import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppHeader } from "@/components/app/app-header";
import { AppFooter } from "@/components/app/app-footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle2, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const PENDING_KEY = "lp_inquiry_pending";

export const Route = createFileRoute("/inquiry/deposit/return")({
  component: DepositReturnPage,
  head: () => ({
    meta: [{ title: "Deposit received — Diploofly" }],
  }),
});

function DepositReturnPage() {
  const [confirmed, setConfirmed] = useState(false);
  const [stillWaiting, setStillWaiting] = useState(false);

  // Poll the inquiries table to confirm the webhook has marked the deposit
  // as paid. Bails out after ~10 seconds — Stripe webhook is usually < 2s.
  useEffect(() => {
    if (typeof window === "undefined") return;
    let inquiryId: string | null = null;
    try {
      const raw = window.localStorage.getItem(PENDING_KEY);
      if (raw) inquiryId = (JSON.parse(raw) as { inquiryId?: string }).inquiryId ?? null;
    } catch {
      // ignore
    }
    if (!inquiryId) {
      setConfirmed(true);
      return;
    }
    let cancelled = false;
    let attempts = 0;
    const poll = async () => {
      attempts += 1;
      const { data } = await supabase
        .from("inquiries")
        .select("id, deposit_status")
        .eq("id", inquiryId!)
        .maybeSingle();
      if (cancelled) return;
      if (data?.deposit_status === "paid") {
        setConfirmed(true);
        try {
          window.localStorage.removeItem(PENDING_KEY);
        } catch {
          // ignore
        }
        return;
      }
      if (attempts >= 6) {
        setStillWaiting(true);
        return;
      }
      setTimeout(poll, 1500);
    };
    poll();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-[var(--surface-sand)]/40">
      <AppHeader />
      <main className="flex-1">
        <div className="mx-auto max-w-2xl px-5 py-16 text-center">
          <Card className="rounded-3xl border-border/60 bg-background p-10 shadow-[var(--shadow-md)]">
            {!confirmed && !stillWaiting ? (
              <>
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[var(--surface-sand)] text-[var(--surface-mocha)]">
                  <Loader2 className="h-7 w-7 animate-spin" />
                </div>
                <h1 className="mt-5 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                  Confirming your deposit…
                </h1>
                <p className="mt-3 text-muted-foreground">
                  Just a moment while we finalize your payment with Stripe.
                </p>
              </>
            ) : (
              <>
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                  <CheckCircle2 className="h-7 w-7" />
                </div>
                <h1 className="mt-5 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                  {stillWaiting
                    ? "Payment received — confirmation coming shortly"
                    : "Deposit received — your build is queued"}
                </h1>
                <p className="mt-3 text-muted-foreground">
                  {stillWaiting
                    ? "We've got your payment. We'll email you a confirmation in a few minutes once Stripe finalizes the charge."
                    : "Thanks for the $206 deposit. Our team will reach out within 1 business day to kick off design and confirm the rest of the scope."}
                </p>
              </>
            )}
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