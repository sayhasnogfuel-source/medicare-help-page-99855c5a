import { createFileRoute, Link } from "@tanstack/react-router";
import { AppHeader } from "@/components/app/app-header";
import { AppFooter } from "@/components/app/app-footer";
import { PageTransition } from "@/components/app/page-transition";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  CreditCard,
  Edit3,
  Eye,
  EyeOff,
  Globe,
  Sparkles,
  Zap,
  Clock,
  Settings,
  TrendingUp,
  Circle,
  ListChecks,
} from "lucide-react";
import { useCredits, PLAN_LABELS } from "@/lib/credits";
import {
  useBilling,
  SITE_STATUS_LABEL,
  SUB_STATUS_LABEL,
  formatDate,
  type SiteStatus,
  type SubStatus,
} from "@/lib/billing";
import { loadBuilder, DEFAULT_BUILDER } from "@/lib/builder-storage";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { AuthGuard } from "@/components/app/auth-guard";

export const Route = createFileRoute("/dashboard")({
  component: GuardedDashboardPage,
  head: () => ({
    meta: [
      { title: "Dashboard — Lumen.pages" },
      {
        name: "description",
        content:
          "Manage your insurance website, credits, subscription, and publish status from a single dashboard.",
      },
      { property: "og:title", content: "Dashboard — Lumen.pages" },
      {
        property: "og:description",
        content:
          "Your command center for managing your AI-built insurance website.",
      },
    ],
  }),
});

function GuardedDashboardPage() {
  return (
    <AuthGuard>
      <DashboardPage />
    </AuthGuard>
  );
}

function siteStatusTone(s: SiteStatus): string {
  switch (s) {
    case "live":
      return "bg-emerald-100 text-emerald-900 border-emerald-300/60";
    case "ready":
      return "bg-sky-100 text-sky-900 border-sky-300/60";
    case "suspended":
      return "bg-destructive/10 text-destructive border-destructive/40";
    default:
      return "bg-[var(--surface-sand)] text-foreground/80 border-border";
  }
}

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

