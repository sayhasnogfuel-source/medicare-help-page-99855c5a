import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import type { BuilderPatch, EditResult } from "./ai-editor.types";
import { INSURANCE_THEMES, getThemeById } from "./builder-storage";

const ChatTurnSchema = z.object({
  role: z.enum(["user", "assistant"]),
  text: z.string().min(1).max(4000),
});

const BuilderSnapshotSchema = z.object({
  businessName: z.string().max(200).optional().default(""),
  agentName: z.string().max(200).optional().default(""),
  phone: z.string().max(60).optional().default(""),
  email: z.string().max(200).optional().default(""),
  city: z.string().max(120).optional().default(""),
  state: z.string().max(120).optional().default(""),
  insuranceType: z.string().max(120).optional().default(""),
  businessType: z.string().max(200).optional().default(""),
  headline: z.string().max(300).optional().default(""),
  subheadline: z.string().max(600).optional().default(""),
  contactMethod: z.enum(["call", "text", "email"]).optional().default("call"),
  ctaText: z.string().max(80).optional().default(""),
  freestyleInstructions: z.string().max(2000).optional().default(""),
  authorNotes: z.string().max(2000).optional().default(""),
  themeId: z.string().max(80).optional().default(""),
  workspaceNotes: z.string().max(4000).optional().default(""),
  showServices: z.boolean().optional(),
  showTestimonials: z.boolean().optional(),
  showFaq: z.boolean().optional(),
  showBookingCta: z.boolean().optional(),
  showAboutAgent: z.boolean().optional(),
});

const InputSchema = z.object({
  messages: z.array(ChatTurnSchema).min(1).max(40),
  builderData: BuilderSnapshotSchema,
});

const VALID_THEME_IDS = [
  "modern-medicare",
  "warm-local-advisor",
  "premium-independent-broker",
  "aca-enrollment",
  "senior-friendly",
  "minimal-leadgen",
  "corporate-agency",
  "personal-brand",
  "community-family",
  "modern-saas",
  "editorial-authority",
  "bold-conversion",
  "soft-luxury",
  "strong-local-business",
  "future-premium",
] as const;

const THEME_BRIEFS = INSURANCE_THEMES.map((th) =>
  `• ${th.id} — ${th.name}. Mood: ${th.mood}. Density: ${th.density}. Tone: ${th.tone} ` +
  `Hero layout: ${th.layout.hero}. Image shape: ${th.layout.imageRadius} ${th.layout.imageAspect}. ` +
  `Heading font: ${th.typography.headingFontFamily}. Body font: ${th.typography.bodyFontFamily}. ` +
  `Section rhythm: ${th.layout.sectionPadding}. Card style: ${th.layout.cardBorder} ${th.layout.cardRadius}. ` +
  `Inspired by: ${th.inspiration.join(", ")}.`
).join("\n");

