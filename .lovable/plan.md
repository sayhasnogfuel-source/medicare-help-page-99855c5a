## Goal

Make the product feel like Lovable for insurance agents:

1. The builder is **one short setup form** (no Part 2 / Part 3).
2. After submit, users land in a **Lovable-style workspace**: chat on one side, the **actual generated website** on the other — and the preview reflects what *they* described, not the same template every time.
3. A **fullscreen preview** route lets users open their site in its own tab, away from the builder UI.
4. When signed in, the home page no longer shows "Sign in" / "Create Your Account" / "Continue with Google" — those CTAs are replaced with "Open Builder" / "Go to Workspace". Sign-up link in the footer is also hidden when signed in.

---

## What changes

### 1. `src/routes/builder.tsx` — collapse to Part 1 only

Keep:
- Dashboard chrome (credits, save draft, upgrade)
- Out-of-credits / low-credits banners
- "Your business" section (name, agent, phone, email, city, state, business type)
- "Insurance niche" picker
- "Choose a visual theme" picker
- "Branding" (logo + headshot upload)
- "Page copy" (headline, subheadline, CTA text)
- "Preferred contact method"
- Submit button → goes to `/workspace`

Remove:
- The `PartHeader` step labels ("Part 1", "Part 2", "Part 3")
- The entire **Part 2 — Tell our AI how to build your site** block (`<FreestyleChat />` + `FREESTYLE_SUGGESTIONS`)
- The entire **Part 3 — Notes from author** block (`authorNotes` textarea)
- The unused `FreestyleChat` and `FREESTYLE_SUGGESTIONS` constants

The page header copy is reworded so it reads as "the only setup step". Submit button label changes from "Generate My Website" to "Open Builder Workspace".

The data model (`BuilderData`) still keeps `freestyleInstructions`, `authorNotes`, and `workspaceNotes` — they're just no longer set from the builder. The chat in the workspace becomes the only place users describe the look/feel.

### 2. Workspace shows a *real, custom* website

Currently the preview is `<GeneratedLanding data={data} />` — a single hard-coded layout with niche-specific text. Same template every time. We change this so the AI actually shapes what's on screen.

**a) New first-run AI generation pass.** When `/workspace` mounts and detects the user just came from the builder (no prior chat history, fresh draft), it automatically calls `editFn` once with a synthetic first message:

> "This is a fresh build. Use the business details, niche, theme, and contact method I provided to write a complete first version of my website — strong headline, subheadline, CTA, and a freestyleInstructions block describing the sections, tone, and visual direction that fit my business. Make it feel custom to me, not generic."

The model fills in `headline`, `subheadline`, `ctaText`, `freestyleInstructions`, and (if appropriate) tweaks `themeId`. The first assistant chat bubble shows what it built.

**b) Make the preview reflect AI choices.** `GeneratedLanding` already reads from `BuilderData`. We extend it to honor `freestyleInstructions` for visible structure decisions:
- Add lightweight section toggles parsed from `freestyleInstructions` (e.g. "testimonials", "services", "booking form", "FAQ", "about-the-agent"). The component conditionally renders those sections based on flags the AI sets.
- Expose those toggles in the AI tool schema in `src/lib/ai-editor.functions.ts` as new optional patch fields: `showTestimonials`, `showServices`, `showFaq`, `showBookingCta`, `showAboutAgent`. Add matching optional booleans to `BuilderData` (default false except `showServices` true) and to `BuilderPatch` in `src/lib/ai-editor.types.ts`.
- Update the system prompt: the AI is the designer — for any user request, it should set both copy fields *and* section toggles, so two different agents end up with visibly different sites.

This is the key: the layout is still our component (we keep visual quality high), but **which sections appear, the copy, the niche framing, the theme, and the CTA** are all AI-driven — so two different agents get visibly different sites.

**c) Update workspace toolbar.** Add an "Open in new tab" button next to "Edit details" / "Publish" linking to `/preview` (see #3). Remove the amber "Add a payment method to publish" notice from inside the workspace and move it to a smaller pill inside the existing status row (less in-the-way, more Lovable-like).

### 3. New fullscreen preview route

`src/routes/preview.tsx` already exists in the project — repurpose it as the fullscreen site preview:
- No `AppHeader`, no `AppFooter`, no chrome.
- Reads the builder data from local storage (`loadBuilder()`).
- Renders `<GeneratedLanding data={data} />` full-bleed.
- Wrapped in `AuthGuard` so only signed-in users can view it.
- Add a small floating "← Back to workspace" pill in the top-left and an "Open in new tab" affordance for sharing the live URL.

The workspace's "Open in new tab" button uses `<Link to="/preview" target="_blank">` so the preview opens in a separate browser tab, exactly like Lovable's preview pop-out.

### 4. Hide irrelevant CTAs when signed in

**`src/routes/index.tsx` (Hero):**
- Read `useAccount()` — if `signedIn`, replace the two hero buttons with one primary "Open Builder" → `/builder` and a secondary "Go to Workspace" → `/workspace`.
- Drop the "Continue with Google" button entirely when signed in.
- Change the trust-row item "Card on file required" to "You're signed in" when signed in (small touch, removes the awkward marketing copy for an authed user).

**`src/routes/index.tsx` (FinalCta):**
- When signed in, button label changes from "Get Started" → "Open Builder" (links to `/builder` instead of `/start`), and "See pricing" stays.

**`src/components/app/app-footer.tsx`:**
- Hide the `<Link to="/signup">Sign up</Link>` row when signed in. (Sign-in link too if present.)

These all use the existing `useAccount()` hook (`account.hydrated && account.signedIn`) so there's no flash on first paint — render the public version until hydrated, mirroring how `AppHeader` already does it.

### 5. Cleanup

- Remove `FREESTYLE_SUGGESTIONS` and `FreestyleChat` from `builder.tsx`.
- Remove unused `Send` and `Sparkles` imports if no longer referenced after the cuts.
- The `authorNotes` field stays in the schema for back-compat but is no longer surfaced; `GeneratedLanding` still renders it if non-empty (so old drafts don't lose data).

---

## Files touched

- `src/routes/builder.tsx` — strip Part 2 and Part 3, simplify copy, change submit CTA.
- `src/routes/workspace.tsx` — auto-run first AI generation on entry, add "Open in new tab" button, slim the payment-method banner.
- `src/routes/preview.tsx` — convert to fullscreen authed preview of the user's generated site.
- `src/components/generated/generated-landing.tsx` — honor new section-toggle flags from `BuilderData`.
- `src/lib/builder-storage.ts` — add optional boolean section-toggle fields to `BuilderData` and `DEFAULT_BUILDER`.
- `src/lib/ai-editor.types.ts` — extend `BuilderPatch` with new optional booleans.
- `src/lib/ai-editor.functions.ts` — extend tool schema + sanitizer + system prompt so the AI drives sections.
- `src/routes/index.tsx` — swap hero + final CTA buttons based on signed-in state.
- `src/components/app/app-footer.tsx` — hide signup link when signed in.

## Validation checklist

- `/builder` shows one continuous form, no "Part 2" / "Part 3" headers, no freestyle chat block, no author-notes block.
- Submitting the builder navigates to `/workspace`, which immediately runs one AI pass and visibly customizes the preview to the agent's business (different niches → visibly different sites).
- Workspace has an "Open in new tab" button → opens `/preview` in a new tab showing only the website (no app chrome).
- Signed-in home page shows "Open Builder" instead of "Sign in" / "Create Your Account" / "Continue with Google".
- Footer no longer offers "Sign up" when already signed in.
- Existing drafts still load (back-compat preserved on `BuilderData`).