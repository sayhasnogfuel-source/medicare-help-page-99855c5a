import { useEffect, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppHeader } from "@/components/app/app-header";
import { AppFooter } from "@/components/app/app-footer";
import { PageTransition } from "@/components/app/page-transition";
import { usePageTransition } from "@/hooks/use-page-transition";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card } from "@/components/ui/card";
import { Upload, ArrowRight, ImageIcon, X, Sparkles, Send } from "lucide-react";
import {
  DEFAULT_BUILDER,
  INSURANCE_NICHES,
  loadBuilder,
  saveBuilder,
  type BuilderData,
  type ContactMethod,
} from "@/lib/builder-storage";

export const Route = createFileRoute("/builder")({
  component: BuilderPage,
  head: () => ({
    meta: [
      { title: "Page Builder — Lumen.pages" },
      { name: "description", content: "Enter your business details, upload your branding, and generate your insurance landing page." },
    ],
  }),
});

const MAX_IMAGE_BYTES = 1.5 * 1024 * 1024; // 1.5 MB to keep localStorage happy

const FREESTYLE_SUGGESTIONS = [
  "Modern and clean",
  "Luxury and warm",
  "Add testimonials",
  "Add services section",
  "Add booking form",
  "Family-oriented feel",
  "Focus on Medicare clients turning 65",
  "Use my headshot prominently",
] as const;

