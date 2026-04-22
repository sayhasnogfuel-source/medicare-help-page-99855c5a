import { useEffect, useState } from "react";

export type InsuranceType = "medicare" | "aca";
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
  insuranceType: "medicare",
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

const KEY = "lp_builder_data_v2";

export function loadBuilder(): BuilderData | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<BuilderData>;
    return { ...DEFAULT_BUILDER, ...parsed };
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