const SYSTEM_PROMPT = `You are the in-app website builder inside Diploo. You behave EXACTLY like an AI website builder (think Lovable for insurance agents): the user types one request, you make sweeping, visible, opinionated changes to the page and report what you did. You are NOT a polite copy editor — you are the designer and the developer.

Your one job: take the user's natural-language request and produce a bold, specific, holistic edit to their landing-page data — copy AND structure AND theme — then describe it in ONE short past-tense sentence.

CRITICAL — bias toward BIG, VISIBLE changes:
- Tweaks are not enough. When the user asks to change "the tone", "the design", "the vibe", "the homepage", or anything similar, REWRITE multiple fields at once: headline + subheadline + ctaText + themeId + several section toggles together. A user should see the page transform, not see one word swap.
- When the user picks a niche, a theme, or a city, regenerate ALL copy fields to match — do not leave a Medicare headline on an Auto-insurance site.
- Always think: what would a senior designer do here? Then do all of it in one patch.
- Use themeId aggressively. If the request implies a different mood (premium, friendly, modern, senior-friendly, corporate, etc.), SWITCH the theme.
- Use section toggles (showServices, showTestimonials, showFaq, showBookingCta, showAboutAgent) so different agents get visibly different sites. A Medicare agent for seniors usually wants showAboutAgent + showFaq. A lead-focused ACA broker usually wants showBookingCta + showTestimonials. A personal-brand agent wants showAboutAgent + showTestimonials.

THEMES ARE FULL DESIGN BRIEFS (NOT JUST COLOR PALETTES):
Every themeId carries opinions about: hero layout, image placement, image shape (round vs sharp vs hero-bg), font family (serif vs sans vs display), heading size scale, body size scale, section padding rhythm (tight/balanced/spacious), card border style, and a list of real-world websites the page should LOOK like. When you choose a theme, you are committing to that ENTIRE visual language — copy length, tone, and section choices must match. Senior-friendly = larger body text + serif headings + airy spacing + short sentences. Minimal lead-gen = giant centered headline + 1 CTA + minimal copy + ample whitespace, like Linear/Stripe. Premium independent broker = serif display heading + sharp edges + spacious layout, like Northwestern Mutual. Personal brand = oversized bold sans + round portrait + headshot-forward, like a creator landing page. Use the brief below to pick the RIGHT theme for the agent's audience and niche, and rewrite copy to fit that theme's reading level, length, and energy.

Theme briefs (use these as your design playbook):
${THEME_BRIEFS}

Hard rules:
- ALWAYS call the edit_website tool. Never reply with plain chat.
- The selected theme is the HEAVIEST signal. It dictates layout, typography, image treatment, AND copy length/tone. Always read the active theme brief before writing copy.
- NEVER greet, never re-introduce yourself, never say "Sure!", "I can help with that", "Of course", "Happy to", or any filler. Just do the work.
- NEVER repeat a previous reply verbatim.
- NEVER ask clarifying questions unless the request is genuinely impossible to interpret. Make a confident edit and describe what you did.
- Only edit fields that exist in the schema. Do not invent fields.
- themeId must be one of: ${VALID_THEME_IDS.join(", ")}.
- contactMethod must be exactly "call", "text", or "email".
- If the request is off-topic (not about the agent's website), set patch to empty {} and reply with one short sentence redirecting them to website edits. Do not lecture.
- Keep copy in plain English, agent-appropriate, no emoji, no exclamation spam.
- The "reply" field is ONE short past-tense sentence describing the change (start with a verb like "Rebuilt", "Switched", "Tightened", "Added", "Rewrote"). Exception: when asking for missing onboarding details, you may use up to two short sentences.

FIRST-BUILD RULE (CRITICAL): When the user's first message is the seed "fresh build" request, you MUST produce a COMPLETE, CUSTOM first version of their site in a single patch. That patch MUST set, at minimum: headline, subheadline, ctaText, themeId, and an opinionated set of ALL FIVE section toggles (showServices, showTestimonials, showFaq, showBookingCta, showAboutAgent). The headline must mention the agent's niche and city specifically. The subheadline must be concrete (not "we help people"). Do not output a generic template — the page must feel custom to this exact agent based on their businessName, agentName, city, state, insuranceType/businessType, contactMethod, and the themeId they already selected. Save your one-line design rationale in freestyleInstructions so future edits stay consistent.

Onboarding rule: inspect the website data JSON. If ANY of these are blank — phone, email, city, state, insuranceType — ask for the missing ones in ONE short friendly sentence at the end of your reply. Still produce the full custom build with whatever you have. As soon as the user answers, fill those exact fields via the patch and stop asking.

Be decisive, specific, brief, and BOLD.`;

const TOOL_SCHEMA = {
  type: "function" as const,
  function: {
    name: "edit_website",
    description: "Apply edits to the agent's landing page and report what changed.",
    parameters: {
      type: "object",
      properties: {
        patch: {
          type: "object",
          description: "Only include fields you are actually changing. Omit unchanged fields entirely.",
          properties: {
            businessName: { type: "string" },
            agentName: { type: "string" },
            phone: { type: "string" },
            email: { type: "string" },
            city: { type: "string" },
            state: { type: "string" },
            insuranceType: {
              type: "string",
              enum: ["Medicare", "ACA", "Life", "Health", "Final Expense", "Auto", "Home", "Commercial", "Independent Agency", "Other"],
            },
            businessType: { type: "string" },
            headline: { type: "string", maxLength: 300 },
            subheadline: { type: "string", maxLength: 600 },
            contactMethod: { type: "string", enum: ["call", "text", "email"] },
            ctaText: { type: "string", maxLength: 80 },
            freestyleInstructions: { type: "string", maxLength: 2000 },
            authorNotes: { type: "string", maxLength: 2000 },
            themeId: { type: "string", enum: [...VALID_THEME_IDS] },
            showServices: { type: "boolean", description: "Show the 'Why work with us' benefits section." },
            showTestimonials: { type: "boolean", description: "Show the testimonial strip." },
            showFaq: { type: "boolean", description: "Show a FAQ section tailored to the niche." },
            showBookingCta: { type: "boolean", description: "Show a prominent booking/scheduling CTA banner." },
            showAboutAgent: { type: "boolean", description: "Show the personal 'About the agent' block." },
          },
          additionalProperties: false,
        },
        reply: {
          type: "string",
          description: "ONE short past-tense sentence describing what you changed. No greetings, no filler.",
          maxLength: 200,
        },
      },
      required: ["patch", "reply"],
      additionalProperties: false,
    },
  },
};

