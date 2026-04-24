import { Link } from "@tanstack/react-router";
import diploofly from "@/assets/diploofly-logo.png";

export function AppFooter() {
  return (
    <footer className="border-t border-border/60 bg-[var(--surface-cream)]">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-12 md:grid-cols-4">
        <div className="md:col-span-2">
          <Link to="/" className="inline-flex items-center">
            <img src={diploofly} alt="Diploofly" className="h-9 w-auto" />
          </Link>
          <p className="mt-4 max-w-sm text-sm text-muted-foreground">
            The simplest way for Medicare and ACA agents to launch beautiful, modern
            lead-generation landing pages.
          </p>
        </div>

        <div>
          <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            Product
          </h3>
          <ul className="mt-4 space-y-2.5 text-sm text-foreground/80">
            <li><Link to="/builder" className="hover:text-foreground">Builder</Link></li>
            <li><Link to="/preview" className="hover:text-foreground">Preview</Link></li>
            <li><Link to="/signup" className="hover:text-foreground">Sign up</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            Company
          </h3>
          <ul className="mt-4 space-y-2.5 text-sm text-foreground/80">
            <li><a href="#" className="hover:text-foreground">About</a></li>
            <li><a href="#" className="hover:text-foreground">Privacy</a></li>
            <li><a href="#" className="hover:text-foreground">Terms</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border/60">
        <p className="mx-auto max-w-6xl px-5 py-5 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} Diploofly — Built for independent insurance agents.
        </p>
      </div>
    </footer>
  );
}