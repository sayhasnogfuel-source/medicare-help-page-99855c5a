

## Why login isn't working

There is no sign-in page in the app. Returning users have no way to log in with their email and password.

Concretely:
- `src/lib/account.ts` already exports a working `signInWithEmail()` function — but **nothing in the UI calls it**.
- The header's "Sign in" button (`app-header.tsx` line 91) links to `/signup`.
- The signup page's "Already have one? Sign in" link (`signup.tsx` line 70) also links to `/signup` (itself).
- There is no `src/routes/signin.tsx` (or `/login`) route file at all.
- The auth logs confirm this: every recent email auth event is `user_repeated_signup` from the `/signup` page — Supabase silently rejects the duplicate signup without creating a session, so the user appears stuck.
- Google sign-in works (the logs show successful `oidc` logins), which is why only that path currently completes.

## Fix

### 1. Create `src/routes/signin.tsx`
A new public route mirroring the signup card design:
- Email + password fields, calling `signInWithEmail()` from `@/lib/account`.
- "Continue with Google" button calling `signInWithGoogle()`.
- "Forgot password?" link that triggers `supabase.auth.resetPasswordForEmail(email, { redirectTo: <origin>/reset-password })` and shows a toast.
- "Don't have an account? Create one" link to `/signup`.
- On success, navigate to `/builder`.
- Toast errors on bad credentials / unconfirmed email.

### 2. Wire up the navigation links
- `src/components/app/app-header.tsx`: change both "Sign in" buttons (desktop line 91, and add one to the mobile menu around line 134) to link to `/signin` instead of `/signup`.
- `src/routes/signup.tsx`: change the "Already have one? Sign in" link (line 70) to `/signin`.

### 3. (Optional polish) Add a "Forgot password?" link on `/signin`
Inline below the password field — opens a small dialog/inline form that calls `resetPasswordForEmail`, then a toast tells the user to check their inbox. The existing `/reset-password` route already handles the recovery callback correctly.

## Files

| File | Change |
|---|---|
| `src/routes/signin.tsx` | **New** — sign-in page with email/password + Google + forgot-password |
| `src/components/app/app-header.tsx` | Point "Sign in" links to `/signin` (desktop + add to mobile menu) |
| `src/routes/signup.tsx` | Fix "Sign in" link to point to `/signin` |

No database, edge function, or Supabase configuration changes are needed — `signInWithEmail` already exists and the auth provider is configured.

## How to test in the preview

1. **Sign up first** (so you have credentials): go to `/signup`, fill out the form with a real email + ≥8-character password, submit. You may need to confirm the email depending on auth settings.
2. **Sign out** from the header.
3. Click **Sign in** in the header — you should land on `/signin`.
4. Enter the same email + password and submit → expect to land on `/builder` and the header to show "Sign out" + "Dashboard".
5. **Wrong password test**: try a wrong password → expect a red toast "Invalid login credentials".
6. **Forgot password test**: click "Forgot password?", submit your email, check inbox for the recovery email, click the link → it lands on `/reset-password` where you set a new password.
7. **Google path**: click "Continue with Google" on `/signin` → completes OAuth and returns to `/builder`.

No Stripe test card is needed for any of these flows — sign-in is independent of billing.

