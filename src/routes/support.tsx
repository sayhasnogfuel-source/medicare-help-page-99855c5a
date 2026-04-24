import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { AppHeader } from "@/components/app/app-header";
import { AppFooter } from "@/components/app/app-footer";
import { PageTransition } from "@/components/app/page-transition";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  CheckCircle2,
  LifeBuoy,
  CreditCard,
  Wrench,
  AlertCircle,
  UserCog,
  Globe,
  HelpCircle,
  ArrowRight,
} from "lucide-react";

export const Route = createFileRoute("/support")({
  component: SupportPage,
  head: () => ({
    meta: [
      { title: "Support — Diploofly" },
      {
        name: "description",
        content:
          "Get help with your Diploofly account, billing, builder, or live website. Our support team is here to help.",
      },
      { property: "og:title", content: "Support — Diploofly" },
      {
        property: "og:description",
        content:
          "Report a problem, ask a question, or get billing and technical help.",
      },
    ],
  }),
});

const STORAGE_KEY = "lp_support_tickets";

type IssueType =
  | "billing"
  | "technical"
  | "website"
  | "account"
  | "question"
  | "other";

const ISSUE_TYPES: { value: IssueType; label: string }[] = [
  { value: "billing", label: "Billing help" },
  { value: "technical", label: "Technical support" },
  { value: "website", label: "Website issue" },
  { value: "account", label: "Account support" },
  { value: "question", label: "General question" },
  { value: "other", label: "Something else" },
];

const TOPICS = [
  { icon: AlertCircle, label: "Report a problem" },
  { icon: HelpCircle, label: "Ask a question" },
  { icon: CreditCard, label: "Billing help" },
  { icon: Wrench, label: "Technical support" },
  { icon: Globe, label: "Website issue support" },
  { icon: UserCog, label: "Account support" },
];

const FAQ = [
  {
    q: "How do I publish my website?",
    a: "Open the dashboard, add a payment method, and choose a plan. Once your subscription is active, the Publish button on your workspace will go live.",
  },
  {
    q: "What happens when my trial ends?",
    a: "You can keep editing in the builder, but your site won't go live until you subscribe. Existing live sites stay up only while a subscription is active.",
  },
  {
    q: "My payment failed — what now?",
    a: "Head to Billing and update your card. As soon as a fresh card is on file, your subscription is reactivated and any suspended site is restored.",
  },
  {
    q: "How do credits work?",
    a: "Credits are spent only on AI actions like generating a site, regenerating a section, or major redesigns. Viewing, navigating, and small text edits are always free.",
  },
  {
    q: "Can I switch insurance niches later?",
    a: "Yes. Open the builder, change the niche, and ask the AI to refresh the copy. Your branding and contact details stay intact.",
  },
  {
    q: "Do you offer done-for-you websites?",
    a: "Yes — that's a separate flow. Submit a Done-For-You inquiry and our team will design and launch your site for you.",
  },
];

interface TicketForm {
  fullName: string;
  email: string;
  issueType: IssueType;
  message: string;
}

const DEFAULT_FORM: TicketForm = {
  fullName: "",
  email: "",
  issueType: "question",
  message: "",
};

