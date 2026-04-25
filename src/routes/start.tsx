import { createFileRoute } from "@tanstack/react-router";
import { AppHeader } from "@/components/app/app-header";
import { AppFooter } from "@/components/app/app-footer";
import { PageTransition } from "@/components/app/page-transition";
import { usePageTransition } from "@/hooks/use-page-transition";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, Clock, HandHelping, Rocket } from "lucide-react";
import { AuthGuard } from "@/components/app/auth-guard";

export const Route = createFileRoute("/start")({
  component: GuardedStartPage,
  head: () => ({
    meta: [
      { title: "Get started — Diploo" },
      {
        name: "description",
        content:
          "Choose how to launch your insurance website — have our team build it for you, or build your own in minutes.",
      },
      { property: "og:title", content: "Get started — Diploo" },
      {
        property: "og:description",
        content:
          "Two simple paths to a beautiful insurance website. It only takes 5 minutes.",
      },
    ],
  }),
});

function GuardedStartPage() {
  return (
    <AuthGuard>
      <StartPage />
    </AuthGuard>
  );
}

function StartPage() {
  const { transitionTo } = usePageTransition();

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <AppHeader />
      <PageTransition>
        <main className="flex-1">
          <section className="mx-auto max-w-5xl px-5 pt-16 pb-16 sm:pt-24 sm:pb-24">
            <div className="mx-auto max-w-2xl text-center">
              <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                How would you like to get started?
              </h1>
              <span className="mt-5 inline-flex items-center gap-1.5 rounded-full border border-border bg-[var(--surface-sand)]/70 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-foreground/70">
                <Clock className="h-3 w-3" />
                It only takes 5 minutes
              </span>
            </div>

            <div className="mt-10 grid gap-5 md:grid-cols-2">
              <Card className="group flex flex-col rounded-3xl border-border/60 bg-background p-7 shadow-[var(--shadow-md)] transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-lg)] sm:p-9">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--surface-sand)] text-[var(--surface-mocha)]">
                  <HandHelping className="h-6 w-6" />
                </span>
                <h2 className="mt-6 text-2xl font-semibold tracking-tight text-foreground">
                  Have Us Build It For You
                </h2>
                <p className="mt-3 flex-1 text-muted-foreground">
                  Submit an inquiry and let our team create a professional insurance website
                  for you.
                </p>
                <Button
                  size="lg"
                  onClick={() => transitionTo({ to: "/inquiry" })}
                  className="mt-7 w-full rounded-full bg-[var(--surface-mocha)] text-base font-semibold text-[var(--surface-cream)] shadow-[var(--shadow-sm)] hover:bg-[var(--surface-espresso)]"
                >
                  Submit Inquiry
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </Card>

              <Card className="group flex flex-col rounded-3xl border-[var(--surface-mocha)]/30 bg-[var(--surface-cream)] p-7 shadow-[var(--shadow-md)] ring-1 ring-[var(--surface-mocha)]/15 transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-lg)] sm:p-9">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--surface-mocha)] text-[var(--surface-cream)]">
                  <Rocket className="h-6 w-6" />
                </span>
                <h2 className="mt-6 text-2xl font-semibold tracking-tight text-foreground">
                  Build Your Own Website
                </h2>
                <p className="mt-3 flex-1 text-muted-foreground">
                  Use our platform to create your own insurance website your way in just
                  minutes.
                </p>
                <Button
                  size="lg"
                  onClick={() => transitionTo({ to: "/builder" })}
                  className="mt-7 w-full rounded-full bg-foreground text-base font-semibold text-background hover:bg-foreground/90"
                >
                  Start Building
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </Card>
            </div>
          </section>
        </main>
      </PageTransition>
      <AppFooter />
    </div>
  );
}
