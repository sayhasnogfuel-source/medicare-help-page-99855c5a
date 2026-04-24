import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppHeader } from "@/components/app/app-header";
import { AppFooter } from "@/components/app/app-footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle2, Loader2 } from "lucide-react";
import { useSubscription } from "@/lib/subscription";

export const Route = createFileRoute("/checkout/return")({
  component: CheckoutReturnPage,
  head: () => ({
    meta: [{ title: "Welcome — Diploo" }],
  }),
});

function CheckoutReturnPage() {
  const sub = useSubscription();
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(4);

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

  // Tick down a small countdown then auto-redirect into the builder so
  // people aren't dumped back at "pick a plan".
  useEffect(() => {
    if (countdown <= 0) {
      navigate({ to: "/builder", replace: true });
      return;
    }
    const t = window.setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => window.clearTimeout(t);
  }, [countdown, navigate]);

  return (
    <div className="flex min-h-screen flex-col bg-[var(--surface-sand)]/40">
      <AppHeader />
      <main className="flex-1">
        <div className="mx-auto max-w-2xl px-5 py-16 text-center">
          <Card className="rounded-3xl border-border/60 bg-background p-10 shadow-[var(--shadow-md)]">
            <div className="mx-auto flex h-20 w-20 animate-[scale-in_500ms_cubic-bezier(0.22,1,0.36,1)_both] items-center justify-center rounded-full bg-emerald-100 text-emerald-600 ring-8 ring-emerald-50">
              <CheckCircle2 className="h-10 w-10" strokeWidth={2.25} />
            </div>
            <p className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-emerald-700">
              Payment received
            </p>
            <h1 className="mt-3 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              You're in — your trial has started.
            </h1>
            <p className="mt-3 text-muted-foreground">
              Welcome to Diploo. You have 7 days to build, edit, and publish your website. Your card won't be charged until the trial ends — cancel anytime.
            </p>
            <p className="mt-4 inline-flex items-center gap-2 text-xs text-muted-foreground">
              <Loader2 className="h-3 w-3 animate-spin" />
              Taking you to the builder in {countdown}s…
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <Button
                asChild
                className="rounded-full bg-[var(--surface-mocha)] text-[var(--surface-cream)] hover:bg-[var(--surface-espresso)]"
              >
                <Link to="/builder">Open the builder now</Link>
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
