import { useEffect, useState, useCallback } from "react";

/**
 * Visual-only credits system. Stored in localStorage. New visitors get a
 * free trial of TRIAL_CREDITS. When credits hit 0, the AI builder is locked
 * until the user "upgrades".
 */

export type Plan = "trial" | "starter" | "pro" | "dfy";

export const PLAN_LABELS: Record<Plan, string> = {
  trial: "Free trial",
  starter: "Starter",
  pro: "Pro",
  dfy: "Done-for-you",
};

export const PLAN_CREDITS: Record<Plan, number> = {
  trial: 10,
  starter: 108,
  pro: 488,
  dfy: 0, // n/a — handled by our team
};

export type CreditAction =
  | "generate"
  | "regenerate_section"
  | "rewrite_copy"
  | "major_redesign"
  | "add_page";

export const ACTION_COSTS: Record<CreditAction, number> = {
  generate: 3,
  regenerate_section: 1,
  rewrite_copy: 1,
  major_redesign: 2,
  add_page: 2,
};

export const ACTION_LABELS: Record<CreditAction, string> = {
  generate: "Generate website",
  regenerate_section: "Regenerate a section",
  rewrite_copy: "Rewrite copy",
  major_redesign: "Major redesign",
  add_page: "Add a page",
};

export interface CreditsState {
  plan: Plan;
  credits: number;
  initializedAt: string;
}

const KEY = "lp_credits_v1";

function defaultState(): CreditsState {
  return {
    plan: "trial",
    credits: PLAN_CREDITS.trial,
    initializedAt: new Date().toISOString(),
  };
}

export function loadCredits(): CreditsState {
  if (typeof window === "undefined") return defaultState();
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) {
      const init = defaultState();
      window.localStorage.setItem(KEY, JSON.stringify(init));
      return init;
    }
    const parsed = JSON.parse(raw) as Partial<CreditsState>;
    return {
      plan: (parsed.plan as Plan) ?? "trial",
      credits:
        typeof parsed.credits === "number" ? parsed.credits : PLAN_CREDITS.trial,
      initializedAt: parsed.initializedAt ?? new Date().toISOString(),
    };
  } catch {
    return defaultState();
  }
}

export function saveCredits(s: CreditsState) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(s));
  } catch {
    // ignore
  }
}

/**
 * React hook giving current credits state plus helpers. Subscribes to a
 * global event so multiple mounted components stay in sync.
 */
const EVT = "lp:credits-changed";

function emit() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(EVT));
  }
}

export function useCredits() {
  const [state, setState] = useState<CreditsState>(() => defaultState());
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setState(loadCredits());
    setHydrated(true);
    function refresh() {
      setState(loadCredits());
    }
    window.addEventListener(EVT, refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener(EVT, refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  const canAfford = useCallback(
    (action: CreditAction) => state.credits >= ACTION_COSTS[action],
    [state.credits],
  );

  const charge = useCallback(
    (action: CreditAction): boolean => {
      const cost = ACTION_COSTS[action];
      if (state.credits < cost) return false;
      const next: CreditsState = {
        ...state,
        credits: Math.max(0, state.credits - cost),
      };
      setState(next);
      saveCredits(next);
      emit();
      return true;
    },
    [state],
  );

  const upgrade = useCallback((plan: Plan) => {
    const next: CreditsState = {
      plan,
      credits: PLAN_CREDITS[plan],
      initializedAt: new Date().toISOString(),
    };
    setState(next);
    saveCredits(next);
    emit();
  }, []);

  const reset = useCallback(() => {
    const next = defaultState();
    setState(next);
    saveCredits(next);
    emit();
  }, []);

  const planTotal = PLAN_CREDITS[state.plan] || 0;
  const isLow = state.credits > 0 && state.credits <= 3;
  const isEmpty = state.credits <= 0 && state.plan !== "dfy";

  return {
    ...state,
    hydrated,
    planTotal,
    isLow,
    isEmpty,
    canAfford,
    charge,
    upgrade,
    reset,
  };
}