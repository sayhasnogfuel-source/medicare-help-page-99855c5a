import { Link } from "@tanstack/react-router";
import { Sparkles, Zap } from "lucide-react";
import { useUserCredits, PLAN_LABELS } from "@/lib/user-credits";

/**
 * Compact credits indicator for use inside the builder/dashboard chrome.
 * Shows current plan, credits remaining, and an Upgrade link when low.
 */
export function CreditsBadge() {
  const { plan, credits, planTotal, isLow, isEmpty, hydrated } = useUserCredits();
  if (!hydrated) return null;

  const tone = isEmpty
    ? "border-destructive/40 bg-destructive/10 text-destructive"
    : isLow
      ? "border-amber-400/40 bg-amber-100/60 text-amber-900"
      : "border-border bg-background text-foreground/80";

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span
        className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${tone}`}
      >
        <Zap className="h-3.5 w-3.5" />
        {credits} / {planTotal || "∞"} credits
      </span>
      <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-[var(--surface-sand)]/70 px-3 py-1 text-xs font-medium text-foreground/75">
        <Sparkles className="h-3.5 w-3.5" />
        {PLAN_LABELS[plan]}
      </span>
      {(isLow || isEmpty) && (
        <Link
          to="/pricing"
          className="inline-flex items-center gap-1 rounded-full bg-[var(--surface-mocha)] px-3 py-1 text-xs font-semibold text-[var(--surface-cream)] hover:bg-[var(--surface-espresso)]"
        >
          Upgrade
        </Link>
      )}
    </div>
  );
}