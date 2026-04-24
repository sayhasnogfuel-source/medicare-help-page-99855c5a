import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";

export interface AccountState {
  signedIn: boolean;
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
    email: u.email ?? undefined,
    firstName: (meta.first_name as string | undefined) ?? undefined,
    provider,
    createdAt: u.created_at ? new Date(u.created_at).getTime() : undefined,
  };
}

export async function signInWithGoogle() {
  const result = await lovable.auth.signInWithOAuth("google", {
    redirect_uri: typeof window !== "undefined" ? `${window.location.origin}/builder` : undefined,
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

export function useAccount(): AccountState & { hydrated: boolean } {
  const [state, setState] = useState<AccountState>({ signedIn: false });
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // CRITICAL: register listener BEFORE getSession to avoid race conditions.
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setState(fromSession(session));
      setHydrated(true);
    });
    supabase.auth.getSession().then(({ data }) => {
      setState(fromSession(data.session));
      setHydrated(true);
    });
    return () => {
      sub.subscription.unsubscribe();
    };
  }, []);

  return { ...state, hydrated };
}
