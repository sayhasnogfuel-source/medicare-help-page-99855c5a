import { createFileRoute } from "@tanstack/react-router";
import { AppHeader } from "@/components/app/app-header";
import { AppFooter } from "@/components/app/app-footer";
import { PageTransition } from "@/components/app/page-transition";
import { usePageTransition } from "@/hooks/use-page-transition";
import { Button } from "@/components/ui/button";
import { Sparkles, ArrowRight, Check } from "lucide-react";

export const Route = createFileRoute("/")({
  component: HomePage,
  head: () => ({
    meta: [
      { title: "Lumen.pages — A modern website builder for insurance agents" },
      {
        name: "description",
        content:
          "A clean, simple website builder for insurance agents — Medicare, ACA, Life, Health, Auto, Home, and more. Launch a modern lead-gen site in minutes.",
      },
      { property: "og:title", content: "Lumen.pages — A modern website builder for insurance agents" },
      {
        property: "og:description",
        content:
          "Launch a beautiful, mobile-friendly website for your insurance practice in minutes — no designer required.",
      },
    ],
  }),
});

function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <AppHeader />
      <PageTransition>
        <main className="flex-1">
          <Hero />
        </main>
      </PageTransition>
      <AppFooter />
    </div>
  );
}

/* ---------------- HERO ---------------- */
function Hero() {
  const { transitionTo } = usePageTransition();
  return (
    <section
      className="relative overflow-hidden"
      style={{ background: "var(--gradient-hero)" }}
    >
      <div className="mx-auto max-w-6xl px-5 pt-20 pb-24 text-center sm:pt-32 sm:pb-36">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background/70 px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-foreground/70 shadow-[var(--shadow-xs)] backdrop-blur">
          <Sparkles className="h-3 w-3" />
          Built for independent insurance agents
        </span>
        <h1 className="mx-auto mt-6 max-w-3xl text-4xl font-semibold leading-[1.05] tracking-tight text-foreground sm:text-6xl">
          A modern website builder for insurance agents
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg text-foreground/70 sm:text-xl">
          Launch a polished, mobile-friendly website for your insurance practice — Medicare,
          ACA, Life, Health, Auto, Home, and more. No designer, no developer required.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button
            size="lg"
            onClick={() => transitionTo({ to: "/start" })}
            className="rounded-full bg-[var(--surface-mocha)] px-8 text-base font-semibold text-[var(--surface-cream)] shadow-[var(--shadow-md)] hover:bg-[var(--surface-espresso)]"
          >
            Get Started
            <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-xs text-muted-foreground">
          {["No credit card", "5-minute setup", "Mobile-friendly", "Lead-ready"].map((t) => (
            <span key={t} className="inline-flex items-center gap-1.5">
              <Check className="h-3.5 w-3.5 text-[var(--surface-mocha)]" />
              {t}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