function BuilderPage() {
  const { transitionTo } = usePageTransition();
  const [data, setData] = useState<BuilderData>(DEFAULT_BUILDER);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const existing = loadBuilder();
    if (existing) setData(existing);
    setHydrated(true);
  }, []);

  function update<K extends keyof BuilderData>(key: K, value: BuilderData[K]) {
    setData((prev) => ({ ...prev, [key]: value }));
  }

  function validate(d: BuilderData) {
    const errs: Record<string, string> = {};
    if (!d.businessName.trim()) errs.businessName = "Required";
    if (!d.agentName.trim()) errs.agentName = "Required";
    if (!d.phone.trim()) errs.phone = "Required";
    if (!/^\S+@\S+\.\S+$/.test(d.email.trim())) errs.email = "Enter a valid email";
    if (!d.city.trim()) errs.city = "Required";
    if (!d.state.trim()) errs.state = "Required";
    if (!d.businessType.trim()) errs.businessType = "Required";
    if (!d.headline.trim()) errs.headline = "Required";
    if (!d.subheadline.trim()) errs.subheadline = "Required";
    if (!d.ctaText.trim()) errs.ctaText = "Required";
    return errs;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate(data);
    setErrors(errs);
    if (Object.keys(errs).length) {
      const first = document.querySelector(`[data-field="${Object.keys(errs)[0]}"]`);
      first?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    saveBuilder(data);
    transitionTo({ to: "/preview" });
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <AppHeader />
      <PageTransition>
      <main className="flex-1">
        <div className="mx-auto max-w-3xl px-5 py-10 sm:py-14">
          <div className="mb-10">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Build your website
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              Your business, your way
            </h1>
            <p className="mt-3 text-muted-foreground">
              Start with the essentials, then describe how you want your site to look and feel — we'll handle the rest.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-10" noValidate>
            {/* PART 1 — Required business information */}
            <PartHeader
              step="Part 1"
              title="Required business information"
              description="The core details we need to build your page."
            />

            <Section title="Your business">
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Business name" id="businessName" error={errors.businessName}>
                  <Input id="businessName" value={data.businessName} onChange={(e) => update("businessName", e.target.value)} maxLength={80} />
                </Field>
                <Field label="Owner or agent name" id="agentName" error={errors.agentName}>
                  <Input id="agentName" value={data.agentName} onChange={(e) => update("agentName", e.target.value)} maxLength={80} />
                </Field>
                <Field label="Phone number" id="phone" error={errors.phone}>
                  <Input id="phone" type="tel" value={data.phone} onChange={(e) => update("phone", e.target.value)} maxLength={30} />
                </Field>
                <Field label="Email" id="email" error={errors.email}>
                  <Input id="email" type="email" value={data.email} onChange={(e) => update("email", e.target.value)} maxLength={120} />
                </Field>
                <Field label="City" id="city" error={errors.city}>
                  <Input id="city" value={data.city} onChange={(e) => update("city", e.target.value)} maxLength={60} />
                </Field>
                <Field label="State" id="state" error={errors.state}>
                  <Input id="state" value={data.state} onChange={(e) => update("state", e.target.value)} maxLength={40} />
                </Field>
                <div className="sm:col-span-2">
                  <Field
                    label="Business type / niche"
                    id="businessType"
                    error={errors.businessType}
                  >
                    <Input
                      id="businessType"
                      value={data.businessType}
                      onChange={(e) => update("businessType", e.target.value)}
                      placeholder="e.g. Medicare insurance agency, ACA brokerage, financial advisor"
                      maxLength={120}
                    />
                  </Field>
                </div>
              </div>
            </Section>

            <Section title="Insurance niche">
              <p className="text-sm text-muted-foreground">
                Pick the niche that best matches your business. We'll tailor the page copy and benefits to it.
              </p>
              <div className="grid gap-2.5 sm:grid-cols-3">
                {INSURANCE_NICHES.map((n) => {
                  const selected = data.insuranceType === n;
                  return (
                    <button
                      key={n}
                      type="button"
                      onClick={() => update("insuranceType", n)}
                      className={`rounded-xl border px-4 py-3 text-sm font-medium transition-all ${
                        selected
                          ? "border-[var(--surface-mocha)] bg-[var(--surface-sand)] text-foreground shadow-[var(--shadow-xs)]"
                          : "border-border bg-background text-foreground/75 hover:border-foreground/30 hover:text-foreground"
                      }`}
                    >
                      {n}
                    </button>
                  );
                })}
              </div>
            </Section>

            <Section title="Branding">
              <div className="grid gap-5 sm:grid-cols-2">
                <ImageUpload
                  label="Business logo"
                  value={data.logoDataUrl}
                  onChange={(v) => update("logoDataUrl", v)}
                />
                <ImageUpload
                  label="Headshot (optional but recommended)"
                  value={data.headshotDataUrl}
                  onChange={(v) => update("headshotDataUrl", v)}
                />
              </div>
            </Section>

            <Section title="Page copy">
              <Field label="Main headline" id="headline" error={errors.headline}>
                <Input id="headline" value={data.headline} onChange={(e) => update("headline", e.target.value)} maxLength={120} />
              </Field>
              <Field label="Subheadline" id="subheadline" error={errors.subheadline}>
                <Textarea id="subheadline" rows={3} value={data.subheadline} onChange={(e) => update("subheadline", e.target.value)} maxLength={240} />
              </Field>
              <Field label="Main call-to-action text" id="ctaText" error={errors.ctaText}>
                <Input id="ctaText" value={data.ctaText} onChange={(e) => update("ctaText", e.target.value)} maxLength={40} />
              </Field>
            </Section>

            <Section title="Preferred contact method">
              <RadioCardGroup
                value={data.contactMethod}
                onChange={(v) => update("contactMethod", v as ContactMethod)}
                options={[
                  { value: "call", label: "Call", description: "" },
                  { value: "text", label: "Text", description: "" },
                  { value: "email", label: "Email", description: "" },
                ]}
                columns={3}
              />
            </Section>

            {/* PART 2 — Freestyle AI chat */}
            <div className="pt-2">
              <PartHeader
                step="Part 2"
                title="Tell our AI how to build it"
                description="Describe the look, feel, and sections you want. Be as specific as you'd like."
              />
            </div>

            <FreestyleChat
              value={data.freestyleInstructions}
              onChange={(v) => update("freestyleInstructions", v)}
            />

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-muted-foreground">
                {hydrated ? "Your draft is saved automatically when you generate." : ""}
              </p>
              <Button
                type="submit"
                size="lg"
                className="rounded-full bg-[var(--surface-mocha)] px-7 text-base font-semibold text-[var(--surface-cream)] shadow-[var(--shadow-md)] hover:bg-[var(--surface-espresso)]"
              >
                Generate My Website
                <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          </form>
        </div>
      </main>
      </PageTransition>
      <AppFooter />
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card className="rounded-2xl border-border/60 bg-background p-6 shadow-[var(--shadow-sm)] sm:p-7">
      <h2 className="text-base font-semibold text-foreground">{title}</h2>
      <div className="mt-5 space-y-5">{children}</div>
    </Card>
  );
}

function PartHeader({
  step,
  title,
  description,
}: {
  step: string;
  title: string;
  description: string;
}) {
  return (
    <div className="space-y-1.5">
      <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-[var(--surface-sand)]/70 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-foreground/70">
        {step}
      </span>
      <h2 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
        {title}
      </h2>
      <p className="text-sm text-muted-foreground sm:text-base">{description}</p>
    </div>
  );
}

