import { createFileRoute, Link } from "@tanstack/react-router";
import { AppHeader } from "@/components/app/app-header";
import { AppFooter } from "@/components/app/app-footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Sparkles,
  Wand2,
  LayoutTemplate,
  Smartphone,
  Users,
  ShieldCheck,
  ArrowRight,
  Check,
  Pencil,
  Image as ImageIcon,
  Zap,
  Eye,
} from "lucide-react";
import { GeneratedLanding } from "@/components/generated/generated-landing";
import { DEFAULT_BUILDER } from "@/lib/builder-storage";

export const Route = createFileRoute("/")({
  component: HomePage,
  head: () => ({
    meta: [
      { title: "Lumen.pages — Build insurance lead pages in minutes" },
      {
        name: "description",
        content:
          "A clean, simple platform for Medicare and ACA agents to create modern landing pages that help capture leads.",
      },
      { property: "og:title", content: "Lumen.pages — Built for insurance agents" },
      {
        property: "og:description",
        content:
          "Launch beautiful, mobile-friendly Medicare and ACA landing pages in minutes — no designer required.",
      },
    ],
  }),
});

function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main>
        <Hero />
        <SocialProof />
        <Features />
        <HowItWorks />
        <PreviewShowcase />
        <Pricing />
        <FinalCta />
      </main>
      <AppFooter />
    </div>
  );
}

