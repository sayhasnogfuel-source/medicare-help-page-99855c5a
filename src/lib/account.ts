import { createContext, createElement, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";

export interface AccountState {
  signedIn: boolean;
  userId?: string;
  email?: string;
  firstName?: string;
  provider?: "email" | "google";
  createdAt?: number;
}

function fromSession(session: Session | null): AccountState {
  if (!session?.user) return { signedIn: false };
  const u = session.user;
  const meta = (u.user_metadata ?? {}) as Record<string, unknown>;
  const provider =
    (u.app_metadata?.provider as string | undefined) === "google" ? "google" : "email";
  return {
    signedIn: true,
    userId: u.id,
    email: u.email ?? undefined,
    firstName: (meta.first_name as string | undefined) ?? undefined,
    provider,
    createdAt: u.created_at ? new Date(u.created_at).getTime() : undefined,
  };
}

/* ------------------------------------------------------------------ */
/* Centralized Auth Provider                                            */
/* ------------------------------------------------------------------ */

interface AuthContextValue {
  hydrated: boolean;
  session: Session | null;
  user: User | null;
  account: AccountState;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let mounted = true;

    // Register listener BEFORE calling getSession to avoid race conditions.
    const { data: sub } = supabase.auth.onAuthStateChange((_event, next) => {
      if (!mounted) return;
      setSession(next ?? null);
      setHydrated(true);
    });

    supabase.auth
      .getSession()
      .then(({ data }) => {
        if (!mounted) return;
        setSession(data.session ?? null);
        setHydrated(true);
      })
      .catch(() => {
        if (!mounted) return;
        setHydrated(true);
      });

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  const value = useMemo<AuthContextValue>(() => {
    const account = fromSession(session);
    return {
      hydrated,
      session,
      user: session?.user ?? null,
      account,
    };
  }, [session, hydrated]);

  return createElement(AuthContext.Provider, { value }, children);
}

function useAuthContext(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (ctx) return ctx;
  // Safe fallback for code paths rendered outside the provider (e.g. error boundaries
  // before the root mounts). Returns "not signed in, not hydrated".
  return { hydrated: false, session: null, user: null, account: { signedIn: false } };
}

export function useAuth(): AuthContextValue {
  return useAuthContext();
}

export async function signInWithGoogle(redirectAfter?: string) {
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const target = encodeURIComponent(redirectAfter || "/dashboard");
  const result = await lovable.auth.signInWithOAuth("google", {
    redirect_uri: origin ? `${origin}/auth/callback?redirect=${target}` : undefined,
  });
  if (result.error) {
    throw result.error instanceof Error ? result.error : new Error(String(result.error));
  }
  return result;
}

export async function signUpWithEmail(input: {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}) {
  const { data, error } = await supabase.auth.signUp({
    email: input.email,
    password: input.password,
    options: {
      emailRedirectTo: typeof window !== "undefined" ? `${window.location.origin}/builder` : undefined,
      data: {
        first_name: input.firstName,
        last_name: input.lastName,
      },
    },
  });
  if (error) throw error;
  return data;
}

export async function signInWithEmail(input: { email: string; password: string }) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: input.email,
    password: input.password,
  });
  if (error) throw error;
  return data;
}

export async function signOut() {
  await supabase.auth.signOut();
}

/**
 * Backwards-compatible hook. Reads from the centralized AuthProvider so
 * every consumer sees the exact same auth snapshot — no more independent
 * listeners or race conditions.
 */
export function useAccount(): AccountState & { hydrated: boolean } {
  const { account, hydrated } = useAuthContext();
  return { ...account, hydrated };
}
