import { useEffect } from "react";
import { useLocation, useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/lib/account";

/**
 * Client-side auth gate. Waits for the centralized auth state to hydrate
 * before deciding whether to render children or redirect to sign-in. Never
 * fires before hydration, so it cannot send the user to /signin on a fast
 * page load when the session is still being restored.
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

  useEffect(() => {
    if (!hydrated) return;
    if (user) return;
    navigate({
      to: redirectTo,
      search: { redirect: location.pathname } as never,
      replace: true,
    });
  }, [hydrated, user, navigate, redirectTo, location.pathname]);

  if (!hydrated || !user) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--surface-mocha)] border-t-transparent" />
      </div>
    );
  }

  return <>{children}</>;
}
