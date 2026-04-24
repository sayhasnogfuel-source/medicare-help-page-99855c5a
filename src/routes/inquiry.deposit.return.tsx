import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect } from "react";
import { AppHeader } from "@/components/app/app-header";
import { AppFooter } from "@/components/app/app-footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";

const PENDING_KEY = "lp_inquiry_pending";
const SUBMISSIONS_KEY = "lp_inquiry_submissions";

export const Route = createFileRoute("/inquiry/deposit/return")({
  component: DepositReturnPage,
  head: () => ({
    meta: [{ title: "Deposit received — Diploofly" }],
  }),
});

function DepositReturnPage() {
  // Promote the pending inquiry to confirmed submissions list, then clear pending.
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = window.localStorage.getItem(PENDING_KEY);
      if (!raw) return;
      const pending = JSON.parse(raw) as Record<string, unknown>;
      const listRaw = window.localStorage.getItem(SUBMISSIONS_KEY);
      const list = listRaw ? (JSON.parse(listRaw) as unknown[]) : [];
      list.push({
        ...pending,
        depositPaidAt: new Date().toISOString(),
        depositAmount: 20600,
      });
      window.localStorage.setItem(SUBMISSIONS_KEY, JSON.stringify(list));
      window.localStorage.removeItem(PENDING_KEY);
    } catch {
      // ignore
    }
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
              Deposit received — your build is queued
            </h1>
            <p className="mt-3 text-muted-foreground">
              Thanks for the $206 deposit. Our team will reach out within 1 business day
              to kick off design and confirm the rest of the scope.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <Button
                asChild
                className="rounded-full bg-[var(--surface-mocha)] text-[var(--surface-cream)] hover:bg-[var(--surface-espresso)]"
              >
                <Link to="/">Back to home</Link>
              </Button>
              <Button asChild variant="outline" className="rounded-full">
                <Link to="/support">Contact support</Link>
              </Button>
            </div>
          </Card>
        </div>
      </main>
      <AppFooter />
    </div>
  );
}