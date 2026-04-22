import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navItems = [
  { to: "/", label: "Home" },
  { to: "/medicare-help", label: "Medicare Help" },
  { to: "/turning-65", label: "Turning 65" },
  { to: "/contact", label: "Contact" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:py-4">
        <Link to="/" className="flex items-center gap-2" aria-label="901 Healthcare home">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--brand-navy)]">
            <ShieldCheck className="h-5 w-5 text-white" aria-hidden="true" />
          </span>
          <span className="flex items-baseline gap-0.5 text-lg font-bold tracking-tight">
            <span className="text-[var(--brand-green-deep)]">901</span>
            <span className="text-[var(--brand-navy)]">Healthcare</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="rounded-md px-3 py-2 text-sm font-medium text-foreground/80 transition-colors hover:bg-secondary hover:text-foreground"
              activeProps={{ className: "bg-secondary text-foreground" }}
              activeOptions={{ exact: item.to === "/" }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:block">
          <Button asChild size="sm" className="bg-[var(--brand-green-deep)] hover:bg-[var(--brand-green-deep)]/90">
            <Link to="/contact">Request Help</Link>
          </Button>
        </div>

        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-border md:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <div
        className={cn(
          "border-t border-border md:hidden",
          open ? "block" : "hidden",
        )}
      >
        <nav className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-3" aria-label="Mobile">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setOpen(false)}
              className="rounded-md px-3 py-2 text-base font-medium text-foreground/80 hover:bg-secondary"
              activeProps={{ className: "bg-secondary text-foreground" }}
              activeOptions={{ exact: item.to === "/" }}
            >
              {item.label}
            </Link>
          ))}
          <Button
            asChild
            className="mt-2 w-full bg-[var(--brand-green-deep)] hover:bg-[var(--brand-green-deep)]/90"
          >
            <Link to="/contact" onClick={() => setOpen(false)}>
              Request Help
            </Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}