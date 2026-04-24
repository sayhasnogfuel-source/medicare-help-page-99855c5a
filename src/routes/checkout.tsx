import { createFileRoute, Link, useSearch } from "@tanstack/react-router";
import { z } from "zod";
import { useEffect, useState } from "react";
import { AppHeader } from "@/components/app/app-header";
import { AppFooter } from "@/components/app/app-footer";
import { TestModeBanner } from "@/components/app/test-mode-banner";
import { StripeEmbeddedCheckoutForm } from "@/components/app/stripe-checkout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { useAccount } from "@/lib/account";

const PLAN_INFO: Record<string, { name: string; price: string; priceId: string }> = {
  starter: { name: "Starter", price: "$26 / month", priceId: "starter_monthly" },
  pro: { name: "Pro", price: "$80 / month", priceId: "pro_monthly" },
};

const searchSchema = z.object({
  plan: z.enum(["starter", "pro"]).optional(),
});

export const Route = createFileRoute("/checkout")({
  component: CheckoutPage,
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "Checkout — Diploo" },
      { name: "description", content: "Start your 7-day free trial. Cancel anytime." },
    ],
  }),
});

function CheckoutPage() {
  const { plan } = useSearch({ from: "/checkout" });
  const account = useAccount();
  const [origin, setOrigin] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") setOrigin(window.location.origin);
  }, []);

  const planInfo = plan ? PLAN_INFO[plan] : null;

  return (
    <div className="flex min-h-screen flex-col bg-[var(--surface-sand)]/40">
      <AppHeader />
      <TestModeBanner />
      <main className="flex-1">
        <div className="mx-auto max-w-3xl px-5 py-10 sm:py-14">
          <Button asChild variant="ghost" size="sm" className="mb-4 rounded-full">
            <Link to="/pricing">
              <ArrowLeft className="mr-1.5 h-3.5 w-3.5" /> Back to pricing
            </Link>
          </Button>

          {!planInfo ? (
            <Card className="rounded-3xl border-border/60 bg-background p-8 text-center shadow-[var(--shadow-sm)]">
              <h1 className="text-2xl font-semibold text-foreground">Choose a plan</h1>
              <p className="mt-2 text-muted-foreground">
                Pick a plan from the pricing page to start checkout.
              </p>
              <Button
                asChild
                className="mt-6 rounded-full bg-[var(--surface-mocha)] text-[var(--surface-cream)] hover:bg-[var(--surface-espresso)]"
              >
                <Link to="/pricing">View plans</Link>
              </Button>
            </Card>
          ) : !account.hydrated ? (
            <Card className="rounded-3xl border-border/60 bg-background p-8 shadow-[var(--shadow-sm)]">
              <p className="text-muted-foreground">Loading…</p>
            </Card>
          ) : !account.signedIn ? (
            <Card className="rounded-3xl border-border/60 bg-background p-8 text-center shadow-[var(--shadow-sm)]">
              <h1 className="text-2xl font-semibold text-foreground">Sign in to continue</h1>
              <p className="mt-2 text-muted-foreground">
                Create a free account or sign in to start your 7-day free trial of the {planInfo.name} plan.
              </p>
              <Button
                asChild
                className="mt-6 rounded-full bg-[var(--surface-mocha)] text-[var(--surface-cream)] hover:bg-[var(--surface-espresso)]"
              >
                <Link to="/signin" search={{ redirect: `/checkout?plan=${plan}` } as never}>
                  Sign in or create account
                </Link>
              </Button>
            </Card>
          ) : (
            <>
              <div className="mb-6">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  7-day free trial
                </p>
                <h1 className="mt-2 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                  {planInfo.name} plan — {planInfo.price}
                </h1>
                <p className="mt-2 text-sm text-muted-foreground">
                  Your card won't be charged today. After the 7-day trial, the {planInfo.price.toLowerCase()} subscription begins automatically. Cancel anytime from the billing page.
                </p>
              </div>
              <Card className="overflow-hidden rounded-3xl border-border/60 bg-background p-2 shadow-[var(--shadow-md)]">
                {origin && (
                  <StripeEmbeddedCheckoutForm
                    priceId={planInfo.priceId}
                    returnUrl={`${origin}/checkout/return?session_id={CHECKOUT_SESSION_ID}`}
                  />
                )}
              </Card>
            </>
          )}
        </div>
      </main>
      <AppFooter />
    </div>
  );
}
