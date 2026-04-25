import { Phone, Mail, MapPin, Sparkles, Zap, Cpu, LayoutGrid, ShieldCheck, ArrowUpRight, Activity } from "lucide-react";
import type { ThemeProps } from "./shared";
import { getBenefits, initials, sectionToggles, ctaTextOf, typeLabelOf } from "./shared";

const C = {
  bg: "#07060F",
  bgSoft: "#0E0C1A",
  border: "rgba(255,255,255,0.08)",
  borderStrong: "rgba(255,255,255,0.16)",
  glass: "rgba(255,255,255,0.04)",
  text: "#E6E6F2",
  textDim: "#A4A3B8",
  blue: "#3DA5FF",
  purple: "#9D5CFF",
  cyan: "#22D3EE",
  glowBlue: "rgba(61,165,255,0.35)",
  glowPurple: "rgba(157,92,255,0.35)",
};

const FONT_HEAD = "'Geist', 'Inter Tight', 'Inter', system-ui, sans-serif";
const FONT_BODY = "'Geist', 'Inter', system-ui, sans-serif";
const FONT_MONO = "'JetBrains Mono', ui-monospace, monospace";

/** Theme 4 — Tech Startup Insurance.
 *  Dark mode SaaS feel. Glowing gradient headline, glass cards, neon
 *  gradient borders on buttons, animated grid background, dashboard
 *  mockup, dark glass forms, sleek minimal footer. */
