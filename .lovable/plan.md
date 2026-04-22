

## Reposition Lumen.pages for all insurance niches + add "Build for me / Build my own" choice + page transitions

### 1. Broaden positioning (Medicare/ACA → all insurance agents)

Update copy across the site so Medicare/ACA become *examples*, not the focus.

- **`src/routes/__root.tsx`** — meta title/description: "for insurance agents" instead of "Medicare and ACA agents".
- **`src/routes/index.tsx`** — Hero subhead, Features card "Medicare & ACA templates" → "Templates for every niche", How-it-works step copy, Showcase blurb, Final CTA copy.
- **`src/routes/signup.tsx`** — left panel copy and bullet list.
- **`src/components/app/app-header.tsx`** — no copy changes needed (brand only).

Add a niches strip on the homepage (under Hero/SocialProof) listing: Medicare, ACA, Life, Health, Final Expense, Auto, Home, Commercial, Independent agencies — as small pill chips.

### 2. Broaden the builder's "Insurance type" / niche field

**`src/lib/builder-storage.ts`**
- Replace the strict `InsuranceType = "medicare" | "aca"` with `InsuranceNiche` string (free-form) backed by a preset list. Keep `insuranceType` field name for backward compatibility but type as `string`.
- Add preset constant `INSURANCE_NICHES` = Medicare, ACA, Life, Health, Final Expense, Auto, Home, Commercial, Independent Agency, Other.
- Default sample `businessType` stays "Medicare insurance agency" (a friendly default), but new niche selector defaults to "Medicare".
- Bump storage key to `lp_builder_data_v3` with safe migration from v2.

**`src/routes/builder.tsx`**
- Replace the 2-card Medicare/ACA RadioCardGroup with a `Select` (or grid of pill buttons) sourced from `INSURANCE_NICHES` so all niches are choosable. Label: "Insurance niche".

**`src/components/generated/generated-landing.tsx`**
- Extend `benefitsByType` to a fallback map that returns generic insurance benefits when the niche isn't medicare/aca (e.g. Life, Auto, Home, etc.) so the generated page always renders sensible copy. Key on lowercased niche; default to a generic "Personalized coverage / Local expert / Easy enrollment" set.
- Header subtitle uses the chosen niche label instead of hardcoded "Medicare/ACA Insurance".

### 3. New "How would you like to get started?" section + route

**Homepage section** (insert in `src/routes/index.tsx` between SocialProof and Features):

```text
                How would you like to get started?
                It only takes 5 minutes
 ┌──────────────────────────────┐  ┌──────────────────────────────┐
 │  ✋  Have Us Build It For You │  │  ⚡  Build Your Own Website   │
 │  Submit an inquiry and let   │  │  Use our platform to create  │
 │  our team create a pro site. │  │  your own site in minutes.   │
 │  [ Submit Inquiry → ]        │  │  [ Start Building → ]        │
 └──────────────────────────────┘  └──────────────────────────────┘
```

Two equal cards, side-by-side on desktop, stacked on mobile. Premium card styling consistent with current shadows/radii. The "It only takes 5 minutes" line sits as a small chip directly under the section heading.

**New route `src/routes/inquiry.tsx`** for the "Have Us Build It For You" path. Fields:
- Full name, Business name, Email, Phone
- Insurance niche (Select with `INSURANCE_NICHES`)
- Website goals (Textarea)
- Preferred contact method (Call / Text / Email radio)
- Optional notes (Textarea)
- Submit button "Submit Inquiry" → on submit, show inline success state ("Thanks — we'll reach out within 1 business day") and persist to localStorage key `lp_inquiry_submissions` (since we're local-only, per earlier scope).

Page uses AppHeader/AppFooter, the same warm neutral card styling as the builder, max-w-2xl.

**Header nav** (`src/components/app/app-header.tsx`) — add "Have us build it" link pointing to `/inquiry`. Keep Home, Builder, Preview.

### 4. Smooth float-away → fade page transitions

Add reusable transition primitives in `src/styles.css`:

```css
@keyframes lp-page-in {
  0%   { opacity: 0; transform: translateY(14px) scale(0.992); }
  100% { opacity: 1; transform: translateY(0)    scale(1); }
}
@keyframes lp-page-out {
  0%   { opacity: 1; transform: translateY(0)    scale(1); }
  100% { opacity: 0; transform: translateY(-10px) scale(0.996); }
}
.lp-page-enter { animation: lp-page-in 420ms cubic-bezier(0.22, 1, 0.36, 1) both; }
.lp-page-leave { animation: lp-page-out 280ms cubic-bezier(0.4, 0, 0.2, 1) both; }
@media (prefers-reduced-motion: reduce) {
  .lp-page-enter, .lp-page-leave { animation: none; }
}
```

**New hook `src/hooks/use-page-transition.ts`** exposing `transitionTo(path)`:
1. Adds `.lp-page-leave` to `document.body` (or a wrapper).
2. Waits ~280ms.
3. Calls TanStack `navigate({ to: path })`.

**New component `src/components/app/page-transition.tsx`** that wraps each page's root `<div>` and applies `lp-page-enter` on mount (using `useLocation().pathname` as the key so it re-fires on every route change). Wrap the four main pages: `/`, `/builder`, `/preview`, `/signup`, `/inquiry`.

Wire `transitionTo` into:
- The two cards in "How would you like to get started?" (Submit Inquiry → `/inquiry`, Start Building → `/builder`).
- All hero CTAs ("Get Started", "Make it yours", "Start building", "Create an account").
- Builder's "Generate My Website" submit (after `saveBuilder`, transition to `/preview`).
- Signup's submit (transition to `/builder` instead of `setTimeout`).

This produces the requested float-away (current page slides up and fades) → fade-in (next page settles down into place). Subtle, ~700ms total, honoring `prefers-reduced-motion`.

### 5. Files touched

- Edit: `src/routes/__root.tsx`, `src/routes/index.tsx`, `src/routes/builder.tsx`, `src/routes/signup.tsx`, `src/routes/preview.tsx`, `src/components/app/app-header.tsx`, `src/components/generated/generated-landing.tsx`, `src/lib/builder-storage.ts`, `src/styles.css`
- Create: `src/routes/inquiry.tsx`, `src/components/app/page-transition.tsx`, `src/hooks/use-page-transition.ts`

### Out of scope (per earlier decisions)

No backend, no real auth, no CRM/analytics/billing, no team accounts. Inquiry submissions are stored locally only.

