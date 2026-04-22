import {
  Phone,
  Mail,
  MessageSquare,
  Check,
  ShieldCheck,
  HeartHandshake,
  Clock,
  Sparkles,
  MapPin,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { BuilderData } from "@/lib/builder-storage";

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase() ?? "")
    .join("");
}

type Benefit = { icon: typeof ShieldCheck; title: string; body: string };

const GENERIC_BENEFITS: readonly Benefit[] = [
  { icon: ShieldCheck, title: "Personalized coverage", body: "Plans matched to your situation, not a one-size-fits-all script." },
  { icon: HeartHandshake, title: "A real local expert", body: "Friendly guidance from someone who answers the phone." },
  { icon: Clock, title: "Easy enrollment", body: "We make signing up simple and stress-free, start to finish." },
];

const BENEFITS_BY_NICHE: Record<string, readonly Benefit[]> = {
  medicare: [
    { icon: ShieldCheck, title: "Medicare made simple", body: "Plain-language guidance from someone who answers the phone." },
    { icon: HeartHandshake, title: "Personalized to you", body: "Plans that match your doctors, prescriptions, and budget." },
    { icon: Clock, title: "Avoid late penalties", body: "Enroll on time and skip the costly mistakes most people make." },
  ],
  aca: [
    { icon: ShieldCheck, title: "Find affordable coverage", body: "Compare ACA plans and subsidies side-by-side." },
    { icon: HeartHandshake, title: "Personal one-on-one help", body: "We listen first, then walk through your best options." },
    { icon: Clock, title: "Don't miss enrollment", body: "Stay ahead of deadlines and special enrollment windows." },
  ],
  life: [
    { icon: ShieldCheck, title: "Protection that lasts", body: "Affordable life policies tailored to your family's future." },
    { icon: HeartHandshake, title: "Personal guidance", body: "We listen first, then recommend the right coverage." },
    { icon: Clock, title: "Quick, simple quotes", body: "Compare top carriers in minutes — no medical exam options available." },
  ],
  health: [
    { icon: ShieldCheck, title: "Quality health coverage", body: "Plans built around your doctors, prescriptions, and budget." },
    { icon: HeartHandshake, title: "Real human help", body: "We answer questions in plain English, not insurance jargon." },
    { icon: Clock, title: "Enroll on time", body: "Stay ahead of deadlines and avoid coverage gaps." },
  ],
  "final expense": [
    { icon: ShieldCheck, title: "Peace of mind for your family", body: "Affordable final expense plans that protect loved ones." },
    { icon: HeartHandshake, title: "Compassionate guidance", body: "Patient, respectful help — no pressure, no rush." },
    { icon: Clock, title: "Fast, simple approval", body: "Most policies issue in days, often with no medical exam." },
  ],
  auto: [
    { icon: ShieldCheck, title: "Reliable auto coverage", body: "Right-sized policies that protect you on every drive." },
    { icon: HeartHandshake, title: "Local, friendly service", body: "An agent who knows your name, not a 1-800 number." },
    { icon: Clock, title: "Quick quotes, real savings", body: "We shop top carriers to find the best price for you." },
  ],
  home: [
    { icon: ShieldCheck, title: "Protect what matters most", body: "Comprehensive home coverage built around your property." },
    { icon: HeartHandshake, title: "A neighbor who has your back", body: "Real guidance from a local expert who knows the area." },
    { icon: Clock, title: "Fast, easy quotes", body: "Get a clear, side-by-side comparison in minutes." },
  ],
  commercial: [
    { icon: ShieldCheck, title: "Coverage built for your business", body: "Policies designed around your industry and risks." },
    { icon: HeartHandshake, title: "An advisor, not a salesperson", body: "We help you choose smart coverage — not the most expensive." },
    { icon: Clock, title: "Renewals made easy", body: "We handle the busywork so you can run your business." },
  ],
};

function getBenefits(niche: string): readonly Benefit[] {
  return BENEFITS_BY_NICHE[niche.toLowerCase().trim()] ?? GENERIC_BENEFITS;
}

const ContactIcon = {
  call: Phone,
  text: MessageSquare,
  email: Mail,
} as const;

