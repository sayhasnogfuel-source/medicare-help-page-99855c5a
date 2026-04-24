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