import { useEffect, useState } from "react";

/**
 * Free-form insurance niche string. We keep the field name `insuranceType`
 * for backward compatibility with previously stored builder drafts, but it
 * now accepts any of the presets in INSURANCE_NICHES (or a custom string).
 */
export type InsuranceType = string;
export type InsuranceNiche = string;

export const INSURANCE_NICHES = [
  "Medicare",
  "ACA",
  "Life",
  "Health",
  "Final Expense",
  "Auto",
  "Home",
  "Commercial",
  "Independent Agency",
  "Other",
] as const;

export type ContactMethod = "call" | "text" | "email";

/**
 * Visual theme directions for insurance agent websites. Each theme guides
 * the AI's design + copy decisions (palette, layout density, tone).
 * The selected theme id is stored on BuilderData.themeId.
 */
export interface InsuranceTheme {
  id: string;
  name: string;
  tagline: string;
  bestFor: string;
  recommended?: boolean;
  /** CSS color tokens (oklch or hex) used for previews and the live page. */
  palette: {
    primary: string;
    accent: string;
    surface: string;
    text: string;
  };
  /** Tone words the AI should pick up. */
  tone: string;
  /** Density: how dense the layout should feel. */
  density: "airy" | "balanced" | "dense";
  /** Mood label shown in UI. */
  mood: string;
  /** Real-world sites this theme is inspired by. The AI should mimic their
   *  layout, typography, and image treatment — not their copy. */
  inspiration: readonly string[];
  /** Typographic personality. Affects font sizing, weight, and tracking
   *  in the generated landing. */
  typography: {
    /** Hero headline scale class (Tailwind). */
    heroHeadline: string;
    /** Section heading scale class. */
    sectionHeading: string;
    /** Body text scale class. */
    body: string;
    /** Heading font weight class. */
    headingWeight: string;
    /** Letter-spacing on headings. */
    headingTracking: string;
    /** Heading font family stack (CSS value). */
    headingFontFamily: string;
    /** Body font family stack (CSS value). */
    bodyFontFamily: string;
  };
  /** Layout instructions: hero shape, image placement, section rhythm. */
  layout: {
    /** Hero column split. "image-right" | "image-left" | "image-bg" | "centered". */
    hero: "image-right" | "image-left" | "image-bg" | "centered";
    /** Vertical rhythm between sections. */
    sectionPadding: "tight" | "balanced" | "spacious";
    /** Container max-width class. */
    maxWidth: string;
    /** Card radius for benefit/feature cards. */
    cardRadius: string;
    /** Image radius for the hero portrait. */
    imageRadius: string;
    /** Image aspect ratio for the hero portrait. */
    imageAspect: string;
    /** Border treatment for cards. */
    cardBorder: "soft" | "hard" | "none";
  };
}

