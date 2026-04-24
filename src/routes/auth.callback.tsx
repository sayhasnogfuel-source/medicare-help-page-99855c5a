import { useEffect } from "react";
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
      { title: "Signing in… — Diploofly" },
      { name: "robots", content: "noindex" },
    ],
  }),
});

function AuthCallbackPage() {
  const navigate = useNavigate();
  const { redirect } = useSearch({ from: "/auth/callback" });
  const { hydrated, user } = useAuth();

  useEffect(() => {
    if (!hydrated) return;
    const dest = (redirect && redirect.startsWith("/") ? redirect : null) || "/dashboard";
    if (user) {
      navigate({ to: dest });
    } else {
      // Auth completed without a session — most likely user canceled OAuth.
      toast.error("Sign in didn't complete. Please try again.");
      navigate({ to: "/signin" });
    }
  }, [hydrated, user, redirect, navigate]);

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