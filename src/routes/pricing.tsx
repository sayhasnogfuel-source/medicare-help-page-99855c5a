import { createFileRoute } from "@tanstack/react-router";
import { AppHeader } from "@/components/app/app-header";
import { AppFooter } from "@/components/app/app-footer";
import { PageTransition } from "@/components/app/page-transition";
import { TestModeBanner } from "@/components/app/test-mode-banner";
import { usePageTransition } from "@/hooks/use-page-transition";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, Sparkles, Zap, ArrowRight, Star } from "lucide-react";
import { ACTION_COSTS, ACTION_LABELS, type Plan } from "@/lib/credits";
import { useAccount } from "@/lib/account";
import { useSubscription } from "@/lib/subscription";
import { toast } from "sonner";

export const Route = createFileRoute("/pricing")({
  component: PricingPage,
  head: () => ({
    meta: [
      { title: "Pricing — Diploofly" },
      {
        name: "description",
        content:
          "Simple credit-based pricing for insurance agents. Start free, upgrade when you're ready, or have us build it for you.",
      },
      { property: "og:title", content: "Pricing — Diploofly" },
      {
        property: "og:description",
        content:
          "Free trial, Starter, and Pro plans for insurance agents. Or let our team build your site for you.",
      },
    ],
  }),
});

interface Tier {
  id: Exclude<Plan, "dfy">;
  name: string;
  price: string;
  period?: string;
  tagline: string;
  features: string[];
  cta: string;
  highlight?: boolean;
  variant: "outline" | "primary" | "dark";
}

const TIERS: Tier[] = [
  {
    id: "trial",
    name: "Free Trial",
    price: "$0",
    period: "to start",
    tagline: "Try the AI builder, build your site, and explore before upgrading.",
    features: [
      "10 trial credits",
      "AI website generation",
      "Edit copy, sections & branding",
      "Mobile-friendly preview",
      "Publish unlocked after upgrade",
    ],
    cta: "Start Free Trial",
    variant: "outline",
  },
  {
    id: "starter",
    name: "Starter",
    price: "$26",
    period: "/ month",
    tagline: "Everything one agent needs to launch and edit a real website.",
    features: [
      "100 credits / month",
      "Publish your website live",
      "Hosting included while subscribed",
      "Edit copy, sections & branding",
      "Email support",
    ],
    cta: "Choose Starter",
    variant: "primary",
  },
  {
    id: "pro",
    name: "Pro",
    price: "$80",
    period: "/ month",
    tagline: "More credits and room to iterate for agents who want to grow fast.",
    features: [
      "500 credits / month",
      "Unlimited redesigns & rewrites",
      "Add additional pages",
      "Priority AI generations",
      "Priority email + chat support",
    ],
    cta: "Choose Pro",
    variant: "dark",
    highlight: true,
  },
];

