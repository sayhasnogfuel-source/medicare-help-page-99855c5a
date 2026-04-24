import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, X, Sparkles, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useBilling } from "@/lib/billing";
import { useAccount, signOut } from "@/lib/account";

const PUBLIC_NAV = [
  { to: "/", label: "Home" },
  { to: "/pricing", label: "Pricing" },
  { to: "/support", label: "Support" },
] as const;

const AUTHED_NAV = [
  { to: "/", label: "Home" },
  { to: "/pricing", label: "Pricing" },
  { to: "/builder", label: "Builder" },
  { to: "/dashboard", label: "Dashboard" },
  { to: "/support", label: "Support" },
] as const;

export function AppHeader() {
  const [open, setOpen] = useState(false);
  const billing = useBilling();
  const account = useAccount();
  const signedIn = account.hydrated && account.signedIn;
  const NAV = signedIn ? AUTHED_NAV : PUBLIC_NAV;
  const showBanner =
    billing.hydrated &&
    (billing.subStatus === "past_due" || billing.siteStatus === "suspended");
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/85 backdrop-blur-md">
      {showBanner && (
        <div className="border-b border-destructive/30 bg-destructive/10 text-destructive">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-5 py-2 text-xs font-medium sm:text-sm">
            <span className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 shrink-0" />
              <span>
                Payment issue —{" "}
                {billing.siteStatus === "suspended"
                  ? "your live website is paused."
                  : "your subscription is past due."}{" "}
                Update your card to restore service.
              </span>
            </span>
            <Link
              to="/billing"
              className="shrink-0 rounded-full border border-destructive/40 bg-background px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-destructive hover:bg-destructive/5"
            >
              Fix payment
            </Link>
          </div>
        </div>
      )}
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3.5">
        <Link to="/" className="flex items-center gap-2.5" aria-label="Lumen home">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--surface-mocha)] text-[var(--surface-cream)] shadow-[var(--shadow-sm)]">
            <Sparkles className="h-4.5 w-4.5" strokeWidth={2.2} />
          </span>
          <span className="text-[1.05rem] font-semibold tracking-tight text-foreground">
            Lumen<span className="text-muted-foreground">.pages</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="rounded-full px-3.5 py-2 text-sm font-medium text-foreground/70 transition-colors hover:bg-secondary hover:text-foreground"
              activeProps={{ className: "bg-secondary text-foreground" }}
              activeOptions={{ exact: true }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          {signedIn ? (
            <>
              <Button asChild variant="ghost" size="sm" className="rounded-full text-foreground/80">
                <Link to="/dashboard">Dashboard</Link>
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="rounded-full"
                onClick={() => signOut()}
              >
                Sign out
              </Button>
            </>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm" className="rounded-full text-foreground/80">
                <Link to="/signup">Sign in</Link>
              </Button>
              <Button asChild size="sm" className="rounded-full bg-[var(--surface-mocha)] text-[var(--surface-cream)] shadow-[var(--shadow-sm)] hover:bg-[var(--surface-espresso)]">
                <Link to="/signup">Create account</Link>
              </Button>
            </>
          )}
        </div>

        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border md:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <div className={cn("border-t border-border/60 md:hidden", open ? "block" : "hidden")}>
        <nav className="mx-auto flex max-w-6xl flex-col gap-1 px-5 py-3" aria-label="Mobile">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-2.5 text-base font-medium text-foreground/80 hover:bg-secondary"
            >
              {item.label}
            </Link>
          ))}
          {signedIn ? (
            <Button
              variant="outline"
              className="mt-2 w-full rounded-full"
              onClick={() => {
                signOut();
                setOpen(false);
              }}
            >
              Sign out
            </Button>
          ) : (
            <Button
              asChild
              className="mt-2 w-full rounded-full bg-[var(--surface-mocha)] text-[var(--surface-cream)] hover:bg-[var(--surface-espresso)]"
            >
              <Link to="/signup" onClick={() => setOpen(false)}>
                Create account
              </Link>
            </Button>
          )}
        </nav>
      </div>
    </header>
  );
}