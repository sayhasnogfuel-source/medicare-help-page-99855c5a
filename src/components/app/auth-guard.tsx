import { useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useAccount } from "@/lib/account";

/**
 * Client-side gate. When the visitor is not signed in, redirects to /signup
 * (or a custom destination). Renders nothing until hydration is complete to
 * avoid flashing protected content.
 */
export function AuthGuard({
  children,
  redirectTo = "/signup",
}: {
  children: React.ReactNode;
  redirectTo?: string;
}) {
  const account = useAccount();
  const navigate = useNavigate();

  useEffect(() => {
    if (account.hydrated && !account.signedIn) {
      navigate({ to: redirectTo });
    }
  }, [account.hydrated, account.signedIn, navigate, redirectTo]);

  if (!account.hydrated || !account.signedIn) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--surface-mocha)] border-t-transparent" />
      </div>
    );
  }

  return <>{children}</>;
}
