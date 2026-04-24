import { useEffect, useState } from "react";

const KEY = "lumen.account.v1";

export interface AccountState {
  signedIn: boolean;
  email?: string;
  firstName?: string;
  provider?: "email" | "google";
  createdAt?: number;
}

function read(): AccountState {
  if (typeof window === "undefined") return { signedIn: false };
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return { signedIn: false };
    const parsed = JSON.parse(raw) as AccountState;
    return parsed && typeof parsed === "object" ? parsed : { signedIn: false };
  } catch {
    return { signedIn: false };
  }
}

function write(state: AccountState) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(state));
    window.dispatchEvent(new Event("lumen:account-changed"));
  } catch {
    /* ignore */
  }
}

export function signIn(input: { email?: string; firstName?: string; provider?: "email" | "google" }) {
  write({
    signedIn: true,
    email: input.email,
    firstName: input.firstName,
    provider: input.provider ?? "email",
    createdAt: Date.now(),
  });
}

export function signOut() {
  write({ signedIn: false });
}

export function useAccount(): AccountState & { hydrated: boolean } {
  const [state, setState] = useState<AccountState>({ signedIn: false });
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setState(read());
    setHydrated(true);
    const handler = () => setState(read());
    window.addEventListener("lumen:account-changed", handler);
    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener("lumen:account-changed", handler);
      window.removeEventListener("storage", handler);
    };
  }, []);

  return { ...state, hydrated };
}