export const INSURANCE_THEMES: readonly InsuranceTheme[] = [
  {
    id: "modern-medicare",
    name: "Modern Medicare",
    tagline: "Clean, trustworthy, professional",
    bestFor: "Best for Medicare agents",
    recommended: true,
    palette: { primary: "#1E3A8A", accent: "#3B82F6", surface: "#F8FAFC", text: "#0F172A" },
    tone: "Educational, clear, calm authority. Plain-language explanations.",
    density: "balanced",
    mood: "Navy / white · trustworthy",
    inspiration: ["humana.com", "ehealthinsurance.com", "boomerbenefits.com"],
    typography: {
      heroHeadline: "text-4xl sm:text-5xl lg:text-6xl",
      sectionHeading: "text-3xl sm:text-4xl",
      body: "text-base sm:text-lg",
      headingWeight: "font-semibold",
      headingTracking: "tracking-tight",
      headingFontFamily: "'Inter', system-ui, sans-serif",
      bodyFontFamily: "'Inter', system-ui, sans-serif",
    },
    layout: {
      hero: "image-right",
      sectionPadding: "balanced",
      maxWidth: "max-w-6xl",
      cardRadius: "rounded-2xl",
      imageRadius: "rounded-[2rem]",
      imageAspect: "aspect-[4/5]",
      cardBorder: "soft",
    },
  },
  {
    id: "warm-local-advisor",
    name: "Warm Local Advisor",
    tagline: "Friendly, community, approachable",
    bestFor: "Best for community-based agents",
    palette: { primary: "#9A6B3F", accent: "#E0B97D", surface: "#FAF6EF", text: "#3A2A1B" },
    tone: "Warm, neighborly, relationship-first. We answer the phone.",
    density: "airy",
    mood: "Cream / camel · welcoming",
    inspiration: ["statefarm.com agent micro-sites", "edwardjones.com advisor pages", "allstate.com local agent"],
    typography: {
      heroHeadline: "text-4xl sm:text-5xl",
      sectionHeading: "text-2xl sm:text-3xl",
      body: "text-lg",
      headingWeight: "font-semibold",
      headingTracking: "tracking-normal",
      headingFontFamily: "'Fraunces', Georgia, serif",
      bodyFontFamily: "'Inter', system-ui, sans-serif",
    },
    layout: {
      hero: "image-left",
      sectionPadding: "spacious",
      maxWidth: "max-w-5xl",
      cardRadius: "rounded-3xl",
      imageRadius: "rounded-full",
      imageAspect: "aspect-square",
      cardBorder: "soft",
    },
  },
  {
    id: "premium-independent-broker",
    name: "Premium Independent Broker",
    tagline: "Elevated, polished, high-trust",
    bestFor: "Best for independent brokers",
    palette: { primary: "#0B1220", accent: "#C5A572", surface: "#F5F3EE", text: "#0B1220" },
    tone: "Polished, modern business, confidence without being stuffy.",
    density: "balanced",
    mood: "Charcoal / gold · premium",
    inspiration: ["northwesternmutual.com", "morganstanley.com fa pages", "jpmorgan.com private bank"],
    typography: {
      heroHeadline: "text-5xl sm:text-6xl lg:text-7xl",
      sectionHeading: "text-3xl sm:text-4xl",
      body: "text-base sm:text-lg",
      headingWeight: "font-medium",
      headingTracking: "-tracking-[0.02em]",
      headingFontFamily: "'Playfair Display', 'Times New Roman', serif",
      bodyFontFamily: "'Inter', system-ui, sans-serif",
    },
    layout: {
      hero: "image-bg",
      sectionPadding: "spacious",
      maxWidth: "max-w-7xl",
      cardRadius: "rounded-none",
      imageRadius: "rounded-none",
      imageAspect: "aspect-[3/4]",
      cardBorder: "hard",
    },
  },
  {
    id: "aca-enrollment",
    name: "ACA Enrollment Focus",
    tagline: "Fast, clear, action-oriented",
    bestFor: "Best for ACA-heavy books",
    palette: { primary: "#0E7490", accent: "#22D3EE", surface: "#F0FDFA", text: "#083344" },
    tone: "Action-first, simple steps, deadline-aware, energetic.",
    density: "balanced",
    mood: "Teal / cyan · energetic",
    inspiration: ["healthsherpa.com", "stride.health", "healthcare.gov"],
    typography: {
      heroHeadline: "text-5xl sm:text-6xl",
      sectionHeading: "text-3xl sm:text-4xl",
      body: "text-base sm:text-lg",
      headingWeight: "font-bold",
      headingTracking: "-tracking-[0.025em]",
      headingFontFamily: "'Inter', system-ui, sans-serif",
      bodyFontFamily: "'Inter', system-ui, sans-serif",
    },
    layout: {
      hero: "centered",
      sectionPadding: "tight",
      maxWidth: "max-w-5xl",
      cardRadius: "rounded-xl",
      imageRadius: "rounded-2xl",
      imageAspect: "aspect-[4/3]",
      cardBorder: "soft",
    },
  },
  {
    id: "senior-friendly",
    name: "Senior-Friendly Educational",
    tagline: "Easy to read, soft, low-pressure",
    bestFor: "Best for 65+ audiences",
    palette: { primary: "#1F4068", accent: "#7BA7C4", surface: "#F7FBFE", text: "#1F2937" },
    tone: "Patient, educational, larger spacing, no jargon.",
    density: "airy",
    mood: "Soft blue · gentle",
    inspiration: ["aarp.org/medicare", "medicare.gov", "boomerbenefits.com"],
    typography: {
      heroHeadline: "text-3xl sm:text-4xl lg:text-5xl",
      sectionHeading: "text-2xl sm:text-3xl",
      body: "text-lg sm:text-xl",
      headingWeight: "font-semibold",
      headingTracking: "tracking-normal",
      headingFontFamily: "'Source Serif Pro', Georgia, serif",
      bodyFontFamily: "'Source Sans Pro', system-ui, sans-serif",
    },
    layout: {
      hero: "image-right",
      sectionPadding: "spacious",
      maxWidth: "max-w-5xl",
      cardRadius: "rounded-2xl",
      imageRadius: "rounded-3xl",
      imageAspect: "aspect-[4/5]",
      cardBorder: "soft",
    },
  },
  {
    id: "minimal-leadgen",
    name: "Minimal Lead-Generation",
    tagline: "Conversion-first, very clean",
    bestFor: "Best for lead-focused agents",
    palette: { primary: "#111827", accent: "#10B981", surface: "#FFFFFF", text: "#111827" },
    tone: "Direct, benefit-driven, single bold CTA.",
    density: "airy",
    mood: "White / black · focused",
    inspiration: ["linear.app", "stripe.com", "vercel.com"],
    typography: {
      heroHeadline: "text-6xl sm:text-7xl lg:text-8xl",
      sectionHeading: "text-4xl sm:text-5xl",
      body: "text-lg",
      headingWeight: "font-bold",
      headingTracking: "-tracking-[0.04em]",
      headingFontFamily: "'Inter', system-ui, sans-serif",
      bodyFontFamily: "'Inter', system-ui, sans-serif",
    },
    layout: {
      hero: "centered",
      sectionPadding: "spacious",
      maxWidth: "max-w-4xl",
      cardRadius: "rounded-lg",
      imageRadius: "rounded-lg",
      imageAspect: "aspect-video",
      cardBorder: "none",
    },
  },
  {
    id: "corporate-agency",
    name: "Corporate Agency Style",
    tagline: "Structured, polished, authoritative",
    bestFor: "Best for multi-line agencies",
    palette: { primary: "#1E293B", accent: "#94A3B8", surface: "#F8FAFC", text: "#0F172A" },
    tone: "Formal, credible, structured services and team sections.",
    density: "dense",
    mood: "Slate / steel · corporate",
    inspiration: ["marsh.com", "aon.com", "wtwco.com"],
    typography: {
      heroHeadline: "text-4xl sm:text-5xl",
      sectionHeading: "text-2xl sm:text-3xl",
      body: "text-sm sm:text-base",
      headingWeight: "font-semibold",
      headingTracking: "tracking-tight",
      headingFontFamily: "'IBM Plex Sans', system-ui, sans-serif",
      bodyFontFamily: "'IBM Plex Sans', system-ui, sans-serif",
    },
    layout: {
      hero: "image-left",
      sectionPadding: "tight",
      maxWidth: "max-w-7xl",
      cardRadius: "rounded-md",
      imageRadius: "rounded-md",
      imageAspect: "aspect-[3/4]",
      cardBorder: "hard",
    },
  },
  {
    id: "personal-brand",
    name: "Personal Brand Agent",
    tagline: "Agent-as-the-face, story-driven",
    bestFor: "Best for personal brands",
    recommended: true,
    palette: { primary: "#7C3AED", accent: "#F59E0B", surface: "#FBFAF7", text: "#1F1B2E" },
    tone: "Personal voice, headshot-forward, story + social proof.",
    density: "balanced",
    mood: "Plum / amber · personal",
    inspiration: ["alexhormozi.com", "marieforleo.com", "ramit.com"],
    typography: {
      heroHeadline: "text-5xl sm:text-6xl lg:text-7xl",
      sectionHeading: "text-3xl sm:text-4xl",
      body: "text-lg",
      headingWeight: "font-bold",
      headingTracking: "-tracking-[0.03em]",
      headingFontFamily: "'Cabinet Grotesk', 'Inter', system-ui, sans-serif",
      bodyFontFamily: "'Inter', system-ui, sans-serif",
    },
    layout: {
      hero: "image-left",
      sectionPadding: "balanced",
      maxWidth: "max-w-6xl",
      cardRadius: "rounded-3xl",
      imageRadius: "rounded-[3rem]",
      imageAspect: "aspect-square",
      cardBorder: "soft",
    },
  },
  {
    id: "community-family",
    name: "Community / Family-Oriented",
    tagline: "People-first, comforting",
    bestFor: "Best for family-focused agents",
    palette: { primary: "#15803D", accent: "#F97316", surface: "#F7FBF6", text: "#14532D" },
    tone: "Warm, family-oriented, service to the community.",
    density: "balanced",
    mood: "Green / orange · welcoming",
    inspiration: ["nationwide.com agent pages", "farmers.com agent locator", "country financial advisor pages"],
    typography: {
      heroHeadline: "text-4xl sm:text-5xl",
      sectionHeading: "text-3xl",
      body: "text-base sm:text-lg",
      headingWeight: "font-semibold",
      headingTracking: "tracking-normal",
      headingFontFamily: "'DM Serif Display', Georgia, serif",
      bodyFontFamily: "'DM Sans', system-ui, sans-serif",
    },
    layout: {
      hero: "image-right",
      sectionPadding: "balanced",
      maxWidth: "max-w-6xl",
      cardRadius: "rounded-2xl",
      imageRadius: "rounded-[2rem]",
      imageAspect: "aspect-[4/5]",
      cardBorder: "soft",
    },
  },
  {
    id: "modern-saas",
    name: "High-Converting Modern SaaS",
    tagline: "Sleek tech-style with motion",
    bestFor: "Best for tech-savvy agencies",
    palette: { primary: "#0F172A", accent: "#8B5CF6", surface: "#FAFAFB", text: "#0F172A" },
    tone: "Sleek, modern, premium cards, subtle motion, clear value.",
    density: "balanced",
    mood: "Indigo / violet · futuristic",
    inspiration: ["linear.app", "framer.com", "arc.net"],
    typography: {
      heroHeadline: "text-5xl sm:text-6xl lg:text-7xl",
      sectionHeading: "text-3xl sm:text-4xl",
      body: "text-base sm:text-lg",
      headingWeight: "font-semibold",
      headingTracking: "-tracking-[0.035em]",
      headingFontFamily: "'Geist', 'Inter', system-ui, sans-serif",
      bodyFontFamily: "'Geist', 'Inter', system-ui, sans-serif",
    },
    layout: {
      hero: "centered",
      sectionPadding: "spacious",
      maxWidth: "max-w-6xl",
      cardRadius: "rounded-2xl",
      imageRadius: "rounded-2xl",
      imageAspect: "aspect-[4/5]",
      cardBorder: "soft",
    },
  },
];

