import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppHeader } from "@/components/app/app-header";
import { AppFooter } from "@/components/app/app-footer";
import { PageTransition } from "@/components/app/page-transition";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CheckCircle2, Sparkles, ArrowRight } from "lucide-react";
import { INSURANCE_NICHES } from "@/lib/builder-storage";

export const Route = createFileRoute("/inquiry")({
  component: InquiryPage,
  head: () => ({
    meta: [
      { title: "Have us build it for you — Lumen.pages" },
      {
        name: "description",
        content:
          "Submit a quick inquiry and our team will design a modern lead-generation website for your insurance business.",
      },
      { property: "og:title", content: "Have us build your insurance website — Lumen.pages" },
      {
        property: "og:description",
        content:
          "Tell us a bit about your business and we'll build a polished, mobile-friendly website tailored to your niche.",
      },
    ],
  }),
});

const STORAGE_KEY = "lp_inquiry_submissions";

type ContactPref = "call" | "text" | "email";
type BrandingState = "yes" | "no" | "partial";

interface InquiryForm {
  fullName: string;
  businessName: string;
  email: string;
  phone: string;
  niche: string;
  states: string;
  hasBranding: BrandingState;
  goals: string;
  contactMethod: ContactPref;
  notes: string;
}

const DEFAULT_FORM: InquiryForm = {
  fullName: "",
  businessName: "",
  email: "",
  phone: "",
  niche: "Medicare",
  states: "",
  hasBranding: "no",
  goals: "",
  contactMethod: "email",
  notes: "",
};

