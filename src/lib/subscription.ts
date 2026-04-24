import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { getStripeEnvironment } from "@/lib/stripe";
import { useAuth } from "@/lib/account";

export type SubStatus =
  | "trialing"
  | "active"
  | "past_due"
  | "canceled"
  | "incomplete"
  | "incomplete_expired"
  | "unpaid"
  | "paused";

export interface SubscriptionRow {
  id: string;
  user_id: string;
  environment: "sandbox" | "live";
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  price_id: string | null;
  product_id: string | null;
  status: SubStatus;
  current_period_end: string | null;
  trial_end: string | null;
  cancel_at_period_end: boolean;
  created_at: string;
  updated_at: string;
}

export interface UseSubscriptionResult {
  hydrated: boolean;
  subscription: SubscriptionRow | null;
  isActive: boolean;
  isTrialing: boolean;
  isPastDue: boolean;
  isCanceled: boolean;
  plan: "starter" | "pro" | "none";
  refetch: () => Promise<void>;
}

function planFromPriceId(priceId: string | null | undefined): "starter" | "pro" | "none" {
  if (priceId === "starter_monthly") return "starter";
  if (priceId === "pro_monthly") return "pro";
  return "none";
}

export function useSubscription(): UseSubscriptionResult {
  const { hydrated: authReady, user } = useAuth();
  const userId = user?.id ?? null;
  const [subscription, setSubscription] = useState<SubscriptionRow | null>(null);
  const [hydrated, setHydrated] = useState(false);

  const fetchSub = useCallback(async () => {
    if (!userId) {
      setSubscription(null);
      setHydrated(true);
      return;
    }
    try {
      const { data, error } = await supabase
        .from("subscriptions")
        .select("*")
        .eq("user_id", userId)
        .eq("environment", getStripeEnvironment())
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (error) {
        setSubscription(null);
      } else {
        setSubscription((data as SubscriptionRow | null) ?? null);
      }
    } catch {
      setSubscription(null);
    } finally {
      setHydrated(true);
    }
  }, [userId]);

  useEffect(() => {
    if (!authReady) return;
    if (!userId) {
      setSubscription(null);
      setHydrated(true);
      return;
    }
    fetchSub();
  }, [authReady, userId, fetchSub]);

  // Realtime subscription updates — only after auth is ready and a user exists.
  useEffect(() => {
    if (!authReady || !userId) return;
    const channel = supabase
      .channel(`subscriptions-changes-${userId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "subscriptions", filter: `user_id=eq.${userId}` },
        () => {
          fetchSub();
        },
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [authReady, userId, fetchSub]);

  const status = subscription?.status;
  const periodEndFuture = subscription?.current_period_end
    ? new Date(subscription.current_period_end).getTime() > Date.now()
    : false;

  const isActive =
    !!subscription &&
    ((status === "active" || status === "trialing" || status === "past_due") &&
      (subscription.current_period_end === null || periodEndFuture)) ||
    (!!subscription && status === "canceled" && periodEndFuture);

  return {
    hydrated,
    subscription,
    isActive,
    isTrialing: status === "trialing",
    isPastDue: status === "past_due",
    isCanceled: status === "canceled",
    plan: planFromPriceId(subscription?.price_id),
    refetch: fetchSub,
  };
}

export async function openBillingPortal(returnUrl: string): Promise<string> {
  const { data, error } = await supabase.functions.invoke("create-portal-session", {
    body: { returnUrl, environment: getStripeEnvironment() },
  });
  if (error) throw new Error(error.message);
  if (!data?.url) throw new Error(data?.error || "Failed to open billing portal");
  return data.url;
}
