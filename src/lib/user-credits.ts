import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAccount } from "@/lib/account";

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
  const account = useAccount();
  const [row, setRow] = useState<UserCreditsRow | null>(null);
  const [hydrated, setHydrated] = useState(false);

  const fetchRow = useCallback(async () => {
    if (!account.signedIn) {
      setRow(null);
      setHydrated(true);
      return;
    }
    const { data } = await supabase
      .from("user_credits")
      .select("*")
      .maybeSingle();
    setRow((data as UserCreditsRow | null) ?? null);
    setHydrated(true);
  }, [account.signedIn]);

  useEffect(() => {
    if (!account.hydrated) return;
    fetchRow();
  }, [account.hydrated, fetchRow]);

  // Realtime updates
  useEffect(() => {
    if (!account.signedIn) return;
    const channel = supabase
      .channel("user_credits-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "user_credits" },
        () => {
          fetchRow();
        },
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [account.signedIn, fetchRow]);

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