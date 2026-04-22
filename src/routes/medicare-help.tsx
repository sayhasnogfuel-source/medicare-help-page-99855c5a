import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { HeartHandshake, BookOpen, Users, Compass, Check } from "lucide-react";

export const Route = createFileRoute("/medicare-help")({
  head: () => ({
    meta: [
      { title: "Medicare Help — 901 Healthcare" },
      {
        name: "description",
        content:
          "Personalized Medicare guidance from 901 Healthcare. Learn about Parts A, B, C, and D, enrollment timing, and how to avoid costly mistakes.",
      },
      { property: "og:title", content: "Medicare Help — 901 Healthcare" },
      {
        property: "og:description",
        content:
          "Friendly Medicare guidance for individuals and families. We help you understand your options.",
      },
    ],
  }),
  component: MedicareHelpPage,
});

const services = [
  {
    icon: HeartHandshake,
    title: "Personalized Medicare Guidance",
    body: "Sit down with a real person who listens to your situation and walks you through your options.",
  },
  {
    icon: BookOpen,
    title: "Easy-to-Understand Explanations",
    body: "Plain-language explanations of Parts A, B, C, and D so you actually understand what you're choosing.",
  },
  {
    icon: Users,
    title: "Friendly Support for Turning 65",
    body: "Caring guidance for the milestone of turning 65 — without pressure or sales tactics.",
  },
  {
    icon: Compass,
    title: "Help Understanding Next Steps",
    body: "Clear next steps for enrollment, working past 65, and coordinating with current coverage.",
  },
];

function MedicareHelpPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main>
        <section className="bg-[var(--brand-navy)] py-16 text-white sm:py-20">
          <div className="mx-auto max-w-4xl px-4 text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-[var(--brand-green)]">
              Medicare Help
            </p>
            <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              Real guidance for the choices that matter most.
            </h1>
            <p className="mt-5 text-lg text-white/85">
              Medicare can feel overwhelming. We make it simple — so you can make confident,
              informed decisions about your health coverage.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-16 sm:py-20">
          <div className="grid gap-6 sm:grid-cols-2">
            {services.map((s) => (
              <Card key={s.title} className="p-6">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/15">
                  <s.icon className="h-6 w-6 text-[var(--brand-green-deep)]" aria-hidden="true" />
                </span>
                <h2 className="mt-4 text-xl font-semibold text-foreground">{s.title}</h2>
                <p className="mt-2 text-muted-foreground">{s.body}</p>
              </Card>
            ))}
          </div>
        </section>

        <section className="bg-secondary py-16 sm:py-20">
          <div className="mx-auto max-w-4xl px-4">
            <h2 className="text-3xl font-bold text-foreground">What we help with</h2>
            <ul className="mt-8 grid gap-3 sm:grid-cols-2">
              {[
                "Understanding Original Medicare (Parts A & B)",
                "Medicare Advantage (Part C) options",
                "Prescription drug coverage (Part D)",
                "Medicare Supplement (Medigap) plans",
                "Initial Enrollment Period timing",
                "Working past 65 and employer coverage",
                "Avoiding late enrollment penalties",
                "Coordinating Medicare with other coverage",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 rounded-lg bg-background p-4">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent">
                    <Check className="h-4 w-4 text-accent-foreground" />
                  </span>
                  <span className="text-foreground">{item}</span>
                </li>
              ))}
            </ul>

            <div className="mt-10 flex justify-center">
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