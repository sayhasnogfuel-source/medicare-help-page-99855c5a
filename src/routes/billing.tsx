import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { AppHeader } from "@/components/app/app-header";
import { AppFooter } from "@/components/app/app-footer";
import { PageTransition } from "@/components/app/page-transition";
import { TestModeBanner } from "@/components/app/test-mode-banner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  AlertTriangle,
  ArrowRight,
  CreditCard,
  ExternalLink,
  TrendingUp,
} from "lucide-react";
import { useSubscription, openBillingPortal } from "@/lib/subscription";
import { useAccount } from "@/lib/account";
import { toast } from "sonner";

export const Route = createFileRoute("/billing")({
  component: BillingPage,
  head: () => ({
    meta: [
      { title: "Billing & subscription — Diploo" },
      {
        name: "description",
        content: "Manage your subscription, payment method, and billing history.",
      },
    ],
  }),
});

const STATUS_LABEL: Record<string, string> = {
  trialing: "Trial active",
  active: "Subscription active",
  past_due: "Past due",
  canceled: "Canceled",
  incomplete: "Incomplete",
  incomplete_expired: "Expired",
  unpaid: "Unpaid",
  paused: "Paused",
};

function statusTone(s: string): string {
  if (s === "active") return "bg-emerald-100 text-emerald-900 border-emerald-300/60";
  if (s === "trialing") return "bg-amber-100 text-amber-900 border-amber-300/60";
  if (s === "past_due" || s === "unpaid") return "bg-destructive/10 text-destructive border-destructive/40";
  if (s === "canceled") return "bg-muted text-muted-foreground border-border";
  return "bg-[var(--surface-sand)] text-foreground/80 border-border";
}

