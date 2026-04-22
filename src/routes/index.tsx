import { createFileRoute, Link } from "@tanstack/react-router";
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
  Compass,
  CalendarClock,
  AlertTriangle,
  Briefcase,
  LifeBuoy,
  Quote,
  Phone,
  ArrowRight,
  Star,
} from "lucide-react";
import portrait from "@/assets/latoria-portrait.png";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "901 Healthcare — Medicare Help for Turning 65" },
      {
        name: "description",
        content:
          "Turning 65 soon? 901 Healthcare offers personalized Medicare guidance to help you understand your options, avoid costly mistakes, and enroll with confidence.",
      },
      { property: "og:title", content: "901 Healthcare — Medicare Help for Turning 65" },
      {
        property: "og:description",
        content:
          "Personalized Medicare guidance from a trusted local team. Real Help. Real People. Real Guidance.",
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

function Hero() {
  return (
    <section className="relative overflow-hidden bg-[var(--brand-navy)] text-white">
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-40"
        style={{
          background:
            "radial-gradient(circle at 20% 20%, color-mix(in oklab, var(--brand-blue) 70%, transparent), transparent 55%), radial-gradient(circle at 85% 80%, color-mix(in oklab, var(--brand-green) 50%, transparent), transparent 50%)",
        }}
      />
      <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-4 py-14 lg:grid-cols-[1.1fr_1fr] lg:gap-12 lg:py-20">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-3 py-1 text-xs font-medium uppercase tracking-wider text-[var(--brand-green)]">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--brand-green)]" />
            Trusted Medicare Guidance
          </span>
          <h1 className="mt-4 text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
            Turning 65 soon? <span className="text-[var(--brand-green)]">Medicare is not automatic.</span>
          </h1>
          <p className="mt-5 max-w-xl text-lg text-white/85 sm:text-xl">
            901 Healthcare helps you understand your Medicare options, avoid common mistakes,
            and take the right next steps with confidence.
          </p>

          <ul className="mt-7 space-y-3">
            {[
              "Learn when to enroll",
              "Avoid costly mistakes",
              "Get simple, friendly guidance",
            ].map((item) => (
              <li key={item} className="flex items-start gap-3 text-base text-white/95">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--brand-green)]">
                  <Check className="h-4 w-4 text-[var(--brand-navy)]" aria-hidden="true" />
                </span>
                {item}
              </li>
            ))}
          </ul>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" className="bg-[var(--brand-green-deep)] text-base font-semibold hover:bg-[var(--brand-green-deep)]/90">
              <Link to="/contact">
                Request Help
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white/30 bg-white/5 text-base font-semibold text-white hover:bg-white/15 hover:text-white"
            >
              <a href="tel:+19015550199">
                <Phone className="mr-1 h-4 w-4" />
                Talk to Us
              </a>
            </Button>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-md lg:max-w-none">
          <div
            aria-hidden="true"
            className="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-[var(--brand-green)]/30 to-[var(--brand-blue)]/30 blur-2xl"
          />
          <div className="relative overflow-hidden rounded-[2rem] border-4 border-white/10 bg-white/5 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.5)]">
            <img
              src={portrait}
              alt="LaToria Howard-Williams, Medicare guide at 901 Healthcare"
              className="h-full w-full object-cover"
              loading="eager"
            />
          </div>
          <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 rounded-full bg-white px-5 py-2 text-center shadow-lg">
            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--brand-green-deep)]">
              Featured Guide
            </p>
            <p className="text-sm font-bold text-[var(--brand-navy)]">LaToria Howard-Williams</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function TrustBar() {
  return (
    <section className="border-b border-border bg-secondary/60">
      <div className="mx-auto grid max-w-6xl gap-4 px-4 py-6 text-center text-sm font-medium text-muted-foreground sm:grid-cols-3">
        <div>✓ Local, family-focused service</div>
        <div>✓ No pressure. No hidden fees.</div>
        <div>✓ Plain-language explanations</div>
      </div>
    </section>
  );
}

const reasons = [
  { icon: HeartHandshake, title: "Personalized Medicare guidance", body: "Real conversations tailored to your life — not a one-size-fits-all script." },
  { icon: BookOpen, title: "Easy-to-understand explanations", body: "We explain Parts A, B, C, and D in plain English you'll actually remember." },
  { icon: Users, title: "Friendly support for turning 65", body: "Compassionate help during one of life's biggest healthcare milestones." },
  { icon: Compass, title: "Help understanding your next steps", body: "We walk with you through enrollment, deadlines, and decisions." },
];

