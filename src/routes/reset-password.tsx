import { useEffect, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AppHeader } from "@/components/app/app-header";
import { AppFooter } from "@/components/app/app-footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/reset-password")({
  component: ResetPasswordPage,
  head: () => ({
    meta: [
      { title: "Reset password — Diploofly" },
      { name: "description", content: "Set a new password for your Diploofly account." },
    ],
  }),
});

function ResetPasswordPage() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    // Supabase parses the recovery hash automatically and emits PASSWORD_RECOVERY.
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY" || event === "SIGNED_IN") setReady(true);
    });
    // Fallback: if a session already exists or hash contains type=recovery, allow update.
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setReady(true);
    });
    if (typeof window !== "undefined" && window.location.hash.includes("type=recovery")) {
      setReady(true);
    }
    return () => sub.subscription.unsubscribe();
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <AppHeader />
      <main className="flex-1">
        <div className="mx-auto flex max-w-md items-center justify-center px-5 py-20">
          <Card className="w-full rounded-3xl border-border/60 bg-background p-8 shadow-[var(--shadow-lg)]">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              Set a new password
            </h1>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Enter and confirm your new password.
            </p>
            <form
              className="mt-6 space-y-4"
              onSubmit={async (e) => {
                e.preventDefault();
                if (submitting) return;
                const form = e.currentTarget as HTMLFormElement;
                const data = new FormData(form);
                const pw = String(data.get("password") || "");
                const confirm = String(data.get("confirm") || "");
                if (pw.length < 8) {
                  toast.error("Password must be at least 8 characters.");
                  return;
                }
                if (pw !== confirm) {
                  toast.error("Passwords do not match.");
                  return;
                }
                setSubmitting(true);
                const { error } = await supabase.auth.updateUser({ password: pw });
                if (error) {
                  toast.error(error.message);
                  setSubmitting(false);
                  return;
                }
                toast.success("Password updated. You're signed in.");
                navigate({ to: "/builder" });
              }}
            >
              <div className="space-y-2">
                <Label htmlFor="rp-pass">New password</Label>
                <Input id="rp-pass" name="password" type="password" required minLength={8} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="rp-confirm">Confirm password</Label>
                <Input id="rp-confirm" name="confirm" type="password" required minLength={8} />
              </div>
              <Button
                type="submit"
                size="lg"
                disabled={!ready || submitting}
                className="w-full rounded-full bg-[var(--surface-mocha)] text-base font-semibold text-[var(--surface-cream)] hover:bg-[var(--surface-espresso)]"
              >
                {!ready ? "Verifying link…" : submitting ? "Updating…" : "Update password"}
              </Button>
            </form>
          </Card>
        </div>
      </main>
      <AppFooter />
    </div>
  );
}