export function GeneratedLanding({ data }: { data: BuilderData }) {
  const benefits = getBenefits(data.insuranceType);
  const CIcon = ContactIcon[data.contactMethod];
  const cta = data.ctaText || "Request Help";
  const typeLabel = data.insuranceType?.trim() || "Insurance";

  return (
    <div className="bg-[var(--surface-cream)] text-foreground">
      {/* Header */}
      <header className="border-b border-border/60 bg-background/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3.5">
          <div className="flex items-center gap-3">
            {data.logoDataUrl ? (
              <img src={data.logoDataUrl} alt={`${data.businessName} logo`} className="h-10 w-auto rounded-md object-contain" />
            ) : (
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--surface-mocha)] text-[var(--surface-cream)] text-sm font-semibold">
                {initials(data.businessName)}
              </span>
            )}
            <div className="leading-tight">
              <p className="text-sm font-semibold text-foreground">{data.businessName}</p>
              <p className="text-[11px] uppercase tracking-wider text-muted-foreground">{typeLabel} Insurance</p>
            </div>
          </div>
          <a href="#lead-form" className="hidden sm:inline-flex">
            <Button size="sm" className="rounded-full bg-[var(--surface-mocha)] text-[var(--surface-cream)] hover:bg-[var(--surface-espresso)]">
              {cta}
            </Button>
          </a>
        </div>
      </header>

      {/* Hero */}
      <section
        className="relative overflow-hidden"
        style={{ background: "var(--gradient-hero)" }}
      >
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-5 py-14 lg:grid-cols-[1.15fr_1fr] lg:gap-14 lg:py-20">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background/70 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-foreground/70 shadow-[var(--shadow-xs)]">
              <Sparkles className="h-3 w-3" />
              Local {typeLabel} guidance
            </span>
            <h1 className="mt-4 text-4xl font-semibold leading-[1.05] tracking-tight text-foreground sm:text-5xl lg:text-[3.5rem]">
              {data.headline}
            </h1>
            <p className="mt-5 max-w-xl text-lg text-foreground/75">{data.subheadline}</p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a href="#lead-form">
                <Button size="lg" className="w-full rounded-full bg-[var(--surface-mocha)] px-7 text-base font-semibold text-[var(--surface-cream)] shadow-[var(--shadow-md)] hover:bg-[var(--surface-espresso)] sm:w-auto">
                  {cta}
                </Button>
              </a>
              <a href={`tel:${data.phone}`}>
                <Button size="lg" variant="outline" className="w-full rounded-full border-foreground/20 bg-background/60 px-7 text-base font-semibold text-foreground hover:bg-background sm:w-auto">
                  <Phone className="mr-1 h-4 w-4" />
                  {data.phone}
                </Button>
              </a>
            </div>

            <ul className="mt-8 grid gap-2.5 sm:grid-cols-2">
              {[
                "Free, no-pressure consultation",
                "Licensed local agent",
                `Serving ${data.city}, ${data.state}`,
                "Friendly, plain-language help",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-foreground/80">
                  <Check className="mt-0.5 h-4 w-4 text-[var(--surface-mocha)]" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="relative mx-auto w-full max-w-md lg:max-w-none">
            <div className="relative overflow-hidden rounded-[2rem] border border-border/60 bg-background shadow-[var(--shadow-lg)]">
              {data.headshotDataUrl ? (
                <img src={data.headshotDataUrl} alt={data.agentName} className="aspect-[4/5] h-full w-full object-cover" />
              ) : (
                <div className="flex aspect-[4/5] items-center justify-center bg-[var(--gradient-warm)]">
                  <span className="flex h-32 w-32 items-center justify-center rounded-full bg-[var(--surface-mocha)] text-3xl font-semibold text-[var(--surface-cream)]">
                    {initials(data.agentName)}
                  </span>
                </div>
              )}
            </div>
            <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border border-border bg-background px-5 py-2.5 text-center shadow-[var(--shadow-md)]">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Your {typeLabel} guide</p>
              <p className="text-sm font-semibold text-foreground">{data.agentName}</p>
            </div>
          </div>
        </div>
      </section>

      {/* About / trust */}
      <section className="mx-auto max-w-6xl px-5 py-16 sm:py-20">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">About {data.businessName}</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Real help from a local agent who actually picks up the phone
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Hi, I'm {data.agentName}. I help neighbors in {data.city}, {data.state} navigate {typeLabel} with
            clarity and care — no pressure, no jargon, just straight answers.
          </p>
          {data.freestyleInstructions?.trim() && (
            <div className="mx-auto mt-8 max-w-2xl rounded-2xl border border-border/60 bg-[var(--surface-sand)]/50 p-6 text-left shadow-[var(--shadow-xs)]">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                A note from {data.agentName}
              </p>
              <p className="mt-2 whitespace-pre-line text-base leading-relaxed text-foreground/85">
                {data.freestyleInstructions}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Benefits */}
      <section className="bg-[var(--surface-sand)]/60 py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-5">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Why work with us</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              Built around what actually matters to you
            </h2>
          </div>
          <div className="mt-12 grid gap-5 sm:grid-cols-3">
            {benefits.map((b) => (
              <Card key={b.title} className="rounded-2xl border-border/60 bg-background p-7 shadow-[var(--shadow-sm)]">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--surface-beige)] text-[var(--surface-mocha)]">
                  <b.icon className="h-5 w-5" />
                </span>
                <h3 className="mt-5 text-lg font-semibold text-foreground">{b.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{b.body}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial strip */}
      <section className="mx-auto max-w-6xl px-5 py-16">
        <div className="rounded-3xl border border-border/60 bg-background p-8 shadow-[var(--shadow-sm)] sm:p-12">
          <div className="flex items-center gap-1 text-[var(--surface-camel)]">
            {[0, 1, 2, 3, 4].map((i) => (
              <Star key={i} className="h-4.5 w-4.5 fill-current" />
            ))}
          </div>
          <p className="mt-5 text-xl font-medium leading-relaxed text-foreground sm:text-2xl">
            "{data.agentName} took the time to actually explain everything. I felt respected,
            not rushed — and ended up with better coverage and a lower premium."
          </p>
          <p className="mt-5 text-sm text-muted-foreground">— A happy client in {data.city}</p>
        </div>
      </section>

      {/* Lead form */}
      <section id="lead-form" className="bg-[var(--surface-beige)]/40 py-16 sm:py-20">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 lg:grid-cols-[1fr_1.1fr] lg:gap-14">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Get in touch</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              Request your free {typeLabel} consultation
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Share a few quick details and {data.agentName} will reach out by{" "}
              {data.contactMethod} soon.
            </p>
            <ul className="mt-8 space-y-3 text-sm text-foreground/80">
              <li className="flex items-center gap-3">
                <CIcon className="h-4 w-4 text-[var(--surface-mocha)]" />
                Preferred contact: {data.contactMethod}
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-[var(--surface-mocha)]" />
                {data.phone}
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-[var(--surface-mocha)]" />
                {data.email}
              </li>
              <li className="flex items-center gap-3">
                <MapPin className="h-4 w-4 text-[var(--surface-mocha)]" />
                {data.city}, {data.state}
              </li>
            </ul>
          </div>

          <Card className="rounded-3xl border-border/60 bg-background p-7 shadow-[var(--shadow-md)] sm:p-9">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="g-first">First name</Label>
                <Input id="g-first" placeholder="Jane" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="g-last">Last name</Label>
                <Input id="g-last" placeholder="Smith" />
              </div>
            </div>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="g-phone">Phone</Label>
                <Input id="g-phone" type="tel" placeholder="(555) 555-5555" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="g-email">Email</Label>
                <Input id="g-email" type="email" placeholder="you@example.com" />
              </div>
            </div>
            <div className="mt-4 space-y-2">
              <Label htmlFor="g-notes">What can we help with?</Label>
              <Input id="g-notes" placeholder={`I'm interested in ${typeLabel} options...`} />
            </div>
            <Button
              type="button"
              size="lg"
              className="mt-6 w-full rounded-full bg-[var(--surface-mocha)] text-base font-semibold text-[var(--surface-cream)] shadow-[var(--shadow-md)] hover:bg-[var(--surface-espresso)]"
            >
              {cta}
            </Button>
            <p className="mt-3 text-center text-xs text-muted-foreground">
              We'll never share your information. This is a preview form.
            </p>
          </Card>
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-5 py-16 sm:py-20">
        <div
          className="mx-auto max-w-5xl rounded-[2rem] px-7 py-14 text-center shadow-[var(--shadow-lg)] sm:px-12"
          style={{ background: "var(--gradient-cta)" }}
        >
          <h2 className="text-3xl font-semibold tracking-tight text-[var(--surface-cream)] sm:text-4xl">
            Ready when you are
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-[var(--surface-cream)]/80">
            Reach out today and let's find the {typeLabel} coverage that fits your life.
          </p>
          <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a href="#lead-form">
              <Button size="lg" className="rounded-full bg-[var(--surface-cream)] px-7 text-base font-semibold text-foreground hover:bg-[var(--surface-sand)]">
                {cta}
              </Button>
            </a>
            <a href={`tel:${data.phone}`}>
              <Button size="lg" variant="outline" className="rounded-full border-[var(--surface-cream)]/30 bg-transparent px-7 text-base font-semibold text-[var(--surface-cream)] hover:bg-[var(--surface-cream)]/10">
                <Phone className="mr-1 h-4 w-4" />
                Call {data.phone}
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/60 bg-background">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-5 py-7 text-sm text-muted-foreground sm:flex-row">
          <p>© {data.businessName}. All rights reserved.</p>
          <p>{data.city}, {data.state} · {typeLabel} insurance</p>
        </div>
      </footer>
    </div>
  );
}