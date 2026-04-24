import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { AppHeader } from "@/components/app/app-header";
import { AppFooter } from "@/components/app/app-footer";
import { PageTransition } from "@/components/app/page-transition";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  AlertTriangle,
  ArrowRight,
  Check,
  CheckCircle2,
  CreditCard,
  Globe,
  Plus,
  Trash2,
  TrendingUp,
  Zap,
} from "lucide-react";
import {
  useBilling,
  detectCardBrand,
  formatDate,
  SUB_STATUS_LABEL,
  type SubStatus,
} from "@/lib/billing";
import { useCredits, PLAN_CREDITS, PLAN_LABELS, type Plan } from "@/lib/credits";
import { toast } from "sonner";

export const Route = createFileRoute("/billing")({
  component: BillingPage,
  head: () => ({
    meta: [
      { title: "Billing & subscription — Lumen.pages" },
      {
        name: "description",
        content:
          "Manage your subscription, payment method, billing history, and plan options.",
      },
      { property: "og:title", content: "Billing & subscription — Lumen.pages" },
      {
        property: "og:description",
        content:
          "Update your card, change plans, or recover from a failed payment.",
      },
    ],
  }),
});

const PLAN_PRICES: Record<Plan, number> = {
  trial: 0,
  starter: 26,
  pro: 44,
  dfy: 0,
};

function subStatusTone(s: SubStatus): string {
  switch (s) {
    case "active":
      return "bg-emerald-100 text-emerald-900 border-emerald-300/60";
    case "trialing":
      return "bg-amber-100 text-amber-900 border-amber-300/60";
    case "past_due":
      return "bg-destructive/10 text-destructive border-destructive/40";
    case "canceled":
      return "bg-muted text-muted-foreground border-border";
    default:
      return "bg-[var(--surface-sand)] text-foreground/80 border-border";
  }
}