function PricingPage() {
  const { transitionTo } = usePageTransition();
  const account = useAccount();
  const sub = useSubscription();
  const currentPlan: Plan = sub.plan === "starter" ? "starter" : sub.plan === "pro" ? "pro" : "trial";

  function onChoose(tier: Tier) {
    if (tier.id === "trial") {
      transitionTo({ to: "/start" });
      return;
    }
    if (account.hydrated && !account.signedIn) {
      toast.info("Sign in to start your free trial");
      transitionTo({ to: "/signup" });
      return;
    }
    if (sub.isActive && currentPlan === tier.id) {
      toast.info("You're already on this plan");
      transitionTo({ to: "/billing" });
      return;
    }
    transitionTo({ to: "/checkout", search: { plan: tier.id } } as Parameters<typeof transitionTo>[0]);
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <AppHeader />
      <TestModeBanner />
      <PageTransition>
        <main className="flex-1">
          <section className="mx-auto max-w-6xl px-5 py-16 sm:py-24">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Pricing
              </p>
              <h1 className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-5xl">
                Simple, credit-based pricing
              </h1>
              <p className="mt-4 text-lg text-muted-foreground">
                Start free, upgrade when you're ready. Credits are used for AI actions
                inside the builder — never for viewing or basic edits.
              </p>
            </div>

            {/* Tiers */}
            <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
              {TIERS.map((tier) => (
                <Card
                  key={tier.id}
                  className={`flex flex-col rounded-3xl p-7 shadow-[var(--shadow-md)] transition-shadow hover:shadow-[var(--shadow-lg)] ${
                    tier.highlight
                      ? "border-[var(--surface-mocha)]/40 bg-[var(--surface-cream)] ring-1 ring-[var(--surface-mocha)]/20"
                      : "border-border/60 bg-background"
                  }`}
                >
                  {tier.highlight && (
                    <span className="mb-3 inline-flex w-fit items-center gap-1 rounded-full bg-[var(--surface-mocha)] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-[var(--surface-cream)]">
                      Most popular
                    </span>
                  )}
                  <h2 className="text-xl font-semibold tracking-tight text-foreground">
                    {tier.name}
                  </h2>
                  <div className="mt-3 flex items-baseline gap-1.5">
                    <span className="text-4xl font-semibold tracking-tight text-foreground">
                      {tier.price}
                    </span>
                    {tier.period && (
                      <span className="text-sm text-muted-foreground">{tier.period}</span>
                    )}
                  </div>
                  <p className="mt-3 text-sm text-muted-foreground">{tier.tagline}</p>
                  <ul className="mt-5 flex-1 space-y-2.5">
                    {tier.features.map((f) => (
                      <li
                        key={f}
                        className="flex items-start gap-2 text-sm text-foreground/80"
                      >
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-[var(--surface-mocha)]" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Button
                    onClick={() => onChoose(tier)}
                    size="lg"
                    className={`mt-6 w-full rounded-full text-sm font-semibold ${
                      tier.variant === "dark"
                        ? "bg-foreground text-background hover:bg-foreground/90"
                        : tier.variant === "primary"
                          ? "bg-[var(--surface-mocha)] text-[var(--surface-cream)] hover:bg-[var(--surface-espresso)]"
                          : "bg-[var(--surface-sand)] text-foreground hover:bg-[var(--surface-beige)]"
                    }`}
                  >
                    {currentPlan === tier.id && sub.isActive ? "Current plan" : tier.cta}
                  </Button>
                </Card>
              ))}

              {/* Custom Website — premium done-for-you offer, same frame as plans */}
              <Card className="relative flex flex-col overflow-hidden rounded-3xl border-foreground/20 bg-gradient-to-br from-[var(--surface-espresso)] to-[var(--surface-mocha)] p-7 text-[var(--surface-cream)] shadow-[var(--shadow-lg)] transition-shadow hover:shadow-[var(--shadow-xl)]">
                <span className="mb-3 inline-flex w-fit items-center gap-1 rounded-full bg-[var(--surface-cream)] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-[var(--surface-espresso)]">
                  <Star className="h-3 w-3" />
                  Done-for-you
                </span>
                <h2 className="text-xl font-semibold tracking-tight text-[var(--surface-cream)]">
                  Custom Website
                </h2>
                <div className="mt-3 flex flex-wrap items-baseline gap-1.5">
                  <span className="text-[11px] font-medium uppercase tracking-wider text-[var(--surface-cream)]/60">
                    From
                  </span>
                  <span className="text-4xl font-semibold tracking-tight text-[var(--surface-cream)]">
                    $206
                  </span>
                  <span className="text-sm text-[var(--surface-cream)]/70">
                    + subscription
                  </span>
                </div>
                <p className="mt-3 text-sm text-[var(--surface-cream)]/75">
                  We design, write, and launch a polished website for you.
                </p>
                <ul className="mt-5 flex-1 space-y-2.5">
                  {[
                    "We build it for you, end to end",
                    "Customized to your brand",
                    "Built for insurance agents",
                    "Mobile-friendly & lead-focused",
                    "Revisions and launch support",
                    "Hosting tied to active subscription",
                  ].map((f) => (
                    <li
                      key={f}
                      className="flex items-start gap-2 text-sm text-[var(--surface-cream)]/90"
                    >
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-[var(--surface-cream)]" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Button
                  onClick={() => transitionTo({ to: "/inquiry" })}
                  size="lg"
                  className="mt-6 w-full rounded-full bg-[var(--surface-cream)] text-sm font-semibold text-[var(--surface-espresso)] hover:bg-[var(--surface-cream)]/90"
                >
                  Submit Inquiry
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
                <p className="mt-3 text-center text-[11px] text-[var(--surface-cream)]/60">
                  Final price varies by scope, pages & features.
                </p>
              </Card>
            </div>

            {/* How credits work */}
            <div className="mt-16">
              <div className="mx-auto max-w-2xl text-center">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-[var(--surface-sand)]/70 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-foreground/70">
                  <Zap className="h-3 w-3" />
                  How credits work
                </span>
                <h2 className="mt-3 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                  Credits power the AI, not the basics
                </h2>
                <p className="mt-3 text-muted-foreground">
                  You only spend credits on meaningful AI actions. Viewing, navigating, and
                  small text edits are always free.
                </p>
              </div>
              <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {(Object.keys(ACTION_COSTS) as Array<keyof typeof ACTION_COSTS>).map(
                  (k) => (
                    <div
                      key={k}
                      className="flex items-center justify-between rounded-2xl border border-border/60 bg-background px-5 py-4 shadow-[var(--shadow-xs)]"
                    >
                      <span className="text-sm font-medium text-foreground">
                        {ACTION_LABELS[k]}
                      </span>
                      <span className="inline-flex items-center gap-1 rounded-full bg-[var(--surface-sand)] px-2.5 py-1 text-xs font-semibold text-foreground/80">
                        <Zap className="h-3 w-3" />
                        {ACTION_COSTS[k]}
                      </span>
                    </div>
                  ),
                )}
              </div>
            </div>

            <p className="mt-10 text-center text-xs text-muted-foreground">
              <Sparkles className="mr-1 inline h-3 w-3" />
              Pricing shown for demo purposes. No real charge — checkout isn't wired up.
            </p>
          </section>
        </main>
      </PageTransition>
      <AppFooter />
    </div>
  );
}