export function getThemeById(id: string | undefined | null): InsuranceTheme {
  return INSURANCE_THEMES.find((t) => t.id === id) ?? INSURANCE_THEMES[0];
}

export interface BuilderData {
  businessName: string;
  agentName: string;
  phone: string;
  email: string;
  city: string;
  state: string;
  insuranceType: InsuranceType;
  businessType: string;
  logoDataUrl: string | null;
  headshotDataUrl: string | null;
  headline: string;
  subheadline: string;
  contactMethod: ContactMethod;
  ctaText: string;
  freestyleInstructions: string;
  authorNotes: string;
  themeId: string;
  /** Workspace-local tweak notes from the post-generation chat. Kept
   *  separate from `freestyleInstructions` (the setup prompt) so chats
   *  don't bleed across stages. */
  workspaceNotes: string;
  /** AI-driven section toggles. Drive which sections render on the
   *  generated landing so two different agents get visibly different
   *  sites. */
  showServices?: boolean;
  showTestimonials?: boolean;
  showFaq?: boolean;
  showBookingCta?: boolean;
  showAboutAgent?: boolean;
}

export const DEFAULT_BUILDER: BuilderData = {
  businessName: "Sterling Insurance Group",
  agentName: "Jordan Sterling",
  phone: "(555) 123-4567",
  email: "jordan@sterlinginsurance.com",
  city: "Austin",
  state: "TX",
  insuranceType: "Medicare",
  businessType: "Medicare insurance agency",
  logoDataUrl: null,
  headshotDataUrl: null,
  headline: "Turning 65? Let's make Medicare simple.",
  subheadline:
    "Friendly, no-pressure guidance to help you understand your Medicare options and enroll with confidence.",
  contactMethod: "call",
  ctaText: "Get My Free Quote",
  freestyleInstructions: "",
  authorNotes: "",
  themeId: "modern-medicare",
  workspaceNotes: "",
  showServices: true,
  showTestimonials: true,
  showFaq: false,
  showBookingCta: false,
  showAboutAgent: true,
};