function BillingPage() {
  const billing = useBilling();
  const credits = useCredits();
  const [showForm, setShowForm] = useState(false);

  if (!billing.hydrated || !credits.hydrated) {
    return (
      <div className="flex min-h-screen flex-col bg-[var(--surface-sand)]/40">
        <AppHeader />
        <main className="flex-1" />
        <AppFooter />
      </div>
    );
  }

  function onSubmitCard(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const num = String(fd.get("number") || "").replace(/\s+/g, "");
    const exp = String(fd.get("exp") || "");
    const name = String(fd.get("name") || "").trim();
    if (num.length < 12 || !/^\d+$/.test(num)) {
      toast.error("Enter a valid card number");
      return;
    }
    const [mm, yy] = exp.split("/").map((s) => s.trim());
    const month = parseInt(mm, 10);
    const year = 2000 + parseInt(yy, 10);
    if (!month || month < 1 || month > 12 || !year) {
      toast.error("Enter expiry as MM/YY");
      return;
    }
    if (!name) {
      toast.error("Enter the cardholder name");
      return;
    }
    billing.addCard({
      brand: detectCardBrand(num),
      last4: num.slice(-4),
      expMonth: month,
      expYear: year,
      name,
    });
    setShowForm(false);
    toast.success(billing.hasCard ? "Card updated" : "Card saved");
  }

  function onChoosePlan(plan: Plan) {
    if (plan === "dfy") return;
    if (plan === "trial") {
      toast.info("You're already on the trial");
      return;
    }
    if (!billing.hasCard) {
      toast.error("Add a payment method first", {
        description: "We need a card on file before starting your subscription.",
      });
      setShowForm(true);
      return;
    }
    credits.upgrade(plan);
    billing.startSubscription(plan, PLAN_PRICES[plan]);
    toast.success(`Subscribed to ${PLAN_LABELS[plan]}`, {
      description: "Credits topped up and your site can stay live.",
    });
  }

  function onCancel() {
    if (
      typeof window !== "undefined" &&
      !window.confirm("Cancel your subscription? Your live site will be unpublished.")
    )
      return;
    billing.cancelSubscription();
    toast.success("Subscription canceled");
  }

  return (
    <div className="flex min-h-screen flex-col bg-[var(--surface-sand)]/40">
      <AppHeader />
      <PageTransition>
        <main className="flex-1">
          <div className="mx-auto max-w-5xl px-5 py-10 sm:py-14">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Account
                </p>
                <h1 className="mt-2 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                  Billing & subscription
                </h1>
                <p className="mt-1.5 text-sm text-muted-foreground">
                  Update your card, manage your plan, and review billing history.
                </p>
              </div>
              <Button asChild variant="outline" size="sm" className="rounded-full">
                <Link to="/dashboard">
                  <ArrowRight className="mr-1.5 h-3.5 w-3.5 rotate-180" /> Back to dashboard
                </Link>
              </Button>
            </div>

            {/* Failed payment recovery */}
            {billing.subStatus === "past_due" && (
              <Card className="mt-6 rounded-3xl border-destructive/40 bg-destructive/5 p-6 shadow-[var(--shadow-sm)]">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-start gap-3 text-destructive">
                    <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
                    <div>
                      <p className="font-semibold">Your payment could not be processed</p>
                      <p className="text-sm opacity-90">
                        Your website has been paused until billing is updated. Update your payment method to restore service.
                      </p>
                    </div>
                  </div>
                  <Button
                    onClick={() => setShowForm(true)}
                    size="sm"
                    className="shrink-0 rounded-full bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Fix payment
                  </Button>
                </div>
              </Card>
            )}

            {/* Plan summary */}
            <Card className="mt-6 rounded-3xl border-border/60 bg-background p-6 shadow-[var(--shadow-sm)]">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                    Current plan
                  </span>
                  <h2 className="mt-1.5 text-2xl font-semibold tracking-tight text-foreground">
                    {PLAN_LABELS[credits.plan]}
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {credits.plan === "dfy"
                      ? "Custom pricing — handled by our team"
                      : credits.plan === "trial"
                        ? "Free trial · no charge until you upgrade"
                        : `$${PLAN_PRICES[credits.plan]} / month`}
                  </p>
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <span
                      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${subStatusTone(billing.subStatus)}`}
                    >
                      {SUB_STATUS_LABEL[billing.subStatus]}
                    </span>
                    {credits.plan === "trial" && billing.trialDaysLeft > 0 && (
                      <span className="inline-flex items-center rounded-full border border-border bg-[var(--surface-sand)]/70 px-2.5 py-0.5 text-[11px] font-medium text-foreground/75">
                        {billing.trialDaysLeft} day{billing.trialDaysLeft === 1 ? "" : "s"} left in trial
                      </span>
                    )}
                    {billing.nextBillingAt && billing.subStatus === "active" && (
                      <span className="inline-flex items-center rounded-full border border-border bg-[var(--surface-sand)]/70 px-2.5 py-0.5 text-[11px] font-medium text-foreground/75">
                        Renews {formatDate(billing.nextBillingAt)}
                      </span>
                    )}
                    <span className="inline-flex items-center gap-1 rounded-full border border-border bg-background px-2.5 py-0.5 text-[11px] font-medium text-foreground/75">
                      <Zap className="h-3 w-3" /> {credits.credits} / {credits.planTotal || "—"} credits
                    </span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {billing.subStatus === "active" && (
                    <Button
                      onClick={onCancel}
                      variant="outline"
                      size="sm"
                      className="rounded-full"
                    >
                      Cancel subscription
                    </Button>
                  )}
                  <Button
                    onClick={billing.simulatePaymentFailure}
                    variant="ghost"
                    size="sm"
                    className="rounded-full text-xs text-muted-foreground"
                    title="Demo only"
                  >
                    Simulate failed payment
                  </Button>
                </div>
              </div>
            </Card>

            {/* Payment method */}
            <Card className="mt-6 rounded-3xl border-border/60 bg-background p-6 shadow-[var(--shadow-sm)]">
              <div className="flex items-center justify-between">
                <div>
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                    <CreditCard className="h-3 w-3" /> Payment method
                  </span>
                  <h2 className="mt-1.5 text-lg font-semibold text-foreground">
                    Card on file
                  </h2>
                </div>
                {billing.hasCard && !showForm && (
                  <Button
                    onClick={() => setShowForm(true)}
                    variant="outline"
                    size="sm"
                    className="rounded-full"
                  >
                    Replace card
                  </Button>
                )}
              </div>

              {!billing.hasCard && !showForm && (
                <div className="mt-4 rounded-2xl border border-dashed border-border bg-[var(--surface-sand)]/30 p-6 text-center">
                  <p className="text-sm text-muted-foreground">
                    No payment method on file. Add a card to publish your website.
                  </p>
                  <Button
                    onClick={() => setShowForm(true)}
                    size="sm"
                    className="mt-4 rounded-full bg-[var(--surface-mocha)] text-[var(--surface-cream)] hover:bg-[var(--surface-espresso)]"
                  >
                    <Plus className="mr-1.5 h-3.5 w-3.5" /> Add payment method
                  </Button>
                </div>
              )}

              {billing.card && !showForm && (
                <div className="mt-4 flex flex-wrap items-center gap-4 rounded-2xl border border-border bg-[var(--surface-sand)]/30 p-4">
                  <div className="flex h-12 w-20 items-center justify-center rounded-lg border border-border bg-background text-xs font-bold uppercase tracking-wider text-foreground/70">
                    {billing.card.brand}
                  </div>
                  <div className="flex-1">
                    <p className="font-mono text-sm text-foreground">
                      •••• •••• •••• {billing.card.last4}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Exp {String(billing.card.expMonth).padStart(2, "0")}/
                      {String(billing.card.expYear).slice(-2)} · {billing.card.name}
                    </p>
                  </div>
                  <Button
                    onClick={() => {
                      billing.removeCard();
                      toast.success("Card removed");
                    }}
                    variant="ghost"
                    size="sm"
                    className="rounded-full text-destructive hover:bg-destructive/10 hover:text-destructive"
                  >
                    <Trash2 className="mr-1 h-3.5 w-3.5" /> Remove
                  </Button>
                </div>
              )}

              {showForm && (
                <form onSubmit={onSubmitCard} className="mt-4 space-y-4">
                  <p className="rounded-lg border border-border bg-[var(--surface-sand)]/40 px-3 py-2 text-xs text-muted-foreground">
                    Demo only — no real charge. Use any 16-digit number.
                  </p>
                  <div className="space-y-2">
                    <Label htmlFor="bp-name">Cardholder name</Label>
                    <Input id="bp-name" name="name" required maxLength={60} placeholder="Jordan Sterling" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bp-num">Card number</Label>
                    <Input
                      id="bp-num"
                      name="number"
                      required
                      inputMode="numeric"
                      maxLength={19}
                      placeholder="4242 4242 4242 4242"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="bp-exp">Expiry (MM/YY)</Label>
                      <Input id="bp-exp" name="exp" required maxLength={7} placeholder="12/28" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bp-cvc">CVC</Label>
                      <Input id="bp-cvc" name="cvc" required inputMode="numeric" maxLength={4} placeholder="123" />
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      type="submit"
                      size="sm"
                      className="rounded-full bg-[var(--surface-mocha)] text-[var(--surface-cream)] hover:bg-[var(--surface-espresso)]"
                    >
                      <Check className="mr-1.5 h-3.5 w-3.5" /> Save card
                    </Button>
                    <Button
                      type="button"
                      onClick={() => setShowForm(false)}
                      variant="ghost"
                      size="sm"
                      className="rounded-full"
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              )}
            </Card>

            {/* Plan options */}
            <Card className="mt-6 rounded-3xl border-border/60 bg-background p-6 shadow-[var(--shadow-sm)]">
              <div className="flex items-center justify-between">
                <div>
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                    <TrendingUp className="h-3 w-3" /> Plan options
                  </span>
                  <h2 className="mt-1.5 text-lg font-semibold text-foreground">
                    Upgrade or downgrade
                  </h2>
                </div>
                <Button asChild variant="outline" size="sm" className="rounded-full">
                  <Link to="/pricing">Compare plans</Link>
                </Button>
              </div>
              <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {(["trial", "starter", "pro", "dfy"] as Plan[]).map((p) => {
                  const current = credits.plan === p;
                  return (
                    <div
                      key={p}
                      className={`flex flex-col rounded-2xl border p-4 ${
                        current
                          ? "border-[var(--surface-mocha)]/50 bg-[var(--surface-cream)]"
                          : "border-border/60 bg-background"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <p className="font-semibold text-foreground">{PLAN_LABELS[p]}</p>
                        {current && (
                          <span className="rounded-full bg-[var(--surface-mocha)] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[var(--surface-cream)]">
                            Current
                          </span>
                        )}
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {p === "dfy"
                          ? "Custom"
                          : p === "trial"
                            ? "Free"
                            : `$${PLAN_PRICES[p]}/mo · ${PLAN_CREDITS[p]} credits`}
                      </p>
                      <div className="mt-auto pt-3">
                        {p === "dfy" ? (
                          <Button asChild size="sm" variant="outline" className="w-full rounded-full">
                            <Link to="/inquiry">Contact us</Link>
                          </Button>
                        ) : (
                          <Button
                            onClick={() => onChoosePlan(p)}
                            disabled={current}
                            size="sm"
                            className="w-full rounded-full bg-[var(--surface-mocha)] text-[var(--surface-cream)] hover:bg-[var(--surface-espresso)] disabled:opacity-50"
                          >
                            {current ? "Current" : "Choose"}
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
              <p className="mt-4 rounded-xl border border-border bg-[var(--surface-sand)]/40 p-3 text-xs text-muted-foreground">
                <Globe className="mr-1 inline h-3 w-3" />
                Hosting your live website depends on an active subscription. If a recurring
                charge fails, your site will be paused until billing is updated.
              </p>
            </Card>

            {/* Billing history */}
            <Card className="mt-6 rounded-3xl border-border/60 bg-background p-6 shadow-[var(--shadow-sm)]">
              <h2 className="text-lg font-semibold text-foreground">Billing history</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                A timeline of trial, subscription, and payment events on your account.
              </p>
              {billing.history.length === 0 ? (
                <p className="mt-4 text-sm text-muted-foreground">No activity yet.</p>
              ) : (
                <ul className="mt-4 divide-y divide-border/60">
                  {billing.history.map((e) => {
                    const danger = e.kind === "payment_failed" || e.kind === "site_suspended";
                    const success =
                      e.kind === "payment_succeeded" ||
                      e.kind === "payment_resolved" ||
                      e.kind === "site_published" ||
                      e.kind === "subscription_started";
                    const Icon = danger ? AlertTriangle : success ? CheckCircle2 : CreditCard;
                    return (
                      <li key={e.id} className="flex items-start gap-3 py-3">
                        <span
                          className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${
                            danger
                              ? "bg-destructive/10 text-destructive"
                              : success
                                ? "bg-emerald-100 text-emerald-700"
                                : "bg-[var(--surface-sand)]/70 text-foreground/70"
                          }`}
                        >
                          <Icon className="h-3.5 w-3.5" />
                        </span>
                        <div className="flex-1">
                          <p className="text-sm text-foreground">{e.description}</p>
                          <p className="text-[11px] text-muted-foreground">
                            {formatDate(e.at)}
                          </p>
                        </div>
                        {typeof e.amount === "number" && (
                          <span className="text-sm font-medium text-foreground">
                            ${e.amount.toFixed(2)}
                          </span>
                        )}
                      </li>
                    );
                  })}
                </ul>
              )}
            </Card>
          </div>
        </main>
      </PageTransition>
      <AppFooter />
    </div>
  );
}