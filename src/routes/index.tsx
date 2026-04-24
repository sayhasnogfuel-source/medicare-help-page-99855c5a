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

export const Route = createFileRoute("/")({
  component: HomePage,
  head: () => ({
    meta: [
      { title: "Lumen.pages — A modern website builder for insurance agents" },
      {
        name: "description",
        content:
          "A clean, simple website builder for insurance agents — Medicare, ACA, Life, Health, Auto, Home, and more. Launch a modern lead-gen site in minutes.",
      },
      { property: "og:title", content: "Lumen.pages — A modern website builder for insurance agents" },
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
  return (
    <section
      className="relative overflow-hidden"
      style={{ background: "var(--gradient-hero)" }}
    >
      {/* Ambient orbs / illumination */}
      <div
        aria-hidden
        className="lp-orb"
        style={{
          top: "-120px", left: "-80px", width: "420px", height: "420px",
          background: "radial-gradient(circle, var(--surface-camel), transparent 60%)",
          opacity: 0.6,
        }}
      />
      <div
        aria-hidden
        className="lp-orb lp-orb-alt"
        style={{
          top: "20%", right: "-120px", width: "460px", height: "460px",
          background: "radial-gradient(circle, var(--surface-mocha), transparent 65%)",
          opacity: 0.35,
        }}
      />
      <div
        aria-hidden
        className="lp-orb"
        style={{
          bottom: "-160px", left: "30%", width: "380px", height: "380px",
          background: "radial-gradient(circle, var(--surface-tan), transparent 65%)",
          opacity: 0.4,
        }}
      />

      <div className="relative mx-auto max-w-6xl px-5 pt-20 pb-24 text-center sm:pt-32 sm:pb-36">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background/70 px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-foreground/70 shadow-[var(--shadow-xs)] backdrop-blur">
          <Sparkles className="h-3 w-3" />
          Built for independent insurance agents
        </span>
        <h1 className="mx-auto mt-6 max-w-3xl text-4xl font-semibold leading-[1.05] tracking-tight text-foreground sm:text-6xl">
          A modern website builder for insurance agents
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg text-foreground/70 sm:text-xl">
          Launch a polished, mobile-friendly website for your insurance practice — Medicare,
          ACA, Life, Health, Auto, Home, and more. No designer, no developer required.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
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
            onClick={() => transitionTo({ to: "/signup" })}
            className="lp-cta-shimmer rounded-full border-foreground/20 bg-background/80 px-8 text-base font-semibold text-foreground backdrop-blur transition-transform hover:-translate-y-0.5 hover:bg-background"
          >
            <HeroGoogleGlyph />
            Continue with Google
          </Button>
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-xs text-muted-foreground">
          {["Card on file required", "5-minute setup", "Mobile-friendly", "Lead-ready"].map((t) => (
            <span key={t} className="inline-flex items-center gap-1.5">
              <Check className="h-3.5 w-3.5 text-[var(--surface-mocha)]" />
              {t}
            </span>
          ))}
        </div>

        {/* Floating mini UI accent cards (decorative) */}
        {/* Floating mini UI accent cards — anchored to lower hero edges so they never cover headline copy */}
        <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-6 mx-auto hidden max-w-6xl lg:block">
          <div
            className="lp-float absolute -left-2 bottom-2 rounded-2xl border border-border/60 bg-background/90 p-3.5 shadow-[var(--shadow-md)] backdrop-blur"
            style={{ width: "210px" }}
          >
            <div className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--surface-mocha)] text-[var(--surface-cream)]">
                <Sparkles className="h-4 w-4" />
              </span>
              <div className="flex-1">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">AI building your site</p>
                <p className="text-xs font-semibold text-foreground">Hero · Services · Lead form</p>
              </div>
            </div>
          </div>
          <div
            className="lp-float-slow absolute -right-2 bottom-10 rounded-2xl border border-border/60 bg-background/90 p-3.5 shadow-[var(--shadow-md)] backdrop-blur"
            style={{ width: "230px" }}
          >
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">New lead captured</p>
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            </div>
            <p className="mt-1.5 text-xs font-semibold text-foreground">Maria R. · Medicare quote request</p>
            <p className="mt-0.5 text-[11px] text-muted-foreground">2 minutes ago · from your live site</p>
          </div>
        </div>
      </div>
    </section>
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
            className="rounded-3xl border-border/60 bg-background p-7 shadow-[var(--shadow-sm)]"
          >
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--surface-sand)] text-[var(--surface-mocha)]">
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
              className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-4 py-2 text-sm font-medium text-foreground/80 shadow-[var(--shadow-xs)]"
            >
              <Check className="h-3.5 w-3.5 text-[var(--surface-mocha)]" />
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
          Why agents choose Lumen
        </p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Everything you need, nothing you don't
        </h2>
      </div>
      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((b) => (
          <Card
            key={b.title}
            className="rounded-3xl border-border/60 bg-background p-6 shadow-[var(--shadow-sm)]"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--surface-sand)] text-[var(--surface-mocha)]">
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
      <Card className="mt-10 rounded-3xl border-border/60 bg-[var(--surface-cream)] p-7 shadow-[var(--shadow-sm)] sm:p-9">
        <div className="grid gap-x-6 gap-y-3 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div key={f} className="flex items-start gap-2.5">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-[var(--surface-mocha)]" />
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
  return (
    <section className="px-5 pb-24">
      <div
        className="mx-auto flex max-w-5xl flex-col items-center gap-5 rounded-[2rem] px-8 py-14 text-center shadow-[var(--shadow-lg)] sm:px-14 sm:py-20"
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
            className="rounded-full bg-[var(--surface-cream)] px-7 text-base font-semibold text-[var(--surface-espresso)] hover:bg-white"
          >
            Get Started
            <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
          <Button
            size="lg"
            variant="ghost"
            onClick={() => transitionTo({ to: "/pricing" })}
            className="rounded-full border border-[var(--surface-cream)]/30 px-7 text-base font-semibold text-[var(--surface-cream)] hover:bg-[var(--surface-cream)]/10 hover:text-[var(--surface-cream)]"
          >
            See pricing
          </Button>
        </div>
      </div>
    </section>
  );
}