function InquiryPage() {
  const [form, setForm] = useState<InquiryForm>(DEFAULT_FORM);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  function update<K extends keyof InquiryForm>(k: K, v: InquiryForm[K]) {
    setForm((p) => ({ ...p, [k]: v }));
  }

  function validate(f: InquiryForm) {
    const e: Record<string, string> = {};
    if (!f.fullName.trim()) e.fullName = "Required";
    if (!f.businessName.trim()) e.businessName = "Required";
    if (!/^\S+@\S+\.\S+$/.test(f.email.trim())) e.email = "Enter a valid email";
    if (!f.phone.trim()) e.phone = "Required";
    if (!f.niche.trim()) e.niche = "Required";
    if (!f.states.trim()) e.states = "List at least one state";
    if (!f.goals.trim()) e.goals = "Tell us a bit about your goals";
    return e;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate(form);
    setErrors(errs);
    if (Object.keys(errs).length) {
      const first = document.querySelector(`[data-field="${Object.keys(errs)[0]}"]`);
      first?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    try {
      if (typeof window !== "undefined") {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        const list = raw ? (JSON.parse(raw) as unknown[]) : [];
        list.push({ ...form, submittedAt: new Date().toISOString() });
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
      }
    } catch {
      // ignore quota errors — local-only persistence
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
          <div className="mx-auto max-w-2xl px-5 py-10 sm:py-14">
            <div className="mb-8">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-[var(--surface-sand)]/70 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-foreground/70">
                <Sparkles className="h-3 w-3" />
                Have us build it for you
              </span>
              <h1 className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                Tell us about your business
              </h1>
              <p className="mt-3 text-muted-foreground">
                Share a few details and our team will design a polished, mobile-friendly
                website for your insurance practice. It only takes 5 minutes.
              </p>
            </div>

            {submitted ? (
              <Card className="rounded-3xl border-border/60 bg-background p-8 text-center shadow-[var(--shadow-md)] sm:p-12">
                <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[var(--surface-sand)] text-[var(--surface-mocha)]">
                  <CheckCircle2 className="h-7 w-7" />
                </span>
                <h2 className="mt-5 text-2xl font-semibold tracking-tight text-foreground">
                  Thanks — we got your inquiry
                </h2>
                <p className="mx-auto mt-3 max-w-md text-muted-foreground">
                  We'll reach out within 1 business day to start building your website.
                </p>
                <Button
                  type="button"
                  className="mt-7 rounded-full bg-[var(--surface-mocha)] text-[var(--surface-cream)] hover:bg-[var(--surface-espresso)]"
                  onClick={() => {
                    setSubmitted(false);
                    setForm(DEFAULT_FORM);
                  }}
                >
                  Submit another
                </Button>
              </Card>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                <Card className="rounded-2xl border-border/60 bg-background p-6 shadow-[var(--shadow-sm)] sm:p-7">
                  <h2 className="text-base font-semibold text-foreground">Your details</h2>
                  <div className="mt-5 grid gap-5 sm:grid-cols-2">
                    <Field label="Full name" id="fullName" error={errors.fullName}>
                      <Input id="fullName" value={form.fullName} onChange={(e) => update("fullName", e.target.value)} maxLength={80} />
                    </Field>
                    <Field label="Business name" id="businessName" error={errors.businessName}>
                      <Input id="businessName" value={form.businessName} onChange={(e) => update("businessName", e.target.value)} maxLength={80} />
                    </Field>
                    <Field label="Email" id="email" error={errors.email}>
                      <Input id="email" type="email" value={form.email} onChange={(e) => update("email", e.target.value)} maxLength={120} />
                    </Field>
                    <Field label="Phone number" id="phone" error={errors.phone}>
                      <Input id="phone" type="tel" value={form.phone} onChange={(e) => update("phone", e.target.value)} maxLength={30} />
                    </Field>
                  </div>
                </Card>

                <Card className="rounded-2xl border-border/60 bg-background p-6 shadow-[var(--shadow-sm)] sm:p-7">
                  <h2 className="text-base font-semibold text-foreground">About your website</h2>
                  <div className="mt-5 space-y-5">
                    <Field label="Insurance niche" id="niche" error={errors.niche}>
                      <Select value={form.niche} onValueChange={(v) => update("niche", v)}>
                        <SelectTrigger id="niche" className="w-full">
                          <SelectValue placeholder="Select your niche" />
                        </SelectTrigger>
                        <SelectContent>
                          {INSURANCE_NICHES.map((n) => (
                            <SelectItem key={n} value={n}>
                              {n}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </Field>
                    <Field label="States you serve" id="states" error={errors.states}>
                      <Input
                        id="states"
                        value={form.states}
                        onChange={(e) => update("states", e.target.value)}
                        placeholder="e.g. TX, FL, CA"
                        maxLength={120}
                      />
                    </Field>
                    <div data-field="hasBranding" className="space-y-2">
                      <Label>Do you already have branding / a logo?</Label>
                      <RadioGroup
                        value={form.hasBranding}
                        onValueChange={(v) => update("hasBranding", v as BrandingState)}
                        className="grid gap-3 sm:grid-cols-3"
                      >
                        {([
                          { v: "yes", label: "Yes, I have it" },
                          { v: "partial", label: "Partial" },
                          { v: "no", label: "Not yet" },
                        ] as const).map((opt) => {
                          const id = `branding-${opt.v}`;
                          const selected = form.hasBranding === opt.v;
                          return (
                            <Label
                              key={opt.v}
                              htmlFor={id}
                              className={`cursor-pointer rounded-xl border p-4 transition-all ${
                                selected
                                  ? "border-[var(--surface-mocha)] bg-[var(--surface-sand)]"
                                  : "border-border bg-background hover:border-foreground/30"
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <RadioGroupItem id={id} value={opt.v} />
                                <span className="text-sm font-medium text-foreground">
                                  {opt.label}
                                </span>
                              </div>
                            </Label>
                          );
                        })}
                      </RadioGroup>
                    </div>
                    <Field label="What do you want from your website?" id="goals" error={errors.goals}>
                      <Textarea
                        id="goals"
                        rows={4}
                        value={form.goals}
                        onChange={(e) => update("goals", e.target.value)}
                        maxLength={800}
                        placeholder="A short description of what you want — sections, tone, key audience, leads vs branding, etc."
                      />
                    </Field>
                    <div data-field="contactMethod" className="space-y-2">
                      <Label>Preferred contact method</Label>
                      <RadioGroup
                        value={form.contactMethod}
                        onValueChange={(v) => update("contactMethod", v as ContactPref)}
                        className="grid gap-3 sm:grid-cols-3"
                      >
                        {(["call", "text", "email"] as const).map((opt) => {
                          const id = `contact-${opt}`;
                          const selected = form.contactMethod === opt;
                          return (
                            <Label
                              key={opt}
                              htmlFor={id}
                              className={`cursor-pointer rounded-xl border p-4 capitalize transition-all ${
                                selected
                                  ? "border-[var(--surface-mocha)] bg-[var(--surface-sand)]"
                                  : "border-border bg-background hover:border-foreground/30"
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <RadioGroupItem id={id} value={opt} />
                                <span className="text-sm font-medium text-foreground">{opt}</span>
                              </div>
                            </Label>
                          );
                        })}
                      </RadioGroup>
                    </div>
                    <Field label="Optional notes" id="notes">
                      <Textarea
                        id="notes"
                        rows={3}
                        value={form.notes}
                        onChange={(e) => update("notes", e.target.value)}
                        maxLength={500}
                        placeholder="Anything else we should know?"
                      />
                    </Field>
                  </div>
                </Card>

                <div className="flex justify-end">
                  <Button
                    type="submit"
                    size="lg"
                    className="rounded-full bg-[var(--surface-mocha)] px-7 text-base font-semibold text-[var(--surface-cream)] shadow-[var(--shadow-md)] hover:bg-[var(--surface-espresso)]"
                  >
                    Submit Inquiry
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </div>
              </form>
            )}
          </div>
        </main>
      </PageTransition>
      <AppFooter />
    </div>
  );
}

function Field({
  label,
  id,
  error,
  children,
}: {
  label: string;
  id: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div data-field={id} className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      {children}
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}