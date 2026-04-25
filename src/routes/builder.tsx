import { useEffect, useRef, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
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
import {
  Upload,
  ArrowRight,
  ImageIcon,
  X,
  Lock,
  Globe,
  AlertCircle,
} from "lucide-react";
import {
  DEFAULT_BUILDER,
  INSURANCE_NICHES,
  INSURANCE_THEMES,
  loadBuilder,
  saveBuilder,
  type BuilderData,
  type ContactMethod,
} from "@/lib/builder-storage";
import type { InsuranceTheme } from "@/lib/builder-storage";
import { useUserCredits, ACTION_COSTS } from "@/lib/user-credits";
import { CreditsBadge } from "@/components/app/credits-badge";
import { toast } from "sonner";
import { AuthGuard } from "@/components/app/auth-guard";
import { ThemeMini } from "@/components/themes/registry";

export const Route = createFileRoute("/builder")({
  component: GuardedBuilderPage,
  head: () => ({
    meta: [
      { title: "Page Builder — Diploo" },
      { name: "description", content: "Enter your business details, upload your branding, and generate your insurance landing page." },
    ],
  }),
});

function GuardedBuilderPage() {
  return (
    <AuthGuard>
      <BuilderPage />
    </AuthGuard>
  );
}

const MAX_IMAGE_BYTES = 1.5 * 1024 * 1024; // 1.5 MB to keep localStorage happy

function BuilderPage() {
  const { transitionTo } = usePageTransition();
  const credits = useUserCredits();
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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (credits.isEmpty) {
      toast.error("You're out of credits", {
        description: "Upgrade to keep generating with AI.",
      });
      transitionTo({ to: "/pricing" });
      return;
    }
    if (!credits.canAfford("generate")) {
      toast.error(`Generating costs ${ACTION_COSTS.generate} credits`, {
        description: `You have ${credits.credits} left. Upgrade to continue.`,
      });
      transitionTo({ to: "/pricing" });
      return;
    }
    const errs = validate(data);
    setErrors(errs);
    if (Object.keys(errs).length) {
      const first = document.querySelector(`[data-field="${Object.keys(errs)[0]}"]`);
      first?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    const charged = await credits.charge("generate");
    if (!charged) {
      transitionTo({ to: "/pricing" });
      return;
    }
    // Reset workspace-stage AI memory so the workspace performs a FRESH,
    // holistic generation tied to the form inputs + chosen theme — not
    // whatever was last generated in a previous session.
    const fresh: BuilderData = {
      ...data,
      freestyleInstructions: "",
      workspaceNotes: "",
      authorNotes: "",
    };
    saveBuilder(fresh);
    toast.success("Website generated", {
      description: `${ACTION_COSTS.generate} credits used. ${credits.credits - ACTION_COSTS.generate} remaining.`,
    });
    transitionTo({ to: "/workspace" });
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <AppHeader />
      <PageTransition>
      <main className="flex-1">
        <div className="mx-auto max-w-3xl px-5 py-10 sm:py-14">
          {/* Dashboard chrome */}
          <Card className="mb-8 flex flex-col gap-4 rounded-2xl border-border/60 bg-background p-5 shadow-[var(--shadow-sm)] sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1.5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                Your dashboard
              </p>
              <CreditsBadge />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-[var(--surface-sand)]/50 px-3 py-1.5 text-xs font-medium text-foreground/75">
                <Globe className="h-3.5 w-3.5" />
                Status: Draft
              </span>
              <Button
                type="button"
                size="sm"
                variant="outline"
                className="rounded-full"
                onClick={() => {
                  saveBuilder(data);
                  toast.success("Saved", { description: "Your draft is up to date." });
                }}
              >
                Save draft
              </Button>
              <Button
                asChild
                type="button"
                size="sm"
                className="rounded-full bg-foreground text-background hover:bg-foreground/90"
              >
                <Link to="/pricing">Upgrade</Link>
              </Button>
            </div>
          </Card>

          {/* Low / empty credit notices */}
          {credits.hydrated && credits.isEmpty && (
            <Card className="mb-8 flex flex-col gap-3 rounded-2xl border-destructive/30 bg-destructive/5 p-5 shadow-[var(--shadow-xs)] sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3">
                <Lock className="mt-0.5 h-5 w-5 text-destructive" />
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    You're out of credits
                  </p>
                  <p className="mt-0.5 text-sm text-muted-foreground">
                    AI generation is locked. Upgrade your plan to keep building.
                  </p>
                </div>
              </div>
              <Button
                asChild
                size="sm"
                className="rounded-full bg-[var(--surface-mocha)] text-[var(--surface-cream)] hover:bg-[var(--surface-espresso)]"
              >
                <Link to="/pricing">Upgrade to continue</Link>
              </Button>
            </Card>
          )}
          {credits.hydrated && credits.isLow && !credits.isEmpty && (
            <Card
              className="mb-8 flex flex-col gap-3 rounded-2xl p-5 shadow-[var(--shadow-xs)] sm:flex-row sm:items-center sm:justify-between"
              style={{
                background: "var(--surface-sand)",
                borderColor: "var(--surface-tan)",
              }}
            >
              <div className="flex items-start gap-3">
                <AlertCircle className="mt-0.5 h-5 w-5 text-[var(--surface-mocha)]" />
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    Only {credits.credits} credits left
                  </p>
                  <p className="mt-0.5 text-sm text-muted-foreground">
                    Upgrade now so you don't get interrupted mid-build.
                  </p>
                </div>
              </div>
              <Button
                asChild
                size="sm"
                variant="outline"
                className="rounded-full"
              >
                <Link to="/pricing">See plans</Link>
              </Button>
            </Card>
          )}

          <div className="mb-10">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Build your website
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              Your business, your way
            </h1>
            <p className="mt-3 text-muted-foreground">
              Tell us about your business — we'll generate your first site instantly. You'll fine-tune the look and copy from the workspace using AI chat.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-10" noValidate>
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

            <Section title="Choose a visual theme">
              <p className="text-sm text-muted-foreground">
                Pick a design direction. Your theme drives layout, typography,
                spacing, button style, and imagery — not just colors. Scroll to
                browse all 15.
              </p>
              <ThemePicker
                themes={INSURANCE_THEMES}
                selectedId={data.themeId}
                onSelect={(id) => update("themeId", id)}
              />
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

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-muted-foreground">
                {hydrated
                  ? credits.isEmpty
                    ? "Generation locked — upgrade to continue."
                    : `Generating uses ${ACTION_COSTS.generate} credits · ${credits.credits} remaining`
                  : ""}
              </p>
              <Button
                type="submit"
                size="lg"
                disabled={credits.hydrated && credits.isEmpty}
                className="rounded-full bg-[var(--surface-mocha)] px-7 text-base font-semibold text-[var(--surface-cream)] shadow-[var(--shadow-md)] hover:bg-[var(--surface-espresso)] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {credits.hydrated && credits.isEmpty ? (
                  <>
                    <Lock className="mr-1 h-4 w-4" />
                    Out of credits
                  </>
                ) : (
                  <>
                    Open Builder Workspace
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </>
                )}
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

function ThemePicker({
  themes,
  selectedId,
  onSelect,
}: {
  themes: readonly InsuranceTheme[];
  selectedId: string;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="-mx-1 overflow-x-auto pb-2">
      <div className="flex gap-3 px-1" style={{ minWidth: "min-content" }}>
        {themes.map((t) => {
          const selected = selectedId === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => onSelect(t.id)}
              aria-pressed={selected}
              className={`group relative flex w-[210px] shrink-0 flex-col overflow-hidden rounded-2xl border p-3 text-left transition-all ${
                selected
                  ? "border-[var(--surface-mocha)] bg-[var(--surface-sand)]/60 shadow-[var(--shadow-md)] ring-2 ring-[var(--surface-mocha)]/30"
                  : "border-border bg-background hover:-translate-y-0.5 hover:border-foreground/30 hover:shadow-[var(--shadow-sm)]"
              }`}
            >
              {(t.signature || t.recommended) && (
                <span
                  className="absolute right-2 top-2 z-10 rounded-full px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider"
                  style={{
                    background: t.signature ? t.palette.accent : "var(--surface-mocha)",
                    color: t.signature ? t.palette.surface : "var(--surface-cream)",
                  }}
                >
                  {t.signature ? "Flagship" : "Recommended"}
                </span>
              )}
              <ThemeThumbnail theme={t} data={data} />
              <p className="mt-2.5 truncate text-[13px] font-semibold text-foreground">{t.name}</p>
              <p className="mt-0.5 line-clamp-1 text-[11px] text-muted-foreground">{t.tagline}</p>
              <p className="mt-1 line-clamp-1 text-[10px] font-medium uppercase tracking-wider text-muted-foreground/70">
                {t.bestFor}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function ThemeThumbnail({ theme: t }: { theme: InsuranceTheme }) {
  const dark = t.layout.heroBackground === "dark-luxury";
  const isCentered = t.layout.hero === "centered" || t.layout.hero === "image-bg";
  const isImageLeft = t.layout.hero === "image-left";
  const radius =
    t.layout.buttonShape === "pill"
      ? "9999px"
      : t.layout.buttonShape === "sharp"
        ? "0"
        : t.layout.buttonShape === "square"
          ? "3px"
          : "8px";
  const cardRadius =
    t.layout.cardRadius === "rounded-none"
      ? "0"
      : t.layout.cardRadius === "rounded-3xl"
        ? "12px"
        : t.layout.cardRadius === "rounded-sm" || t.layout.cardRadius === "rounded-md"
          ? "3px"
          : "6px";
  const headlineH = t.density === "airy" ? 5 : t.density === "dense" ? 3 : 4;
  const bgStyle: React.CSSProperties = dark
    ? { background: `linear-gradient(135deg, ${t.palette.primary} 0%, ${t.palette.contrast || "#000"} 100%)` }
    : t.layout.heroBackground === "warm-gradient"
      ? { background: `linear-gradient(135deg, ${t.palette.surface}, ${t.palette.accent2 || t.palette.accent}33)` }
      : t.layout.heroBackground === "mesh-glow"
        ? { background: `radial-gradient(80% 60% at 30% 20%, ${t.palette.accent}33, transparent 70%), ${t.palette.surface}` }
        : { background: t.palette.surface };
  const fg = dark ? t.palette.surface : t.palette.text;
  const showImage = !isCentered;

  return (
    <div
      className="relative flex h-[110px] w-full flex-col overflow-hidden rounded-lg border border-border/50 p-2"
      style={bgStyle}
    >
      {/* mini header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <span className="h-1.5 w-1.5 rounded-full" style={{ background: t.palette.primary }} />
          <span className="block h-1 w-6 rounded-full" style={{ background: fg, opacity: 0.5 }} />
        </div>
        <span
          className="block h-2 w-6"
          style={{ background: t.palette.accent, borderRadius: radius }}
        />
      </div>
      {/* hero body */}
      <div className={`mt-2 flex flex-1 gap-2 ${isImageLeft ? "flex-row-reverse" : "flex-row"}`}>
        <div className={`flex flex-1 flex-col justify-center gap-1 ${isCentered ? "items-center" : "items-start"}`}>
          {Array.from({ length: headlineH }).map((_, i) => (
            <span
              key={i}
              className="block h-1 rounded-full"
              style={{
                width: `${[80, 65, 55, 70, 45][i % 5]}%`,
                background: fg,
                opacity: i === 0 ? 0.95 : 0.4,
              }}
            />
          ))}
          <span
            className="mt-1 inline-block h-2.5"
            style={{
              width: "38%",
              background:
                t.layout.buttonStyle === "gradient"
                  ? `linear-gradient(90deg, ${t.palette.accent}, ${t.palette.accent2 || t.palette.primary})`
                  : t.layout.buttonStyle === "outline-bold" || t.layout.buttonStyle === "ghost-underline"
                    ? "transparent"
                    : t.palette.primary,
              border:
                t.layout.buttonStyle === "outline-bold" || t.layout.buttonStyle === "ghost-underline"
                  ? `1px solid ${fg}`
                  : "none",
              borderRadius: radius,
              boxShadow: t.layout.buttonStyle === "glow" ? `0 0 8px ${t.palette.accent}` : "none",
            }}
          />
        </div>
        {showImage && (
          <div
            className="shrink-0"
            style={{
              width: "32%",
              background: t.palette.accent2 || t.palette.accent,
              opacity: 0.7,
              borderRadius:
                t.layout.imageRadius === "rounded-full"
                  ? "9999px"
                  : t.layout.imageRadius === "rounded-none"
                    ? "0"
                    : "6px",
              aspectRatio:
                t.layout.imageAspect === "aspect-square"
                  ? "1/1"
                  : t.layout.imageAspect === "aspect-video"
                    ? "16/9"
                    : "3/4",
            }}
          />
        )}
      </div>
      {/* trust strip / footer */}
      <div className="mt-1 flex items-center gap-1">
        {Array.from({ length: t.density === "dense" ? 5 : 3 }).map((_, i) => (
          <span
            key={i}
            className="block h-0.5 flex-1"
            style={{ background: fg, opacity: 0.25, borderRadius: cardRadius }}
          />
        ))}
      </div>
    </div>
  );
}