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