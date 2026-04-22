import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import logo from "@/assets/901-healthcare-logo.png";

const navItems = [
  { href: "#home", label: "Home" },
  { href: "#aca-help", label: "ACA Help" },
  { href: "#open-enrollment", label: "Open Enrollment" },
  { href: "#contact", label: "Contact" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <a href="#home" className="flex items-center" aria-label="901 Healthcare home">
          <img
            src={logo}
            alt="901 Healthcare — Connecting individuals with quality healthcare"
            className="h-10 w-auto sm:h-12"
          />
        </a>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="rounded-md px-3 py-2 text-sm font-medium text-foreground/80 transition-colors hover:bg-secondary hover:text-foreground"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="hidden lg:block">
          <Button asChild size="sm" className="bg-[var(--brand-green-deep)] text-white hover:bg-[var(--brand-green-deep)]/90">
            <a href="#contact">Get Covered</a>
          </Button>
        </div>

        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-border lg:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <div className={cn("border-t border-border lg:hidden", open ? "block" : "hidden")}>
        <nav className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-3" aria-label="Mobile">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="rounded-md px-3 py-2 text-base font-medium text-foreground/80 hover:bg-secondary"
            >
              {item.label}
            </a>
          ))}
          <Button
            asChild
            className="mt-2 w-full bg-[var(--brand-green-deep)] text-white hover:bg-[var(--brand-green-deep)]/90"
          >
            <a href="#contact" onClick={() => setOpen(false)}>
              Get Covered
            </a>
          </Button>
        </nav>
      </div>
    </header>
  );
}
