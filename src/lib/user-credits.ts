import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/account";

export type CreditPlan = "trial" | "starter" | "pro";

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

export const PLAN_LABELS: Record<CreditPlan, string> = {
  trial: "Free trial",
  starter: "Starter",
  pro: "Pro",
};

export const PLAN_TOTALS: Record<CreditPlan, number> = {
  trial: 10,
  starter: 100,
  pro: 500,
};

export interface UserCreditsRow {
  id: string;
  user_id: string;
  plan: CreditPlan;
  credits: number;
  plan_total: number;
  cycle_started_at: string;
  cycle_ends_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface UseUserCreditsResult {
  hydrated: boolean;
  row: UserCreditsRow | null;
  plan: CreditPlan;
  credits: number;
  planTotal: number;
  isLow: boolean;
  isEmpty: boolean;
  canAfford: (action: CreditAction) => boolean;
  charge: (action: CreditAction) => Promise<boolean>;
  refetch: () => Promise<void>;
}

export function useUserCredits(): UseUserCreditsResult {
  const { hydrated: authReady, user } = useAuth();
  const userId = user?.id ?? null;
  const [row, setRow] = useState<UserCreditsRow | null>(null);
  const [hydrated, setHydrated] = useState(false);

  const fetchRow = useCallback(async () => {
    if (!userId) {
      setRow(null);
      setHydrated(true);
      return;
    }
    try {
      const { data, error } = await supabase
        .from("user_credits")
        .select("*")
        .eq("user_id", userId)
        .maybeSingle();
      if (error) {
        // Swallow — treat as "no row yet". The signup trigger creates the
        // row asynchronously and we don't want the UI to crash on a brief
        // race or RLS hiccup.
        setRow(null);
      } else {
        setRow((data as UserCreditsRow | null) ?? null);
      }
    } catch {
      setRow(null);
    } finally {
      setHydrated(true);
    }
  }, [userId]);

  useEffect(() => {
    if (!authReady) return;
    if (!userId) {
      // Signed out — drop any stale row immediately.
      setRow(null);
      setHydrated(true);
      return;
    }
    fetchRow();
  }, [authReady, userId, fetchRow]);

  // Realtime updates — only after auth is ready and a user exists.
  useEffect(() => {
    if (!authReady || !userId) return;
    const channel = supabase
      .channel(`user_credits-changes-${userId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "user_credits", filter: `user_id=eq.${userId}` },
        () => {
          fetchRow();
        },
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [authReady, userId, fetchRow]);

  const credits = row?.credits ?? 0;
  const planTotal = row?.plan_total ?? 0;
  const plan = (row?.plan as CreditPlan | undefined) ?? "trial";

  const canAfford = useCallback(
    (action: CreditAction) => credits >= ACTION_COSTS[action],
    [credits],
  );

  const charge = useCallback(
    async (action: CreditAction): Promise<boolean> => {
      if (!row) return false;
      const cost = ACTION_COSTS[action];
      if (row.credits < cost) return false;
      const next = Math.max(0, row.credits - cost);
      // Optimistic local update
      setRow({ ...row, credits: next });
      const { error } = await supabase
        .from("user_credits")
        .update({ credits: next })
        .eq("id", row.id);
      if (error) {
        // Revert on failure
        setRow(row);
        return false;
      }
      return true;
    },
    [row],
  );

  return {
    hydrated,
    row,
    plan,
    credits,
    planTotal,
    isLow: credits > 0 && credits <= 3,
    isEmpty: credits <= 0,
    canAfford,
    charge,
    refetch: fetchRow,
  };
}