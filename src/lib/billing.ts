import { useEffect, useState, useCallback } from "react";
import type { Plan } from "./credits";

/**
 * Visual-only billing & subscription state. Stored in localStorage.
 * No real payments — this simulates the Stripe-style lifecycle so the
 * dashboard and billing UI feel like a real SaaS.
 */

export type SiteStatus = "draft" | "ready" | "live" | "suspended";
export type SubStatus =
  | "none"
  | "trialing"
  | "active"
  | "past_due"
  | "canceled";

export interface CardOnFile {
  brand: string; // visa, mastercard, amex, discover
  last4: string;
  expMonth: number;
  expYear: number;
  name: string;
}

export interface BillingEvent {
  id: string;
  at: string; // ISO
  kind:
    | "trial_started"
    | "card_added"
    | "card_updated"
    | "card_removed"
    | "subscription_started"
    | "subscription_canceled"
    | "payment_succeeded"
    | "payment_failed"
    | "payment_resolved"
    | "site_published"
    | "site_unpublished"
    | "site_suspended";
  description: string;
  amount?: number; // dollars
}

export interface BillingState {
  card: CardOnFile | null;
  subStatus: SubStatus;
  trialEndsAt: string | null; // ISO
  nextBillingAt: string | null; // ISO
  siteStatus: SiteStatus;
  history: BillingEvent[];
}

const KEY = "lp_billing_v1";

function nowIso() {
  return new Date().toISOString();
}

function inDays(days: number) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString();
}

function defaultState(): BillingState {
  return {
    card: null,
    subStatus: "none",
    trialEndsAt: inDays(7),
    nextBillingAt: null,
    siteStatus: "draft",
    history: [
      {
        id: `e-${Date.now()}`,
        at: nowIso(),
        kind: "trial_started",
        description: "7-day free trial started",
      },
    ],
  };
}

export function loadBilling(): BillingState {
  if (typeof window === "undefined") return defaultState();
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) {
      const init = defaultState();
      window.localStorage.setItem(KEY, JSON.stringify(init));
      return init;
    }
    const parsed = JSON.parse(raw) as Partial<BillingState>;
    const base = defaultState();
    return {
      ...base,
      ...parsed,
      history: Array.isArray(parsed.history) ? parsed.history : base.history,
    };
  } catch {
    return defaultState();
  }
}

export function saveBilling(s: BillingState) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(s));
  } catch {
    // ignore
  }
}

const EVT = "lp:billing-changed";
function emit() {
  if (typeof window !== "undefined") window.dispatchEvent(new Event(EVT));
}

function appendEvent(
  s: BillingState,
  e: Omit<BillingEvent, "id" | "at">,
): BillingState {
  return {
    ...s,
    history: [
      { id: `e-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`, at: nowIso(), ...e },
      ...s.history,
    ].slice(0, 30),
  };
}

export const SUB_STATUS_LABEL: Record<SubStatus, string> = {
  none: "No subscription",
  trialing: "Trial active",
  active: "Subscription active",
  past_due: "Past due",
  canceled: "Canceled",
};

export const SITE_STATUS_LABEL: Record<SiteStatus, string> = {
  draft: "Draft",
  ready: "Ready to publish",
  live: "Live",
  suspended: "Suspended due to billing",
};

