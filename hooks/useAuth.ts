'use client';

import { useState, useEffect } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { Session, User as SupabaseAuthUser } from "@supabase/supabase-js";
import { Database } from "@/lib/types/supabase"; // Ensure this exists, or adjust accordingly
import { User, Company } from "@/lib/types/models";
import { UseAuthReturn } from "@/lib/types/auth";

export function useAuth(): UseAuthReturn {
  const supabase = createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [company, setCompany] = useState<Company | null>(null);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isSignUpMode, setIsSignUpMode] = useState<boolean>(false);

  const clearError = () => setError(null);

  const fetchUserAndCompany = async (authUserId: string, userEmail: string) => {
    try {
      // Attempt to fetch the row
      let { data: userData, error: userError } = await supabase
        .from("users")
        .select("*")
        .eq("id", authUserId)
        .single();
  
      // If no row found, insert (or upsert) then refetch
      if (userError?.code === "PGRST116") {
        const { error: insertErr } = await supabase
          .from("users")
          .insert({ id: authUserId })
          .select()             // returns the inserted row
          .single();
  
        // Ignore unique‑constraint errors (23505)
        if (insertErr && insertErr.code !== "23505") throw insertErr;
  
        // Refetch after insert/duplicate
        const { data, error: refetchErr } = await supabase
          .from("users")
          .select("*")
          .eq("id", authUserId)
          .single();
        if (refetchErr) throw refetchErr;
        userData = data;
      } else if (userError) {
        throw userError;
      }
  
      // Fetch linked company (same as before)
      let companyData: Company | null = null;
      if (userData?.company_id) {
        const { data: companyRes, error: companyErr } = await supabase
          .from("companies")
          .select("*")
          .eq("id", userData.company_id)
          .single();
        if (companyErr && companyErr.code !== "PGRST116") throw companyErr;
        companyData = companyRes ?? null;
      }

      setUser({
        id:             userData?.id!,                       // assert non‑null
        role:           userData?.role       ?? null,
        email:          userEmail,                          // comes from session
        company_id:     userData?.company_id ?? null,
        created_at:     userData?.created_at!,               // assert non‑null
        updated_at:     userData?.updated_at!,               // assert non‑null
        company:        companyData                         // matches Company|null
      });
  
      setCompany(companyData);
  
    } catch (err: any) {
      console.error("❌ Error fetching user or company:", err);
      await signOut();
    } finally {
      setIsLoading(false);
    }
  };
  

  const updateSessionState = async (newSession: Session | null) => {
    setSession(newSession);
    setIsLoggedIn(!!newSession);

    if (newSession?.user) {
      setIsLoading(true);
      await fetchUserAndCompany(newSession.user.id, newSession.user.email!);
    } else {
      setUser(null);
      setCompany(null);
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setSession(null);
      setUser(null);
      setCompany(null);
      setIsLoggedIn(false);
      setEmail("");
      setPassword("");
      window.localStorage.removeItem("supabase.auth.token");
    } catch (error: any) {
      setError(error.message);
      console.error("Error signing out:", error);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        setError(error.message);
      } else {
        console.log("✅ User logged in:", data.user?.email);
      }
    } catch (error: any) {
      setError(error.message);
      console.error("Error logging in:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    clearError();
    try {
      await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/platform`,
        },
      });
    } catch (error: any) {
      setError(error.message);
      console.error("Error with Google login:", error);
    }
  };

  const handleSignup = async () => {
    clearError();
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: `${window.location.origin}/` },
      });

      if (error) {
        setError(error.message);
      } else {
        setError("Please check your email to confirm your account");
      }
    } catch (error: any) {
      setError(error.message);
      console.error("Error signing up:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        await updateSessionState(session);
      } catch (error: any) {
        console.error("Error initializing auth:", error);
        setError(error.message);
        await signOut();
      }
    };

    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        updateSessionState(session);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  return {
    user,
    company,
    session,
    email,
    password,
    isLoggedIn,
    isLoading,
    error,
    isSignUpMode,

    signOut,
    handleLogin,
    handleGoogleLogin,
    handleSignup,
    setEmail,
    setPassword,
    setIsSignUpMode,
    clearError,
  };
}
