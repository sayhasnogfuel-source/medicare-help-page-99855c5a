import { createFileRoute } from "@tanstack/react-router";
import { AppHeader } from "@/components/app/app-header";
import { AppFooter } from "@/components/app/app-footer";
import { PageTransition } from "@/components/app/page-transition";
import { usePageTransition } from "@/hooks/use-page-transition";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Sparkles,
  ArrowRight,
  Check,
  Smartphone,
  Palette,
  Zap,
  Shield,
  Target,
  Wand2,
  HeartHandshake,
  PencilLine,
  Rocket,
  UserPlus,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { signInWithGoogle, useAccount } from "@/lib/account";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/")({
  component: HomePage,
  head: () => ({
    meta: [
      { title: "Diploo — A modern website builder for insurance agents" },
      {
        name: "description",
        content:
          "A clean, simple website builder for insurance agents — Medicare, ACA, Life, Health, Auto, Home, and more. Launch a modern lead-gen site in minutes.",
      },
      { property: "og:title", content: "Diploo — A modern website builder for insurance agents" },
      {
        property: "og:description",
        content:
          "Launch a beautiful, mobile-friendly website for your insurance practice in minutes — no designer required.",
      },
    ],
  }),
});

function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <AppHeader />
      <PageTransition>
        <main className="flex-1">
          <Hero />
          <HowItWorks />
          <WhoItsFor />
          <BuiltIn />
          <Benefits />
          <Faq />
          <FinalCta />
        </main>
      </PageTransition>
      <AppFooter />
    </div>
  );
}