function FreestyleChat({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  function appendSuggestion(s: string) {
    const next = value.trim().length === 0 ? s : `${value.trim()}\n• ${s}`;
    onChange(next);
  }

  return (
    <Card className="overflow-hidden rounded-3xl border-border/60 bg-background p-0 shadow-[var(--shadow-md)]">
      {/* Assistant intro bubble */}
      <div className="flex items-start gap-3 border-b border-border/60 bg-[var(--surface-sand)]/50 p-5 sm:p-6">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--surface-mocha)] text-[var(--surface-cream)] shadow-[var(--shadow-xs)]">
          <Sparkles className="h-4 w-4" />
        </span>
        <div className="flex-1">
          <p className="text-sm font-semibold text-foreground">AI website assistant</p>
          <p className="mt-1 text-sm leading-relaxed text-foreground/75">
            Describe how your site should feel, what sections to include, and anything that
            makes your business unique. I'll combine this with your business details to build
            your page.
          </p>
        </div>
      </div>

      {/* Chat input */}
      <div className="p-5 sm:p-6">
        <div className="rounded-2xl border border-border bg-[var(--surface-cream)]/60 focus-within:border-foreground/30 focus-within:bg-background transition-colors">
          <Textarea
            id="freestyle"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Describe how you want your website to look, feel, and what sections you want included..."
            rows={5}
            maxLength={1200}
            className="min-h-[140px] resize-none border-0 bg-transparent p-4 text-base shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
          />
          <div className="flex items-center justify-between gap-3 border-t border-border/60 px-4 py-2.5">
            <p className="text-[11px] text-muted-foreground">
              {value.length}/1200 · Optional, but the more you share the better
            </p>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--surface-sand)] px-2.5 py-1 text-[11px] font-medium text-foreground/70">
              <Send className="h-3 w-3" />
              Saved with your website
            </span>
          </div>
        </div>

        {/* Suggestion chips */}
        <div className="mt-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            Try a suggestion
          </p>
          <div className="mt-2.5 flex flex-wrap gap-2">
            {FREESTYLE_SUGGESTIONS.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => appendSuggestion(s)}
                className="rounded-full border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground/80 transition-colors hover:border-foreground/30 hover:bg-[var(--surface-sand)]/60 hover:text-foreground"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>
    </Card>
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

function RadioCardGroup({
  value,
  onChange,
  options,
  columns = 2,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string; description?: string }[];
  columns?: 2 | 3;
}) {
  return (
    <RadioGroup
      value={value}
      onValueChange={onChange}
      className={columns === 3 ? "grid gap-3 sm:grid-cols-3" : "grid gap-3 sm:grid-cols-2"}
    >
      {options.map((opt) => {
        const id = `radio-${opt.value}`;
        const selected = value === opt.value;
        return (
          <Label
            key={opt.value}
            htmlFor={id}
            className={`group cursor-pointer rounded-xl border p-4 transition-all ${
              selected
                ? "border-[var(--surface-mocha)] bg-[var(--surface-sand)] shadow-[var(--shadow-xs)]"
                : "border-border bg-background hover:border-foreground/30"
            }`}
          >
            <div className="flex items-start gap-3">
              <RadioGroupItem id={id} value={opt.value} className="mt-0.5" />
              <div>
                <p className="text-sm font-medium text-foreground">{opt.label}</p>
                {opt.description && (
                  <p className="mt-0.5 text-xs text-muted-foreground">{opt.description}</p>
                )}
              </div>
            </div>
          </Label>
        );
      })}
    </RadioGroup>
  );
}

function ImageUpload({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string | null;
  onChange: (v: string | null) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);

  function handleFile(file: File | null) {
    setError(null);
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Please choose an image file");
      return;
    }
    if (file.size > MAX_IMAGE_BYTES) {
      setError("Image is too large (max 1.5 MB)");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === "string" ? reader.result : null;
      onChange(result);
    };
    reader.readAsDataURL(file);
  }

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div
        className={`relative flex aspect-[4/3] w-full items-center justify-center overflow-hidden rounded-xl border border-dashed ${
          value ? "border-border bg-background" : "border-border bg-[var(--surface-sand)]/50 hover:bg-[var(--surface-sand)]"
        }`}
      >
        {value ? (
          <>
            <img src={value} alt={label} className="h-full w-full object-contain" />
            <button
              type="button"
              onClick={() => onChange(null)}
              className="absolute right-2 top-2 inline-flex h-8 w-8 items-center justify-center rounded-full bg-background/90 text-foreground shadow-[var(--shadow-sm)] hover:bg-background"
              aria-label={`Remove ${label}`}
            >
              <X className="h-4 w-4" />
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="flex h-full w-full flex-col items-center justify-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-background shadow-[var(--shadow-xs)]">
              <ImageIcon className="h-4 w-4" />
            </span>
            <span className="text-sm font-medium">Click to upload</span>
            <span className="text-xs">PNG or JPG · up to 1.5 MB</span>
          </button>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
        />
      </div>
      {value && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="rounded-full"
          onClick={() => inputRef.current?.click()}
        >
          <Upload className="mr-1 h-3.5 w-3.5" />
          Replace
        </Button>
      )}
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}