function formatDate(iso: string | null): string {
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

function BillingPage() {
  const account = useAccount();
  const sub = useSubscription();
  const [opening, setOpening] = useState(false);

  async function handleOpenPortal() {
    setOpening(true);
    try {
      const url = await openBillingPortal(window.location.href);
      window.open(url, "_blank", "noopener,noreferrer");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to open billing portal";
      toast.error(message);
    } finally {
      setOpening(false);
    }
  }

  if (!account.hydrated || !sub.hydrated) {
    return (
      <div className="flex min-h-screen flex-col bg-[var(--surface-sand)]/40">
        <AppHeader />
        <main className="flex-1" />
        <AppFooter />
      </div>
    );
  }

  if (!account.signedIn) {
    return (
      <div className="flex min-h-screen flex-col bg-[var(--surface-sand)]/40">
        <AppHeader />
        <main className="flex-1">
          <div className="mx-auto max-w-2xl px-5 py-16 text-center">
            <Card className="rounded-3xl border-border/60 bg-background p-10 shadow-[var(--shadow-sm)]">
              <h1 className="text-2xl font-semibold text-foreground">Sign in to view billing</h1>
              <p className="mt-2 text-muted-foreground">
                You need to be signed in to manage your subscription.
              </p>
              <Button
                asChild
                className="mt-6 rounded-full bg-[var(--surface-mocha)] text-[var(--surface-cream)] hover:bg-[var(--surface-espresso)]"
              >
                <Link to="/signin" search={{ redirect: "/billing" } as never}>Sign in</Link>
              </Button>
            </Card>
          </div>
        </main>
        <AppFooter />
      </div>
    );
  }

  const planLabel =
    sub.plan === "starter" ? "Starter — $26 / month" : sub.plan === "pro" ? "Pro — $80 / month" : "No active plan";
  const status = sub.subscription?.status ?? "none";
  const periodEnd = sub.subscription?.current_period_end;
  const trialEnd = sub.subscription?.trial_end;
  const cancelAtEnd = sub.subscription?.cancel_at_period_end;

  return (
    <div className="flex min-h-screen flex-col bg-[var(--surface-sand)]/40">
      <AppHeader />
      <TestModeBanner />
      <PageTransition>
        <main className="flex-1">
          <div className="mx-auto max-w-3xl px-5 py-10 sm:py-14">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Account
                </p>
                <h1 className="mt-2 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                  Billing & subscription
                </h1>
                <p className="mt-1.5 text-sm text-muted-foreground">
                  Manage your plan, payment method, and invoices.
                </p>
              </div>
              <Button asChild variant="outline" size="sm" className="rounded-full">
                <Link to="/dashboard">
                  <ArrowRight className="mr-1.5 h-3.5 w-3.5 rotate-180" /> Back to dashboard
                </Link>
              </Button>
            </div>

            {sub.isPastDue && (
              <Card className="mt-6 rounded-3xl border-destructive/40 bg-destructive/5 p-6 shadow-[var(--shadow-sm)]">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-start gap-3 text-destructive">
                    <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
                    <div>
                      <p className="font-semibold">Your latest payment failed</p>
                      <p className="text-sm opacity-90">
                        Update your card in the billing portal to keep your site live.
                      </p>
                    </div>
                  </div>
                  <Button
                    onClick={handleOpenPortal}
                    disabled={opening}
                    size="sm"
                    className="shrink-0 rounded-full bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    {opening ? "Opening…" : "Update payment"}
                  </Button>
                </div>
              </Card>
            )}

            {/* Plan summary */}
            <Card className="mt-6 rounded-3xl border-border/60 bg-background p-6 shadow-[var(--shadow-sm)]">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                    Current plan
                  </span>
                  <h2 className="mt-1.5 text-2xl font-semibold tracking-tight text-foreground">
                    {planLabel}
                  </h2>
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    {sub.subscription && (
                      <span
                        className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${statusTone(status)}`}
                      >
                        {STATUS_LABEL[status] ?? status}
                      </span>
                    )}
                    {sub.isTrialing && trialEnd && (
                      <span className="inline-flex items-center rounded-full border border-border bg-[var(--surface-sand)]/70 px-2.5 py-0.5 text-[11px] font-medium text-foreground/75">
                        Trial ends {formatDate(trialEnd)}
                      </span>
                    )}
                    {periodEnd && status === "active" && (
                      <span className="inline-flex items-center rounded-full border border-border bg-[var(--surface-sand)]/70 px-2.5 py-0.5 text-[11px] font-medium text-foreground/75">
                        {cancelAtEnd ? "Ends" : "Renews"} {formatDate(periodEnd)}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {sub.subscription ? (
                    <Button
                      onClick={handleOpenPortal}
                      disabled={opening}
                      size="sm"
                      className="rounded-full bg-[var(--surface-mocha)] text-[var(--surface-cream)] hover:bg-[var(--surface-espresso)]"
                    >
                      <CreditCard className="mr-1.5 h-3.5 w-3.5" />
                      {opening ? "Opening…" : "Manage subscription"}
                      <ExternalLink className="ml-1.5 h-3 w-3" />
                    </Button>
                  ) : (
                    <Button
                      asChild
                      size="sm"
                      className="rounded-full bg-[var(--surface-mocha)] text-[var(--surface-cream)] hover:bg-[var(--surface-espresso)]"
                    >
                      <Link to="/pricing">Choose a plan</Link>
                    </Button>
                  )}
                </div>
              </div>
              {sub.subscription && (
                <p className="mt-4 rounded-xl border border-border bg-[var(--surface-sand)]/40 p-3 text-xs text-muted-foreground">
                  The billing portal opens in a new tab and lets you update your card, change plans, view invoices, or cancel.
                </p>
              )}
            </Card>

            {/* Plan options */}
            <Card className="mt-6 rounded-3xl border-border/60 bg-background p-6 shadow-[var(--shadow-sm)]">
              <div className="flex items-center justify-between">
                <div>
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                    <TrendingUp className="h-3 w-3" /> Plans
                  </span>
                  <h2 className="mt-1.5 text-lg font-semibold text-foreground">
                    Compare plans
                  </h2>
                </div>
                <Button asChild variant="outline" size="sm" className="rounded-full">
                  <Link to="/pricing">View pricing</Link>
                </Button>
              </div>
              <p className="mt-3 text-sm text-muted-foreground">
                Need more credits or want to switch tiers? Visit the pricing page to start a new plan, or open the billing portal to change plans on your existing subscription.
              </p>
            </Card>
          </div>
        </main>
      </PageTransition>
      <AppFooter />
    </div>
  );
}