const KEY = "lp_builder_data_v3";
const LEGACY_KEY = "lp_builder_data_v2";

function migrateLegacyType(t: unknown): string {
  if (typeof t !== "string") return DEFAULT_BUILDER.insuranceType;
  if (t === "medicare") return "Medicare";
  if (t === "aca") return "ACA";
  return t;
}

export function loadBuilder(): BuilderData | null {
  if (typeof window === "undefined") return null;
  try {
    let raw = window.localStorage.getItem(KEY);
    // Migrate from v2 if v3 is missing
    if (!raw) {
      const legacy = window.localStorage.getItem(LEGACY_KEY);
      if (!legacy) return null;
      raw = legacy;
    }
    const parsed = JSON.parse(raw) as Partial<BuilderData>;
    return {
      ...DEFAULT_BUILDER,
      ...parsed,
      insuranceType: migrateLegacyType(parsed.insuranceType),
    };
  } catch {
    return null;
  }
}

export function saveBuilder(data: BuilderData) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(data));
  } catch {
    // ignore quota errors
  }
}

export function clearBuilder() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(KEY);
}

export function useBuilderData(): BuilderData | null {
  const [data, setData] = useState<BuilderData | null>(null);
  useEffect(() => {
    setData(loadBuilder());
  }, []);
  return data;
}