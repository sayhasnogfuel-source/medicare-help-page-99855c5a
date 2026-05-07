# Mature "Lovable-style" UI refinement

Keep the existing warm cream/mocha palette, but tighten the visual language to feel like a serious modern SaaS (lovable.dev, linear.app, vercel.com): sharper edges, calmer surfaces, more whitespace, less decorative motion, more deliberate typography.

## What changes

### 1. Global tokens (`src/styles.css`)
- Tighten radius: `--radius` from `0.875rem` → `0.625rem` (smaller, more grown-up corners; cards stop looking pillowy).
- Calmer shadows: reduce blur/opacity on `--shadow-sm/md/lg` so cards sit on the page instead of floating.
- Slightly cooler border: bump `--border` chroma down so outlines read as crisp hairlines rather than warm tan.
- Tone down ambient motion: keep keyframes but lower default opacity on `.lp-orb` and disable the CTA shimmer sweep by default (opt-in via a separate class). Lovable's site is mostly still — motion should be the exception.

### 2. Header (`src/components/app/app-header.tsx`)
- Replace the rounded-full nav pills with subtle underline-on-hover links (Lovable-style top bar). Active state = foreground color + thin underline, not a filled pill.
- Slim the bar: `py-3.5` → `py-3`, smaller logo mark.
- "Create account" CTA: switch from full-pill mocha to a square-ish (radius-md) solid button with a thin 1px border highlight — matches Lovable's primary button feel.
- "Sign in" stays as a quiet ghost link.

### 3. Hero (`src/routes/index.tsx` → `Hero`)
- Remove the floating decorative cards ("AI building your site" / "New lead captured") — they read as marketing fluff. Lovable's hero is clean text + CTA.
- Remove the radial orbs OR keep one extremely faint one. Replace with a subtle grid/dot background using a CSS background-image so the hero feels structured, not dreamy.
- Eyebrow chip: keep, but make it square-edged (rounded-md) with a single thin border, no shadow.
- H1: tighten — `text-6xl` is fine but reduce `leading` and add `-tracking-[0.02em]` for that modern editorial feel.
- CTAs: square-ish radius (rounded-md or rounded-lg, not rounded-full). Drop `lp-cta-shimmer` and `lp-cta-glow`. Primary = solid mocha, secondary = outline with hairline border.
- Trust row: smaller, monochrome, no green-ish check tint.

### 4. Section cards (HowItWorks, Benefits, BuiltIn)
- Cards: `rounded-3xl` → `rounded-xl`, `shadow-sm` → no shadow + `border-border/80`. This single change is the biggest "mature" upgrade.
- Icon chips: `rounded-2xl` → `rounded-md`, smaller (h-9 w-9), muted background instead of sand.
- Section eyebrows already use uppercase tracked text — keep, this is on-brand for the new look.
- Increase vertical rhythm slightly (`py-20` → `py-24`) and constrain headings to `max-w-xl` for tighter line lengths.

### 5. WhoItsFor chips
- Pill chips → small square-radius tags (`rounded-md`), thinner border, no shadow, smaller text.

### 6. Footer (`src/components/app/app-footer.tsx`)
- Light pass to match: hairline top border, smaller text, links use the same underline-on-hover treatment as the header.

## What stays the same
- Color palette (cream, sand, mocha, espresso) — untouched.
- Page structure, copy, routes, all functionality.
- Logo and brand mark.

## Files touched
- `src/styles.css` (tokens + motion toning)
- `src/components/app/app-header.tsx` (nav + CTA restyle)
- `src/components/app/app-footer.tsx` (light pass)
- `src/routes/index.tsx` (hero cleanup, card restyle across sections)

## Out of scope
- Auth, builder, workspace, dashboard internal UI. Once you approve the marketing/header pass, we can apply the same token changes app-wide in a follow-up — most of it will inherit automatically from the radius + shadow + border token updates.
