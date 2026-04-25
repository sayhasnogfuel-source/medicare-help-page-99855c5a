## Problem

Once inside `/builder`, the only ways out are the Diploo logo (top-left) and the small "Dashboard" link in the header — neither reads as a back/exit affordance, so users feel trapped.

## Fix

Add a clearly visible **Back** button to the builder's top "dashboard chrome" card, next to the "Status: Draft" / "Save draft" / "Upgrade" controls.

### Behavior
- Label: **Back to start**
- Icon: `ArrowLeft` (lucide-react)
- Style: ghost / outline pill button, matching the existing "Save draft" button's look
- Destination: `/start` (the "How would you like to get started?" hub) — this matches how the user enters the builder
- Uses `transitionTo({ to: "/start" })` so the page transition animation stays consistent with the rest of the app
- Placed at the **left edge** of the actions row (before the Status pill) so it reads as a back control, not an action

### Files touched
- `src/routes/builder.tsx`
  - Add `ArrowLeft` to the existing `lucide-react` import block
  - Insert the Back button as the first child inside the actions `<div className="flex flex-wrap items-center gap-2">` (around line 148)

### Optional polish (included)
- On mobile, the Back button keeps its label so the affordance stays obvious (no icon-only collapse)
- Hovering shows a subtle background tint, matching other outline buttons in the builder

No other routes, no schema, no storage changes.
