## Goal

Make `/workspace` look and feel like Lovable's builder — same visual language, same panel layout, same affordances. The setup form at `/builder` stays as it is. Business detail collection (phone, email, niche) is moved into the AI chat: when the user opens the workspace, if any of those fields are blank the AI proactively asks for them in chat and writes them to the draft as the user replies.

## Visual reference

Lovable's builder, condensed:

```text
┌──────────────────────────────────────────────────────────────────────────┐
│ ◉ Diploofly  /  project-name        Preview ▾   Share   Publish   ◐ avatar│  ← top bar (dark)
├────────────────────────┬──────────────────────────────────────────────────┤
│  ✦ Chat                │  ◀  ▶  ⟳   project.diploofly.app    [ Desktop ▾]│
│  ──────────────        │ ┌────────────────────────────────────────────┐  │
│  Bot: Hi, ready to     │ │                                            │  │
│       build…           │ │            (live site preview)             │  │
│                        │ │                                            │  │
│  You: Make it warmer   │ │                                            │  │
│                        │ │                                            │  │
│  Bot: Done ✓           │ │                                            │  │
│                        │ │                                            │  │
│  ┌──────────────────┐  │ └────────────────────────────────────────────┘  │
│  │ Ask Diploofly…  ↗│  │                                                  │
│  └──────────────────┘  │  Edits · Version 4 · Saved 2s ago               │
└────────────────────────┴──────────────────────────────────────────────────┘
```

## Changes

### 1. New top bar (replaces current toolbar)

Replace the current pill-row toolbar in `src/routes/workspace.tsx` with a Lovable-style dark slim bar:

- Dark background (`bg-[var(--surface-espresso)]` / near-black), white text.
- Left: small Diploofly logo + breadcrumb `Workspace / {businessName or "Untitled site"}`.
- Center: nothing (keeps it clean).
- Right cluster: `Preview ▾` (dropdown: Open in new tab, Copy preview link), `Edit details`, `Share` (disabled w/ tooltip "Publishing required"), `Publish` (primary).
- Hide the existing `AppHeader` on this route — workspace gets its own chrome (Lovable doesn't show the marketing header in the builder).
- Move credits + status into a thin sub-bar directly under the dark bar: `● Saved 2s ago · 12 credits left · AI quality-check on`.

### 2. Two-pane body, Lovable proportions

Currently grid is `1fr 400px`. Lovable uses a narrower chat (~360px) on the LEFT and the preview on the RIGHT. Swap sides and tighten:

- `lg:grid-cols-[360px_1fr]` — chat left, preview right.
- Chat panel: dark-tinted background (`bg-[var(--surface-cream)]/30` on a near-black panel), rounded-none, fills full height, scrolls internally.
- Preview panel: card with browser-chrome header (back/forward/refresh buttons that are visual only + URL pill + device toggle on the right). The dotted-traffic-light pattern moves out; replace with three flat circular buttons that match Lovable's neutral chevrons.

### 3. Chat panel (left)

Compact Lovable-style chat:

- Header strip: small sparkle + "Diploofly AI" + tiny model tag chip ("Gemini 3 Flash"). No subtitle.
- Bubbles tighter, smaller radius (rounded-xl), no big avatar circles. User bubble = solid mocha, assistant bubble = subtle outline only (no fill) — matches Lovable's text-first chat.
- Render assistant text with `react-markdown` (need to add the dep) so bold/lists/inline-code render the way Lovable's chat does. Bun add `react-markdown`.
- Composer: single rounded-lg input that auto-grows, with a small ↗ send icon button inside the right edge (no full "Send" button text). Below the composer: `⌘↵ to send · Shift+↵ for newline · 1 credit per edit`.
- Suggestion chips above the composer when the chat is empty/short: e.g. `Make it warmer`, `Add testimonials`, `Switch theme to coastal`, `Stronger CTA`.

### 4. Preview panel (right)

Lovable-style fake browser frame:

- Header row: ◀  ▶  ⟳ (visual buttons, ⟳ actually re-renders by bumping `launchedAt`), URL pill showing `{slug}.diploofly.app`, then device segmented control (Desktop / Tablet / Mobile — adds a 768px tablet width to the existing scaled preview), then a small "Open ↗" icon.
- Body: white card containing `<GeneratedLanding>` for desktop and the existing `ScaledMobilePreview` for mobile. Add a parallel `ScaledTabletPreview` (~768px frame) reusing the same scale technique.
- Footer strip inside the preview card: `Version N · Saved Xs ago · {credits} credits` — version increments client-side every time the AI returns a patch (just a counter, no persistence yet).

### 5. Auto-ask for missing business details in chat

In `runFirstGeneration` (currently sends one synthetic message), branch on what's missing in `BuilderData`:

- If `phone`, `email`, `city`, `state`, or `insuranceType` is empty after first AI pass, the assistant's first reply is replaced with a conversational onboarding question:
  > "Before we polish this, I need a few quick details so the site converts. What's the best phone or email for clients to reach you, and which city/state do you serve?"
- The AI tool schema (`src/lib/ai-editor.functions.ts`) already supports `phone`, `email`, `city`, `state`, `insuranceType` patches — so when the user replies with that info in normal chat, the existing `editFn` will fill the fields and update the preview. Tighten the system prompt: "If the user has not yet provided contact details (phone/email) or location (city/state) or insuranceType, ALWAYS ask for the missing ones in your reply and fill them via the patch as soon as they answer. Never repeat a question once answered."
- Track which questions were asked in component state so the seeded onboarding message doesn't replay if the user reloads.

### 6. Trim noise

- Remove the standalone "Card-required notice" pill row — fold into the sub-bar as a quiet `Add card to publish →` link next to the credits.
- Remove the giant `lp-workspace-launch` entry animation (Lovable's builder loads instantly). Keep the chat bubble fade-in.

### 7. Small details for the Lovable feel

- Monospace font (`ui-monospace`) for the URL pill.
- All icons one weight smaller (`h-3.5 w-3.5`).
- Subtle 1px inner border on both panels (`ring-1 ring-border/40`).
- Cursor blinks in the composer on mount (`autoFocus`).
- Keyboard: `⌘K` opens a quick action menu (out of scope for v1 — keep stub: just bind ⌘K to focus the composer).

## Files touched

- `src/routes/workspace.tsx` — main rewrite of the page chrome, panels, composer, version chip, tablet preview, ⌘K focus, hide `AppHeader`.
- `src/lib/ai-editor.functions.ts` — extend system prompt to proactively ask for missing contact/location/niche fields and never re-ask.
- `package.json` (via `bun add react-markdown`) — markdown rendering in chat bubbles.
- `src/styles.css` — tiny utility for the dark workspace bar surface if not already covered by existing tokens.

No changes to `/builder`, `/preview`, builder data shape, credits, or auth.

## Validation checklist

- `/workspace` no longer shows the marketing `AppHeader`; instead has a dark slim bar with breadcrumb + Preview/Share/Publish.
- Chat is on the LEFT (~360px), preview on the right with a fake browser URL bar and Desktop/Tablet/Mobile toggle.
- First-run AI message asks for any missing phone/email/city/state/insuranceType in conversational form; user replies in chat update those fields and re-render the preview.
- Composer sends on ⌘↵, supports Shift+↵, has an inline ↗ send icon (no big "Send" pill).
- Assistant bubbles render markdown.
- A "Version N · Saved Xs ago" strip sits at the bottom of the preview card and bumps after each successful AI patch.
