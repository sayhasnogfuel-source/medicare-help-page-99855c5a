import { useEffect, useState } from "react";
import { createFileRoute, useNavigate, useSearch } from "@tanstack/react-router";
import { z } from "zod";
import diploofly from "@/assets/diploofly-logo.png";
import { useAuth } from "@/lib/account";
import { toast } from "sonner";

const searchSchema = z.object({
  redirect: z.string().optional(),
});

export const Route = createFileRoute("/auth/callback")({
  component: AuthCallbackPage,
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "Signing in… — Diploo" },
      { name: "robots", content: "noindex" },
    ],
  }),
});

/**
 * Normalize a "redirect" search param into a safe in-app path. We never want
 * to navigate to an absolute URL, a protocol-relative URL (//evil.com), or a
 * non-existent destination. If the value isn't a clean in-app path we fall
 * back to /dashboard.
 */
function safeRedirectPath(raw: string | undefined): string {
  if (!raw) return "/dashboard";
  let value = raw;
  // The link from signin/signup may double-encode this when it round-trips
  // through the OAuth broker. Decode defensively.
  try {
    if (value.startsWith("%2F") || value.includes("%3F")) {
      value = decodeURIComponent(value);
    }
  } catch {
    // ignore — fall through to the literal value
  }
  if (!value.startsWith("/")) return "/dashboard";
  if (value.startsWith("//")) return "/dashboard";
  return value;
}

function AuthCallbackPage() {
  const navigate = useNavigate();
  const { redirect } = useSearch({ from: "/auth/callback" });
  const { hydrated, user } = useAuth();
  // Grace window: even after the auth provider says it's hydrated, Supabase
  // may still be parsing the OAuth tokens out of the URL fragment. Don't
  // declare the sign-in failed until that window has passed.
  const [graceExpired, setGraceExpired] = useState(false);

  useEffect(() => {
    const t = window.setTimeout(() => setGraceExpired(true), 4000);
    return () => window.clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    const dest = safeRedirectPath(redirect);
    if (user) {
      navigate({ to: dest, replace: true });
      return;
    }
    if (graceExpired) {
      // Auth still has no session after the grace window — most likely the
      // user canceled OAuth or the broker dropped the token exchange.
      toast.error("Sign in didn't complete. Please try again.");
      navigate({ to: "/signin", replace: true });
    }
  }, [hydrated, user, redirect, navigate, graceExpired]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <img
          src={diploofly}
          alt=""
          className="h-16 w-16 animate-pulse object-contain"
        />
        <span className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
          Finishing sign in…
        </span>
      </div>
    </div>
  );
}