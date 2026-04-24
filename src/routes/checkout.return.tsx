import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect } from "react";
import { AppHeader } from "@/components/app/app-header";
import { AppFooter } from "@/components/app/app-footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";
import { useSubscription } from "@/lib/subscription";

export const Route = createFileRoute("/checkout/return")({
  component: CheckoutReturnPage,
  head: () => ({
    meta: [{ title: "Welcome — Diploofly" }],
  }),
});

function CheckoutReturnPage() {
  const sub = useSubscription();

  // Refetch subscription a few times in case the webhook hasn't landed yet
  useEffect(() => {
    let cancelled = false;
    const tries = [1000, 2500, 5000];
    tries.forEach((delay) => {
      setTimeout(() => {
        if (!cancelled) sub.refetch();
      }, delay);
    });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-[var(--surface-sand)]/40">
      <AppHeader />
      <main className="flex-1">
        <div className="mx-auto max-w-2xl px-5 py-16 text-center">
          <Card className="rounded-3xl border-border/60 bg-background p-10 shadow-[var(--shadow-md)]">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
              <CheckCircle2 className="h-7 w-7" />
            </div>
            <h1 className="mt-5 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              You're in! Your trial has started.
            </h1>
            <p className="mt-3 text-muted-foreground">
              Welcome to Diploofly. You have 7 days to build, edit, and publish your website. Your card won't be charged until the trial ends — cancel anytime.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <Button
                asChild
                className="rounded-full bg-[var(--surface-mocha)] text-[var(--surface-cream)] hover:bg-[var(--surface-espresso)]"
              >
                <Link to="/builder">Open the builder</Link>
              </Button>
              <Button asChild variant="outline" className="rounded-full">
                <Link to="/billing">Manage subscription</Link>
              </Button>
            </div>
          </Card>
        </div>
      </main>
      <AppFooter />
    </div>
  );
}
