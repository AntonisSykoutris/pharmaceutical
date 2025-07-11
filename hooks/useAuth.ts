"use client";

import { useState, useEffect } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { Session } from "@supabase/supabase-js";
import { User, Company } from "@/lib/types/models";
import { UseAuthReturn } from "@/lib/types/auth";
import { Database } from "@/lib/database.types";

export function useAuth(): UseAuthReturn {
  const supabase = createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // ------------------ STATE ------------------

  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [company, setCompany] = useState<Company | null>(null);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isSignUpMode, setIsSignUpMode] = useState<boolean>(false);

  // ------------------ HELPERS ------------------

  const clearError = () => setError(null);

  /**
   * Fetches user from DB or creates it if it does not exist
   * Also fetches associated company
   */
const fetchOrCreateUser = async (authUserId: string, userEmail: string) => {
  try {
    console.log("Fetching user by auth_user_id", authUserId);

    let { data: userData, error: userError } = await supabase
      .from("users")
      .select("*")
      .eq("auth_user_id", authUserId)
      .single();

    if (userError) {
      console.log("User fetch error", userError);

      if (userError.code === "PGRST116") {
        console.log("No user found, inserting new user");

        const { data: insertData, error: insertErr } = await supabase
          .from("users")
          .insert({
            auth_user_id: authUserId,
            email: userEmail,
          })
          .select("*")
          .single();

        if (insertErr) {
          console.error("Insert user error", insertErr);
          throw insertErr;
        }

        userData = insertData;
      } else {
        throw userError;
      }
    }

    // Continue with company fetch logic...
  } catch (err: any) {
    console.error("❌ Error fetching or inserting user", err);
    await signOut();
  } finally {
    setIsLoading(false);
  }
};


  /**
   * Updates session state and fetches user/company accordingly
   */
  const updateSessionState = async (newSession: Session | null) => {
    setSession(newSession);
    setIsLoggedIn(!!newSession);

    if (newSession?.user) {
      setIsLoading(true);
      await fetchOrCreateUser(newSession.user.id, newSession.user.email!);
    } else {
      setUser(null);
      setCompany(null);
      setIsLoading(false);
    }
  };

  // ------------------ AUTH ACTIONS ------------------

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
      if (error) setError(error.message);
      else console.log("✅ User logged in:", data.user?.email);
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
          redirectTo: `${process.env.NEXT_PUBLIC_SUPABASE_REDIRECT_URL}/platform`,
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

  // ------------------ INIT + SUBSCRIPTIONS ------------------

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

  // ------------------ RETURN ------------------

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