function SupportPage() {
  const [form, setForm] = useState<TicketForm>(DEFAULT_FORM);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  function update<K extends keyof TicketForm>(k: K, v: TicketForm[K]) {
    setForm((p) => ({ ...p, [k]: v }));
  }

  function validate(f: TicketForm) {
    const e: Record<string, string> = {};
    if (!f.fullName.trim()) e.fullName = "Required";
    if (!/^\S+@\S+\.\S+$/.test(f.email.trim())) e.email = "Enter a valid email";
    if (!f.message.trim()) e.message = "Tell us a bit more so we can help";
    return e;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate(form);
    setErrors(errs);
    if (Object.keys(errs).length) return;
    try {
      if (typeof window !== "undefined") {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        const list = raw ? (JSON.parse(raw) as unknown[]) : [];
        list.push({ ...form, submittedAt: new Date().toISOString() });
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
      }
    } catch {
      // ignore
    }
    setSubmitted(true);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <AppHeader />
      <PageTransition>
        <main className="flex-1">
          <div className="mx-auto max-w-3xl px-5 py-10 sm:py-14">
            <div className="mb-8 text-center">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-[var(--surface-sand)]/70 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-foreground/70">
                <LifeBuoy className="h-3 w-3" />
                Support center
              </span>
              <h1 className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                We're here to help
              </h1>
              <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
                Need help? Our support team is here if you run into any issues with your
                website, billing, or account.
              </p>
              <p className="mx-auto mt-2 max-w-xl text-sm text-muted-foreground">
                Looking to have us build your site for you?{" "}
                <Link
                  to="/inquiry"
                  className="font-medium text-foreground underline underline-offset-4 hover:text-[var(--surface-mocha)]"
                >
                  Submit a Done-For-You inquiry instead.
                </Link>
              </p>
            </div>

            {/* Topics */}
            <div className="mb-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {TOPICS.map((t) => (
                <div
                  key={t.label}
                  className="flex items-center gap-3 rounded-2xl border border-border/60 bg-background px-4 py-3 shadow-[var(--shadow-xs)]"
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--surface-sand)] text-[var(--surface-mocha)]">
                    <t.icon className="h-4 w-4" />
                  </span>
                  <span className="text-sm font-medium text-foreground">{t.label}</span>
                </div>
              ))}
            </div>

            {submitted ? (
              <Card className="rounded-3xl border-border/60 bg-background p-8 text-center shadow-[var(--shadow-md)] sm:p-12">
                <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[var(--surface-sand)] text-[var(--surface-mocha)]">
                  <CheckCircle2 className="h-7 w-7" />
                </span>
                <h2 className="mt-5 text-2xl font-semibold tracking-tight text-foreground">
                  Got it — your request is in
                </h2>
                <p className="mx-auto mt-3 max-w-md text-muted-foreground">
                  Our team will get back to you within 1 business day at{" "}
                  <span className="font-medium text-foreground">{form.email}</span>.
                </p>
                <Button
                  type="button"
                  className="mt-7 rounded-full bg-[var(--surface-mocha)] text-[var(--surface-cream)] hover:bg-[var(--surface-espresso)]"
                  onClick={() => {
                    setSubmitted(false);
                    setForm(DEFAULT_FORM);
                  }}
                >
                  Submit another request
                </Button>
              </Card>
            ) : (
              <form onSubmit={handleSubmit} noValidate>
                <Card className="rounded-2xl border-border/60 bg-background p-6 shadow-[var(--shadow-sm)] sm:p-7">
                  <h2 className="text-base font-semibold text-foreground">
                    Contact support
                  </h2>
                  <div className="mt-5 grid gap-5 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full name</Label>
                      <Input
                        id="fullName"
                        value={form.fullName}
                        onChange={(e) => update("fullName", e.target.value)}
                        maxLength={80}
                      />
                      {errors.fullName && (
                        <p className="text-sm text-destructive">{errors.fullName}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={form.email}
                        onChange={(e) => update("email", e.target.value)}
                        maxLength={120}
                      />
                      {errors.email && (
                        <p className="text-sm text-destructive">{errors.email}</p>
                      )}
                    </div>
                    <div className="space-y-2 sm:col-span-2">
                      <Label htmlFor="issueType">Issue type</Label>
                      <Select
                        value={form.issueType}
                        onValueChange={(v) => update("issueType", v as IssueType)}
                      >
                        <SelectTrigger id="issueType" className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {ISSUE_TYPES.map((it) => (
                            <SelectItem key={it.value} value={it.value}>
                              {it.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2 sm:col-span-2">
                      <Label htmlFor="message">Short message</Label>
                      <Textarea
                        id="message"
                        rows={5}
                        value={form.message}
                        onChange={(e) => update("message", e.target.value)}
                        maxLength={1000}
                        placeholder="Briefly describe the issue or question — include any error messages or what you were trying to do."
                      />
                      {errors.message && (
                        <p className="text-sm text-destructive">{errors.message}</p>
                      )}
                    </div>
                  </div>
                  <div className="mt-6 flex justify-end">
                    <Button
                      type="submit"
                      size="lg"
                      className="rounded-full bg-[var(--surface-mocha)] px-7 text-base font-semibold text-[var(--surface-cream)] hover:bg-[var(--surface-espresso)]"
                    >
                      Send to support
                      <ArrowRight className="ml-1 h-4 w-4" />
                    </Button>
                  </div>
                </Card>
              </form>
            )}

            {/* FAQ */}
            <div className="mt-12">
              <h2 className="text-xl font-semibold tracking-tight text-foreground">
                Frequently asked questions
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Quick answers to the most common builder, billing, and account questions.
              </p>
              <Accordion type="single" collapsible className="mt-4">
                {FAQ.map((f, i) => (
                  <AccordionItem key={i} value={`faq-${i}`}>
                    <AccordionTrigger className="text-left text-sm font-medium text-foreground">
                      {f.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-sm text-muted-foreground">
                      {f.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </main>
      </PageTransition>
      <AppFooter />
    </div>
  );
}