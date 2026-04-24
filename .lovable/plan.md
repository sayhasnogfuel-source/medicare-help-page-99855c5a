## Goal

Wire a real AI into the website that:
- Acts as a focused agent-website builder (not a general chatbot)
- Edits the live preview in `workspace.tsx` based on natural language
- Remembers the conversation so it doesn't repeat itself
- Costs you nothing extra to set up — uses Lovable AI, which is already enabled (LOVABLE_API_KEY is provisioned)

## Does it cost money?

Short answer: **no extra setup cost, but usage is metered.**

- Lovable AI is already wired into your project. No API key, no third-party signup, no new billing relationship.
- It comes with a free monthly allowance included with your Lovable plan.
- After that allowance, requests draw from workspace credits (top up at Settings → Workspace → Usage). Cheap models (e.g. `google/gemini-3-flash-preview`) are pennies per conversation; expensive reasoning models (e.g. `openai/gpt-5`) cost more.
- We will default to **`google/gemini-3-flash-preview`** — fast, cheap, more than capable for "tweak this landing page" edits. You can switch models later in one place.

If you ever exceed the allowance the user sees a clean toast ("AI usage limit reached, please top up") instead of a crash.

## What "not repetitive" means in practice

Three things cause an AI to feel repetitive:
1. It forgets prior turns → keeps reintroducing itself or re-asking. Fix: send the full chat history every turn.
2. It has no role/scope → falls back to generic helper phrasing. Fix: a strong system prompt that locks it to insurance-agent-website tasks.
3. It free-talks instead of acting → repeats "I can help with..." instead of editing. Fix: structured tool-calling so the model returns an *edit patch* (JSON), not chat fluff. The reply text only describes what changed.

We will do all three.

## Scope

Replace the regex-based `applyTweak` engine in `src/routes/workspace.tsx` with a real AI call. The builder page (`/builder`) stays as-is for initial form input. Workspace becomes the conversational editor.

## Architecture

```text
Workspace UI (chat input)
        │  user message + chat history + current BuilderData
        ▼
TanStack server function: editWebsite()
        │  calls Lovable AI Gateway with structured tool call
        ▼
Lovable AI (gemini-3-flash-preview)
        │  returns { patch: Partial<BuilderData>, reply: string }
        ▼
Workspace applies patch → preview updates instantly
```

No edge functions needed. No new env vars. No new tables.

## Changes

### 1. New server function: `src/lib/ai-editor.functions.ts`

- Uses `createServerFn({ method: "POST" })` with Zod input validation.
- Inputs: `{ messages: ChatMessage[], builderData: BuilderData }`.
- Calls `https://ai.gateway.lovable.dev/v1/chat/completions` with:
  - `model: "google/gemini-3-flash-preview"`
  - System prompt locking the assistant to the role of "senior web designer for US insurance agents" with explicit rules:
    - Only edit fields that exist on `BuilderData`
    - Never repeat greetings or re-introduce yourself
    - Never say "I can help with..." — just do it and describe the change in one sentence
    - Decline non-website requests politely in one short sentence
  - `tools: [edit_website]` — a forced tool call with JSON schema mirroring `BuilderData`'s editable fields (headline, subheadline, ctaText, themeId, contactMethod, freestyleInstructions, businessName, agentName, etc.) plus a required `reply` string.
  - `tool_choice` forces the function call so the model can't drift into pure chat.
- Handles 429 (rate limit) and 402 (credits exhausted) explicitly and returns a typed error result the UI can toast.
- Returns `{ patch: Partial<BuilderData> | null, reply: string, error?: string }`.

### 2. Update `src/routes/workspace.tsx`

- Remove the `applyTweak` regex function and its keyword cascade.
- Add `useServerFn(editWebsite)` and call it on send.
- Pass full chat history (sliced to last ~20 messages to keep it cheap) plus current `BuilderData`.
- Keep the existing optimistic UI: append user message, show a "thinking…" assistant bubble, replace it with the real reply when it returns.
- Apply returned `patch` with the existing `setData` + `saveBuilder` flow.
- Toast on error result.
- Keep the credit-cost UX (`ACTION_COSTS`) so each AI tweak still consumes a credit — no behavior change there.

### 3. New file: `src/lib/ai-editor.types.ts`

- Shared `ChatMessage` type and the Zod schema for the tool-call response, used by both the server function and the client.

### 4. Small polish in workspace

- The starter assistant message stays, but we add a one-time "what I can do" hint chip row (Change headline, Switch theme, Add testimonial section, Make it warmer, etc.) so users discover capabilities without the AI having to explain itself every turn.

## What stays out of scope

- Streaming token-by-token responses. Tweaks return in 1–3 seconds with the cheap model, so streaming adds complexity without UX gain. Easy to add later if you want.
- Letting the AI invent new sections/components beyond what `GeneratedLanding` already renders. The model can only set fields the renderer understands — this prevents broken previews.
- Image generation. Out of scope for this round; can be a follow-up using Lovable AI's image models against headshots/logos.

## Risks and how we handle them

- **Model returns malformed JSON**: tool-calling with a strict schema + Zod validation on the server — invalid responses become a friendly "Could you rephrase that?" reply with no patch applied.
- **Off-topic requests** ("write me a poem"): system prompt instructs a one-sentence redirect; tool call is still forced so the patch is just `null`.
- **Cost runaway**: cheap model by default, history capped at 20 turns, single non-streaming request per send.

## Validation checklist

- "Change the headline to 'Medicare made easy'" → headline updates in preview, reply is one sentence.
- "Switch to the warm local advisor theme" → `themeId` updates, palette changes in preview.
- "Make the tone more family-oriented" → `freestyleInstructions` and possibly subheadline update; reply describes the shift without re-greeting.
- Asking the same thing twice in a row → second reply does not repeat the first verbatim and acknowledges the change is already in place.
- Asking "what's the weather" → polite one-line redirect, no patch.
- Network/credit failure → red toast with a clear message, chat input stays usable.
