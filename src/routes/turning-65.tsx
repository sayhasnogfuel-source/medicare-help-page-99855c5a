import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarClock, AlertTriangle, Briefcase, LifeBuoy } from "lucide-react";

export const Route = createFileRoute("/turning-65")({
  head: () => ({
    meta: [
      { title: "Turning 65 — 901 Healthcare" },
      {
        name: "description",
        content:
          "Turning 65 soon? Medicare is not automatic. Learn what to do, when to enroll, and how to avoid common mistakes with 901 Healthcare.",
      },
      { property: "og:title", content: "Turning 65 — 901 Healthcare" },
      {
        property: "og:description",
        content:
          "Everything you need to know about Medicare when turning 65 — explained simply.",
      },
    ],
  }),
  component: Turning65Page,
});

const facts = [
  {
    icon: AlertTriangle,
    title: "Medicare is not always automatic",
    body: "If you aren't already collecting Social Security, you usually have to actively enroll in Medicare yourself.",
  },
  {
    icon: CalendarClock,
    title: "Timing matters",
    body: "Your Initial Enrollment Period is a 7-month window around your 65th birthday. Missing it can cost you.",
  },
  {
    icon: Briefcase,
    title: "Working past 65 changes things",
    body: "Employer coverage may let you delay parts of Medicare — but only if you handle it correctly.",
  },
  {
    icon: LifeBuoy,
    title: "Early guidance avoids penalties",
    body: "A short conversation now can prevent lifelong late-enrollment penalties and confusion later.",
  },
];

function Turning65Page() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main>
        <section className="bg-[var(--brand-navy)] py-16 text-white sm:py-20">
          <div className="mx-auto max-w-4xl px-4 text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-[var(--brand-green)]">
              Turning 65
            </p>
            <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              What you need to know about turning 65.
            </h1>
            <p className="mt-5 text-lg text-white/85">
              A few simple decisions now can save you money, stress, and headaches later.
              Here's what every person approaching 65 should understand.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-16 sm:py-20">
          <div className="grid gap-6 sm:grid-cols-2">
            {facts.map((f) => (
              <Card key={f.title} className="p-6">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--brand-blue)]/10">
                  <f.icon className="h-6 w-6 text-[var(--brand-blue)]" aria-hidden="true" />
                </span>
                <h2 className="mt-4 text-xl font-semibold text-foreground">{f.title}</h2>
                <p className="mt-2 text-muted-foreground">{f.body}</p>
              </Card>
            ))}
          </div>
        </section>

        <section className="bg-secondary py-16 sm:py-20">
          <div className="mx-auto max-w-3xl px-4 text-center">
            <h2 className="text-3xl font-bold text-foreground">Not sure where to start?</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              That's exactly what we're here for. Tell us a little about your situation,
              and a friendly member of the 901 Healthcare team will reach out.
            </p>
            <div className="mt-8">
              <Button asChild size="lg" className="bg-[var(--brand-green-deep)] hover:bg-[var(--brand-green-deep)]/90">
                <Link to="/contact">Request Help</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}