/* ---------------- HERO ---------------- */
function Hero() {
  const { transitionTo } = usePageTransition();
  const [googleLoading, setGoogleLoading] = useState(false);
  const account = useAccount();
  const signedIn = account.hydrated && account.signedIn;
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
  return (
    <section
      className="relative overflow-hidden"
      style={{
        background: "var(--surface-cream)",
        backgroundImage:
          "radial-gradient(oklch(0.85 0.01 75 / 0.5) 1px, transparent 1px)",
        backgroundSize: "22px 22px",
      }}
    >
      {/* Subtle top fade so the dot grid doesn't fight the header */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-32"
        style={{ background: "linear-gradient(to bottom, var(--surface-cream), transparent)" }}
      />

      <div className="relative mx-auto max-w-6xl px-5 pt-20 pb-24 text-center sm:pt-32 sm:pb-36">
        <span className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background/80 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.14em] text-foreground/70 backdrop-blur">
          <Sparkles className="h-3 w-3" />
          Built for independent insurance agents
        </span>
        <h1 className="mx-auto mt-6 max-w-3xl text-4xl font-semibold leading-[1.02] -tracking-[0.02em] text-foreground sm:text-6xl">
          A modern website builder for insurance agents
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-base text-foreground/65 sm:text-lg">
          Launch a polished, mobile-friendly website for your insurance practice — Medicare,
          ACA, Life, Health, Auto, Home, and more. No designer, no developer required.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          {signedIn ? (
            <>
              <Button
                size="lg"
                onClick={() => transitionTo({ to: "/start" })}
                className="group bg-[var(--surface-mocha)] px-7 text-sm font-medium text-[var(--surface-cream)] hover:bg-[var(--surface-espresso)]"
              >
                Open Builder
                <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => transitionTo({ to: "/workspace" })}
                className="border-border bg-background px-7 text-sm font-medium text-foreground hover:bg-secondary"
              >
                Go to Workspace
              </Button>
            </>
          ) : (
            <>
          <Button
            size="lg"
            onClick={() => transitionTo({ to: "/signup" })}
            className="group bg-[var(--surface-mocha)] px-7 text-sm font-medium text-[var(--surface-cream)] hover:bg-[var(--surface-espresso)]"
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
            className="border-border bg-background px-7 text-sm font-medium text-foreground hover:bg-secondary hover:text-foreground"
          >
            <HeroGoogleGlyph />
            {googleLoading ? "Connecting…" : "Continue with Google"}
          </Button>
            </>
          )}
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-muted-foreground">
          {(signedIn
            ? ["You're signed in", "5-minute setup", "Mobile-friendly", "Lead-ready"]
            : ["Card on file required", "5-minute setup", "Mobile-friendly", "Lead-ready"]
          ).map((t) => (
            <span key={t} className="inline-flex items-center gap-1.5">
              <Check className="h-3.5 w-3.5 text-muted-foreground" />
              {t}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

function HeroGoogleGlyph() {
  return (
    <svg className="mr-1 h-4 w-4" viewBox="0 0 48 48" aria-hidden>
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.6-6 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.7 1.1 7.8 3l5.7-5.7C33.6 6.1 29.1 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.3-.4-3.5z" />
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.4 19 12 24 12c3 0 5.7 1.1 7.8 3l5.7-5.7C33.6 6.1 29.1 4 24 4 16.3 4 9.7 8.4 6.3 14.7z" />
      <path fill="#4CAF50" d="M24 44c5 0 9.6-1.9 13-5l-6-5.1C29.1 35.5 26.7 36 24 36c-5.3 0-9.7-3.4-11.3-8l-6.6 5.1C9.5 39.5 16.2 44 24 44z" />
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4-4 5.4l6 5.1C40.7 34.7 44 30.1 44 24c0-1.3-.1-2.3-.4-3.5z" />
    </svg>
  );
}

/* ---------------- HOW IT WORKS ---------------- */
function HowItWorks() {
  const steps = [
    {
      icon: PencilLine,
      title: "Tell us about your business",
      desc: "Share a few essentials — name, niche, contact info, and your branding.",
    },
    {
      icon: Wand2,
      title: "Describe your perfect site",
      desc: "Use the AI prompt to shape the look, feel, and sections you want.",
    },
    {
      icon: Rocket,
      title: "Generate & publish",
      desc: "Preview a polished, mobile-ready landing page and publish in one click.",
    },
  ];
  return (
    <section className="mx-auto max-w-6xl px-5 py-20 sm:py-28">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          How it works
        </p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Launch in three simple steps
        </h2>
        <p className="mt-3 text-muted-foreground">
          Designed for agents, not designers. The whole flow takes about five minutes.
        </p>
      </div>
      <div className="mt-12 grid gap-5 md:grid-cols-3">
        {steps.map((s, i) => (
          <Card
            key={s.title}
            className="rounded-xl border-border bg-background p-7 shadow-none"
          >
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-md bg-secondary text-foreground">
                <s.icon className="h-5 w-5" />
              </span>
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Step {i + 1}
              </span>
            </div>
            <h3 className="mt-5 text-lg font-semibold tracking-tight text-foreground">
              {s.title}
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
          </Card>
        ))}
      </div>
    </section>
  );
}

/* ---------------- WHO IT'S FOR ---------------- */
function WhoItsFor() {
  const niches = [
    "Medicare agents",
    "ACA agents",
    "Life insurance agents",
    "Health insurance agents",
    "Final expense specialists",
    "Auto & home agents",
    "Commercial agents",
    "Independent brokers",
  ];
  return (
    <section
      className="border-y border-border/60"
      style={{ background: "var(--surface-cream)" }}
    >
      <div className="mx-auto max-w-6xl px-5 py-20 sm:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Who it's for
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Made for every kind of insurance agent
          </h2>
          <p className="mt-3 text-muted-foreground">
            Built specifically for insurance — not a generic website builder pretending to
            understand your business.
          </p>
        </div>
        <div className="mx-auto mt-10 flex max-w-4xl flex-wrap justify-center gap-2.5">
          {niches.map((n) => (
            <span
              key={n}
              className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground/80"
            >
              <Check className="h-3 w-3 text-muted-foreground" />
              {n}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- BENEFITS ---------------- */
function Benefits() {
  const items = [
    { icon: Zap, title: "No coding needed", desc: "Just answer a few questions — we handle the rest." },
    { icon: Smartphone, title: "Mobile-friendly by default", desc: "Every site looks great on phones, tablets, and desktops." },
    { icon: Palette, title: "Your branding, your way", desc: "Upload your logo, headshot, and pick your style." },
    { icon: Target, title: "Lead-focused structure", desc: "Designed to capture inquiries, not just look pretty." },
    { icon: Shield, title: "Built for insurance", desc: "Copy and sections tuned for Medicare, ACA, Life, P&C — not generic SMB." },
    { icon: HeartHandshake, title: "Easy to update", desc: "Edit copy, swap photos, and republish anytime." },
  ];
  return (
    <section className="mx-auto max-w-6xl px-5 py-20 sm:py-28">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          Why agents choose Diploo
        </p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Everything you need, nothing you don't
        </h2>
      </div>
      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((b) => (
          <Card
            key={b.title}
            className="rounded-xl border-border bg-background p-6 shadow-none"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-md bg-secondary text-foreground">
              <b.icon className="h-5 w-5" />
            </span>
            <h3 className="mt-4 text-base font-semibold tracking-tight text-foreground">
              {b.title}
            </h3>
            <p className="mt-1.5 text-sm text-muted-foreground">{b.desc}</p>
          </Card>
        ))}
      </div>
    </section>
  );
}

/* ---------------- BUILT-IN ---------------- */
function BuiltIn() {
  const features = [
    "Mobile-responsive layout",
    "Homepage with clear hero",
    "About page",
    "Services section",
    "Contact form",
    "Lead capture structure",
    "Call-to-action buttons",
    "Navigation menu",
    "Footer with business info",
    "Branded color & font system",
    "Trust-building sections",
    "Appointment-ready layout",
    "Fast-loading modern design",
    "SEO-friendly structure",
    "Insurance-focused sections",
    "Editable content blocks",
    "Publish-ready framework",
    "Conversion-focused hierarchy",
  ];
  return (
    <section className="mx-auto max-w-6xl px-5 py-20 sm:py-24">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          Built in by default
        </p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          A real, functional website — not just a pretty page
        </h2>
        <p className="mt-3 text-muted-foreground">
          The AI builder already understands the essentials of a working insurance
          website. You focus on your branding, copy, and photos — we handle the rest.
        </p>
      </div>
      <Card className="mt-10 rounded-xl border-border bg-[var(--surface-cream)] p-7 shadow-none sm:p-9">
        <div className="grid gap-x-6 gap-y-3 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div key={f} className="flex items-start gap-2.5">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-foreground/60" />
              <span className="text-sm text-foreground/85">{f}</span>
            </div>
          ))}
        </div>
      </Card>
    </section>
  );
}

/* ---------------- FAQ ---------------- */
function Faq() {
  const faqs = [
    {
      q: "Do I need design or coding skills?",
      a: "No. The AI handles layout, structure, and the standard sections every insurance site needs. You mostly customize your branding, copy, and photos.",
    },
    {
      q: "What's already included in the builder?",
      a: "Mobile-responsive layout, homepage, services, about, contact form, lead capture, navigation, footer, trust sections, and an SEO-friendly page structure — all by default.",
    },
    {
      q: "How is pricing structured?",
      a: "Free trial to test the builder, Starter at $26/mo, Pro at $80/mo, and a custom done-for-you option starting at $206 + active subscription if you'd rather we build it.",
    },
    {
      q: "What if I need help?",
      a: "Our support team is one click away in the Support tab — billing, technical, or website questions are all covered.",
    },
  ];
  return (
    <section className="border-t border-border/60 bg-background">
      <div className="mx-auto max-w-3xl px-5 py-20 sm:py-24">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Frequently asked
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Common questions
          </h2>
        </div>
        <Accordion type="single" collapsible className="mt-8">
          {faqs.map((f, i) => (
            <AccordionItem key={i} value={`home-faq-${i}`}>
              <AccordionTrigger className="text-left text-sm font-medium text-foreground sm:text-base">
                {f.q}
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground sm:text-base">
                {f.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}

/* ---------------- FINAL CTA ---------------- */
function FinalCta() {
  const { transitionTo } = usePageTransition();
  const account = useAccount();
  const signedIn = account.hydrated && account.signedIn;
  return (
    <section className="px-5 pb-24">
      <div
        className="mx-auto flex max-w-5xl flex-col items-center gap-5 rounded-2xl px-8 py-14 text-center shadow-[var(--shadow-md)] sm:px-14 sm:py-20"
        style={{ background: "var(--gradient-cta)" }}
      >
        <h2 className="max-w-2xl text-3xl font-semibold tracking-tight text-[var(--surface-cream)] sm:text-4xl">
          Ready to launch your insurance website?
        </h2>
        <p className="max-w-xl text-base text-[var(--surface-cream)]/80">
          Try the AI builder free, or have our team build it for you. It only takes 5
          minutes to get started.
        </p>
        <div className="mt-2 flex flex-col gap-3 sm:flex-row">
          <Button
            size="lg"
            onClick={() => transitionTo({ to: "/start" })}
            className="bg-[var(--surface-cream)] px-7 text-sm font-medium text-[var(--surface-espresso)] hover:bg-white"
          >
            {signedIn ? "Open Builder" : "Get Started"}
            <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
          <Button
            size="lg"
            variant="ghost"
            onClick={() => transitionTo({ to: "/pricing" })}
            className="border border-[var(--surface-cream)]/30 px-7 text-sm font-medium text-[var(--surface-cream)] hover:bg-[var(--surface-cream)]/10 hover:text-[var(--surface-cream)]"
          >
            See pricing
          </Button>
        </div>
      </div>
    </section>
  );
}
