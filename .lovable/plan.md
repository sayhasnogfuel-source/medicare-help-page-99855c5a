
Goal: finish the auth rebuild properly so sign-in no longer drops users into the global error screen and navigation stays stable after authentication.

What is still wrong in the current code
- The auth rework is only partial:
  - `src/router.tsx` still has an empty router context, so there is no real route-level auth system yet.
  - Protected pages still rely on the client-side `AuthGuard` component (`builder`, `dashboard`, `start`) instead of `beforeLoad` redirects.
  - `workspace` is not behind the same auth boundary at all, and `billing` uses a separate in-component check.
  - `src/routes/auth.callback.tsx` treats “hydrated but no user yet” as a failed login immediately, which is too early for OAuth/session restoration.
  - `signin.tsx` and `signup.tsx` still navigate directly into protected pages instead of using one consistent post-auth finalization path.
- Backend verification also shows the credits trigger function exists, but no trigger is currently active in the live backend, so new users may not get their credits row consistently.

Implementation plan

1. Finish the auth architecture with a real route-level boundary
- Update `src/router.tsx` and `src/routes/__root.tsx` so auth state is passed through router context.
- Add a pathless authenticated layout route using TanStack `beforeLoad` + `redirect()`.
- Move protected pages under that boundary while keeping the same public URLs:
  - `/builder`
  - `/dashboard`
  - `/workspace`
  - `/billing`
  - `/start`
- Remove dependency on render-time redirects for auth protection.

2. Replace `AuthGuard` entirely
- Delete or stop using `src/components/app/auth-guard.tsx`.
- Convert current protected route files to use the new authenticated layout instead of wrapping page components.
- This prevents protected pages from mounting before auth is truly ready.

3. Make the auth callback resilient instead of fail-fast
- Rework `src/routes/auth.callback.tsx` so it:
  - shows the Diploofly loading screen,
  - waits for centralized auth readiness,
  - gives OAuth/session restoration a short grace window before deciding login failed,
  - only sends the user back to `/signin` if auth still has no session after that window.
- Use replace-style navigation so the callback screen does not pollute history.

4. Unify every login path through the same finalization flow
- Update `src/lib/account.ts`:
  - Google sign-in should always return to `/auth/callback`.
  - Email sign-in should not push straight into a protected route before auth state catches up.
  - Signup should also finish through the same callback/finalization path.
- Update `src/routes/signin.tsx` and `src/routes/signup.tsx` so success handling is consistent across Google and email.

5. Fix redirect handling so post-login destinations are safe
- Normalize redirect parsing so paths like `/checkout?plan=starter` are handled safely.
- Avoid passing raw querystrings as a plain TanStack `to` target.
- Preserve redirect-back behavior for protected pages, checkout, and billing.

6. Harden auth-dependent data hooks
- Update `src/lib/user-credits.ts` and `src/lib/subscription.ts` so they:
  - run only when auth is ready and a user exists,
  - explicitly handle Supabase `error` responses instead of assuming success,
  - reset state immediately on sign-out,
  - keep UI stable if the row does not exist yet.
- Ensure header and other shared UI render harmless fallbacks while auth/data bootstrap is settling.

7. Verify and fix the backend credits bootstrap
- Apply the missing database trigger so new users automatically get a `user_credits` row.
- Backfill any existing users missing credits.
- Keep the frontend tolerant even if the row is briefly absent during first login.

Files likely involved
- `src/router.tsx`
- `src/routes/__root.tsx`
- new authenticated layout route file
- `src/components/app/auth-guard.tsx` (remove/retire)
- `src/lib/account.ts`
- `src/routes/auth.callback.tsx`
- `src/routes/signin.tsx`
- `src/routes/signup.tsx`
- `src/routes/builder.tsx`
- `src/routes/dashboard.tsx`
- `src/routes/workspace.tsx`
- `src/routes/billing.tsx`
- `src/routes/start.tsx`
- `src/lib/user-credits.ts`
- `src/lib/subscription.ts`
- one migration file for the missing credits trigger

Technical details
- Use TanStack `beforeLoad` auth protection, not in-component redirects.
- Keep one auth listener for the whole app.
- Do not treat “no user on first hydrated tick” as immediate OAuth failure.
- Route all successful auth flows through one finalization screen.
- Do not manually edit `src/routeTree.gen.ts`.

Validation checklist
- Google sign-in completes without showing the global error page.
- Email sign-in completes without bouncing or flashing back to sign-in.
- Clicking Home, Pricing, Support, Builder, Dashboard, Workspace, and Billing after login does not trigger the error screen.
- Redirect-back works when login starts from a protected page or checkout.
- Signing out returns the app to a clean public state.
- Brand-new users receive starter credits automatically.