const STRING_FIELDS = [
  "businessName", "agentName", "phone", "email", "city", "state",
  "insuranceType", "businessType", "headline", "subheadline",
  "ctaText", "freestyleInstructions", "authorNotes",
] as const;

function sanitizePatch(raw: unknown): BuilderPatch | null {
  if (!raw || typeof raw !== "object") return null;
  const patch = raw as Record<string, unknown>;
  const out: BuilderPatch = {};
  for (const key of STRING_FIELDS) {
    const v = patch[key];
    if (typeof v === "string" && v.length > 0) {
      (out as Record<string, string>)[key] = v;
    }
  }
  if (typeof patch.themeId === "string" && VALID_THEME_IDS.includes(patch.themeId as (typeof VALID_THEME_IDS)[number])) {
    out.themeId = patch.themeId;
  }
  if (patch.contactMethod === "call" || patch.contactMethod === "text" || patch.contactMethod === "email") {
    out.contactMethod = patch.contactMethod;
  }
  for (const flag of ["showServices", "showTestimonials", "showFaq", "showBookingCta", "showAboutAgent"] as const) {
    if (typeof patch[flag] === "boolean") {
      (out as Record<string, boolean>)[flag] = patch[flag] as boolean;
    }
  }
  return Object.keys(out).length ? out : null;
}

export const editWebsite = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => InputSchema.parse(input))
  .handler(async ({ data }): Promise<EditResult> => {
    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) {
      return {
        patch: null,
        reply: "AI is not configured for this project.",
        error: "LOVABLE_API_KEY missing",
      };
    }

    const activeTheme = getThemeById(data.builderData.themeId);
    const contextLine = `Current website data (JSON): ${JSON.stringify(data.builderData)}`;
    const themeContextLine =
      `Active theme brief — id="${activeTheme.id}", name="${activeTheme.name}", ` +
      `mood="${activeTheme.mood}", density="${activeTheme.density}", ` +
      `hero="${activeTheme.layout.hero}", sectionPadding="${activeTheme.layout.sectionPadding}", ` +
      `headingFont="${activeTheme.typography.headingFontFamily}", bodyFont="${activeTheme.typography.bodyFontFamily}", ` +
      `inspiration=[${activeTheme.inspiration.join(", ")}]. ` +
      `Match this design language in every copy decision.`;

    const messages = [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "system", content: contextLine },
      { role: "system", content: themeContextLine },
      ...data.messages.map((m) => ({
        role: m.role,
        content: m.text,
      })),
    ];

    let response: Response;
    try {
      response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages,
          tools: [TOOL_SCHEMA],
          tool_choice: { type: "function", function: { name: "edit_website" } },
        }),
      });
    } catch (err) {
      console.error("AI gateway network error:", err);
      return {
        patch: null,
        reply: "Network hiccup reaching the AI. Try again in a moment.",
        error: "network",
      };
    }

    if (response.status === 429) {
      return {
        patch: null,
        reply: "AI is busy right now — please try again in a few seconds.",
        error: "rate_limited",
      };
    }
    if (response.status === 402) {
      return {
        patch: null,
        reply: "AI usage limit reached. Add credits in workspace settings to keep editing.",
        error: "credits_exhausted",
      };
    }
    if (!response.ok) {
      const body = await response.text().catch(() => "");
      console.error("AI gateway error", response.status, body);
      return {
        patch: null,
        reply: "The AI couldn't process that one. Try rephrasing.",
        error: `gateway_${response.status}`,
      };
    }

    let payload: any;
    try {
      payload = await response.json();
    } catch {
      return {
        patch: null,
        reply: "Got a malformed response from the AI. Try again.",
        error: "parse",
      };
    }

    const choice = payload?.choices?.[0]?.message;
    const toolCall = choice?.tool_calls?.[0];
    const argsRaw = toolCall?.function?.arguments;
    if (!argsRaw) {
      return {
        patch: null,
        reply:
          typeof choice?.content === "string" && choice.content.trim()
            ? choice.content.trim()
            : "I couldn't translate that into an edit — try being more specific.",
      };
    }

    let parsed: any;
    try {
      parsed = typeof argsRaw === "string" ? JSON.parse(argsRaw) : argsRaw;
    } catch {
      return {
        patch: null,
        reply: "I couldn't translate that into an edit — try being more specific.",
      };
    }

    const cleanPatch = sanitizePatch(parsed?.patch);
    const reply =
      typeof parsed?.reply === "string" && parsed.reply.trim()
        ? parsed.reply.trim().slice(0, 200)
        : cleanPatch
          ? "Updated."
          : "Nothing to change there.";

    return { patch: cleanPatch, reply };
  });