export function useBilling() {
  const [state, setState] = useState<BillingState>(() => defaultState());
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setState(loadBilling());
    setHydrated(true);
    function refresh() {
      setState(loadBilling());
    }
    window.addEventListener(EVT, refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener(EVT, refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  const persist = useCallback((next: BillingState) => {
    setState(next);
    saveBilling(next);
    emit();
  }, []);

  const addCard = useCallback(
    (card: CardOnFile) => {
      const wasReplacing = !!state.card;
      let next = appendEvent(
        { ...state, card },
        {
          kind: wasReplacing ? "card_updated" : "card_added",
          description: wasReplacing
            ? `Card updated · ${card.brand.toUpperCase()} •••• ${card.last4}`
            : `Card added · ${card.brand.toUpperCase()} •••• ${card.last4}`,
        },
      );
      // Resolve past-due automatically when a fresh card is added.
      if (next.subStatus === "past_due") {
        next = appendEvent(
          {
            ...next,
            subStatus: "active",
            siteStatus: next.siteStatus === "suspended" ? "live" : next.siteStatus,
            nextBillingAt: inDays(30),
          },
          {
            kind: "payment_resolved",
            description: "Payment recovered with new card",
          },
        );
      }
      persist(next);
    },
    [state, persist],
  );

  const removeCard = useCallback(() => {
    if (!state.card) return;
    const next = appendEvent(
      { ...state, card: null },
      { kind: "card_removed", description: "Payment method removed" },
    );
    persist(next);
  }, [state, persist]);

  const startSubscription = useCallback(
    (plan: Plan, monthly: number) => {
      if (!state.card) return false;
      const next = appendEvent(
        {
          ...state,
          subStatus: "active",
          nextBillingAt: inDays(30),
          siteStatus:
            state.siteStatus === "suspended" ? "live" : state.siteStatus,
        },
        {
          kind: "subscription_started",
          description: `Subscribed to ${plan.toUpperCase()} · $${monthly}/mo`,
          amount: monthly,
        },
      );
      persist(next);
      return true;
    },
    [state, persist],
  );

  const cancelSubscription = useCallback(() => {
    const next = appendEvent(
      {
        ...state,
        subStatus: "canceled",
        siteStatus: state.siteStatus === "live" ? "suspended" : state.siteStatus,
        nextBillingAt: null,
      },
      {
        kind: "subscription_canceled",
        description: "Subscription canceled",
      },
    );
    persist(next);
  }, [state, persist]);

  const publishSite = useCallback(() => {
    if (!state.card || (state.subStatus !== "active" && state.subStatus !== "trialing")) {
      return { ok: false as const, reason: "Add a payment method and active subscription to publish." };
    }
    if (state.subStatus === "trialing" && !state.card) {
      return { ok: false as const, reason: "Add a card on file before publishing." };
    }
    const next = appendEvent(
      { ...state, siteStatus: "live" },
      { kind: "site_published", description: "Website published live" },
    );
    persist(next);
    return { ok: true as const };
  }, [state, persist]);

  const unpublishSite = useCallback(() => {
    const next = appendEvent(
      { ...state, siteStatus: "draft" },
      { kind: "site_unpublished", description: "Website unpublished" },
    );
    persist(next);
  }, [state, persist]);

  const markReady = useCallback(() => {
    if (state.siteStatus !== "draft") return;
    persist({ ...state, siteStatus: "ready" });
  }, [state, persist]);

  // Demo-only: simulate a failed recurring charge.
  const simulatePaymentFailure = useCallback(() => {
    const next = appendEvent(
      {
        ...state,
        subStatus: "past_due",
        siteStatus: state.siteStatus === "live" ? "suspended" : state.siteStatus,
      },
      {
        kind: "payment_failed",
        description: "Recurring charge declined by issuer",
      },
    );
    persist(next);
  }, [state, persist]);

  const reset = useCallback(() => {
    persist(defaultState());
  }, [persist]);

  const hasCard = !!state.card;
  const canPublish =
    hasCard && (state.subStatus === "active" || state.subStatus === "trialing");
  const isSuspended = state.siteStatus === "suspended" || state.subStatus === "past_due";
  const trialDaysLeft = state.trialEndsAt
    ? Math.max(
        0,
        Math.ceil(
          (new Date(state.trialEndsAt).getTime() - Date.now()) /
            (1000 * 60 * 60 * 24),
        ),
      )
    : 0;

  return {
    ...state,
    hydrated,
    hasCard,
    canPublish,
    isSuspended,
    trialDaysLeft,
    addCard,
    removeCard,
    startSubscription,
    cancelSubscription,
    publishSite,
    unpublishSite,
    markReady,
    simulatePaymentFailure,
    reset,
  };
}

export function detectCardBrand(num: string): string {
  const n = num.replace(/\s+/g, "");
  if (/^4/.test(n)) return "visa";
  if (/^(5[1-5]|2[2-7])/.test(n)) return "mastercard";
  if (/^3[47]/.test(n)) return "amex";
  if (/^6(?:011|5)/.test(n)) return "discover";
  return "card";
}

export function formatDate(iso: string | null): string {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}