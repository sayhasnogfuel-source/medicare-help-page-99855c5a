import { Facebook, Instagram, Linkedin, Mail, Phone, MapPin } from "lucide-react";
import logo from "@/assets/901-healthcare-logo.png";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-[var(--brand-navy)] text-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="inline-flex items-center justify-center rounded-xl bg-white p-3">
            <img src={logo} alt="901 Healthcare" className="h-12 w-auto" />
          </div>
          <p className="mt-5 max-w-md text-sm text-white/80">
            Connecting individuals with quality healthcare. Personal, caring ACA Open
            Enrollment guidance for individuals and families.
          </p>
          <div className="mt-6 flex gap-3">
            {[
              { icon: Facebook, label: "Facebook" },
              { icon: Instagram, label: "Instagram" },
              { icon: Linkedin, label: "LinkedIn" },
            ].map(({ icon: Icon, label }) => (
              <a
                key={label}
                href="#"
                aria-label={label}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white/20"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-white/70">Explore</h3>
          <ul className="mt-4 space-y-2 text-sm">
            <li><a href="#home" className="hover:text-[var(--brand-green)]">Home</a></li>
            <li><a href="#aca-help" className="hover:text-[var(--brand-green)]">ACA Open Enrollment Help</a></li>
            <li><a href="#open-enrollment" className="hover:text-[var(--brand-green)]">Open Enrollment</a></li>
            <li><a href="#contact" className="hover:text-[var(--brand-green)]">Contact</a></li>
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
