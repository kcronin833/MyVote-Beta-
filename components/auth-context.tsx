"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { User, Session } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";

interface Profile {
  id: string;
  username: string;
  display_name: string;
  avatar_url: string | null;
  bio: string;
  location: string;
  political_lean: "left" | "center" | "right";
  verified: boolean;
  is_admin: boolean;
  created_at: string;
}

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  loading: boolean;
  signUp: (
    email: string,
    password: string,
    username: string,
    displayName: string,
    location?: string,
    politicalLean?: string
  ) => Promise<{ error: string | null }>;
  signIn: (
    email: string,
    password: string
  ) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<{ error: string | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  async function fetchProfile(userId: string) {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .maybeSingle();

      if (!error && data) {
        setProfile(data as Profile);
      } else {
        // Profile may not exist yet (trigger hasn't fired or first sign-in)
        setProfile(null);
      }
    } catch {
      setProfile(null);
    }
    setLoading(false);
  }

  async function signUp(
    email: string,
    password: string,
    username: string,
    displayName: string,
    location?: string,
    politicalLean?: string
  ) {
    // Check username availability (best-effort; DB unique constraint is the real guard)
    const { data: existing } = await supabase
      .from("profiles")
      .select("username")
      .eq("username", username)
      .maybeSingle();

    if (existing) return { error: "Username already taken" };

    const redirectTo =
      process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL ||
      `${window.location.origin}/auth/callback`;

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectTo,
        data: {
          username,
          display_name: displayName,
          location: location || null,
          political_lean: politicalLean && politicalLean !== "prefer-not" ? politicalLean : null,
        },
      },
    });

    return { error: error?.message ?? null };
  }

  async function signIn(email: string, password: string) {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      if (error.message.includes("Invalid login credentials")) {
        return { error: "Invalid email or password. Please check your credentials or sign up for a new account." };
      }
      if (error.message.includes("Email not confirmed")) {
        return { error: "Please check your email and click the confirmation link before signing in." };
      }
      return { error: error.message };
    }
    return { error: null };
  }

  async function signOut() {
    await supabase.auth.signOut();
  }

  async function updateProfile(updates: Partial<Profile>) {
    if (!user) return { error: "Not authenticated" };

    const { error } = await supabase
      .from("profiles")
      .update(updates)
      .eq("id", user.id);

    if (!error) {
      setProfile((prev) => (prev ? { ...prev, ...updates } : null));
    }

    return { error: error?.message ?? null };
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        session,
        loading,
        signUp,
        signIn,
        signOut,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
