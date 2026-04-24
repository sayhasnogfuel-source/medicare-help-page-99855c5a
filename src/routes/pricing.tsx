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
      "108 credits / month",
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
      "488 credits / month",
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

            {/* DFY footnote */}
            <Card className="mt-16 flex flex-col items-center gap-4 rounded-3xl border-border/60 bg-[var(--surface-cream)] p-8 text-center shadow-[var(--shadow-sm)] sm:flex-row sm:text-left">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--surface-mocha)] text-[var(--surface-cream)]">
                <HandHelping className="h-6 w-6" />
              </span>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-foreground">
                  Don't want to build it yourself?
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Our team will design, write, and launch a polished website for your
                  insurance practice — usually within a week.
                </p>
              </div>
              <Button
                onClick={() => transitionTo({ to: "/inquiry" })}
                className="rounded-full bg-foreground text-background hover:bg-foreground/90"
              >
                Talk to our team
                <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </Card>

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