function WhyChoose() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:py-20">
      <div className="text-center">
        <p className="text-sm font-semibold uppercase tracking-wider text-[var(--brand-green-deep)]">Why 901 Healthcare</p>
        <h2 className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Why Families Trust 901 Healthcare
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
          We're a local team committed to helping you and your family approach Medicare with clarity and confidence.
        </p>
      </div>
      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {reasons.map((r) => (
          <Card key={r.title} className="p-6 transition-shadow hover:shadow-md">
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/15">
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

const facts = [
  { icon: AlertTriangle, title: "Medicare is not always automatic", body: "If you aren't already collecting Social Security, you usually have to enroll yourself." },
  { icon: CalendarClock, title: "Timing matters", body: "Enrolling at the right time avoids delays, gaps in coverage, and lifetime penalties." },
  { icon: Briefcase, title: "Working past 65 affects your decisions", body: "Employer coverage may let you delay parts of Medicare — but only if you do it right." },
  { icon: LifeBuoy, title: "Early guidance prevents problems", body: "A short conversation now can save you from costly mistakes for years to come." },
];

function Educational() {
  return (
    <section className="bg-secondary/60 py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-[var(--brand-blue)]">Education</p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            What You Need to Know About Turning 65
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
            A few simple truths can save you stress, confusion, and money.
          </p>
        </div>
        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          {facts.map((f) => (
            <div key={f.title} className="flex gap-4 rounded-xl border border-border bg-background p-5">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[var(--brand-blue)]/10">
                <f.icon className="h-5 w-5 text-[var(--brand-blue)]" aria-hidden="true" />
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

function AboutPersonal() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:py-20">
      <div className="grid items-center gap-10 lg:grid-cols-[360px_1fr] lg:gap-12">
        <div className="relative mx-auto w-full max-w-xs">
          <div
            aria-hidden="true"
            className="absolute -inset-3 rounded-full bg-gradient-to-br from-[var(--brand-green)]/40 to-[var(--brand-blue)]/30 blur-xl"
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
          <p className="text-sm font-semibold uppercase tracking-wider text-[var(--brand-green-deep)]">About 901 Healthcare</p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Real Help. Real People. Real Guidance.
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            At 901 Healthcare, we believe Medicare guidance should feel personal, caring,
            and easy to understand. We help individuals and families approach Medicare with
            more confidence and less confusion.
          </p>
          <p className="mt-3 text-muted-foreground">
            Whether you're turning 65 next month or planning ahead for next year, we're here
            to listen, explain your options clearly, and walk with you every step of the way.
          </p>
          <div className="mt-6">
            <Button asChild size="lg" className="bg-[var(--brand-green-deep)] hover:bg-[var(--brand-green-deep)]/90">
              <Link to="/contact">Request Help</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

function LeadCapture() {
  return (
    <section id="request-help" className="bg-[var(--brand-navy)] py-16 text-white sm:py-20">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 lg:grid-cols-[1fr_1.1fr] lg:gap-12">
        <div className="lg:pt-6">
          <p className="text-sm font-semibold uppercase tracking-wider text-[var(--brand-green)]">Get Started</p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Request Medicare Help
          </h2>
          <p className="mt-4 text-lg text-white/85">
            Share a few details and a friendly member of 901 Healthcare will reach out
            soon to help you understand your options.
          </p>
          <ul className="mt-6 space-y-3 text-white/90">
            {[
              "No cost. No obligation.",
              "We respond promptly during business hours.",
              "Your information stays private.",
            ].map((p) => (
              <li key={p} className="flex items-start gap-3">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--brand-green)]">
                  <Check className="h-4 w-4 text-[var(--brand-navy)]" />
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

const testimonials = [
  {
    quote:
      "901 Healthcare made Medicare so much easier to understand. They answered every question without making me feel rushed.",
    name: "Carol M.",
    location: "Memphis, TN",
  },
  {
    quote:
      "I was overwhelmed turning 65. They walked me through everything and helped me pick a plan that fit my life.",
    name: "James R.",
    location: "Bartlett, TN",
  },
  {
    quote:
      "Friendly, patient, and knowledgeable. I trust them with my parents — and I recommend them to all my friends.",
    name: "Denise W.",
    location: "Germantown, TN",
  },
];

function Testimonials() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:py-20">
      <div className="text-center">
        <p className="text-sm font-semibold uppercase tracking-wider text-[var(--brand-green-deep)]">Testimonials</p>
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

function FinalCta() {
  return (
    <section className="bg-gradient-to-br from-[var(--brand-navy)] to-[var(--brand-blue)] py-16 text-white sm:py-20">
      <div className="mx-auto max-w-3xl px-4 text-center">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Get Help Understanding Your Medicare Next Steps
        </h2>
        <p className="mt-4 text-lg text-white/85">
          If you're turning 65 soon, 901 Healthcare is here to help you understand
          your options and move forward with confidence.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button asChild size="lg" className="bg-[var(--brand-green-deep)] text-base font-semibold hover:bg-[var(--brand-green-deep)]/90">
            <Link to="/contact">
              Request Help Today
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="border-white/30 bg-white/5 text-base font-semibold text-white hover:bg-white/15 hover:text-white">
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