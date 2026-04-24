

## Goal

Make only the **logo** look polished and "fit" the page properly — no other site changes.

## What changes

### 1. Replace the current logo asset
The current `src/assets/diploofly-logo.png` is the AI-generated brown "D" mark on a transparent background — at small sizes it looks pixelated and tacky next to the crisp wordmark text. Swap it for a clean, vector-style SVG mark that renders perfectly sharp at any size.

- New file: `src/assets/diploofly-logo.svg` — a minimal geometric "D" mark (rounded square container + stylized D) drawn in pure SVG using the existing brand mocha color (`#5a3a22` family, matching `--surface-mocha`).
- Delete dependence on the PNG in the header/footer (keep the PNG file for the favicon for now).

### 2. Header (`src/components/app/app-header.tsx`)
- Import the SVG instead of the PNG.
- Slightly smaller, tighter lockup so it sits naturally next to the wordmark:
  - Mark: `h-7 w-7` (was `h-8 w-8`)
  - Wordmark: keep current size, reduce gap to `gap-2`, add `-tracking-[0.01em]` for a tighter, more premium feel.
- Vertically center the mark with the wordmark's optical baseline (small `-mt-px` nudge).

### 3. Footer (`src/components/app/app-footer.tsx`)
- Same swap: SVG mark, `h-7 w-7`, tighter gap, same wordmark treatment.

### 4. Favicon
- Leave `public/diploofly-icon.png` as-is for now (browser tab). No change needed.

## Files touched

- New: `src/assets/diploofly-logo.svg`
- Edited: `src/components/app/app-header.tsx` (swap import, tweak sizing/tracking)
- Edited: `src/components/app/app-footer.tsx` (swap import, tweak sizing/tracking)

## Result

The Diploofly mark in the header and footer becomes a crisp, vector logo that scales perfectly, sits properly aligned with the wordmark, and looks professional instead of pixel-y. Nothing else on the site changes.

