

## Why "Continue with Google" doesn't open Google

Right now there is no real authentication in the project. The whole account system is a mock that writes a flag to `localStorage` (`src/lib/account.ts`). The Google buttons do one of two things:

- On `/` (home) and `/start`: they just navigate to `/signup` — no Google call at all.
- On `/signup`: they call `signIn({ provider: "google" })` which only sets a local flag and pushes the user to `/builder`.

There is no OAuth redirect, no Google consent screen, no backend session. That is why nothing happens with Google.

## Fix: wire up real Google sign-in via Lovable Cloud

Lovable Cloud (Supabase) supports Google natively. The plan replaces the mock with a real auth flow while keeping the existing UI.

### 1. Enable Lovable Cloud + Google provider
- Turn on Lovable Cloud for the project (creates the Supabase backend and `VITE_SUPABASE_*` env vars).
- Enable the Google provider in Auth settings (uses Lovable's shared Google OAuth credentials by default — no Google Cloud Console setup required).

### 2. Add a Supabase client
- New file `src/lib/supabase.ts` exporting a browser client built from `import.meta.env.VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY`.

### 3. Replace the mock account store
- Rewrite `src/lib/account.ts` so `useAccount` subscribes to `supabase.auth.onAuthStateChange` (set listener BEFORE calling `getSession()` to avoid race conditions).
- Replace the `signIn(...)` helper with two real functions:
  - `signInWithGoogle()` → `supabase.auth.signInWithOAuth({ provider: "google", options: { redirectTo: window.location.origin + "/builder" } })`. This is what triggers the real Google redirect.
  - `signUpWithEmail({ email, password, firstName })` → `supabase.auth.signUp({ email, password, options: { data: { first_name }, emailRedirectTo: window.location.origin } })`.
  - `signInWithEmail({ email, password })` → `supabase.auth.signInWithPassword(...)`.
- Keep the same `useAccount()` shape (`signedIn`, `email`, `firstName`, `hydrated`) so no consumers break.

### 4. Wire the Google buttons to the real call
- `src/routes/index.tsx` hero "Continue with Google" → `onClick={signInWithGoogle}` (no longer routes to `/signup`).
- `src/routes/start.tsx` hero "Continue with Google" → same.
- `src/routes/signup.tsx` "Continue with Google" → same (remove the `signIn({ provider: "google" })` mock + manual `transitionTo`).
- The email form on `/signup` calls `signUpWithEmail(...)` and then routes to `/builder` only after success.

### 5. Add a `/reset-password` route (required when email auth is on)
- Public route that reads `type=recovery` from the URL hash and calls `supabase.auth.updateUser({ password })`. Without it, password resets silently log users in.

### 6. Sign-out + AuthGuard
- `src/components/app/app-header.tsx` "Sign out" → `await supabase.auth.signOut()`.
- `src/components/app/auth-guard.tsx` keeps working unchanged because `useAccount()` keeps the same surface.

### 7. (Optional) Profiles table
- I'll ask whether to store user profile data (first name, agency name, avatar, etc.). If yes, I'll add a `profiles` table linked to `auth.users` with RLS + an auto-insert trigger on signup. If no, we use only `auth.users` and skip the table.

## Files touched

- New: `src/lib/supabase.ts`, `src/routes/reset-password.tsx`
- Edited: `src/lib/account.ts`, `src/routes/index.tsx`, `src/routes/start.tsx`, `src/routes/signup.tsx`, `src/components/app/app-header.tsx`
- Possibly: a migration for the `profiles` table if you want stored profile data

## What you'll see after this ships

Clicking "Continue with Google" on the home page, start page, or signup page will redirect to the real Google account-chooser screen, then return the user to `/builder` already signed in with a real session.

