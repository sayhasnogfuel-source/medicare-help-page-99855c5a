import { useEffect, useState, useRef } from "react";
import { Phone, ShieldCheck, Award, Users, Clock, ChevronRight, Star, BadgeCheck, Mail, MapPin } from "lucide-react";
import type { ThemeProps } from "./shared";
import { getBenefits, initials, sectionToggles, ctaTextOf, typeLabelOf } from "./shared";

const C = {
  navy: "#0B2545",
  navyDeep: "#061634",
  blue: "#2563EB",
  blueBright: "#3B82F6",
  blueGlow: "rgba(59,130,246,0.45)",
  white: "#FFFFFF",
  paper: "#F4F7FB",
  ink: "#0B2545",
  body: "#475569",
  ruleSubtle: "rgba(255,255,255,0.12)",
};

const FONT_HEAD = "'Plus Jakarta Sans', 'Inter', system-ui, sans-serif";
const FONT_BODY = "'Inter', system-ui, sans-serif";

/** Theme 2 — Bold Medicare Expert.
 *  Direct, conversion-focused. Navy hero, big left-aligned headline,
 *  bright blue CTA with glow, benefits strip, animated counters,
 *  sharp section dividers, sticky mobile CTA, simple navy footer. */
export function BoldMedicareLanding({ data }: ThemeProps) {
  const cta = ctaTextOf(data);
  const typeLabel = typeLabelOf(data);
  const benefits = getBenefits(data.insuranceType);
  const t = sectionToggles(data);

  return (
    <div
      style={{ background: C.white, color: C.ink, fontFamily: FONT_BODY }}
      className="min-h-screen pb-16 sm:pb-0"
      data-theme="bold-medicare"
    >
      {/* Top bar */}
      <header style={{ background: C.navy, color: C.white }}>
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
          <div className="flex items-center gap-3">
            {data.logoDataUrl ? (
              <img src={data.logoDataUrl} alt={data.businessName} className="h-9 w-auto object-contain" />
            ) : (
              <span
                className="grid h-9 w-9 place-items-center rounded text-sm font-extrabold"
                style={{ background: C.blueBright, color: C.white }}
              >
                {initials(data.businessName)}
              </span>
            )}
            <div className="leading-tight">
              <p className="text-[15px] font-bold" style={{ fontFamily: FONT_HEAD }}>
                {data.businessName}
              </p>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em]" style={{ color: "#93C5FD" }}>
                Licensed {typeLabel} Agent
              </p>
            </div>
          </div>
          <a
            href={`tel:${data.phone}`}
            className="hidden items-center gap-2 rounded-md px-4 py-2 text-sm font-bold transition-colors sm:inline-flex"
            style={{ background: C.blueBright, color: C.white }}
          >
            <Phone className="h-4 w-4" />
            {data.phone}
          </a>
        </div>
      </header>

      {/* Hero */}
      <section
        style={{
          background: `linear-gradient(135deg, ${C.navyDeep} 0%, ${C.navy} 60%, #0E2E5C 100%)`,
          color: C.white,
        }}
        className="relative overflow-hidden"
      >
        {/* faint grid pattern */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.6) 1px, transparent 1px)",
            backgroundSize: "44px 44px",
          }}
        />
        <div className="relative mx-auto grid max-w-6xl gap-10 px-5 py-20 lg:grid-cols-[1.3fr_1fr] lg:py-28">
          <div>
            <span
              className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em]"
              style={{ background: "rgba(59,130,246,0.18)", color: "#93C5FD" }}
            >
              <BadgeCheck className="h-3.5 w-3.5" />
              Licensed in {data.state}
            </span>
            <h1
              className="mt-5 text-5xl font-extrabold leading-[1.02] sm:text-6xl lg:text-[68px]"
              style={{ fontFamily: FONT_HEAD, letterSpacing: "-0.025em" }}
            >
              {data.headline}
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed" style={{ color: "#CBD5E1" }}>
              {data.subheadline}
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <a
                href="#lead"
                className="inline-flex items-center justify-center gap-2 rounded-md px-7 py-4 text-base font-extrabold text-white transition-all hover:translate-y-[-1px]"
                style={{
                  background: C.blueBright,
                  boxShadow: `0 0 0 0 ${C.blueGlow}, 0 14px 40px -10px ${C.blueGlow}`,
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.boxShadow = `0 0 0 6px ${C.blueGlow}, 0 14px 40px -10px ${C.blueGlow}`)
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.boxShadow = `0 0 0 0 ${C.blueGlow}, 0 14px 40px -10px ${C.blueGlow}`)
                }
              >
                {cta}
                <ChevronRight className="h-4 w-4" />
              </a>
              <a
                href={`tel:${data.phone}`}
                className="inline-flex items-center justify-center gap-2 rounded-md border-2 px-7 py-4 text-base font-bold transition-colors"
                style={{ borderColor: "rgba(255,255,255,0.35)", color: C.white }}
              >
                <Phone className="h-4 w-4" />
                Call {data.phone}
              </a>
            </div>

            {/* trust pill row */}
            <div className="mt-10 flex flex-wrap gap-2">
              {["Licensed Agent", "Free Plan Review", "Multiple Carriers", "No Cost To You"].map((p) => (
                <span
                  key={p}
                  className="inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.1em]"
                  style={{ background: "rgba(255,255,255,0.06)", color: "#CBD5E1", border: "1px solid rgba(255,255,255,0.1)" }}
                >
                  <ShieldCheck className="h-3 w-3" />
                  {p}
                </span>
              ))}
            </div>
          </div>

          {/* Lead card */}
          <div
            className="rounded-xl p-6 shadow-2xl sm:p-7"
            style={{ background: C.white, color: C.ink }}
            id="lead"
          >
            <p className="text-[11px] font-bold uppercase tracking-[0.16em]" style={{ color: C.blue }}>
              Free {typeLabel} Review
            </p>
            <h3 className="mt-2 text-2xl font-extrabold" style={{ fontFamily: FONT_HEAD, letterSpacing: "-0.02em" }}>
              See your best plan options today
            </h3>
            <p className="mt-1 text-sm" style={{ color: C.body }}>
              Most reviews take under 15 minutes.
            </p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <BoldField placeholder="First name" />
              <BoldField placeholder="Last name" />
              <BoldField placeholder="ZIP code" />
              <BoldField placeholder="Phone" />
            </div>
            <button
              type="button"
              className="mt-5 w-full rounded-md py-4 text-base font-extrabold uppercase tracking-wide text-white transition-all hover:brightness-110"
              style={{
                background: C.blueBright,
                boxShadow: `0 10px 30px -8px ${C.blueGlow}`,
              }}
            >
              {cta}
            </button>
            <p className="mt-3 text-center text-[11px]" style={{ color: C.body }}>
              No obligation. Your info stays private.
            </p>
          </div>
        </div>
      </section>

      {/* Benefits strip */}
      <section style={{ background: C.paper, borderBottom: `4px solid ${C.navy}` }}>
        <div className="mx-auto grid max-w-6xl gap-6 px-5 py-10 sm:grid-cols-4">
          {[
            { icon: ShieldCheck, label: "Top-rated carriers" },
            { icon: Award, label: "Years of experience" },
            { icon: Users, label: "Families served" },
            { icon: Clock, label: "Fast plan reviews" },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-md" style={{ background: C.navy, color: C.white }}>
                <Icon className="h-5 w-5" />
              </span>
              <p className="text-sm font-bold" style={{ color: C.ink, fontFamily: FONT_HEAD }}>
                {label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Counters */}
      <section className="mx-auto max-w-6xl px-5 py-20">
        <div className="grid gap-8 sm:grid-cols-3">
          <Counter value={1240} suffix="+" label={`${typeLabel} clients helped`} />
          <Counter value={12} suffix="+" label="Years experience" />
          <Counter value={18} suffix="+" label="Carriers compared" />
        </div>
      </section>

      {/* Services as bold scannable cards */}
      {t.services && (
        <section style={{ background: C.paper }}>
          <div className="mx-auto max-w-6xl px-5 py-20">
            <div className="max-w-2xl">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em]" style={{ color: C.blue }}>
                What you get
              </p>
              <h2 className="mt-2 text-3xl font-extrabold sm:text-4xl" style={{ fontFamily: FONT_HEAD, letterSpacing: "-0.02em" }}>
                Straight answers. Real plans. Zero pressure.
              </h2>
            </div>
            <div className="mt-10 grid gap-5 sm:grid-cols-3">
              {benefits.map((b) => (
                <div
                  key={b.title}
                  className="rounded-lg bg-white p-7 transition-all"
                  style={{ border: `2px solid ${C.navy}`, boxShadow: "0 8px 0 -4px " + C.navy }}
                >
                  <span className="grid h-12 w-12 place-items-center rounded-md text-white" style={{ background: C.navy }}>
                    <b.icon className="h-6 w-6" />
                  </span>
                  <h3 className="mt-5 text-xl font-extrabold" style={{ fontFamily: FONT_HEAD }}>
                    {b.title}
                  </h3>
                  <p className="mt-2 text-sm" style={{ color: C.body }}>
                    {b.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Testimonial slab */}
      {t.testimonials && (
        <section style={{ background: C.navy, color: C.white }}>
          <div className="mx-auto max-w-4xl px-5 py-20 text-center">
            <div className="mx-auto inline-flex gap-1" style={{ color: "#FACC15" }}>
              {[0, 1, 2, 3, 4].map((i) => <Star key={i} className="h-5 w-5 fill-current" />)}
            </div>
            <p className="mt-6 text-2xl font-bold leading-snug sm:text-3xl" style={{ fontFamily: FONT_HEAD }}>
              "{data.agentName} explained {typeLabel} better in 20 minutes than anyone I'd talked to all year.
              Saved me real money and got me on a plan that fits."
            </p>
            <p className="mt-5 text-sm font-semibold" style={{ color: "#93C5FD" }}>
              — Verified client · {data.city}, {data.state}
            </p>
          </div>
        </section>
      )}

      {/* Final CTA banner */}
      <section className="mx-auto max-w-6xl px-5 py-16">
        <div
          className="flex flex-col items-center gap-4 rounded-xl p-9 text-center sm:flex-row sm:justify-between sm:text-left"
          style={{ background: C.navy, color: C.white, border: `2px solid ${C.blueBright}` }}
        >
          <div>
            <h3 className="text-2xl font-extrabold sm:text-3xl" style={{ fontFamily: FONT_HEAD }}>
              Ready for a real {typeLabel.toLowerCase()} review?
            </h3>
            <p className="mt-1 text-sm" style={{ color: "#CBD5E1" }}>
              {data.agentName} reaches out by {data.contactMethod}. Usually same day.
            </p>
          </div>
          <a
            href="#lead"
            className="rounded-md px-7 py-4 text-base font-extrabold transition-all hover:brightness-110"
            style={{ background: C.blueBright, color: C.white, boxShadow: `0 10px 30px -8px ${C.blueGlow}` }}
          >
            {cta}
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: C.navyDeep, color: "#94A3B8" }}>
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-4 px-5 py-8 text-sm sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            <span
              className="grid h-8 w-8 place-items-center rounded text-xs font-extrabold text-white"
              style={{ background: C.blueBright }}
            >
              {initials(data.businessName)}
            </span>
            <div>
              <p className="font-bold text-white" style={{ fontFamily: FONT_HEAD }}>{data.businessName}</p>
              <p className="text-[11px] uppercase tracking-[0.16em]">Licensed {typeLabel} Agent · {data.state}</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[12px]">
            <span className="inline-flex items-center gap-1.5"><Phone className="h-3.5 w-3.5" />{data.phone}</span>
            <span className="inline-flex items-center gap-1.5"><Mail className="h-3.5 w-3.5" />{data.email}</span>
            <span className="inline-flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" />{data.city}, {data.state}</span>
          </div>
        </div>
      </footer>

      {/* Sticky mobile CTA */}
      <div className="fixed bottom-0 left-0 right-0 z-30 sm:hidden" style={{ background: C.navy, borderTop: `2px solid ${C.blueBright}` }}>
        <a
          href="#lead"
          className="flex items-center justify-center gap-2 px-5 py-4 text-base font-extrabold uppercase tracking-wide text-white"
          style={{ background: C.blueBright }}
        >
          <Phone className="h-4 w-4" />
          {cta}
        </a>
      </div>
    </div>
  );
}

function BoldField({ placeholder }: { placeholder: string }) {
  return (
    <input
      placeholder={placeholder}
      className="w-full rounded-md border-2 px-4 py-3 text-sm font-medium outline-none transition-colors"
      style={{ borderColor: "#CBD5E1", color: C.ink, background: C.white }}
      onFocus={(e) => (e.currentTarget.style.borderColor = C.blueBright)}
      onBlur={(e) => (e.currentTarget.style.borderColor = "#CBD5E1")}
    />
  );
}

function Counter({ value, suffix, label }: { value: number; suffix?: string; label: string }) {
  const [n, setN] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          const start = performance.now();
          const dur = 1100;
          const step = (now: number) => {
            const p = Math.min(1, (now - start) / dur);
            const eased = 1 - Math.pow(1 - p, 3);
            setN(Math.round(value * eased));
            if (p < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
          obs.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [value]);
  return (
    <div ref={ref} className="text-center sm:text-left">
      <p
        className="text-5xl font-extrabold sm:text-6xl"
        style={{ fontFamily: FONT_HEAD, color: C.navy, letterSpacing: "-0.03em" }}
      >
        {n.toLocaleString()}
        {suffix}
      </p>
      <p className="mt-1 text-sm font-semibold uppercase tracking-[0.14em]" style={{ color: C.body }}>
        {label}
      </p>
    </div>
  );
}

/** Mini preview — navy hero with bright blue CTA + lead card on the right. */
export function BoldMedicareMini(_props: ThemeProps) {
  return (
    <div className="flex h-full w-full flex-col" style={{ background: C.white, fontFamily: FONT_BODY }}>
      <div style={{ background: C.navy }} className="flex flex-1 gap-1.5 p-1.5">
        <div className="flex flex-1 flex-col justify-center">
          <span className="block h-1 w-[40%] rounded" style={{ background: "#93C5FD" }} />
          <span className="mt-1 block h-1.5 w-[85%]" style={{ background: C.white }} />
          <span className="mt-0.5 block h-1.5 w-[65%]" style={{ background: C.white }} />
          <span
            className="mt-1.5 block h-2 w-[42%] rounded"
            style={{ background: C.blueBright, boxShadow: `0 0 4px ${C.blueGlow}` }}
          />
        </div>
        <div className="w-[36%] rounded p-1" style={{ background: C.white }}>
          <span className="block h-0.5 w-[60%] rounded" style={{ background: C.blue }} />
          <span className="mt-0.5 block h-1 w-[80%] rounded" style={{ background: C.ink }} />
          <div className="mt-1 grid grid-cols-2 gap-0.5">
            {[0, 1, 2, 3].map((i) => <span key={i} className="block h-1 rounded border" style={{ borderColor: "#CBD5E1" }} />)}
          </div>
          <span className="mt-1 block h-1.5 rounded" style={{ background: C.blueBright }} />
        </div>
      </div>
      <div style={{ background: C.paper, borderTop: `2px solid ${C.navy}` }} className="flex h-3 items-center gap-0.5 px-1.5">
        {[0, 1, 2, 3].map((i) => <span key={i} className="block h-1 flex-1 rounded" style={{ background: C.navy, opacity: 0.7 }} />)}
      </div>
    </div>
  );
}