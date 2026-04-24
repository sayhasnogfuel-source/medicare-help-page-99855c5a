import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/lib/account";

/**
 * Client-side auth gate. Waits for the centralized auth state to hydrate AND
 * for a short grace window before deciding to redirect to sign-in. The grace
 * window absorbs the brief gap right after sign-in / token-refresh where the
 * Supabase client says "hydrated" but a new session event hasn't been
 * dispatched yet — without it we'd briefly bounce authenticated users back
 * to /signin and trip the global error overlay.
 */
export function AuthGuard({
  children,
  redirectTo = "/signin",
}: {
  children: React.ReactNode;
  redirectTo?: string;
}) {
  const { hydrated, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [graceExpired, setGraceExpired] = useState(false);

  useEffect(() => {
    const t = window.setTimeout(() => setGraceExpired(true), 1500);
    return () => window.clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    if (user) return;
    if (!graceExpired) return;
    navigate({
      to: redirectTo,
      search: { redirect: location.pathname } as never,
      replace: true,
    });
  }, [hydrated, user, navigate, redirectTo, location.pathname, graceExpired]);

  if (!hydrated || !user) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--surface-mocha)] border-t-transparent" />
      </div>
    );
  }

  return <>{children}</>;
}
