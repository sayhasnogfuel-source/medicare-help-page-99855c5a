import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { RequestForm } from "@/components/request-form";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Check,
  HeartHandshake,
  BookOpen,
  Users,
  ClipboardList,
  CalendarClock,
  AlertTriangle,
  DollarSign,
  LifeBuoy,
  Quote,
  Phone,
  ArrowRight,
  Star,
  ShieldCheck,
  Clock,
  Sparkles,
} from "lucide-react";
import portrait from "@/assets/latoria-portrait.png";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "901 Healthcare — ACA Open Enrollment Help (Deadline Dec 15)" },
      {
        name: "description",
        content:
          "ACA Open Enrollment ends December 15. 901 Healthcare helps you review your health insurance options and enroll on time with simple, personal guidance.",
      },
      { property: "og:title", content: "901 Healthcare — ACA Open Enrollment Ends Dec 15" },
      {
        property: "og:description",
        content:
          "Get personal help reviewing your ACA health insurance options before the December 15 deadline.",
      },
    ],
  }),
});

function Index() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main>
        <Hero />
        <TrustBar />
        <Urgency />
        <WhyChoose />
        <Educational />
        <AboutPersonal />
        <LeadCapture />
        <Testimonials />
        <FinalCta />
      </main>
      <SiteFooter />
    </div>
  );
}

/* ---------------- HERO ---------------- */
function Hero() {
  return (
    <section
      id="home"
      className="relative overflow-hidden bg-gradient-to-br from-[var(--brand-navy)] via-[var(--brand-blue-deep)] to-[var(--brand-blue)] text-white"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-50"
        style={{
          background:
            "radial-gradient(circle at 15% 20%, color-mix(in oklab, var(--brand-blue) 60%, transparent), transparent 55%), radial-gradient(circle at 85% 80%, color-mix(in oklab, var(--brand-green) 55%, transparent), transparent 50%)",
        }}
      />
      <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-4 py-12 lg:grid-cols-[1.1fr_1fr] lg:gap-12 lg:py-20">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-[var(--brand-urgent)]/40 bg-[var(--brand-urgent)]/15 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-[var(--brand-urgent-soft)] backdrop-blur">
            <Clock className="h-3.5 w-3.5" />
            Open Enrollment Ends Dec 15
          </span>
          <h1 className="mt-4 text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl">
            ACA Open Enrollment Is Here —{" "}
            <span className="text-[var(--brand-green)]">Don't Miss the December 15 Deadline</span>
          </h1>
          <p className="mt-5 max-w-xl text-lg text-white/90 sm:text-xl">
            The Open Enrollment window is shorter this year. 901 Healthcare can help you
            review your health insurance options and enroll before the deadline.
          </p>

          <ul className="mt-7 space-y-3">
            {[
              "See your coverage options",
              "Get help before the deadline",
              "Simple, personal guidance",
            ].map((item) => (
              <li key={item} className="flex items-start gap-3 text-base text-white/95">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--brand-green)]">
                  <Check className="h-4 w-4 text-white" aria-hidden="true" />
                </span>
                {item}
              </li>
            ))}
          </ul>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button
              asChild
              size="lg"
              className="bg-[var(--brand-green-deep)] text-base font-semibold text-white hover:bg-[var(--brand-green-deep)]/90"
            >
              <a href="#contact">
                Get Covered
                <ArrowRight className="ml-1 h-4 w-4" />
              </a>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white/30 bg-white/5 text-base font-semibold text-white hover:bg-white/15 hover:text-white"
            >
              <a href="#contact">
                <Phone className="mr-1 h-4 w-4" />
                Request Help
              </a>
            </Button>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-md lg:max-w-none">
          <div
            aria-hidden="true"
            className="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-[var(--brand-green)]/40 to-[var(--brand-blue)]/40 blur-2xl"
          />
          <div className="relative overflow-hidden rounded-[2rem] border-4 border-white/10 bg-white/5 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.5)]">
            <img
              src={portrait}
              alt="LaToria Howard-Williams, ACA enrollment guide at 901 Healthcare"
              className="h-full w-full object-cover"
              loading="eager"
            />
          </div>
          <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-white px-5 py-2 text-center shadow-lg">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--brand-green-deep)]">
              Your ACA Guide
            </p>
            <p className="text-sm font-bold text-[var(--brand-navy)]">LaToria Howard-Williams</p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- TRUST BAR ---------------- */
