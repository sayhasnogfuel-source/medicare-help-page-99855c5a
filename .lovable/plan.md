

## Goal

Rebrand the entire site from "Lumen.pages" to **Diploofly** and use the uploaded logo image in the header and footer.

## What changes

### 1. Add the logo asset
- Copy `user-uploads://ChatGPT_Image_Apr_23_2026_06_41_24_PM.png` into `src/assets/diploofly-logo.png` (full lockup: D-mark + wordmark).
- Also copy a square favicon-friendly version into `public/diploofly-icon.png` for the browser tab and OG fallback.

### 2. Header (`src/components/app/app-header.tsx`)
- Replace the Sparkles-icon-in-a-square + "Lumen.pages" text with the imported logo image.
- Render as a single `<img src={diploofly} alt="Diploofly" className="h-8 w-auto" />` inside the `<Link to="/">`.
- Update `aria-label="Lumen home"` → `aria-label="Diploofly home"`.
- Drop the now-unused `Sparkles` import.

### 3. Footer (`src/components/app/app-footer.tsx`)
- Same swap: logo image instead of icon + wordmark.
- Update copyright line: `© {year} Diploofly — Built for independent insurance agents.`
- Drop the `Sparkles` import.

### 4. Site-wide text rebrand
Find-and-replace **"Lumen.pages"** → **"Diploofly"** and **"Lumen"** → **"Diploofly"** across:
- `src/routes/__root.tsx` (title, description, author, og:title, og:description, twitter tags)
- `src/routes/index.tsx` (head meta + the "Why agents choose Lumen" eyebrow → "Why agents choose Diploofly")
- `src/routes/pricing.tsx`, `src/routes/billing.tsx`, `src/routes/support.tsx`, `src/routes/signup.tsx`, `src/routes/reset-password.tsx`, `src/routes/builder.tsx`, `src/routes/inquiry.tsx` (all head meta titles/descriptions)
- Any remaining body copy mentioning Lumen across components/routes

### 5. Browser tab
- Update `<link rel="icon">` in `__root.tsx` head to point to `/diploofly-icon.png`.

### 6. Theme alignment (light touch)
The logo's brown/tan palette already matches the existing warm-neutral theme (mocha/camel/cream tokens in `styles.css`), so no color-token changes are needed. The logo will sit naturally in the header and footer.

## Files touched

- New: `src/assets/diploofly-logo.png`, `public/diploofly-icon.png`
- Edited: `src/components/app/app-header.tsx`, `src/components/app/app-footer.tsx`, `src/routes/__root.tsx`, `src/routes/index.tsx`, `src/routes/pricing.tsx`, `src/routes/billing.tsx`, `src/routes/support.tsx`, `src/routes/signup.tsx`, `src/routes/reset-password.tsx`, `src/routes/builder.tsx`, `src/routes/inquiry.tsx`

## Result

Every page header and footer shows the actual Diploofly logo, the browser tab shows the Diploofly mark, and every meta title, description, social card, and on-page mention reads "Diploofly" instead of "Lumen.pages".

