import { useEffect, useState } from "react";
import { createFileRoute, useNavigate, useSearch } from "@tanstack/react-router";
import { z } from "zod";
import { AppHeader } from "@/components/app/app-header";
import { AppFooter } from "@/components/app/app-footer";
import { PageTransition } from "@/components/app/page-transition";
import { usePageTransition } from "@/hooks/use-page-transition";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Sparkles } from "lucide-react";
import { signInWithEmail, useAuth } from "@/lib/account";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const searchSchema = z.object({
  redirect: z.string().optional(),
});

export const Route = createFileRoute("/signin")({
  component: SigninPage,
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "Sign in — Diploo" },
      { name: "description", content: "Sign in to your Diploo account to manage your insurance landing pages." },
    ],
  }),
});

function SigninPage() {
  const { transitionTo } = usePageTransition();
  const navigate = useNavigate();
  const { hydrated, user } = useAuth();
  const { redirect } = useSearch({ from: "/signin" });
  const safeRedirect = redirect && redirect.startsWith("/") ? redirect : "/start";
  const [submitting, setSubmitting] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetting, setResetting] = useState(false);
  const [showReset, setShowReset] = useState(false);

  useEffect(() => {
    if (hydrated && user) {
      transitionTo({ to: safeRedirect });
    }
  }, [hydrated, user, safeRedirect, transitionTo]);

  if (hydrated && user) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <AppHeader />
        <main className="flex flex-1 items-center justify-center px-5">
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-[var(--surface-mocha)] border-t-transparent" />
            <div>
              <h1 className="text-xl font-semibold text-foreground">Finishing sign in…</h1>
              <p className="mt-1 text-sm text-muted-foreground">Taking you to choose how you'd like to get started.</p>
            </div>
          </div>
        </main>
        <AppFooter />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <AppHeader />
      <PageTransition>
        <main className="flex-1">
          <div className="mx-auto grid min-h-[calc(100vh-12rem)] max-w-6xl items-center gap-12 px-5 py-12 lg:grid-cols-[1.05fr_1fr] lg:py-20">
            <div className="hidden lg:block">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                <Sparkles className="h-3 w-3" />
                Welcome back
              </span>
              <h1 className="mt-4 text-4xl font-semibold leading-[1.05] tracking-tight text-foreground sm:text-5xl">
                Sign in to your Diploo account.
              </h1>
              <p className="mt-5 max-w-md text-lg text-muted-foreground">
                Pick up right where you left off — manage your pages, leads, and
                subscription in one place.
              </p>
            </div>

            <Card className="rounded-3xl border-border/60 bg-background p-7 shadow-[var(--shadow-lg)] sm:p-10">
              <h2 className="text-2xl font-semibold tracking-tight text-foreground">Sign in</h2>
              <p className="mt-1.5 text-sm text-muted-foreground">
                Welcome back — enter your details to continue.
              </p>

              {!showReset ? (
                <form
                  className="mt-7 space-y-4"
                  onSubmit={async (e) => {
                    e.preventDefault();
                    if (submitting) return;
                    setSubmitting(true);
                    const form = e.currentTarget as HTMLFormElement;
                    const data = new FormData(form);
                    try {
                      await signInWithEmail({
                        email: String(data.get("email") || ""),
                        password: String(data.get("password") || ""),
                      });
                      // Route through the auth callback so the auth provider
                      // has a chance to hydrate the new session before any
                      // protected page mounts.
                      navigate({
                        to: "/auth/callback",
                        search: { redirect: safeRedirect } as never,
                        replace: true,
                      });
                    } catch (err) {
                      toast.error(err instanceof Error ? err.message : "Sign in failed");
                      setSubmitting(false);
                    }
                  }}
                >
                  <div className="space-y-2">
                    <Label htmlFor="si-email">Email</Label>
                    <Input id="si-email" name="email" type="email" required maxLength={120} placeholder="you@agency.com" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="si-pass">Password</Label>
                      <button
                        type="button"
                        onClick={() => setShowReset(true)}
                        className="text-xs font-medium text-muted-foreground underline-offset-4 hover:underline"
                      >
                        Forgot password?
                      </button>
                    </div>
                    <Input id="si-pass" name="password" type="password" required minLength={1} maxLength={120} placeholder="Your password" />
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    disabled={submitting}
                    className="w-full rounded-full bg-[var(--surface-mocha)] text-base font-semibold text-[var(--surface-cream)] shadow-[var(--shadow-md)] hover:bg-[var(--surface-espresso)]"
                  >
                    {submitting ? "Signing in…" : "Sign in"}
                  </Button>
                </form>
              ) : (
                <form
                  className="mt-7 space-y-4"
                  onSubmit={async (e) => {
                    e.preventDefault();
                    if (resetting) return;
                    setResetting(true);
                    try {
                      const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
                        redirectTo: `${window.location.origin}/reset-password`,
                      });
                      if (error) throw error;
                      toast.success("Check your inbox for a password reset link.");
                      setShowReset(false);
                      setResetEmail("");
                    } catch (err) {
                      toast.error(err instanceof Error ? err.message : "Could not send reset email");
                    } finally {
                      setResetting(false);
                    }
                  }}
                >
                  <div className="space-y-2">
                    <Label htmlFor="reset-email">Reset your password</Label>
                    <p className="text-xs text-muted-foreground">
                      Enter your email and we'll send you a link to set a new password.
                    </p>
                    <Input
                      id="reset-email"
                      type="email"
                      required
                      maxLength={120}
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      placeholder="you@agency.com"
                    />
                  </div>
                  <Button
                    type="submit"
                    size="lg"
                    disabled={resetting}
                    className="w-full rounded-full bg-[var(--surface-mocha)] text-base font-semibold text-[var(--surface-cream)] shadow-[var(--shadow-md)] hover:bg-[var(--surface-espresso)]"
                  >
                    {resetting ? "Sending…" : "Send reset link"}
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="w-full rounded-full"
                    onClick={() => setShowReset(false)}
                  >
                    Back to sign in
                  </Button>
                </form>
              )}
            </Card>
          </div>
        </main>
      </PageTransition>
      <AppFooter />
    </div>
  );
}