function TrustBar() {
  return (
    <section className="border-b border-border bg-secondary/60">
      <div className="mx-auto grid max-w-6xl gap-3 px-4 py-5 text-center text-sm font-medium text-muted-foreground sm:grid-cols-3">
        <div className="flex items-center justify-center gap-2">
          <ShieldCheck className="h-4 w-4 text-[var(--brand-green-deep)]" />
          Local, family-focused service
        </div>
        <div className="flex items-center justify-center gap-2">
          <ShieldCheck className="h-4 w-4 text-[var(--brand-green-deep)]" />
          No pressure. No hidden fees.
        </div>
        <div className="flex items-center justify-center gap-2">
          <ShieldCheck className="h-4 w-4 text-[var(--brand-green-deep)]" />
          Plain-language guidance
        </div>
      </div>
    </section>
  );
}

/* ---------------- URGENCY ---------------- */
function Urgency() {
  return (
    <section id="open-enrollment" className="bg-[var(--brand-urgent-soft)] py-14 sm:py-18">
      <div className="mx-auto max-w-5xl px-4">
        <div className="overflow-hidden rounded-3xl border-2 border-[var(--brand-urgent)]/30 bg-white shadow-[var(--shadow-urgent)]">
          <div className="grid items-center gap-0 lg:grid-cols-[1fr_auto]">
            <div className="p-7 sm:p-10">
              <span className="inline-flex items-center gap-2 rounded-full bg-[var(--brand-urgent)]/15 px-3 py-1 text-xs font-bold uppercase tracking-wider text-[var(--brand-urgent)]">
                <AlertTriangle className="h-3.5 w-3.5" />
                Limited time
              </span>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Open Enrollment Ends{" "}
                <span className="text-[var(--brand-urgent)]">December 15</span>
              </h2>
              <p className="mt-4 text-base text-muted-foreground sm:text-lg">
                The ACA Open Enrollment window is shorter this year. Don't wait until
                the last minute — delaying could cause you to miss your chance to
                enroll for the year.
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Button
                  asChild
                  size="lg"
                  className="bg-[var(--brand-urgent)] text-base font-semibold text-white hover:bg-[var(--brand-urgent)]/90"
                >
                  <a href="#contact">
                    Request Help Now
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </a>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="border-[var(--brand-navy)]/20 text-[var(--brand-navy)] hover:bg-secondary"
                >
                  <a href="tel:+19015550199">
                    <Phone className="mr-1 h-4 w-4" />
                    Call (901) 555-0199
                  </a>
                </Button>
              </div>
            </div>

            <div className="bg-gradient-to-br from-[var(--brand-urgent)] to-[oklch(0.55_0.22_25)] p-7 text-center text-white sm:p-10 lg:rounded-l-[2rem]">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/80">
                Deadline
              </p>
              <p className="mt-2 text-6xl font-extrabold leading-none tracking-tight sm:text-7xl">
                Dec
              </p>
              <p className="mt-1 text-7xl font-extrabold leading-none tracking-tight sm:text-8xl">
                15
              </p>
              <p className="mt-3 flex items-center justify-center gap-2 text-sm font-medium text-white/90">
                <Clock className="h-4 w-4" />
                Don't miss it
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- WHY CHOOSE ---------------- */
const reasons = [
  {
    icon: HeartHandshake,
    title: "Personalized ACA guidance",
    body: "One-on-one help that fits your household, budget, and health needs — not a one-size script.",
  },
  {
    icon: BookOpen,
    title: "Easy-to-understand help",
    body: "We explain plans, premiums, and subsidies in plain language you'll actually remember.",
  },
  {
    icon: Users,
    title: "Friendly one-on-one support",
    body: "Real people who care, take their time, and never pressure you into a decision.",
  },
  {
    icon: ClipboardList,
    title: "Help reviewing your options",
    body: "We walk through plans side-by-side so you can confidently choose what's best for you.",
  },
];

function WhyChoose() {
  return (
    <section id="aca-help" className="mx-auto max-w-6xl px-4 py-16 sm:py-20">
      <div className="text-center">
        <p className="text-sm font-semibold uppercase tracking-wider text-[var(--brand-green-deep)]">
          Why 901 Healthcare
        </p>
        <h2 className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Why Choose 901 Healthcare
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
          We're a local team committed to making ACA Open Enrollment simple, clear,
          and stress-free for every person we help.
        </p>
      </div>
      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {reasons.map((r) => (
          <Card key={r.title} className="p-6 transition-shadow hover:shadow-md">
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--brand-green)]/15">
              <r.icon className="h-6 w-6 text-[var(--brand-green-deep)]" aria-hidden="true" />
            </span>
            <h3 className="mt-4 text-lg font-semibold text-foreground">{r.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{r.body}</p>
          </Card>
        ))}
      </div>
    </section>
  );
}

/* ---------------- EDUCATIONAL ---------------- */
const facts = [
  {
    icon: CalendarClock,
    title: "Open Enrollment is the main time to choose ACA coverage",
    body: "It's the once-a-year window to enroll, switch plans, or update your existing coverage.",
  },
  {
    icon: AlertTriangle,
    title: "The deadline is December 15",
    body: "Miss the window and you may have to wait until next year unless you qualify for a special enrollment period.",
  },
  {
    icon: DollarSign,
    title: "Plans and costs can vary",
    body: "Premiums, networks, and subsidies change every year — even if you keep the same plan.",
  },
  {
    icon: LifeBuoy,
    title: "Getting help makes it easier",
    body: "A short conversation with a guide can save you time, money, and a lot of confusion.",
  },
];

function Educational() {
  return (
    <section className="bg-secondary/60 py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-[var(--brand-blue-deep)]">
            Education
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            What You Need to Know About ACA Open Enrollment
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
            A few simple facts that can save you stress, confusion, and money.
          </p>
        </div>
        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          {facts.map((f) => (
            <div
              key={f.title}
              className="flex gap-4 rounded-xl border border-border bg-background p-5 shadow-sm"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[var(--brand-blue)]/10">
                <f.icon className="h-5 w-5 text-[var(--brand-blue-deep)]" aria-hidden="true" />
              </span>
              <div>
                <h3 className="text-base font-semibold text-foreground">{f.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{f.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- ABOUT / PERSONAL TRUST ---------------- */
function AboutPersonal() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:py-20">
      <div className="grid items-center gap-10 lg:grid-cols-[360px_1fr] lg:gap-12">
        <div className="relative mx-auto w-full max-w-xs">
          <div
            aria-hidden="true"
            className="absolute -inset-3 rounded-full bg-gradient-to-br from-[var(--brand-green)]/40 to-[var(--brand-blue)]/40 blur-xl"
          />
          <div className="relative aspect-square overflow-hidden rounded-full border-[6px] border-white shadow-[var(--shadow-portrait)] ring-4 ring-[var(--brand-green)]/40">
            <img
              src={portrait}
              alt="LaToria Howard-Williams of 901 Healthcare"
              className="h-full w-full object-cover"
              loading="lazy"
            />
          </div>
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-[var(--brand-green-deep)]">
            About 901 Healthcare
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Real Help From Real People
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            At 901 Healthcare, we believe health coverage should be easier to understand.
            We help individuals and families review their ACA options with simple, caring
            support during Open Enrollment.
          </p>
          <p className="mt-3 text-muted-foreground">
            Whether you're switching plans, signing up for the first time, or just unsure
            where to start — we'll listen, explain your options clearly, and walk with you
            every step of the way.
          </p>
          <div className="mt-6">
            <Button
              asChild
              size="lg"
              className="bg-[var(--brand-green-deep)] text-white hover:bg-[var(--brand-green-deep)]/90"
            >
              <a href="#contact">Request Help</a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- LEAD CAPTURE ---------------- */
function LeadCapture() {
  return (
    <section
      id="contact"
      className="bg-gradient-to-br from-[var(--brand-navy)] to-[var(--brand-blue-deep)] py-16 text-white sm:py-20"
    >
      <div className="mx-auto grid max-w-6xl gap-10 px-4 lg:grid-cols-[1fr_1.1fr] lg:gap-12">
        <div className="lg:pt-6">
          <span className="inline-flex items-center gap-2 rounded-full border border-[var(--brand-urgent)]/40 bg-[var(--brand-urgent)]/15 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-[var(--brand-urgent-soft)]">
            <Sparkles className="h-3.5 w-3.5" />
            Free help — Deadline Dec 15
          </span>
          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            Request ACA Enrollment Help
          </h2>
          <p className="mt-4 text-lg text-white/85">
            Share a few details and a friendly member of 901 Healthcare will reach out
            soon to help you review your ACA options before the deadline.
          </p>
          <ul className="mt-6 space-y-3 text-white/90">
            {[
              "No cost. No obligation.",
              "We respond promptly during business hours.",
              "Your information stays private.",
            ].map((p) => (
              <li key={p} className="flex items-start gap-3">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--brand-green)]">
                  <Check className="h-4 w-4 text-white" />
                </span>
                {p}
              </li>
            ))}
          </ul>
        </div>
        <Card className="p-6 sm:p-8">
          <RequestForm />
        </Card>
      </div>
    </section>
  );
}

/* ---------------- TESTIMONIALS ---------------- */
const testimonials = [
  {
    quote:
      "901 Healthcare made picking an ACA plan so much easier. They took the time to explain everything and never pushed me.",
    name: "Carol M.",
    location: "Memphis, TN",
  },
  {
    quote:
      "I had no idea where to start with Open Enrollment. They walked me through it all and helped me find a plan that fit my budget.",
    name: "James R.",
    location: "Bartlett, TN",
  },
  {
    quote:
      "Friendly, patient, and knowledgeable. I trust them with my whole family — and I recommend them to my friends.",
    name: "Denise W.",
    location: "Germantown, TN",
  },
];

function Testimonials() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:py-20">
      <div className="text-center">
        <p className="text-sm font-semibold uppercase tracking-wider text-[var(--brand-green-deep)]">
          Testimonials
        </p>
        <h2 className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          What Our Community Says
        </h2>
      </div>
      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {testimonials.map((t) => (
          <Card key={t.name} className="flex flex-col p-6">
            <Quote className="h-7 w-7 text-[var(--brand-green-deep)]" aria-hidden="true" />
            <p className="mt-3 flex-1 text-foreground">"{t.quote}"</p>
            <div className="mt-4 flex items-center gap-1 text-[var(--brand-green-deep)]">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-current" />
              ))}
            </div>
            <p className="mt-3 text-sm font-semibold text-foreground">{t.name}</p>
            <p className="text-xs text-muted-foreground">{t.location}</p>
          </Card>
        ))}
      </div>
    </section>
  );
}

/* ---------------- FINAL CTA ---------------- */
function FinalCta() {
  return (
    <section className="bg-gradient-to-br from-[var(--brand-blue-deep)] via-[var(--brand-navy)] to-[var(--brand-green-deep)] py-16 text-white sm:py-20">
      <div className="mx-auto max-w-3xl px-4 text-center">
        <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider backdrop-blur">
          <Clock className="h-3.5 w-3.5" />
          Deadline December 15
        </span>
        <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
          Don't Wait Until It's Too Late
        </h2>
        <p className="mt-4 text-lg text-white/90">
          ACA Open Enrollment ends December 15. Let 901 Healthcare help you review
          your options and get covered before the deadline.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button
            asChild
            size="lg"
            className="bg-white text-base font-semibold text-[var(--brand-navy)] hover:bg-white/90"
          >
            <a href="#contact">
              Request Help Today
              <ArrowRight className="ml-1 h-4 w-4" />
            </a>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="border-white/40 bg-white/5 text-base font-semibold text-white hover:bg-white/15 hover:text-white"
          >
            <a href="tel:+19015550199">
              <Phone className="mr-1 h-4 w-4" />
              (901) 555-0199
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}
