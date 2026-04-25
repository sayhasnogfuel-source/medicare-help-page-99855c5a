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

/* ------------------------------------------------------------------ */
/* Sign-out overlay broadcaster                                        */
/* ------------------------------------------------------------------ */

type SignOutListener = (active: boolean) => void;
const signOutListeners = new Set<SignOutListener>();
let signOutActive = false;

export function subscribeSignOut(listener: SignOutListener): () => void {
  signOutListeners.add(listener);
  listener(signOutActive);
  return () => {
    signOutListeners.delete(listener);
  };
}

function setSignOutActive(value: boolean) {
  signOutActive = value;
  for (const fn of signOutListeners) fn(value);
}

/**
 * Sign the user out while showing a full-screen loading overlay, then
 * navigate them back to the home screen. The overlay is guaranteed to be
 * visible for ~900ms so the transition feels intentional even if sign-out
 * resolves instantly.
 */
export async function signOutWithRedirect() {
  if (signOutActive) return;
  setSignOutActive(true);
  const startedAt = Date.now();
  try {
    await supabase.auth.signOut();
  } catch {
    // ignore — we still want to send the user home
  }
  const MIN_VISIBLE_MS = 900;
  const elapsed = Date.now() - startedAt;
  const remaining = Math.max(0, MIN_VISIBLE_MS - elapsed);
  await new Promise((resolve) => setTimeout(resolve, remaining));
  if (typeof window !== "undefined") {
    // Hard navigation guarantees a clean state (no stale auth context, no
    // protected route flicker) before the overlay fades.
    window.location.assign("/");
  }
  // Keep the overlay visible during the navigation; it will unmount on
  // page load. As a safety net, clear it after a short delay.
  setTimeout(() => setSignOutActive(false), 1500);
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