/* ---------------- HERO ---------------- */
function Hero() {
  return (
    <section
      className="relative overflow-hidden"
      style={{ background: "var(--gradient-hero)" }}
    >
      <div className="mx-auto max-w-6xl px-5 pt-16 pb-20 text-center sm:pt-24 sm:pb-28">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background/70 px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-foreground/70 shadow-[var(--shadow-xs)] backdrop-blur">
          <Sparkles className="h-3 w-3" />
          Built for independent insurance agents
        </span>
        <h1 className="mx-auto mt-5 max-w-3xl text-4xl font-semibold leading-[1.05] tracking-tight text-foreground sm:text-6xl">
          Build insurance lead pages in minutes
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg text-foreground/70 sm:text-xl">
          A clean, simple platform for Medicare and ACA agents to create modern landing
          pages that help capture leads — no designer, no developer required.
        </p>
        <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button
            asChild
            size="lg"
            className="rounded-full bg-[var(--surface-mocha)] px-7 text-base font-semibold text-[var(--surface-cream)] shadow-[var(--shadow-md)] hover:bg-[var(--surface-espresso)]"
          >
            <Link to="/builder">
              Get Started
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="rounded-full border-foreground/20 bg-background/70 px-7 text-base font-semibold text-foreground hover:bg-background"
          >
            <a href="#preview">
              <Eye className="mr-1 h-4 w-4" />
              See Demo
            </a>
          </Button>
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-xs text-muted-foreground">
          {["No credit card", "5-minute setup", "Mobile-friendly", "Lead-ready"].map((t) => (
            <span key={t} className="inline-flex items-center gap-1.5">
              <Check className="h-3.5 w-3.5 text-[var(--surface-mocha)]" />
              {t}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

function SocialProof() {
  return (
    <section className="border-y border-border/60 bg-background">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-12 gap-y-4 px-5 py-7 text-sm font-medium text-muted-foreground">
        <span>Loved by independent agents in</span>
        {["Austin", "Memphis", "Phoenix", "Tampa", "Charlotte"].map((c) => (
          <span key={c} className="text-foreground/70">{c}</span>
        ))}
      </div>
    </section>
  );
}

/* ---------------- FEATURES ---------------- */
const FEATURES = [
  { icon: Zap, title: "Fast page generation", body: "From form to finished page in under five minutes." },
  { icon: LayoutTemplate, title: "Modern landing pages", body: "Clean, premium layouts that look like a high-end brand." },
  { icon: ShieldCheck, title: "Medicare & ACA templates", body: "Built around the exact buyers you serve." },
  { icon: Users, title: "Built for insurance agents", body: "Every default copy and CTA is written for your industry." },
  { icon: Smartphone, title: "Mobile-friendly design", body: "Looks beautiful on every screen — phone, tablet, desktop." },
  { icon: Wand2, title: "No design skills needed", body: "Type your details, upload your photo, hit generate." },
] as const;

function Features() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-20 sm:py-24">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Features</p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Everything you need to launch a lead page
        </h2>
        <p className="mt-4 text-muted-foreground">
          A focused set of tools, designed for one job: getting more qualified leads
          into your pipeline.
        </p>
      </div>
      <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((f) => (
          <Card key={f.title} className="rounded-2xl border-border/60 bg-background p-7 shadow-[var(--shadow-sm)] transition-shadow hover:shadow-[var(--shadow-md)]">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--surface-sand)] text-[var(--surface-mocha)]">
              <f.icon className="h-5 w-5" />
            </span>
            <h3 className="mt-5 text-lg font-semibold text-foreground">{f.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{f.body}</p>
          </Card>
        ))}
      </div>
    </section>
  );
}

/* ---------------- HOW IT WORKS ---------------- */
const STEPS = [
  { icon: Pencil, title: "Enter your business info", body: "Name, location, phone, email — the basics that personalize your page." },
  { icon: ImageIcon, title: "Upload your logo and photo", body: "A friendly headshot and your logo build instant trust with visitors." },
  { icon: Wand2, title: "Generate your landing page", body: "We assemble a clean, modern page tailored to Medicare or ACA." },
  { icon: Eye, title: "Preview and publish", body: "Review your page on desktop and mobile before sharing it with leads." },
] as const;

function HowItWorks() {
  return (
    <section className="bg-[var(--surface-sand)]/50 py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-5">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">How it works</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Four simple steps to your first lead page
          </h2>
        </div>
        <ol className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s, i) => (
            <li key={s.title} className="rounded-2xl border border-border/60 bg-background p-7 shadow-[var(--shadow-sm)]">
              <div className="flex items-center justify-between">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--surface-mocha)] text-[var(--surface-cream)]">
                  <s.icon className="h-5 w-5" />
                </span>
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Step {i + 1}
                </span>
              </div>
              <h3 className="mt-5 text-base font-semibold text-foreground">{s.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{s.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ---------------- PREVIEW SHOWCASE ---------------- */
function PreviewShowcase() {
  return (
    <section id="preview" className="mx-auto max-w-6xl px-5 py-20 sm:py-24">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Example output</p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          A real preview of what you'll generate
        </h2>
        <p className="mt-4 text-muted-foreground">
          This is a live render of the template using sample data — exactly what your
          page will look like with your details swapped in.
        </p>
      </div>

      <div className="mt-12 overflow-hidden rounded-3xl border border-border/60 bg-background shadow-[var(--shadow-lg)]">
        <div className="flex items-center gap-2 border-b border-border/60 bg-[var(--surface-sand)]/60 px-4 py-2.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[oklch(0.78_0.13_25)]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[oklch(0.85_0.13_85)]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[oklch(0.78_0.13_145)]" />
          <span className="ml-3 rounded-md bg-background px-3 py-1 text-xs text-muted-foreground">
            sterlinginsurance.lumen.pages
          </span>
        </div>
        <div className="max-h-[640px] overflow-hidden">
          <GeneratedLanding data={DEFAULT_BUILDER} />
        </div>
      </div>

      <div className="mt-8 text-center">
        <Button
          asChild
          size="lg"
          className="rounded-full bg-[var(--surface-mocha)] px-7 text-base font-semibold text-[var(--surface-cream)] shadow-[var(--shadow-md)] hover:bg-[var(--surface-espresso)]"
        >
          <Link to="/builder">
            Make it yours
            <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </section>
  );
}

/* ---------------- PRICING ---------------- */
const TIERS = [
  {
    name: "Starter",
    price: "$0",
    cadence: "free during beta",
    features: ["1 landing page", "Medicare or ACA template", "Mobile-friendly", "Lead form"],
    cta: "Get Started",
    highlight: false,
  },
  {
    name: "Pro",
    price: "$29",
    cadence: "/ month",
    features: ["Up to 5 landing pages", "All templates", "Custom domain (soon)", "Priority support"],
    cta: "Join the waitlist",
    highlight: true,
  },
  {
    name: "Agency",
    price: "Custom",
    cadence: "for teams",
    features: ["Unlimited pages", "Team accounts (soon)", "White-label", "Dedicated support"],
    cta: "Contact us",
    highlight: false,
  },
] as const;

function Pricing() {
  return (
    <section className="bg-[var(--surface-sand)]/50 py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-5">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Pricing</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Simple plans, built for agents
          </h2>
          <p className="mt-4 text-muted-foreground">
            Start free during beta. Upgrade only when you need more pages.
          </p>
        </div>
        <div className="mt-12 grid gap-5 sm:grid-cols-3">
          {TIERS.map((t) => (
            <Card
              key={t.name}
              className={`rounded-2xl border p-7 shadow-[var(--shadow-sm)] ${
                t.highlight
                  ? "border-[var(--surface-mocha)] bg-background ring-1 ring-[var(--surface-mocha)]"
                  : "border-border/60 bg-background"
              }`}
            >
              <div className="flex items-center justify-between">
                <h3 className="text-base font-semibold text-foreground">{t.name}</h3>
                {t.highlight && (
                  <span className="rounded-full bg-[var(--surface-mocha)] px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[var(--surface-cream)]">
                    Popular
                  </span>
                )}
              </div>
              <p className="mt-5">
                <span className="text-4xl font-semibold tracking-tight text-foreground">{t.price}</span>
                <span className="ml-1.5 text-sm text-muted-foreground">{t.cadence}</span>
              </p>
              <ul className="mt-6 space-y-2.5 text-sm text-foreground/80">
                {t.features.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 text-[var(--surface-mocha)]" />
                    {f}
                  </li>
                ))}
              </ul>
              <Button
                asChild
                className={`mt-7 w-full rounded-full ${
                  t.highlight
                    ? "bg-[var(--surface-mocha)] text-[var(--surface-cream)] hover:bg-[var(--surface-espresso)]"
                    : "bg-foreground/5 text-foreground hover:bg-foreground/10"
                }`}
              >
                <Link to="/signup">{t.cta}</Link>
              </Button>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- FINAL CTA ---------------- */
function FinalCta() {
  return (
    <section className="px-5 py-20 sm:py-24">
      <div
        className="mx-auto max-w-5xl rounded-[2rem] px-7 py-16 text-center shadow-[var(--shadow-lg)] sm:px-12 sm:py-20"
        style={{ background: "var(--gradient-cta)" }}
      >
        <h2 className="mx-auto max-w-2xl text-3xl font-semibold tracking-tight text-[var(--surface-cream)] sm:text-4xl">
          Your next great landing page is five minutes away
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-lg text-[var(--surface-cream)]/80">
          Join the agents using Lumen.pages to turn more visitors into qualified leads.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button
            asChild
            size="lg"
            className="rounded-full bg-[var(--surface-cream)] px-7 text-base font-semibold text-foreground hover:bg-[var(--surface-sand)]"
          >
            <Link to="/builder">
              Start building
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="rounded-full border-[var(--surface-cream)]/30 bg-transparent px-7 text-base font-semibold text-[var(--surface-cream)] hover:bg-[var(--surface-cream)]/10"
          >
            <Link to="/signup">Create an account</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}