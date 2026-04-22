import { Link } from "@tanstack/react-router";
import { ShieldCheck, Facebook, Instagram, Linkedin, Mail, Phone, MapPin } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-[var(--brand-navy)] text-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10">
              <ShieldCheck className="h-5 w-5 text-[var(--brand-green)]" aria-hidden="true" />
            </span>
            <span className="text-lg font-bold">
              <span className="text-[var(--brand-green)]">901</span>Healthcare
            </span>
          </div>
          <p className="mt-4 max-w-md text-sm text-white/80">
            Connecting individuals with quality healthcare. Friendly, personalized
            Medicare guidance for people turning 65 and their families.
          </p>
          <div className="mt-6 flex gap-3">
            <a
              href="#"
              aria-label="Facebook"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 hover:bg-white/20"
            >
              <Facebook className="h-4 w-4" />
            </a>
            <a
              href="#"
              aria-label="Instagram"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 hover:bg-white/20"
            >
              <Instagram className="h-4 w-4" />
            </a>
            <a
              href="#"
              aria-label="LinkedIn"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 hover:bg-white/20"
            >
              <Linkedin className="h-4 w-4" />
            </a>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-white/70">Explore</h3>
          <ul className="mt-4 space-y-2 text-sm">
            <li><Link to="/" className="hover:text-[var(--brand-green)]">Home</Link></li>
            <li><Link to="/medicare-help" className="hover:text-[var(--brand-green)]">Medicare Help</Link></li>
            <li><Link to="/turning-65" className="hover:text-[var(--brand-green)]">Turning 65</Link></li>
            <li><Link to="/contact" className="hover:text-[var(--brand-green)]">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-white/70">Contact</h3>
          <ul className="mt-4 space-y-3 text-sm text-white/85">
            <li className="flex items-start gap-2">
              <Phone className="mt-0.5 h-4 w-4 text-[var(--brand-green)]" />
              <span>(901) 555-0199</span>
            </li>
            <li className="flex items-start gap-2">
              <Mail className="mt-0.5 h-4 w-4 text-[var(--brand-green)]" />
              <span>hello@901healthcare.com</span>
            </li>
            <li className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-4 w-4 text-[var(--brand-green)]" />
              <span>Memphis, TN</span>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <p className="mx-auto max-w-6xl px-4 py-4 text-center text-xs text-white/60">
          © {new Date().getFullYear()} 901 Healthcare. All rights reserved.
        </p>
      </div>
    </footer>
  );
}