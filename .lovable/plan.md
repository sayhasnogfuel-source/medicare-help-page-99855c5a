
Goal: rebuild the sign-in flow so login is stable, Google and email behave the same, and the app never falls into a site-wide error state after authentication.

1. Centralize authentication state
- Replace the current pattern where `useAccount()` is called independently in many places (`AppHeader`, `AuthGuard`, `signin`, `pricing`, `checkout`, `billing`, `useSubscription`, `useUserCredits`).
- Create one root auth source that restores the session once, listens for auth changes once, and exposes:
  - `isReady`
  - `isAuthenticated`
  - `user`
  - `session`
  - `signIn/signOut` helpers
- Wire that state through the root app so every route and hook reads the same auth snapshot.

Why this matters:
- Right now auth is fragmented across multiple hooks, which can put the app in inconsistent states during login redirects.
- Shared UI like the header mounts auth-dependent hooks on public pages, which increases the chance of auth/data races right after login.

2. Move protected pages behind a real route-level auth boundary
- Replace the client-side `AuthGuard` component with a TanStack protected layout route using `beforeLoad` + `redirect()`.
- Keep the public pages public (`/`, `/pricing`, `/support`, `/signin`, `/signup`, `/reset-password`).
- Move protected pages under the authenticated boundary while keeping the same URLs:
  - `/builder`
  - `/dashboard`
  - `/workspace`
  - `/billing`
  - any other page that should require login
- Preserve redirect-back behavior so users return to the page they meant to visit after signing in.

Why this matters:
- The current guard waits until render time, which is more fragile during login transitions.
- Route-level auth prevents protected pages from partially mounting before the session is fully ready.

3. Split sign-in from auth callback/finalization
- Keep `/signin` as the manual sign-in page.
- Add a dedicated auth callback/finalization route that only does one job:
  - show the logo loading screen
  - wait for centralized auth to become ready
  - optionally wait for first authenticated bootstrap fetches to settle
  - redirect to the intended destination or a safe default like `/dashboard`
- Update Google sign-in to return to that callback route instead of dropping straight into a protected page.
- Update email/password sign-in to use the same post-login finalization path.

Why this matters:
- Right now login completion and app navigation are mixed together.
- A dedicated callback screen is the safest place to absorb OAuth timing and session hydration delays.

4. Refactor auth-dependent data hooks to be safe during login
- Rework `useSubscription()` and `useUserCredits()` so they depend on the centralized auth state instead of calling `useAccount()` internally.
- Only run their queries when auth is fully ready and a user exists.
- Add proper error handling and safe fallbacks instead of silently proceeding with partial state.
- Reset local state immediately on sign-out.
- Make realtime subscriptions start only after auth is ready, and tear down cleanly on sign-out.
- Filter queries by the current user where appropriate, instead of relying only on implicit row policies.

Why this matters:
- These hooks are mounted in global/shared areas like the header and protected pages.
- They need to be impossible to misfire during auth initialization.

5. Clean up all auth entry points and redirects
- Update every “sign in” CTA that still sends people to `/signup` so the flow is consistent:
  - pricing page
  - checkout page
  - billing page
  - any remaining auth prompts
- Standardize the destination after successful login.
- Use the logo loading screen for auth bootstrap only, not as a general workaround for broken state.

6. Add resilient error handling around auth flows
- Keep the root error page, but make auth-related routes/components fail gracefully instead of collapsing the whole app.
- Show inline auth errors for:
  - invalid credentials
  - canceled Google sign-in
  - missing session after callback
  - failed bootstrap fetches
- Avoid navigating into protected pages until auth is confirmed ready.

7. Backend verification
- Verify the existing backend pieces are actually active for the current project:
  - `user_credits` table
  - `subscriptions` table
  - the new-user credits trigger
- If the new-user credits trigger is missing in the live backend, apply/fix the migration so new accounts always get initialized correctly.
- No new backend tables should be needed unless that verification reveals a missing migration.

Files likely involved
- `src/lib/account.ts`
- `src/routes/__root.tsx`
- `src/router.tsx`
- `src/components/app/auth-guard.tsx` (remove/replace)
- `src/components/app/app-header.tsx`
- `src/lib/user-credits.ts`
- `src/lib/subscription.ts`
- `src/routes/signin.tsx`
- `src/routes/pricing.tsx`
- `src/routes/checkout.tsx`
- `src/routes/billing.tsx`
- protected route files for builder/dashboard/workspace
- new auth callback route file
- backend migration only if trigger verification fails

Technical implementation notes
- Use TanStack route protection with `beforeLoad`, not component-time redirects.
- Do not edit `src/routeTree.gen.ts` manually.
- Keep one auth listener for the whole app.
- Gate authenticated queries behind `auth.isReady && !!auth.user`.
- Use a dedicated callback/loading route with the Diploofly logo.

Validation checklist
- Email/password sign-in succeeds and lands on the intended page.
- Google sign-in succeeds and lands on the intended page.
- Clicking Home, Pricing, Support, Builder, Dashboard, Billing after login does not show the global error page.
- Signing out returns the app to a clean public state.
- Fresh new accounts receive usable starter credits.
- Wrong password, canceled OAuth, and expired recovery links show readable inline errors instead of breaking navigation.
