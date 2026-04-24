import { createFileRoute } from "@tanstack/react-router";
import { AppHeader } from "@/components/app/app-header";
import { AppFooter } from "@/components/app/app-footer";
import { PageTransition } from "@/components/app/page-transition";
import { usePageTransition } from "@/hooks/use-page-transition";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, Sparkles, Zap, ArrowRight, HandHelping, Star } from "lucide-react";
import { useCredits, ACTION_COSTS, ACTION_LABELS, type Plan } from "@/lib/credits";
import { toast } from "sonner";

export const Route = createFileRoute("/pricing")({
  component: PricingPage,
  head: () => ({
    meta: [
      { title: "Pricing — Lumen.pages" },
      {
        name: "description",
        content:
          "Simple credit-based pricing for insurance agents. Start free, upgrade when you're ready, or have us build it for you.",
      },
      { property: "og:title", content: "Pricing — Lumen.pages" },
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
    price: "$44",
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
  const { plan, upgrade } = useCredits();

  function onChoose(tier: Tier) {
    if (tier.id === "trial") {
      transitionTo({ to: "/start" });
      return;
    }
    upgrade(tier.id);
    toast.success(`You're on the ${tier.name} plan`, {
      description: "Credits topped up. Happy building!",
    });
    transitionTo({ to: "/builder" });
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <AppHeader />
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
            <div className="mt-12 grid gap-5 md:grid-cols-3">
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
                    {plan === tier.id ? "Current plan" : tier.cta}
                  </Button>
                </Card>
              ))}
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

            {/* Custom Website — premium done-for-you offer */}
            <div className="mt-20">
              <div className="mx-auto max-w-2xl text-center">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-foreground/20 bg-foreground px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-background">
                  <Star className="h-3 w-3" />
                  Done-for-you
                </span>
                <h2 className="mt-3 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                  Need us to build it for you?
                </h2>
                <p className="mt-3 text-muted-foreground">
                  Skip the builder. Our team designs, writes, and launches a polished
                  insurance website for you — built to convert.
                </p>
              </div>

              <Card className="relative mt-8 overflow-hidden rounded-3xl border-foreground/15 bg-gradient-to-br from-[var(--surface-espresso)] to-[var(--surface-mocha)] p-0 text-[var(--surface-cream)] shadow-[var(--shadow-lg)]">
                <div className="grid gap-0 lg:grid-cols-[1.1fr_1fr]">
                  <div className="p-8 sm:p-10">
                    <div className="flex items-center gap-2">
                      <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--surface-cream)]/15 text-[var(--surface-cream)]">
                        <HandHelping className="h-5 w-5" />
                      </span>
                      <span className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--surface-cream)]/70">
                        Custom Website
                      </span>
                    </div>
                    <h3 className="mt-4 text-2xl font-semibold tracking-tight sm:text-3xl">
                      Best for agents who want a professional website built for them.
                    </h3>
                    <div className="mt-5 flex flex-wrap items-baseline gap-2">
                      <span className="text-xs font-medium uppercase tracking-wider text-[var(--surface-cream)]/60">
                        Starting at
                      </span>
                      <span className="text-4xl font-semibold tracking-tight">$206</span>
                      <span className="text-sm text-[var(--surface-cream)]/70">
                        + active monthly subscription
                      </span>
                    </div>
                    <p className="mt-3 text-sm text-[var(--surface-cream)]/70">
                      Final price may vary based on scope, pages, features, and support
                      needs.
                    </p>
                    <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                      <Button
                        onClick={() => transitionTo({ to: "/inquiry" })}
                        size="lg"
                        className="rounded-full bg-[var(--surface-cream)] text-[var(--surface-espresso)] hover:bg-[var(--surface-cream)]/90"
                      >
                        Submit Inquiry
                        <ArrowRight className="ml-1 h-4 w-4" />
                      </Button>
                      <Button
                        onClick={() => transitionTo({ to: "/support" })}
                        size="lg"
                        variant="outline"
                        className="rounded-full border-[var(--surface-cream)]/30 bg-transparent text-[var(--surface-cream)] hover:bg-[var(--surface-cream)]/10 hover:text-[var(--surface-cream)]"
                      >
                        Ask a question
                      </Button>
                    </div>
                  </div>
                  <div className="border-t border-[var(--surface-cream)]/15 p-8 sm:p-10 lg:border-l lg:border-t-0">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--surface-cream)]/60">
                      What's included
                    </p>
                    <ul className="mt-4 space-y-3">
                      {[
                        "We build it for you, end to end",
                        "Customized to your brand",
                        "Built specifically for insurance agents",
                        "Mobile-friendly and lead-focused design",
                        "Revisions and launch support included",
                        "Hosting and live website tied to subscription",
                      ].map((f) => (
                        <li
                          key={f}
                          className="flex items-start gap-2.5 text-sm text-[var(--surface-cream)]/90"
                        >
                          <Check className="mt-0.5 h-4 w-4 shrink-0 text-[var(--surface-cream)]" />
                          {f}
                        </li>
                      ))}
                    </ul>
                    <p className="mt-5 rounded-2xl border border-[var(--surface-cream)]/15 bg-[var(--surface-cream)]/5 px-4 py-3 text-xs text-[var(--surface-cream)]/75">
                      An active monthly subscription keeps your website live, hosted, and
                      managed through the platform after launch.
                    </p>
                  </div>
                </div>
              </Card>
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