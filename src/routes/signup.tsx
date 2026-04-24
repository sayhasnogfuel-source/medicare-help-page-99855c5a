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
import { signUpWithEmail, signInWithGoogle } from "@/lib/account";
import { toast } from "sonner";

export const Route = createFileRoute("/signup")({
  component: SignupPage,
  head: () => ({
    meta: [
      { title: "Sign up — Diploofly" },
      { name: "description", content: "Create your Diploofly account and launch your first insurance landing page in minutes." },
    ],
  }),
});

function SignupPage() {
  const { transitionTo } = usePageTransition();
  const [submitting, setSubmitting] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <AppHeader />
      <PageTransition>
      <main className="flex-1">
        <div className="mx-auto grid min-h-[calc(100vh-12rem)] max-w-6xl items-center gap-12 px-5 py-12 lg:grid-cols-[1.05fr_1fr] lg:py-20">
          <div className="hidden lg:block">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              <Sparkles className="h-3 w-3" />
              Free trial · card required
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
                "Card on file to start your trial",
                "Templates for every insurance niche",
                "Mobile-friendly out of the box",
                "Publishing requires an active subscription",
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
              <Link to="/signin" className="font-medium text-foreground underline-offset-4 hover:underline">
                Sign in
              </Link>
            </p>

            <form
              className="mt-7 space-y-4"
              onSubmit={async (e) => {
                e.preventDefault();
                if (submitting) return;
                setSubmitting(true);
                const form = e.currentTarget as HTMLFormElement;
                const data = new FormData(form);
                try {
                  await signUpWithEmail({
                    email: String(data.get("email") || ""),
                    password: String(data.get("password") || ""),
                    firstName: String(data.get("firstName") || ""),
                    lastName: String(data.get("lastName") || ""),
                  });
                  transitionTo({ to: "/dashboard" });
                } catch (err) {
                  toast.error(err instanceof Error ? err.message : "Sign up failed");
                  setSubmitting(false);
                }
              }}
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="su-first">First name</Label>
                  <Input id="su-first" name="firstName" required maxLength={40} placeholder="Jordan" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="su-last">Last name</Label>
                  <Input id="su-last" name="lastName" required maxLength={40} placeholder="Sterling" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="su-email">Work email</Label>
                <Input id="su-email" name="email" type="email" required maxLength={120} placeholder="you@agency.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="su-pass">Password</Label>
                <Input id="su-pass" name="password" type="password" required minLength={8} maxLength={120} placeholder="At least 8 characters" />
              </div>

              <Button
                type="submit"
                size="lg"
                disabled={submitting}
                className="w-full rounded-full bg-[var(--surface-mocha)] text-base font-semibold text-[var(--surface-cream)] shadow-[var(--shadow-md)] hover:bg-[var(--surface-espresso)]"
              >
                {submitting ? "Creating account…" : "Create account"}
              </Button>
              <div className="relative my-2">
                <div className="h-px bg-border" />
                <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-2 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                  or
                </span>
              </div>
              <Button
                type="button"
                size="lg"
                variant="outline"
                disabled={googleLoading}
                className="w-full rounded-full border-foreground/20 bg-background text-base font-semibold text-foreground hover:bg-secondary"
                onClick={async () => {
                  if (googleLoading) return;
                  setGoogleLoading(true);
                  try {
                    await signInWithGoogle("/dashboard");
                  } catch (err) {
                    toast.error(err instanceof Error ? err.message : "Google sign-in failed");
                    setGoogleLoading(false);
                  }
                }}
              >
                <SignupGoogleGlyph />
                {googleLoading ? "Connecting…" : "Continue with Google"}
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

function SignupGoogleGlyph() {
  return (
    <svg className="mr-2 h-4 w-4" viewBox="0 0 48 48" aria-hidden>
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.6-6 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.7 1.1 7.8 3l5.7-5.7C33.6 6.1 29.1 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.3-.4-3.5z" />
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.4 19 12 24 12c3 0 5.7 1.1 7.8 3l5.7-5.7C33.6 6.1 29.1 4 24 4 16.3 4 9.7 8.4 6.3 14.7z" />
      <path fill="#4CAF50" d="M24 44c5 0 9.6-1.9 13-5l-6-5.1C29.1 35.5 26.7 36 24 36c-5.3 0-9.7-3.4-11.3-8l-6.6 5.1C9.5 39.5 16.2 44 24 44z" />
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4-4 5.4l6 5.1C40.7 34.7 44 30.1 44 24c0-1.3-.1-2.3-.4-3.5z" />
    </svg>
  );
}