function DashboardPage() {
  const credits = useCredits();
  const billing = useBilling();
  const [hasBuilderDraft, setHasBuilderDraft] = useState(false);
  const [hasCustomized, setHasCustomized] = useState(false);

  useEffect(() => {
    const data = loadBuilder();
    setHasBuilderDraft(!!data);
    if (data) {
      const customized =
        data.businessName !== DEFAULT_BUILDER.businessName ||
        data.agentName !== DEFAULT_BUILDER.agentName ||
        !!data.logoDataUrl ||
        !!data.headshotDataUrl ||
        data.headline !== DEFAULT_BUILDER.headline;
      setHasCustomized(customized);
    }
  }, []);

  if (!credits.hydrated || !billing.hydrated) {
    return (
      <div className="flex min-h-screen flex-col bg-[var(--surface-sand)]/40">
        <AppHeader />
        <main className="flex-1" />
        <AppFooter />
      </div>
    );
  }

  const usedCredits = Math.max(0, credits.planTotal - credits.credits);
  const usedPct =
    credits.planTotal > 0 ? Math.round((usedCredits / credits.planTotal) * 100) : 0;

  const alerts: Array<{
    tone: "warn" | "danger" | "info" | "success";
    title: string;
    body: string;
    cta?: { label: string; to: "/billing" | "/pricing" | "/workspace" };
  }> = [];
  if (billing.subStatus === "past_due") {
    alerts.push({
      tone: "danger",
      title: "Your payment could not be processed",
      body: "Your live website has been paused until billing is updated. Update your payment method to restore service.",
      cta: { label: "Fix payment", to: "/billing" },
    });
  }
  if (!billing.hasCard) {
    alerts.push({
      tone: "warn",
      title: "Add a payment method to publish",
      body: "You can build and edit during your trial — going live requires an active subscription and a valid card on file.",
      cta: { label: "Add card", to: "/billing" },
    });
  }
  if (credits.isLow && !credits.isEmpty) {
    alerts.push({
      tone: "warn",
      title: "You're running low on credits",
      body: `You have ${credits.credits} credits left on your ${PLAN_LABELS[credits.plan]} plan. Upgrade to keep building.`,
      cta: { label: "Upgrade", to: "/pricing" },
    });
  }
  if (credits.isEmpty) {
    alerts.push({
      tone: "danger",
      title: "You're out of credits",
      body: "Upgrade to keep tweaking your website with AI.",
      cta: { label: "View plans", to: "/pricing" },
    });
  }
  if (
    credits.plan === "trial" &&
    billing.trialDaysLeft <= 2 &&
    billing.trialDaysLeft > 0
  ) {
    alerts.push({
      tone: "warn",
      title: `Trial ends in ${billing.trialDaysLeft} day${billing.trialDaysLeft === 1 ? "" : "s"}`,
      body: "Pick a plan to keep your website online when the trial ends.",
      cta: { label: "Choose a plan", to: "/pricing" },
    });
  }
  if (billing.siteStatus === "ready" && billing.canPublish) {
    alerts.push({
      tone: "success",
      title: "Your site is ready to publish",
      body: "Hit publish whenever you're ready — your subscription will keep it live.",
      cta: { label: "Publish now", to: "/billing" },
    });
  }

  function onPublish() {
    const r = billing.publishSite();
    if (r.ok) toast.success("Your website is now live");
    else toast.error("Cannot publish yet", { description: r.reason });
  }
  function onUnpublish() {
    billing.unpublishSite();
    toast.success("Website unpublished");
  }
  function onMarkReady() {
    billing.markReady();
    toast.success("Marked as ready to publish");
  }

  return (
    <div className="flex min-h-screen flex-col bg-[var(--surface-sand)]/40">
      <AppHeader />
      <PageTransition>
        <main className="flex-1">
          <div className="mx-auto max-w-6xl px-5 py-10 sm:py-14">
            {/* Heading */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Account
                </p>
                <h1 className="mt-2 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                  Dashboard
                </h1>
                <p className="mt-1.5 text-sm text-muted-foreground">
                  Manage your website, credits, and subscription.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button asChild variant="outline" size="sm" className="rounded-full">
                  <Link to="/workspace">
                    <Edit3 className="mr-1.5 h-3.5 w-3.5" /> Continue building
                  </Link>
                </Button>
                <Button asChild size="sm" className="rounded-full bg-[var(--surface-mocha)] text-[var(--surface-cream)] hover:bg-[var(--surface-espresso)]">
                  <Link to="/billing">
                    <Settings className="mr-1.5 h-3.5 w-3.5" /> Billing
                  </Link>
                </Button>
              </div>
            </div>

            {/* Alerts */}
            {alerts.length > 0 && (
              <div className="mt-6 space-y-2.5">
                {alerts.map((a, i) => {
                  const tone =
                    a.tone === "danger"
                      ? "border-destructive/40 bg-destructive/5 text-destructive"
                      : a.tone === "warn"
                        ? "border-amber-300/60 bg-amber-50/80 text-amber-900"
                        : a.tone === "success"
                          ? "border-emerald-300/60 bg-emerald-50/80 text-emerald-900"
                          : "border-border bg-background";
                  const Icon =
                    a.tone === "success" ? CheckCircle2 : AlertTriangle;
                  return (
                    <div
                      key={i}
                      className={`flex flex-col gap-2 rounded-2xl border px-4 py-3 text-sm sm:flex-row sm:items-center sm:justify-between ${tone}`}
                    >
                      <div className="flex items-start gap-2.5">
                        <Icon className="mt-0.5 h-4 w-4 shrink-0" />
                        <div>
                          <p className="font-semibold">{a.title}</p>
                          <p className="opacity-90">{a.body}</p>
                        </div>
                      </div>
                      {a.cta && (
                        <Button
                          asChild
                          size="sm"
                          variant="outline"
                          className="shrink-0 rounded-full bg-background"
                        >
                          <Link to={a.cta.to}>
                            {a.cta.label}
                            <ArrowRight className="ml-1 h-3.5 w-3.5" />
                          </Link>
                        </Button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Onboarding checklist */}
            <OnboardingChecklist
              hasBuilderDraft={hasBuilderDraft}
              hasCustomized={hasCustomized}
              hasCard={billing.hasCard}
              isLive={billing.siteStatus === "live"}
              hasSubscription={
                billing.subStatus === "active" ||
                billing.subStatus === "trialing"
              }
            />

            {/* Cards grid */}
            <div className="mt-8 grid gap-4 lg:grid-cols-3">
              {/* Website status */}
              <Card className="rounded-3xl border-border/60 bg-background p-6 shadow-[var(--shadow-sm)]">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                    <Globe className="h-3 w-3" /> Website
                  </span>
                  <span
                    className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${siteStatusTone(billing.siteStatus)}`}
                  >
                    {SITE_STATUS_LABEL[billing.siteStatus]}
                  </span>
                </div>
                <h2 className="mt-3 text-lg font-semibold text-foreground">
                  {billing.siteStatus === "live"
                    ? "Your site is live"
                    : billing.siteStatus === "ready"
                      ? "Ready to launch"
                      : billing.siteStatus === "suspended"
                        ? "Paused due to billing"
                        : "In progress"}
                </h2>
                <p className="mt-1.5 text-sm text-muted-foreground">
                  {billing.siteStatus === "live"
                    ? "Your subscription keeps the site online."
                    : billing.siteStatus === "ready"
                      ? "Publish whenever you're ready."
                      : billing.siteStatus === "suspended"
                        ? "Update billing to bring your site back online."
                        : "Keep building or mark it ready when done."}
                </p>
                <div className="mt-5 flex flex-wrap gap-2">
                  <Button asChild size="sm" variant="outline" className="rounded-full">
                    <Link to="/workspace">
                      <Edit3 className="mr-1 h-3.5 w-3.5" /> Open builder
                    </Link>
                  </Button>
                  <Button asChild size="sm" variant="ghost" className="rounded-full">
                    <Link to="/preview">
                      <Eye className="mr-1 h-3.5 w-3.5" /> Preview
                    </Link>
                  </Button>
                </div>
              </Card>

              {/* Plan */}
              <Card className="rounded-3xl border-border/60 bg-background p-6 shadow-[var(--shadow-sm)]">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                    <Sparkles className="h-3 w-3" /> Plan
                  </span>
                  <span
                    className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${subStatusTone(billing.subStatus)}`}
                  >
                    {SUB_STATUS_LABEL[billing.subStatus]}
                  </span>
                </div>
                <h2 className="mt-3 text-lg font-semibold text-foreground">
                  {PLAN_LABELS[credits.plan]}
                </h2>
                <p className="mt-1.5 text-sm text-muted-foreground">
                  {credits.plan === "trial"
                    ? billing.trialDaysLeft > 0
                      ? `Trial ends in ${billing.trialDaysLeft} day${billing.trialDaysLeft === 1 ? "" : "s"} (${formatDate(billing.trialEndsAt)})`
                      : "Trial period has ended"
                    : billing.nextBillingAt
                      ? `Renews ${formatDate(billing.nextBillingAt)}`
                      : "No upcoming charge scheduled"}
                </p>
                <Button asChild size="sm" className="mt-5 w-full rounded-full bg-[var(--surface-mocha)] text-[var(--surface-cream)] hover:bg-[var(--surface-espresso)]">
                  <Link to="/pricing">
                    <TrendingUp className="mr-1.5 h-3.5 w-3.5" /> Manage subscription
                  </Link>
                </Button>
              </Card>

              {/* Credits */}
              <Card className="rounded-3xl border-border/60 bg-background p-6 shadow-[var(--shadow-sm)]">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                    <Zap className="h-3 w-3" /> Credits
                  </span>
                  {credits.isLow && (
                    <span className="inline-flex items-center rounded-full border border-amber-300/60 bg-amber-100 px-2.5 py-0.5 text-[11px] font-semibold text-amber-900">
                      Low
                    </span>
                  )}
                </div>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-3xl font-semibold tracking-tight text-foreground">
                    {credits.credits}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    / {credits.planTotal || "—"} remaining
                  </span>
                </div>
                <Progress value={100 - usedPct} className="mt-3 h-2" />
                <p className="mt-2 text-xs text-muted-foreground">
                  {usedCredits} used this cycle
                </p>
                <Button
                  asChild
                  size="sm"
                  variant={credits.isLow ? "default" : "outline"}
                  className="mt-5 w-full rounded-full"
                >
                  <Link to="/pricing">Upgrade for more credits</Link>
                </Button>
              </Card>

              {/* Payment */}
              <Card className="rounded-3xl border-border/60 bg-background p-6 shadow-[var(--shadow-sm)] lg:col-span-2">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                    <CreditCard className="h-3 w-3" /> Payment method
                  </span>
                  <span
                    className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${
                      billing.hasCard
                        ? "border-emerald-300/60 bg-emerald-100 text-emerald-900"
                        : "border-amber-300/60 bg-amber-100 text-amber-900"
                    }`}
                  >
                    {billing.hasCard ? "On file" : "Required"}
                  </span>
                </div>
                {billing.card ? (
                  <div className="mt-4 flex flex-wrap items-center gap-4">
                    <div className="flex h-12 w-20 items-center justify-center rounded-lg border border-border bg-[var(--surface-sand)]/60 text-xs font-bold uppercase tracking-wider text-foreground/70">
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
                    <Button asChild size="sm" variant="outline" className="rounded-full">
                      <Link to="/billing">Update billing</Link>
                    </Button>
                  </div>
                ) : (
                  <div className="mt-4">
                    <p className="text-sm text-muted-foreground">
                      No card on file yet. Add one to publish your website when it's ready.
                    </p>
                    <Button asChild size="sm" className="mt-4 rounded-full bg-[var(--surface-mocha)] text-[var(--surface-cream)] hover:bg-[var(--surface-espresso)]">
                      <Link to="/billing">Add payment method</Link>
                    </Button>
                  </div>
                )}
              </Card>

              {/* Publish controls */}
              <Card className="rounded-3xl border-border/60 bg-background p-6 shadow-[var(--shadow-sm)]">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                    <Globe className="h-3 w-3" /> Publish
                  </span>
                </div>
                <p className="mt-3 text-sm text-foreground">
                  {billing.siteStatus === "live"
                    ? "Your website is currently live."
                    : billing.siteStatus === "suspended"
                      ? "Your website has been paused due to billing issues."
                      : billing.canPublish
                        ? "Your site is ready to publish."
                        : "Add a valid payment method to publish your website."}
                </p>
                <div className="mt-5 space-y-2">
                  {billing.siteStatus === "live" ? (
                    <Button onClick={onUnpublish} variant="outline" size="sm" className="w-full rounded-full">
                      <EyeOff className="mr-1.5 h-3.5 w-3.5" /> Unpublish
                    </Button>
                  ) : (
                    <Button
                      onClick={onPublish}
                      size="sm"
                      disabled={!billing.canPublish}
                      className="w-full rounded-full bg-[var(--surface-mocha)] text-[var(--surface-cream)] hover:bg-[var(--surface-espresso)] disabled:opacity-50"
                    >
                      <Globe className="mr-1.5 h-3.5 w-3.5" /> Publish website
                    </Button>
                  )}
                  {billing.siteStatus === "draft" && (
                    <Button onClick={onMarkReady} variant="ghost" size="sm" className="w-full rounded-full">
                      Mark as ready to publish
                    </Button>
                  )}
                </div>
              </Card>
            </div>

            {/* Recent activity */}
            <Card className="mt-6 rounded-3xl border-border/60 bg-background p-6 shadow-[var(--shadow-sm)]">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-semibold text-foreground">
                  Recent activity
                </h2>
                <Button asChild variant="ghost" size="sm" className="rounded-full">
                  <Link to="/billing">View all</Link>
                </Button>
              </div>
              <ul className="mt-4 divide-y divide-border/60">
                {billing.history.slice(0, 5).map((e) => (
                  <li key={e.id} className="flex items-start gap-3 py-3">
                    <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--surface-sand)]/70 text-foreground/70">
                      <Clock className="h-3.5 w-3.5" />
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
                ))}
              </ul>
            </Card>
          </div>
        </main>
      </PageTransition>
      <AppFooter />
    </div>
  );
}

function OnboardingChecklist({
  hasBuilderDraft,
  hasCustomized,
  hasCard,
  hasSubscription,
  isLive,
}: {
  hasBuilderDraft: boolean;
  hasCustomized: boolean;
  hasCard: boolean;
  hasSubscription: boolean;
  isLive: boolean;
}) {
  const steps: Array<{
    label: string;
    done: boolean;
    cta?: { label: string; to: "/start" | "/builder" | "/workspace" | "/billing" };
  }> = [
    {
      label: "Complete the starter form",
      done: hasBuilderDraft,
      cta: hasBuilderDraft ? undefined : { label: "Start", to: "/start" },
    },
    {
      label: "Generate your website",
      done: hasBuilderDraft,
      cta: hasBuilderDraft ? undefined : { label: "Generate", to: "/builder" },
    },
    {
      label: "Customize branding & copy",
      done: hasCustomized,
      cta: hasCustomized ? undefined : { label: "Open builder", to: "/workspace" },
    },
    {
      label: "Add a payment method",
      done: hasCard,
      cta: hasCard ? undefined : { label: "Add card", to: "/billing" },
    },
    {
      label: "Publish your website",
      done: isLive,
      cta:
        isLive
          ? undefined
          : {
              label: hasSubscription ? "Publish" : "Choose plan",
              to: "/billing",
            },
    },
  ];

  const completed = steps.filter((s) => s.done).length;
  const total = steps.length;
  if (completed === total) return null;

  return (
    <Card className="mt-6 rounded-3xl border-border/60 bg-background p-6 shadow-[var(--shadow-sm)]">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--surface-sand)] text-[var(--surface-mocha)]">
            <ListChecks className="h-4.5 w-4.5" />
          </span>
          <div>
            <h2 className="text-base font-semibold text-foreground">
              Get your site live
            </h2>
            <p className="text-xs text-muted-foreground">
              {completed} of {total} steps complete
            </p>
          </div>
        </div>
        <span className="rounded-full border border-border bg-[var(--surface-sand)]/60 px-3 py-1 text-[11px] font-semibold text-foreground/70">
          {Math.round((completed / total) * 100)}%
        </span>
      </div>
      <ul className="mt-5 space-y-2.5">
        {steps.map((s, i) => (
          <li
            key={i}
            className={`flex items-center justify-between gap-3 rounded-2xl border px-4 py-3 ${
              s.done
                ? "border-emerald-300/40 bg-emerald-50/40"
                : "border-border/60 bg-[var(--surface-cream)]/50"
            }`}
          >
            <div className="flex items-center gap-3">
              {s.done ? (
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-700" />
              ) : (
                <Circle className="h-4 w-4 shrink-0 text-muted-foreground" />
              )}
              <span
                className={`text-sm ${s.done ? "text-foreground/70 line-through" : "font-medium text-foreground"}`}
              >
                {s.label}
              </span>
            </div>
            {s.cta && (
              <Button
                asChild
                size="sm"
                variant="outline"
                className="h-7 shrink-0 rounded-full text-xs"
              >
                <Link to={s.cta.to}>
                  {s.cta.label}
                  <ArrowRight className="ml-1 h-3 w-3" />
                </Link>
              </Button>
            )}
          </li>
        ))}
      </ul>
    </Card>
  );
}