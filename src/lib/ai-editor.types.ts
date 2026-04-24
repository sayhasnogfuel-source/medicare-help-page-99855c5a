export interface ChatTurn {
  role: "user" | "assistant";
  text: string;
}

export interface BuilderPatch {
  businessName?: string;
  agentName?: string;
  phone?: string;
  email?: string;
  city?: string;
  state?: string;
  insuranceType?: string;
  businessType?: string;
  headline?: string;
  subheadline?: string;
  contactMethod?: "call" | "text" | "email";
  ctaText?: string;
  freestyleInstructions?: string;
  authorNotes?: string;
  themeId?: string;
}

export interface EditResult {
  patch: BuilderPatch | null;
  reply: string;
  error?: string;
}