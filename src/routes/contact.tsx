import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Card } from "@/components/ui/card";
import { RequestForm } from "@/components/request-form";
import { Phone, Mail, MapPin, Clock } from "lucide-react";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Request Medicare Help — 901 Healthcare" },
      {
        name: "description",
        content:
          "Request friendly Medicare help from 901 Healthcare. Tell us about your situation and we'll reach out to guide your next steps.",
      },
      { property: "og:title", content: "Request Medicare Help — 901 Healthcare" },
      {
        property: "og:description",
        content:
          "Connect with 901 Healthcare for personalized Medicare guidance.",
      },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main>
        <section className="bg-[var(--brand-navy)] py-12 text-white sm:py-16">
          <div className="mx-auto max-w-4xl px-4 text-center">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              Request Medicare Help
            </h1>
            <p className="mt-4 text-lg text-white/85">
              Tell us a little about yourself and a member of 901 Healthcare will reach out
              to help you with your next steps.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
          <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
            <Card className="p-6 sm:p-8">
              <RequestForm />
            </Card>

            <aside className="space-y-4">
              <Card className="p-6">
                <h2 className="text-lg font-semibold text-foreground">Get in touch</h2>
                <ul className="mt-4 space-y-4 text-sm">
                  <ContactRow icon={Phone} label="Phone" value="(901) 555-0199" />
                  <ContactRow icon={Mail} label="Email" value="hello@901healthcare.com" />
                  <ContactRow icon={MapPin} label="Service area" value="Memphis, TN & surrounding" />
                  <ContactRow icon={Clock} label="Hours" value="Mon–Fri, 9am–6pm CT" />
                </ul>
              </Card>
              <Card className="bg-[var(--brand-navy)] p-6 text-white">
                <h2 className="text-lg font-semibold">No pressure. Ever.</h2>
                <p className="mt-2 text-sm text-white/85">
                  We're here to help you understand your options — not to push a sale.
                  Reach out whenever you're ready.
                </p>
              </Card>
            </aside>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}

function ContactRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <li className="flex items-start gap-3">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent/15">
        <Icon className="h-4 w-4 text-[var(--brand-green-deep)]" />
      </span>
      <div>
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
        <p className="text-foreground">{value}</p>
      </div>
    </li>
  );
}