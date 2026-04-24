import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppHeader } from "@/components/app/app-header";
import { AppFooter } from "@/components/app/app-footer";
import { TestModeBanner } from "@/components/app/test-mode-banner";
import { DepositCheckoutForm } from "@/components/app/deposit-checkout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, ShieldCheck } from "lucide-react";

const PENDING_KEY = "lp_inquiry_pending";

interface PendingInquiry {
  email?: string;
  businessName?: string;
  inquiryId?: string;
}

export const Route = createFileRoute("/inquiry/deposit")({
  component: InquiryDepositPage,
  head: () => ({
    meta: [
      { title: "Pay your $206 deposit — Diploo" },
      {
        name: "description",
        content:
          "Secure your custom done-for-you website project with a $206 deposit. We start the build right after.",
      },
    ],
  }),
});

function InquiryDepositPage() {
  const [origin, setOrigin] = useState("");
  const [pending, setPending] = useState<PendingInquiry | null>(null);
  const [missing, setMissing] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setOrigin(window.location.origin);
    try {
      const raw = window.localStorage.getItem(PENDING_KEY);
      if (!raw) {
        setMissing(true);
        return;
      }
      const parsed = JSON.parse(raw) as PendingInquiry;
      setPending(parsed);
    } catch {
      setMissing(true);
    }
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-[var(--surface-sand)]/40">
      <AppHeader />
      <TestModeBanner />
      <main className="flex-1">
        <div className="mx-auto max-w-3xl px-5 py-10 sm:py-14">
          <Button asChild variant="ghost" size="sm" className="mb-4 rounded-full">
            <Link to="/inquiry">
              <ArrowLeft className="mr-1.5 h-3.5 w-3.5" /> Back to inquiry
            </Link>
          </Button>

          {missing ? (
            <Card className="rounded-3xl border-border/60 bg-background p-8 text-center shadow-[var(--shadow-sm)]">
              <h1 className="text-2xl font-semibold text-foreground">Start with the inquiry form</h1>
              <p className="mt-2 text-muted-foreground">
                Tell us about your business first. Your deposit secures the project once we have your details.
              </p>
              <Button
                asChild
                className="mt-6 rounded-full bg-[var(--surface-mocha)] text-[var(--surface-cream)] hover:bg-[var(--surface-espresso)]"
              >
                <Link to="/inquiry">Open inquiry form</Link>
              </Button>
            </Card>
          ) : (
            <>
              <div className="mb-6">
                <p className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  <ShieldCheck className="h-3.5 w-3.5" /> Custom Website Deposit
                </p>
                <h1 className="mt-2 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                  $206 to start your build
                </h1>
                <p className="mt-2 text-sm text-muted-foreground">
                  This deposit secures your project slot and kicks off design work. The
                  remaining balance depends on final scope and is invoiced before launch.
                </p>
              </div>
              <Card className="overflow-hidden rounded-3xl border-border/60 bg-background p-2 shadow-[var(--shadow-md)]">
                {origin && pending && (
                  <DepositCheckoutForm
                    priceId="custom_website_deposit_206"
                    returnUrl={`${origin}/inquiry/deposit/return?session_id={CHECKOUT_SESSION_ID}`}
                    customerEmail={pending.email}
                    businessName={pending.businessName}
                    inquiryId={pending.inquiryId}
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