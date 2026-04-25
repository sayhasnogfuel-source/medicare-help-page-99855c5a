import type { BuilderData } from "@/lib/builder-storage";
import {
  Phone,
  Mail,
  MessageSquare,
  ShieldCheck,
  HeartHandshake,
  Clock,
  type LucideIcon,
} from "lucide-react";

export type Benefit = { icon: LucideIcon; title: string; body: string };

const GENERIC_BENEFITS: readonly Benefit[] = [
  { icon: ShieldCheck, title: "Personalized coverage", body: "Plans matched to your situation, not a one-size-fits-all script." },
  { icon: HeartHandshake, title: "A real local expert", body: "Friendly guidance from someone who answers the phone." },
  { icon: Clock, title: "Easy enrollment", body: "We make signing up simple and stress-free, start to finish." },
];

const BENEFITS_BY_NICHE: Record<string, readonly Benefit[]> = {
  medicare: [
    { icon: ShieldCheck, title: "Medicare made simple", body: "Plain-language guidance from someone who actually answers the phone." },
    { icon: HeartHandshake, title: "Personalized to you", body: "Plans that match your doctors, prescriptions, and budget." },
    { icon: Clock, title: "Avoid late penalties", body: "Enroll on time and skip the costly mistakes most people make." },
  ],
  aca: [
    { icon: ShieldCheck, title: "Find affordable coverage", body: "Compare ACA plans and subsidies side-by-side." },
    { icon: HeartHandshake, title: "Personal one-on-one help", body: "We listen first, then walk through your best options." },
    { icon: Clock, title: "Don't miss enrollment", body: "Stay ahead of deadlines and special enrollment windows." },
  ],
  life: [
    { icon: ShieldCheck, title: "Protection that lasts", body: "Affordable life policies tailored to your family's future." },
    { icon: HeartHandshake, title: "Personal guidance", body: "We listen first, then recommend the right coverage." },
    { icon: Clock, title: "Quick, simple quotes", body: "Compare top carriers in minutes — no medical exam options available." },
  ],
  health: [
    { icon: ShieldCheck, title: "Quality health coverage", body: "Plans built around your doctors, prescriptions, and budget." },
    { icon: HeartHandshake, title: "Real human help", body: "We answer questions in plain English, not insurance jargon." },
    { icon: Clock, title: "Enroll on time", body: "Stay ahead of deadlines and avoid coverage gaps." },
  ],
  "final expense": [
    { icon: ShieldCheck, title: "Peace of mind for your family", body: "Affordable final expense plans that protect loved ones." },
    { icon: HeartHandshake, title: "Compassionate guidance", body: "Patient, respectful help — no pressure, no rush." },
    { icon: Clock, title: "Fast, simple approval", body: "Most policies issue in days, often with no medical exam." },
  ],
  auto: [
    { icon: ShieldCheck, title: "Reliable auto coverage", body: "Right-sized policies that protect you on every drive." },
    { icon: HeartHandshake, title: "Local, friendly service", body: "An agent who knows your name, not a 1-800 number." },
    { icon: Clock, title: "Quick quotes, real savings", body: "We shop top carriers to find the best price for you." },
  ],
  home: [
    { icon: ShieldCheck, title: "Protect what matters most", body: "Comprehensive home coverage built around your property." },
    { icon: HeartHandshake, title: "A neighbor who has your back", body: "Real guidance from a local expert who knows the area." },
    { icon: Clock, title: "Fast, easy quotes", body: "Get a clear, side-by-side comparison in minutes." },
  ],
  commercial: [
    { icon: ShieldCheck, title: "Coverage built for your business", body: "Policies designed around your industry and risks." },
    { icon: HeartHandshake, title: "An advisor, not a salesperson", body: "We help you choose smart coverage — not the most expensive." },
    { icon: Clock, title: "Renewals made easy", body: "We handle the busywork so you can run your business." },
  ],
};

export function getBenefits(niche: string): readonly Benefit[] {
  return BENEFITS_BY_NICHE[niche.toLowerCase().trim()] ?? GENERIC_BENEFITS;
}

export const ContactIcon = {
  call: Phone,
  text: MessageSquare,
  email: Mail,
} as const;

export function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase() ?? "")
    .join("");
}

export interface ThemeProps {
  data: BuilderData;
}

/** Common faux-form props every theme can use without restating field code. */
export function placeholderFormText(typeLabel: string) {
  return `I'm interested in ${typeLabel} options...`;
}

export function typeLabelOf(data: BuilderData) {
  return data.insuranceType?.trim() || "Insurance";
}

export function ctaTextOf(data: BuilderData) {
  return data.ctaText || "Request Help";
}

/** Section-toggle helper with sensible defaults. */
export function sectionToggles(data: BuilderData) {
  return {
    services: data.showServices !== false,
    testimonials: data.showTestimonials !== false,
    aboutAgent: data.showAboutAgent !== false,
    faq: data.showFaq === true,
    bookingCta: data.showBookingCta === true,
  };
}