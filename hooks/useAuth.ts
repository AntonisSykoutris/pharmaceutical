'use client';

import { useState, useEffect } from "react";
import { User } from "@/lib/types/models"; // your User type definition
import { UseAuthReturn } from "@/lib/types/auth"; // your hook return type
import { createBrowserClient } from "@supabase/ssr";

// This custom hook manages authentication state, login, signup, logout, and user profile fetching
export function useAuth(): UseAuthReturn {
  // Initialise Supabase client on the browser side
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // --- State variables ---
  const [session, setSession] = useState<any>(null); // Supabase session object
  const [user, setUser] = useState<User | null>(null); // your User profile
  const [email, setEmail] = useState(""); // input email field state
  const [password, setPassword] = useState(""); // input password field state
  const [isLoggedIn, setIsLoggedIn] = useState(false); // boolean login status
  const [isLoading, setIsLoading] = useState(true); // loading state for UI
  const [error, setError] = useState<string | null>(null); // auth error messages
  const [isSignUpMode, setIsSignUpMode] = useState(false); // toggles login/signup form mode

  // --- Helper function to clear error ---
  const clearError = () => setError(null);

  // --- Fetch user profile from Supabase 'profiles' table + usage data ---
  const fetchUserProfile = async (userId: string, userEmail: string) => {
    try {
      const [profileResponse, usageResponse] = await Promise.all([
        supabase.from("profiles").select("*").eq("user_id", userId).single(),
        supabase
          .from("usage_tracking")
          .select("tasks_created")
          .eq("user_id", userId)
          .eq("year_month", new Date().toISOString().slice(0, 7))
          .maybeSingle(),
      ]);

      if (profileResponse.error) throw profileResponse.error;

      // Merge data into user state
      setUser({
        ...profileResponse.data,
        email: userEmail,
        tasks_created: usageResponse.data?.tasks_created || 0,
      });
    } catch (error) {
      console.error("Critical error fetching user profile:", error);
      await signOut(); // sign out if profile fetch fails critically
    } finally {
      setIsLoading(false);
    }
  };

  // --- Updates auth session state and fetches user profile if logged in ---
  const updateSessionState = async (newSession: any) => {
    setSession(newSession);
    setIsLoggedIn(!!newSession);

    if (newSession?.user) {
      setIsLoading(true);
      await fetchUserProfile(newSession.user.id, newSession.user.email);
    } else {
      setUser(null);
      setIsLoading(false);
    }
  };

  // --- Sign out method ---
  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setSession(null);
      setUser(null);
      setIsLoggedIn(false);
      setEmail("");
      setPassword("");
      window.localStorage.removeItem("supabase.auth.token"); // cleanup localStorage
    } catch (error: any) {
      setError(error.message);
      console.error("Error signing out:", error);
    }
  };

  // --- Handle login with email/password ---
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) setError(error.message);
      console.log("✅ User logged in:", email, user);
    } catch (error: any) {
      setError(error.message);
      console.error("Error logging in:", error);
    }
  };

  // --- Handle Google OAuth login ---
  const handleGoogleLogin = async () => {
    try {
      await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/platform`, // redirect after login
        },
      });
    } catch (error: any) {
      setError(error.message);
      console.error("Error with Google login:", error);
    }
  };

  // --- Handle user signup ---
  const handleSignup = async () => {
    clearError();
    try {
      const { error } = await supabase.auth.signUp({
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
    }
  };

  // --- Initialise auth state on hook mount ---
  useEffect(() => {
    const initAuth = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        await updateSessionState(session);
      } catch (error: any) {
        console.error("Error initializing auth:", error);
        setError(error.message);
        await signOut();
      }
    };

    initAuth();

    // Listen to auth state changes (login/logout) and update state accordingly
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      updateSessionState(session);
    });

    // Cleanup subscription on unmount
    return () => subscription.unsubscribe();
  }, []);

  // --- Return states and functions to use in your components ---
  return {
    user,
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
