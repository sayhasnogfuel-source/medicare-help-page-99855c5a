import { createFileRoute } from "@tanstack/react-router";
import { AppHeader } from "@/components/app/app-header";
import { AppFooter } from "@/components/app/app-footer";
import { PageTransition } from "@/components/app/page-transition";
import { usePageTransition } from "@/hooks/use-page-transition";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, Clock, HandHelping, Rocket, Sparkles, UserPlus } from "lucide-react";
import { signInWithGoogle, useAccount } from "@/lib/account";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/start")({
  component: StartPage,
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

function StartPage() {
  const { transitionTo } = usePageTransition();
  const [googleLoading, setGoogleLoading] = useState(false);
  const { hydrated, signedIn } = useAccount();

  const handleGoogle = async () => {
    if (googleLoading) return;
    setGoogleLoading(true);
    try {
      await signInWithGoogle("/start");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Google sign-in failed");
      setGoogleLoading(false);
    }
  };

  // Prevent signed-in users from briefly seeing signed-out intro UI while
  // auth state is still hydrating.
  if (!hydrated) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <AppHeader />
        <main className="flex flex-1 items-center justify-center px-5">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-[var(--surface-mocha)] border-t-transparent" />
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
          {!signedIn && (
            <section className="relative overflow-hidden" style={{ background: "var(--gradient-hero)" }}>
              <div
                aria-hidden
                className="lp-orb"
                style={{
                  top: "-80px",
                  left: "-60px",
                  width: "320px",
                  height: "320px",
                  background: "radial-gradient(circle, var(--surface-camel), transparent 60%)",
                }}
              />
              <div
                aria-hidden
                className="lp-orb lp-orb-alt"
                style={{
                  top: "10%",
                  right: "-80px",
                  width: "360px",
                  height: "360px",
                  background: "radial-gradient(circle, var(--surface-mocha), transparent 65%)",
                  opacity: 0.45,
                }}
              />
              <div className="relative mx-auto max-w-3xl px-5 pt-16 pb-10 text-center sm:pt-24">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background/70 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-foreground/70 shadow-[var(--shadow-xs)] backdrop-blur">
                  <Sparkles className="h-3 w-3" />
                  Start in seconds
                </span>
                <h1 className="mt-5 text-4xl font-semibold leading-[1.05] tracking-tight text-foreground sm:text-6xl">
                  Build the website your <span className="text-[var(--surface-mocha)]">insurance practice</span> deserves.
                </h1>
                <p className="mx-auto mt-5 max-w-xl text-lg text-foreground/70">
                  Create your account and launch a polished, lead-ready website in
                  under five minutes — no designer required.
                </p>
                <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
                  <Button
                    size="lg"
                    onClick={() => transitionTo({ to: "/signup" })}
                    className="lp-cta-shimmer lp-cta-glow group rounded-full bg-[var(--surface-mocha)] px-8 text-base font-semibold text-[var(--surface-cream)] shadow-[var(--shadow-md)] transition-transform hover:-translate-y-0.5 hover:bg-[var(--surface-espresso)]"
                  >
                    <UserPlus className="mr-1 h-4 w-4" />
                    Create Your Account
                    <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    disabled={googleLoading}
                    onClick={handleGoogle}
                    className="lp-cta-shimmer group rounded-full border-foreground/20 bg-background/80 px-8 text-base font-semibold text-foreground shadow-[var(--shadow-sm)] backdrop-blur transition-transform hover:-translate-y-0.5 hover:bg-background"
                  >
                    <GoogleGlyph />
                    {googleLoading ? "Connecting…" : "Continue with Google"}
                  </Button>
                </div>
                <p className="mt-4 text-xs text-muted-foreground">
                  No credit card needed for the trial · Cancel anytime
                </p>
              </div>
            </section>
          )}

          <section className={`mx-auto max-w-5xl px-5 pb-16 sm:pb-24 ${signedIn ? "pt-16 sm:pt-24" : "pt-6"}`}>
            <div className="mx-auto max-w-2xl text-center">
              {!signedIn && (
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Or pick a path
                </p>
              )}
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                How would you like to get started?
              </h2>
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

function GoogleGlyph() {
  return (
    <svg className="mr-2 h-4 w-4" viewBox="0 0 48 48" aria-hidden>
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.6-6 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.7 1.1 7.8 3l5.7-5.7C33.6 6.1 29.1 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.3-.4-3.5z" />
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.4 19 12 24 12c3 0 5.7 1.1 7.8 3l5.7-5.7C33.6 6.1 29.1 4 24 4 16.3 4 9.7 8.4 6.3 14.7z" />
      <path fill="#4CAF50" d="M24 44c5 0 9.6-1.9 13-5l-6-5.1C29.1 35.5 26.7 36 24 36c-5.3 0-9.7-3.4-11.3-8l-6.6 5.1C9.5 39.5 16.2 44 24 44z" />
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4-4 5.4l6 5.1C40.7 34.7 44 30.1 44 24c0-1.3-.1-2.3-.4-3.5z" />
    </svg>
  );
}
