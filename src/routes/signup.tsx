import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { AppHeader } from "@/components/app/app-header";
import { AppFooter } from "@/components/app/app-footer";
import { PageTransition } from "@/components/app/page-transition";
import { usePageTransition } from "@/hooks/use-page-transition";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Sparkles, Check } from "lucide-react";

export const Route = createFileRoute("/signup")({
  component: SignupPage,
  head: () => ({
    meta: [
      { title: "Sign up — Lumen.pages" },
      { name: "description", content: "Create your Lumen.pages account and launch your first insurance landing page in minutes." },
    ],
  }),
});

function SignupPage() {
  const { transitionTo } = usePageTransition();
  const [submitting, setSubmitting] = useState(false);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <AppHeader />
      <PageTransition>
      <main className="flex-1">
        <div className="mx-auto grid min-h-[calc(100vh-12rem)] max-w-6xl items-center gap-12 px-5 py-12 lg:grid-cols-[1.05fr_1fr] lg:py-20">
          <div className="hidden lg:block">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              <Sparkles className="h-3 w-3" />
              Free during beta
            </span>
            <h1 className="mt-4 text-4xl font-semibold leading-[1.05] tracking-tight text-foreground sm:text-5xl">
              Launch your first lead page in under 5 minutes.
            </h1>
            <p className="mt-5 max-w-md text-lg text-muted-foreground">
              Designed for insurance agents across every niche — Medicare, ACA, Life,
              Health, Auto, Home, and more — who want a modern, mobile-friendly site
              without hiring a designer.
            </p>
            <ul className="mt-8 space-y-3.5">
              {[
                "No credit card required",
                "Templates for every insurance niche",
                "Mobile-friendly out of the box",
                "Capture leads from day one",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-foreground/80">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--surface-mocha)] text-[var(--surface-cream)]">
                    <Check className="h-3 w-3" strokeWidth={3} />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <Card className="rounded-3xl border-border/60 bg-background p-7 shadow-[var(--shadow-lg)] sm:p-10">
            <h2 className="text-2xl font-semibold tracking-tight text-foreground">Create your account</h2>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Already have one?{" "}
              <Link to="/signup" className="font-medium text-foreground underline-offset-4 hover:underline">
                Sign in
              </Link>
            </p>

            <form
              className="mt-7 space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                setSubmitting(true);
                transitionTo({ to: "/builder" });
              }}
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="su-first">First name</Label>
                  <Input id="su-first" required maxLength={40} placeholder="Jordan" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="su-last">Last name</Label>
                  <Input id="su-last" required maxLength={40} placeholder="Sterling" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="su-email">Work email</Label>
                <Input id="su-email" type="email" required maxLength={120} placeholder="you@agency.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="su-pass">Password</Label>
                <Input id="su-pass" type="password" required minLength={8} maxLength={120} placeholder="At least 8 characters" />
              </div>

              <Button
                type="submit"
                size="lg"
                disabled={submitting}
                className="w-full rounded-full bg-[var(--surface-mocha)] text-base font-semibold text-[var(--surface-cream)] shadow-[var(--shadow-md)] hover:bg-[var(--surface-espresso)]"
              >
                {submitting ? "Creating account…" : "Create account"}
              </Button>
              <p className="text-center text-xs text-muted-foreground">
                By continuing you agree to our Terms and Privacy Policy.
              </p>
            </form>
          </Card>
        </div>
      </main>
      </PageTransition>
      <AppFooter />
    </div>
  );
}