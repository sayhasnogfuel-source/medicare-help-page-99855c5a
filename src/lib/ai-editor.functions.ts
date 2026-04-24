import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import type { BuilderPatch, EditResult } from "./ai-editor.types";

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
] as const;

const SYSTEM_PROMPT = `You are the in-app design assistant inside Diploofly, a website builder used exclusively by US insurance agents (Medicare, ACA, Life, Health, Final Expense, Auto, Home, Commercial, Independent Agency).

Your one job: take the user's natural-language request and translate it into precise edits to their landing-page data, then describe the change in ONE short sentence.

Hard rules:
- ALWAYS call the edit_website tool. Never reply with plain chat.
- NEVER greet, never re-introduce yourself, never say "Sure!", "I can help with that", "Of course", "Happy to", or any filler. Just do the work.
- NEVER repeat a previous reply verbatim. If the user asks for something already in place, say so in one sentence and leave patch empty.
- NEVER ask clarifying questions unless the request is genuinely impossible to interpret. Make a confident edit and describe what you did.
- Only edit fields that exist in the schema. Do not invent fields.
- themeId must be one of: ${VALID_THEME_IDS.join(", ")}.
- contactMethod must be exactly "call", "text", or "email".
- If the request is off-topic (not about the agent's website), set patch to empty {} and reply with one short sentence redirecting them to website edits. Do not lecture.
- Keep copy in plain English, agent-appropriate, no emoji, no exclamation spam.
- The "reply" field must be ONE sentence (max ~140 chars) describing the change you made, in past tense. Never start with "I will" or "Let me" — start with a verb like "Updated", "Switched", "Tightened", "Added", "Removed".

You are a senior web designer. Be decisive, specific, and brief.`;

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

    const contextLine = `Current website data (JSON): ${JSON.stringify(data.builderData)}`;

    const messages = [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "system", content: contextLine },
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