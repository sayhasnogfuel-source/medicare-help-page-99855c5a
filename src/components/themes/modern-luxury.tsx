import { Phone, Mail, MapPin, Check, Quote, ArrowRight } from "lucide-react";
import type { ThemeProps } from "./shared";
import { getBenefits, initials, sectionToggles, ctaTextOf, typeLabelOf } from "./shared";

const PALETTE = {
  ink: "#0A0A0A",
  cream: "#FAF7F1",
  paper: "#FFFFFF",
  gold: "#B89968",
  goldSoft: "#D9C7A2",
  rule: "#1A1A1A",
  body: "#3F3A33",
};

const FONT_HEAD = "'Cormorant Garamond', 'Playfair Display', Georgia, serif";
const FONT_BODY = "'Inter', system-ui, sans-serif";

/** Theme 1 — Modern Luxury Insurance.
 *  Premium, clean, high-end like a luxury financial advisor:
 *  white/cream background, gold hairlines, serif display headline,
 *  portrait card on the right, quote-led testimonials, luxury footer. */
export function ModernLuxuryLanding({ data }: ThemeProps) {
  const cta = ctaTextOf(data);
  const typeLabel = typeLabelOf(data);
  const benefits = getBenefits(data.insuranceType);
  const t = sectionToggles(data);

  return (
    <div
      style={{ background: PALETTE.cream, color: PALETTE.ink, fontFamily: FONT_BODY }}
      className="min-h-screen"
      data-theme="modern-luxury"
    >
      {/* Top bar */}
      <header style={{ borderBottom: `1px solid ${PALETTE.goldSoft}` }} className="bg-transparent">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <div className="flex items-center gap-3">
            {data.logoDataUrl ? (
              <img src={data.logoDataUrl} alt={data.businessName} className="h-9 w-auto object-contain" />
            ) : (
              <span
                className="grid h-9 w-9 place-items-center text-xs font-semibold"
                style={{ background: PALETTE.ink, color: PALETTE.cream, letterSpacing: "0.08em" }}
              >
                {initials(data.businessName)}
              </span>
            )}
            <div className="leading-tight">
              <p className="text-[15px] font-medium" style={{ fontFamily: FONT_HEAD, letterSpacing: "0.04em" }}>
                {data.businessName}
              </p>
              <p className="text-[10px] uppercase tracking-[0.22em]" style={{ color: PALETTE.gold }}>
                Private {typeLabel} Counsel
              </p>
            </div>
          </div>
          <nav className="hidden items-center gap-8 text-[12px] uppercase tracking-[0.2em] sm:flex" style={{ color: PALETTE.body }}>
            <a href="#about">About</a>
            <a href="#services">Services</a>
            <a href="#testimonial">Clients</a>
            <a href="#contact">Contact</a>
          </nav>
          <a
            href="#contact"
            className="hidden items-center gap-2 px-5 py-2 text-[11px] font-semibold uppercase tracking-[0.2em] transition-colors sm:inline-flex"
            style={{ background: PALETTE.ink, color: PALETTE.cream }}
          >
            Private Consultation
          </a>
        </div>
      </header>

      {/* Hero */}
      <section className="relative">
        <div className="mx-auto grid max-w-6xl gap-14 px-6 py-20 lg:grid-cols-[1.15fr_1fr] lg:gap-20 lg:py-28">
          <div className="flex flex-col justify-center">
            <span
              className="text-[10px] font-medium uppercase tracking-[0.32em]"
              style={{ color: PALETTE.gold }}
            >
              Established practice · {data.city}, {data.state}
            </span>
            <h1
              className="mt-6 text-5xl leading-[1.05] sm:text-6xl lg:text-7xl"
              style={{ fontFamily: FONT_HEAD, fontWeight: 400, letterSpacing: "-0.01em" }}
            >
              {data.headline}
            </h1>
            <div
              className="mt-7 h-px w-24"
              style={{ background: PALETTE.gold }}
              aria-hidden
            />
            <p className="mt-7 max-w-md text-[17px] leading-relaxed" style={{ color: PALETTE.body }}>
              {data.subheadline}
            </p>
            <div className="mt-10 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
              <a
                href="#contact"
                className="group inline-flex items-center gap-3 px-7 py-3.5 text-[12px] font-semibold uppercase tracking-[0.22em] transition-all"
                style={{ background: PALETTE.ink, color: PALETTE.cream }}
                onMouseEnter={(e) => (e.currentTarget.style.background = PALETTE.gold)}
                onMouseLeave={(e) => (e.currentTarget.style.background = PALETTE.ink)}
              >
                {cta}
                <ArrowRight className="h-3.5 w-3.5" />
              </a>
              <a
                href={`tel:${data.phone}`}
                className="text-[12px] uppercase tracking-[0.22em]"
                style={{ color: PALETTE.body, borderBottom: `1px solid ${PALETTE.gold}` }}
              >
                {data.phone}
              </a>
            </div>
          </div>

          {/* Portrait card */}
          <div className="relative">
            <div
              className="absolute -inset-3 -z-10"
              style={{ background: PALETTE.goldSoft, opacity: 0.4 }}
              aria-hidden
            />
            <div className="relative overflow-hidden bg-white" style={{ aspectRatio: "4/5" }}>
              {data.headshotDataUrl ? (
                <img src={data.headshotDataUrl} alt={data.agentName} className="h-full w-full object-cover" />
              ) : (
                <div
                  className="flex h-full w-full items-center justify-center"
                  style={{ background: `linear-gradient(160deg, ${PALETTE.cream}, ${PALETTE.goldSoft})` }}
                >
                  <span
                    className="grid h-28 w-28 place-items-center text-3xl"
                    style={{ background: PALETTE.ink, color: PALETTE.cream, fontFamily: FONT_HEAD }}
                  >
                    {initials(data.agentName)}
                  </span>
                </div>
              )}
            </div>
            <div
              className="mt-5 flex items-baseline justify-between border-t pt-4"
              style={{ borderColor: PALETTE.goldSoft }}
            >
              <p style={{ fontFamily: FONT_HEAD, fontSize: 18 }}>{data.agentName}</p>
              <p className="text-[10px] uppercase tracking-[0.2em]" style={{ color: PALETTE.gold }}>
                Licensed Advisor
              </p>
            </div>
          </div>
        </div>
        <div
          className="mx-auto h-px max-w-6xl"
          style={{ background: PALETTE.goldSoft }}
          aria-hidden
        />
      </section>

      {/* About */}
      {t.aboutAgent && (
        <section id="about" className="mx-auto max-w-3xl px-6 py-24 text-center">
          <span className="text-[10px] uppercase tracking-[0.32em]" style={{ color: PALETTE.gold }}>
            The practice
          </span>
          <h2
            className="mt-5 text-4xl leading-tight sm:text-5xl"
            style={{ fontFamily: FONT_HEAD, fontWeight: 400 }}
          >
            A measured, private approach to {typeLabel.toLowerCase()}.
          </h2>
          <div className="mx-auto mt-7 h-px w-16" style={{ background: PALETTE.gold }} aria-hidden />
          <p className="mt-7 text-[17px] leading-relaxed" style={{ color: PALETTE.body }}>
            I'm {data.agentName}. For more than a decade I've helped families across {data.city} and the
            surrounding {data.state} area think through {typeLabel.toLowerCase()} the way they would think
            through any other long-term decision — with patience, evidence, and care.
          </p>
        </section>
      )}

      {/* Services as concierge cards */}
      {t.services && (
        <section id="services" style={{ background: PALETTE.paper }}>
          <div className="mx-auto max-w-6xl px-6 py-24">
            <div className="flex items-end justify-between gap-8 border-b pb-8" style={{ borderColor: PALETTE.goldSoft }}>
              <div>
                <span className="text-[10px] uppercase tracking-[0.32em]" style={{ color: PALETTE.gold }}>
                  Services
                </span>
                <h2 className="mt-3 text-3xl sm:text-4xl" style={{ fontFamily: FONT_HEAD, fontWeight: 400 }}>
                  Considered guidance, end to end.
                </h2>
              </div>
              <p className="hidden max-w-sm text-sm leading-relaxed sm:block" style={{ color: PALETTE.body }}>
                Every engagement begins the same way — a quiet, no-obligation conversation
                about what you need protected.
              </p>
            </div>
            <div className="mt-12 grid gap-px" style={{ background: PALETTE.goldSoft, gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))" }}>
              {benefits.map((b, i) => (
                <article
                  key={b.title}
                  className="bg-white p-9"
                  style={{ background: PALETTE.paper }}
                >
                  <span
                    className="text-[10px] uppercase tracking-[0.28em]"
                    style={{ color: PALETTE.gold }}
                  >
                    No. {String(i + 1).padStart(2, "0")}
                  </span>
                  <b.icon className="mt-6 h-5 w-5" style={{ color: PALETTE.ink }} strokeWidth={1.25} />
                  <h3 className="mt-5 text-2xl" style={{ fontFamily: FONT_HEAD, fontWeight: 400 }}>
                    {b.title}
                  </h3>
                  <p className="mt-3 text-[15px] leading-relaxed" style={{ color: PALETTE.body }}>
                    {b.body}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Quote testimonial */}
      {t.testimonials && (
        <section id="testimonial" className="mx-auto max-w-4xl px-6 py-28 text-center">
          <Quote className="mx-auto h-8 w-8" style={{ color: PALETTE.gold }} strokeWidth={1} />
          <blockquote
            className="mt-8 text-3xl leading-snug sm:text-4xl"
            style={{ fontFamily: FONT_HEAD, fontWeight: 400 }}
          >
            "{data.agentName} listens the way a good attorney does — carefully. We left our
            consultation knowing exactly what we had, what we needed, and why."
          </blockquote>
          <div className="mx-auto mt-10 h-px w-16" style={{ background: PALETTE.gold }} aria-hidden />
          <p className="mt-6 text-[11px] uppercase tracking-[0.28em]" style={{ color: PALETTE.body }}>
            A private client · {data.city}
          </p>
        </section>
      )}

      {/* Contact / form */}
      <section id="contact" style={{ background: PALETTE.cream, borderTop: `1px solid ${PALETTE.goldSoft}` }}>
        <div className="mx-auto grid max-w-6xl gap-16 px-6 py-24 lg:grid-cols-[1fr_1.1fr]">
          <div>
            <span className="text-[10px] uppercase tracking-[0.32em]" style={{ color: PALETTE.gold }}>
              Begin
            </span>
            <h2 className="mt-4 text-4xl sm:text-5xl" style={{ fontFamily: FONT_HEAD, fontWeight: 400, lineHeight: 1.05 }}>
              Request a private consultation.
            </h2>
            <p className="mt-6 max-w-md text-[16px] leading-relaxed" style={{ color: PALETTE.body }}>
              Share a few details and {data.agentName} will reach out personally by{" "}
              {data.contactMethod}. Conversations are private and obligation-free.
            </p>
            <ul className="mt-10 space-y-4 text-[14px]" style={{ color: PALETTE.body }}>
              <li className="flex items-center gap-3">
                <Phone className="h-4 w-4" style={{ color: PALETTE.gold }} strokeWidth={1.25} />
                {data.phone}
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-4 w-4" style={{ color: PALETTE.gold }} strokeWidth={1.25} />
                {data.email}
              </li>
              <li className="flex items-center gap-3">
                <MapPin className="h-4 w-4" style={{ color: PALETTE.gold }} strokeWidth={1.25} />
                {data.city}, {data.state}
              </li>
            </ul>
          </div>

          <form
            className="bg-white p-10"
            style={{ border: `1px solid ${PALETTE.goldSoft}` }}
            onSubmit={(e) => e.preventDefault()}
          >
            <div className="grid gap-7 sm:grid-cols-2">
              <LuxField label="First name" placeholder="Eleanor" />
              <LuxField label="Last name" placeholder="Whitfield" />
              <LuxField label="Telephone" placeholder="(555) 555-5555" />
              <LuxField label="Email" placeholder="you@example.com" />
            </div>
            <div className="mt-7">
              <LuxField label="What may we help you with" placeholder={`A note about ${typeLabel.toLowerCase()}…`} />
            </div>
            <button
              type="submit"
              className="mt-10 inline-flex w-full items-center justify-center gap-3 px-7 py-4 text-[12px] font-semibold uppercase tracking-[0.22em] transition-colors"
              style={{ background: PALETTE.ink, color: PALETTE.cream }}
              onMouseEnter={(e) => (e.currentTarget.style.background = PALETTE.gold)}
              onMouseLeave={(e) => (e.currentTarget.style.background = PALETTE.ink)}
            >
              <Check className="h-3.5 w-3.5" />
              {cta}
            </button>
            <p className="mt-4 text-center text-[11px]" style={{ color: PALETTE.body }}>
              Your information is held in the strictest confidence.
            </p>
          </form>
        </div>
      </section>

      {/* Luxury footer */}
      <footer style={{ background: PALETTE.ink, color: PALETTE.cream }}>
        <div className="mx-auto max-w-6xl px-6 py-16">
          <div className="grid gap-12 sm:grid-cols-[1.4fr_1fr_1fr_1fr]">
            <div>
              <p className="text-2xl" style={{ fontFamily: FONT_HEAD, letterSpacing: "0.04em" }}>
                {data.businessName}
              </p>
              <p className="mt-3 text-[12px] uppercase tracking-[0.28em]" style={{ color: PALETTE.gold }}>
                Private {typeLabel} Counsel
              </p>
              <p className="mt-6 max-w-xs text-[13px] leading-relaxed" style={{ color: "#C9C2B6" }}>
                A small, deliberate practice serving discerning families throughout {data.state}.
              </p>
            </div>
            <FooterCol title="Practice" items={["About", "Services", "Process", "Press"]} />
            <FooterCol title="Reach Us" items={[data.phone, data.email, `${data.city}, ${data.state}`]} />
            <FooterCol title="Hours" items={["Mon–Thu  9 – 5", "Fri  9 – 1", "By appointment"]} />
          </div>
          <div
            className="mt-14 flex flex-col items-start justify-between gap-3 border-t pt-6 text-[11px] uppercase tracking-[0.22em] sm:flex-row sm:items-center"
            style={{ borderColor: "rgba(184,153,104,0.35)", color: "#A39A8C" }}
          >
            <span>© {new Date().getFullYear()} {data.businessName}</span>
            <span>Discretion · Diligence · Care</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

function LuxField({ label, placeholder }: { label: string; placeholder: string }) {
  return (
    <label className="block">
      <span
        className="text-[10px] font-medium uppercase tracking-[0.22em]"
        style={{ color: PALETTE.body }}
      >
        {label}
      </span>
      <input
        placeholder={placeholder}
        className="mt-2 w-full bg-transparent pb-2 text-[15px] outline-none"
        style={{ borderBottom: `1px solid ${PALETTE.goldSoft}`, color: PALETTE.ink }}
        onFocus={(e) => (e.currentTarget.style.borderColor = PALETTE.gold)}
        onBlur={(e) => (e.currentTarget.style.borderColor = PALETTE.goldSoft)}
      />
    </label>
  );
}

function FooterCol({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <p className="text-[11px] uppercase tracking-[0.28em]" style={{ color: PALETTE.gold }}>
        {title}
      </p>
      <ul className="mt-5 space-y-2.5 text-[13px]" style={{ color: "#C9C2B6" }}>
        {items.map((it) => (
          <li key={it}>{it}</li>
        ))}
      </ul>
    </div>
  );
}

/** Mini preview — a faithfully scaled snapshot of the luxury layout. */
export function ModernLuxuryMini(_props: ThemeProps) {
  return (
    <div
      className="flex h-full w-full flex-col p-2"
      style={{ background: PALETTE.cream, color: PALETTE.ink, fontFamily: FONT_BODY }}
    >
      <div className="flex items-center justify-between border-b pb-1" style={{ borderColor: PALETTE.goldSoft }}>
        <span className="text-[5px] uppercase tracking-[0.3em]" style={{ color: PALETTE.gold }}>Practice</span>
        <span className="block h-1 w-3" style={{ background: PALETTE.ink }} />
      </div>
      <div className="mt-1.5 flex flex-1 gap-1.5">
        <div className="flex flex-1 flex-col justify-center">
          <span className="block h-1 w-[55%]" style={{ background: PALETTE.gold }} />
          <span className="mt-1 block h-1.5 w-[80%]" style={{ background: PALETTE.ink, fontFamily: FONT_HEAD }} />
          <span className="mt-0.5 block h-1.5 w-[60%]" style={{ background: PALETTE.ink }} />
          <span className="mt-1 block h-px w-3" style={{ background: PALETTE.gold }} />
          <span className="mt-1.5 block h-1.5 w-[35%]" style={{ background: PALETTE.ink }} />
        </div>
        <div className="relative w-[34%]">
          <div className="absolute -inset-0.5" style={{ background: PALETTE.goldSoft, opacity: 0.5 }} />
          <div className="relative h-full w-full" style={{ background: `linear-gradient(160deg, ${PALETTE.cream}, ${PALETTE.goldSoft})` }} />
        </div>
      </div>
      <div className="mt-1 flex gap-px">
        {[0, 1, 2].map((i) => (
          <span key={i} className="block h-1 flex-1" style={{ background: PALETTE.paper, border: `1px solid ${PALETTE.goldSoft}` }} />
        ))}
      </div>
    </div>
  );
}