export function TechStartupLanding({ data }: ThemeProps) {
  const cta = ctaTextOf(data);
  const typeLabel = typeLabelOf(data);
  const benefits = getBenefits(data.insuranceType);
  const t = sectionToggles(data);

  return (
    <div
      style={{ background: C.bg, color: C.text, fontFamily: FONT_BODY }}
      className="relative min-h-screen overflow-hidden"
      data-theme="tech-startup"
    >
      {/* Background grid + radial glows */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.18]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.08) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          maskImage: "radial-gradient(ellipse at top, #000 30%, transparent 75%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-32 top-0 h-[480px] w-[480px] rounded-full blur-3xl"
        style={{ background: C.glowPurple }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute right-[-160px] top-40 h-[520px] w-[520px] rounded-full blur-3xl"
        style={{ background: C.glowBlue }}
      />

      {/* Header */}
      <header className="relative z-10">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
          <div className="flex items-center gap-3">
            {data.logoDataUrl ? (
              <img src={data.logoDataUrl} alt={data.businessName} className="h-9 w-auto object-contain" />
            ) : (
              <span
                className="grid h-9 w-9 place-items-center rounded-lg text-sm font-bold text-white"
                style={{ background: `linear-gradient(135deg, ${C.purple}, ${C.blue})` }}
              >
                {initials(data.businessName)}
              </span>
            )}
            <p className="text-base font-semibold tracking-tight" style={{ fontFamily: FONT_HEAD }}>{data.businessName}</p>
          </div>
          <nav className="hidden items-center gap-7 text-[13px] sm:flex" style={{ color: C.textDim }}>
            <a href="#product">Product</a>
            <a href="#features">Features</a>
            <a href="#contact">Contact</a>
          </nav>
          <a
            href="#contact"
            className="hidden items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-semibold sm:inline-flex"
            style={{ background: C.text, color: C.bg }}
          >
            {cta}
            <ArrowUpRight className="h-3.5 w-3.5" />
          </a>
        </div>
      </header>

      {/* Hero */}
      <section className="relative z-10">
        <div className="mx-auto max-w-5xl px-5 py-24 text-center sm:py-32">
          <span
            className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium"
            style={{
              background: C.glass,
              border: `1px solid ${C.borderStrong}`,
              color: C.textDim,
              backdropFilter: "blur(8px)",
            }}
          >
            <Sparkles className="h-3.5 w-3.5" style={{ color: C.cyan }} />
            Built for modern {typeLabel.toLowerCase()} agents
          </span>
          <h1
            className="mx-auto mt-7 max-w-3xl text-5xl font-semibold leading-[1.02] sm:text-6xl lg:text-7xl"
            style={{
              fontFamily: FONT_HEAD,
              letterSpacing: "-0.04em",
              backgroundImage: `linear-gradient(180deg, #FFFFFF 0%, #B7B6CF 100%)`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            {data.headline}
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed" style={{ color: C.textDim }}>
            {data.subheadline}
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            {/* Gradient-border CTA */}
            <a href="#contact" className="group relative inline-block">
              <span
                aria-hidden
                className="absolute -inset-px rounded-xl opacity-80 blur-sm transition-opacity group-hover:opacity-100"
                style={{ background: `linear-gradient(135deg, ${C.purple}, ${C.cyan})` }}
              />
              <span
                className="relative inline-flex items-center gap-2 rounded-xl px-7 py-3.5 text-base font-semibold"
                style={{ background: C.bgSoft, color: C.text, border: `1px solid ${C.borderStrong}` }}
              >
                {cta}
                <ArrowUpRight className="h-4 w-4" style={{ color: C.cyan }} />
              </span>
            </a>
            <a
              href={`tel:${data.phone}`}
              className="inline-flex items-center gap-2 rounded-xl px-7 py-3.5 text-base font-semibold transition-colors"
              style={{ color: C.textDim, border: `1px solid ${C.border}` }}
            >
              <Phone className="h-4 w-4" />
              {data.phone}
            </a>
          </div>

          {/* Dashboard mockup */}
          <div
            id="product"
            className="relative mx-auto mt-20 w-full max-w-4xl overflow-hidden rounded-2xl"
            style={{
              background: C.bgSoft,
              border: `1px solid ${C.borderStrong}`,
              boxShadow: `0 60px 120px -40px ${C.glowPurple}, 0 0 0 1px ${C.border}`,
            }}
          >
            <div className="flex items-center justify-between px-4 py-2.5" style={{ borderBottom: `1px solid ${C.border}` }}>
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: "#FF5F57" }} />
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: "#FEBC2E" }} />
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: "#28C840" }} />
              </div>
              <span className="text-[11px]" style={{ color: C.textDim, fontFamily: FONT_MONO }}>
                {data.businessName.toLowerCase().replace(/\s+/g, "")}.app/quotes
              </span>
              <span className="w-12" />
            </div>
            <div className="grid gap-4 p-5 sm:grid-cols-[200px_1fr]">
              <aside className="space-y-2 text-left">
                {["Quotes", "Clients", "Carriers", "Renewals", "Reports"].map((it, i) => (
                  <div
                    key={it}
                    className="rounded-md px-3 py-2 text-[12px]"
                    style={{
                      background: i === 0 ? "rgba(157,92,255,0.15)" : "transparent",
                      color: i === 0 ? C.text : C.textDim,
                      border: i === 0 ? `1px solid ${C.glowPurple}` : "1px solid transparent",
                    }}
                  >
                    {it}
                  </div>
                ))}
              </aside>
              <main className="space-y-3">
                <div className="grid grid-cols-3 gap-3 text-left">
                  {[
                    { v: "1,248", l: "Quotes" },
                    { v: "98%", l: "Match rate" },
                    { v: "12s", l: "Avg load" },
                  ].map((m) => (
                    <div key={m.l} className="rounded-lg p-3" style={{ background: C.glass, border: `1px solid ${C.border}` }}>
                      <p className="text-[11px]" style={{ color: C.textDim }}>{m.l}</p>
                      <p className="mt-1 text-xl font-semibold" style={{ fontFamily: FONT_HEAD, letterSpacing: "-0.02em" }}>{m.v}</p>
                    </div>
                  ))}
                </div>
                <div className="rounded-lg p-4" style={{ background: C.glass, border: `1px solid ${C.border}` }}>
                  <div className="flex items-center justify-between">
                    <p className="text-[12px] font-medium" style={{ color: C.text }}>Live quote stream</p>
                    <Activity className="h-3.5 w-3.5" style={{ color: C.cyan }} />
                  </div>
                  <div className="mt-3 flex h-16 items-end gap-1">
                    {[40, 65, 50, 80, 55, 90, 70, 95, 60, 85, 75, 100].map((h, i) => (
                      <span
                        key={i}
                        className="flex-1 rounded-sm"
                        style={{
                          height: `${h}%`,
                          background: `linear-gradient(180deg, ${C.cyan}, ${C.purple})`,
                          opacity: 0.85,
                        }}
                      />
                    ))}
                  </div>
                </div>
              </main>
            </div>
          </div>
        </div>
      </section>

      {/* Feature cards */}
      {t.services && (
        <section id="features" className="relative z-10">
          <div className="mx-auto max-w-6xl px-5 py-24">
            <div className="mx-auto max-w-2xl text-center">
              <span className="text-xs font-semibold uppercase tracking-[0.18em]" style={{ color: C.cyan }}>Features</span>
              <h2
                className="mt-3 text-4xl font-semibold sm:text-5xl"
                style={{ fontFamily: FONT_HEAD, letterSpacing: "-0.035em", color: C.text }}
              >
                Everything you need, nothing you don't.
              </h2>
            </div>
            <div className="mt-14 grid gap-5 sm:grid-cols-3">
              {benefits.map((b, i) => {
                const FeatureIcon = [Zap, Cpu, ShieldCheck][i % 3];
                return (
                  <div
                    key={b.title}
                    className="group relative rounded-2xl p-6 transition-all hover:-translate-y-1"
                    style={{
                      background: C.glass,
                      border: `1px solid ${C.border}`,
                      backdropFilter: "blur(10px)",
                    }}
                  >
                    <span
                      aria-hidden
                      className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity group-hover:opacity-100"
                      style={{
                        background: `radial-gradient(60% 60% at 50% 0%, ${C.glowPurple}, transparent 70%)`,
                      }}
                    />
                    <div
                      className="relative grid h-11 w-11 place-items-center rounded-lg"
                      style={{
                        background: `linear-gradient(135deg, ${C.purple}, ${C.blue})`,
                        boxShadow: `0 10px 30px -10px ${C.glowPurple}`,
                      }}
                    >
                      <FeatureIcon className="h-5 w-5 text-white" strokeWidth={2} />
                    </div>
                    <h3 className="relative mt-5 text-lg font-semibold" style={{ fontFamily: FONT_HEAD, letterSpacing: "-0.02em" }}>
                      {b.title}
                    </h3>
                    <p className="relative mt-2 text-sm leading-relaxed" style={{ color: C.textDim }}>
                      {b.body}
                    </p>
                    <div className="relative mt-5 flex items-center gap-1.5 text-[12px] font-medium" style={{ color: C.cyan }}>
                      <LayoutGrid className="h-3 w-3" />
                      <span style={{ fontFamily: FONT_MONO }}>module_{String(i + 1).padStart(2, "0")}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Glowing divider */}
      <div
        aria-hidden
        className="relative z-10 mx-auto h-px max-w-5xl"
        style={{ background: `linear-gradient(90deg, transparent, ${C.purple}, ${C.cyan}, transparent)`, opacity: 0.6 }}
      />

      {/* Testimonial */}
      {t.testimonials && (
        <section className="relative z-10 mx-auto max-w-3xl px-5 py-24 text-center">
          <p className="text-2xl leading-snug sm:text-3xl" style={{ fontFamily: FONT_HEAD, letterSpacing: "-0.02em", color: C.text }}>
            "Felt like the first time {typeLabel.toLowerCase()} was actually built for how I work today.
            Faster quotes, cleaner data, happier clients."
          </p>
          <div className="mt-6 inline-flex items-center gap-3">
            <span className="grid h-9 w-9 place-items-center rounded-full text-xs font-semibold" style={{ background: C.glass, border: `1px solid ${C.borderStrong}`, color: C.text }}>
              {initials(data.agentName)}
            </span>
            <span className="text-sm" style={{ color: C.textDim }}>{data.agentName} · {data.businessName}</span>
          </div>
        </section>
      )}

      {/* Contact */}
      <section id="contact" className="relative z-10">
        <div className="mx-auto max-w-4xl px-5 py-24">
          <div
            className="rounded-3xl p-8 sm:p-12"
            style={{
              background: C.glass,
              border: `1px solid ${C.borderStrong}`,
              backdropFilter: "blur(14px)",
              boxShadow: `0 60px 120px -40px ${C.glowBlue}`,
            }}
          >
            <p className="text-xs font-semibold uppercase tracking-[0.18em]" style={{ color: C.cyan }}>Get started</p>
            <h2 className="mt-3 text-3xl font-semibold sm:text-4xl" style={{ fontFamily: FONT_HEAD, letterSpacing: "-0.03em" }}>
              Talk to {data.agentName.split(" ")[0]}.
            </h2>
            <p className="mt-3 text-base" style={{ color: C.textDim }}>
              We'll reach out by {data.contactMethod} within one business day.
            </p>
            <form onSubmit={(e) => e.preventDefault()} className="mt-8 grid gap-4 sm:grid-cols-2">
              <GlassField placeholder="Full name" />
              <GlassField placeholder="Work email" />
              <GlassField placeholder="Phone" />
              <GlassField placeholder="Company" />
              <div className="sm:col-span-2">
                <GlassField placeholder={`Tell us about your ${typeLabel.toLowerCase()} setup`} />
              </div>
            </form>
            <button
              type="button"
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl px-6 py-4 text-base font-semibold transition-transform hover:scale-[1.005]"
              style={{
                background: `linear-gradient(135deg, ${C.purple}, ${C.blue})`,
                color: "#fff",
                boxShadow: `0 20px 60px -20px ${C.glowPurple}`,
              }}
            >
              {cta}
              <ArrowUpRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10" style={{ borderTop: `1px solid ${C.border}` }}>
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-4 px-5 py-8 text-sm sm:flex-row sm:items-center" style={{ color: C.textDim }}>
          <div className="flex items-center gap-3">
            <span
              className="grid h-7 w-7 place-items-center rounded-md text-[11px] font-bold text-white"
              style={{ background: `linear-gradient(135deg, ${C.purple}, ${C.blue})` }}
            >
              {initials(data.businessName)}
            </span>
            <span style={{ color: C.text, fontFamily: FONT_HEAD }} className="font-semibold tracking-tight">
              {data.businessName}
            </span>
            <span style={{ fontFamily: FONT_MONO }} className="text-[11px]">v1.0.0</span>
          </div>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[12px]">
            <span className="inline-flex items-center gap-1.5"><Mail className="h-3.5 w-3.5" />{data.email}</span>
            <span className="inline-flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" />{data.city}, {data.state}</span>
            <span>© {new Date().getFullYear()}</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

function GlassField({ placeholder }: { placeholder: string }) {
  return (
    <input
      placeholder={placeholder}
      className="w-full rounded-lg px-4 py-3 text-sm outline-none transition-colors"
      style={{
        background: C.glass,
        color: C.text,
        border: `1px solid ${C.border}`,
        backdropFilter: "blur(8px)",
      }}
      onFocus={(e) => (e.currentTarget.style.borderColor = C.cyan)}
      onBlur={(e) => (e.currentTarget.style.borderColor = C.border)}
    />
  );
}

/** Mini preview — dark gradient, neon button, dashboard chip. */
export function TechStartupMini(_props: ThemeProps) {
  return (
    <div
      className="relative h-full w-full p-1.5"
      style={{
        background: `radial-gradient(80% 60% at 50% 0%, ${C.glowPurple}, transparent 70%), ${C.bg}`,
      }}
    >
      <div
        aria-hidden
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.08) 1px, transparent 1px)",
          backgroundSize: "16px 16px",
        }}
      />
      <div className="relative flex h-full flex-col items-center justify-center gap-1">
        <span className="block h-1 w-[55%] rounded" style={{ background: C.text, opacity: 0.95 }} />
        <span className="block h-1 w-[40%] rounded" style={{ background: C.text, opacity: 0.5 }} />
        <span
          className="mt-1 block h-2 w-[30%] rounded"
          style={{
            background: `linear-gradient(135deg, ${C.purple}, ${C.cyan})`,
            boxShadow: `0 0 6px ${C.glowPurple}`,
          }}
        />
        <div
          className="mt-1.5 flex h-3 w-[80%] items-end gap-0.5 rounded p-0.5"
          style={{ background: C.glass, border: `1px solid ${C.border}` }}
        >
          {[40, 70, 50, 90, 60, 100, 55, 80].map((h, i) => (
            <span
              key={i}
              className="flex-1 rounded-sm"
              style={{
                height: `${h}%`,
                background: `linear-gradient(180deg, ${C.cyan}, ${C.purple})`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}