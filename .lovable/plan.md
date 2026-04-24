Goal: stop the real crash that happens after login so the app no longer falls into the global error screen when a signed-in page mounts.

What the actual issue is
- I reproduced the failure by opening a signed-in route.
- The global error page is not being caused by the login form itself anymore.
- The immediate crash is this runtime error:
  `cannot add 'postgres_changes' callbacks for realtime:subscriptions-changes-<userId> after 'subscribe()'`
- That error comes from `src/lib/subscription.ts`, and it matches Supabase’s newer behavior: once a channel topic is already joining/joined, adding `postgres_changes` listeners to that same topic throws.
- Because `useSubscription()` is used in shared UI like `AppHeader` and again inside pages like `dashboard` and `billing`, the same channel topic is getting registered more than once. In development/preview, React’s effect behavior makes this easier to hit.
- `useUserCredits()` uses the same pattern and should be hardened too, even though the visible crash right now is the subscription hook.

Implementation plan

1. Fix the realtime channel lifecycle in the shared hooks
- Update `src/lib/subscription.ts` so it does not create a conflicting channel topic on repeated mounts.
- Before creating a new subscription channel, clean up any existing channel with the same topic, or switch to a unique topic strategy that cannot collide.
- Ensure listeners are attached before `subscribe()` and that cleanup always removes the channel reliably.
- Apply the same hardening to `src/lib/user-credits.ts` to prevent the next identical crash from surfacing there.

2. Reduce duplicate subscriptions from shared UI
- Review where `useSubscription()` is mounted, especially `src/components/app/app-header.tsx`, `src/routes/dashboard.tsx`, `src/routes/billing.tsx`, `src/routes/pricing.tsx`, and `src/routes/checkout.return.tsx`.
- Keep the existing UX, but avoid needless duplicate realtime subscriptions where a one-time fetch is enough.
- If needed, centralize the subscription state the same way auth was centralized so header + pages read one shared source instead of each opening their own realtime channel.

3. Keep auth fixes targeted instead of rebuilding everything again
- Leave the current sign-in/callback flow in place unless testing shows a second issue after the realtime crash is removed.
- Re-test `signin`, `auth.callback`, and protected pages only after the hook crash is fixed, so any remaining auth issue can be isolated cleanly instead of being masked by the channel exception.

4. Validate the exact user journey that is failing now
- Test signed-in navigation across:
  - `/dashboard`
  - `/billing`
  - `/pricing`
  - `/builder`
  - `/workspace`
- Confirm that Google/email sign-in can complete without landing on the global error screen.
- Confirm that clicking around after login no longer triggers the crash.

Files to change
- `src/lib/subscription.ts`
- `src/lib/user-credits.ts`
- likely `src/components/app/app-header.tsx`
- possibly `src/routes/dashboard.tsx`
- possibly `src/routes/billing.tsx`
- possibly `src/routes/pricing.tsx`
- possibly `src/routes/checkout.return.tsx`

Technical details
- Supabase now throws if `channel.on('postgres_changes', ...)` is called on a channel topic that has already subscribed/joined.
- React preview/dev behavior can mount effects more than once, so hooks that reuse fixed channel names must be idempotent.
- The fix is to make channel creation/cleanup collision-safe and avoid multiple independent realtime subscriptions for the same user/topic when shared UI and page UI mount together.

Validation checklist
- Sign in no longer lands on “Something went wrong”.
- Signed-in navigation to Dashboard and Billing does not crash.
- Header renders while signed in without opening a conflicting realtime subscription.
- Credits and subscription state still load correctly.
- If any auth bug remains after this fix, it will appear as a separate issue rather than the current site-wide crash.