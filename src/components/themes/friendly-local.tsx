import { Phone, Mail, MapPin, MessageCircle, Heart, Coffee, Handshake, ArrowRight } from "lucide-react";
import type { ThemeProps } from "./shared";
import { getBenefits, initials, sectionToggles, ctaTextOf, typeLabelOf } from "./shared";

const C = {
  bg: "#FBF7F0",
  beige: "#F3ECDF",
  blueSoft: "#CDE3EE",
  blue: "#5B8FB0",
  blueDark: "#2F5D74",
  sage: "#9BBFA0",
  sageDeep: "#6F9C76",
  warmBrown: "#3F2E1F",
  ink: "#2A2316",
  body: "#5A4F3F",
};

const FONT_HEAD = "'Fraunces', Georgia, serif";
const FONT_BODY = "'Inter', system-ui, sans-serif";
const FONT_HAND = "'Caveat', 'Patrick Hand', cursive";

/** Theme 3 — Friendly Local Agent.
 *  Warm, neighborly. Blob backdrop behind family photo, conversational
 *  headline, soft pill buttons, "How I Help" 3-step section, pill service
 *  tags, personal-bio footer. */
export function FriendlyLocalLanding({ data }: ThemeProps) {
  const cta = ctaTextOf(data);
  const typeLabel = typeLabelOf(data);
  const benefits = getBenefits(data.insuranceType);
  const t = sectionToggles(data);

  return (
    <div
      style={{ background: C.bg, color: C.ink, fontFamily: FONT_BODY }}
      className="min-h-screen overflow-hidden"
      data-theme="friendly-local"
    >
      {/* Header */}
      <header className="relative">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
          <div className="flex items-center gap-3">
            {data.logoDataUrl ? (
              <img src={data.logoDataUrl} alt={data.businessName} className="h-10 w-auto object-contain" />
            ) : (
              <span className="grid h-10 w-10 place-items-center rounded-full text-sm font-semibold" style={{ background: C.sage, color: "#fff" }}>
                {initials(data.businessName)}
              </span>
            )}
            <div className="leading-tight">
              <p className="text-base font-semibold" style={{ fontFamily: FONT_HEAD }}>{data.businessName}</p>
              <p className="text-xs" style={{ color: C.blueDark }}>Local agent · {data.city}, {data.state}</p>
            </div>
          </div>
          <a
            href="#contact"
            className="hidden rounded-full px-5 py-2.5 text-sm font-semibold transition-colors sm:inline-block"
            style={{ background: C.sageDeep, color: "#fff" }}
          >
            Say hello →
          </a>
        </div>
      </header>

      {/* Hero */}
      <section className="relative">
        <div className="mx-auto grid max-w-5xl gap-12 px-6 py-12 lg:grid-cols-[1fr_1.05fr] lg:items-center lg:py-20">
          {/* Image with blob */}
          <div className="relative order-2 lg:order-1">
            {/* Decorative blobs */}
            <span
              aria-hidden
              className="absolute -left-6 -top-6 h-48 w-48 rounded-full blur-2xl"
              style={{ background: C.blueSoft, opacity: 0.7 }}
            />
            <span
              aria-hidden
              className="absolute -bottom-10 -right-4 h-56 w-56 rounded-full blur-2xl"
              style={{ background: C.sage, opacity: 0.45 }}
            />
            <div
              className="relative mx-auto aspect-square w-full max-w-md overflow-hidden"
              style={{
                borderRadius: "62% 38% 47% 53% / 53% 41% 59% 47%",
                background: `linear-gradient(160deg, ${C.beige}, ${C.blueSoft})`,
              }}
            >
              {data.headshotDataUrl ? (
                <img src={data.headshotDataUrl} alt={data.agentName} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <span
                    className="grid h-32 w-32 place-items-center rounded-full text-3xl text-white"
                    style={{ background: C.sageDeep, fontFamily: FONT_HEAD }}
                  >
                    {initials(data.agentName)}
                  </span>
                </div>
              )}
            </div>
            {/* Hand-written tag */}
            <span
              className="absolute -bottom-2 left-2 rotate-[-4deg] text-xl"
              style={{ fontFamily: FONT_HAND, color: C.blueDark }}
            >
              that's me, {data.agentName.split(" ")[0]}!
            </span>
          </div>

          <div className="order-1 lg:order-2">
            <span
              className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold"
              style={{ background: C.beige, color: C.warmBrown }}
            >
              <Heart className="h-3.5 w-3.5" />
              Friendly help · no pressure
            </span>
            <h1
              className="mt-5 text-4xl leading-[1.1] sm:text-5xl lg:text-[54px]"
              style={{ fontFamily: FONT_HEAD, fontWeight: 600, color: C.ink }}
            >
              {data.headline}
            </h1>
            <p className="mt-5 max-w-lg text-lg leading-relaxed" style={{ color: C.body }}>
              {data.subheadline}
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <a
                href="#contact"
                className="inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 text-base font-semibold text-white transition-transform hover:scale-[1.02]"
                style={{ background: C.sageDeep }}
              >
                {cta}
                <ArrowRight className="h-4 w-4" />
              </a>
              <a
                href={`tel:${data.phone}`}
                className="inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 text-base font-semibold transition-colors"
                style={{ background: C.beige, color: C.warmBrown }}
              >
                <Phone className="h-4 w-4" /> {data.phone}
              </a>
            </div>

            {/* pill tags */}
            <div className="mt-7 flex flex-wrap gap-2">
              {[typeLabel, "Local & licensed", "Real conversations", "Same-day callback"].map((p) => (
                <span
                  key={p}
                  className="rounded-full px-3 py-1 text-xs font-medium"
                  style={{ background: C.blueSoft, color: C.blueDark }}
                >
                  {p}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How I Help */}
      {t.aboutAgent && (
        <section className="mx-auto max-w-5xl px-6 py-20">
          <div className="text-center">
            <span className="text-sm italic" style={{ fontFamily: FONT_HEAD, color: C.blueDark }}>
              How I help
            </span>
            <h2
              className="mt-2 text-3xl sm:text-4xl"
              style={{ fontFamily: FONT_HEAD, fontWeight: 600 }}
            >
              Three simple steps. No insurance jargon.
            </h2>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-3">
            {[
              { icon: Coffee, title: "We chat", body: `Coffee or phone — we sit down, no script, and figure out what you actually need.` },
              { icon: Handshake, title: "We compare", body: `I shop the carriers I know and trust, then walk you through what makes sense.` },
              { icon: Heart, title: "I'm here later", body: `One agent, one phone number. No call centers. I'm here when life changes.` },
            ].map(({ icon: Icon, title, body }, i) => (
              <div
                key={title}
                className="relative rounded-3xl p-7 transition-transform hover:translate-y-[-3px]"
                style={{ background: "#fff", boxShadow: "0 6px 24px -10px rgba(63,46,31,0.18)" }}
              >
                <span
                  className="absolute -top-4 left-7 grid h-9 w-9 place-items-center rounded-full text-sm font-bold text-white"
                  style={{ background: C.blueDark, fontFamily: FONT_HEAD }}
                >
                  {i + 1}
                </span>
                <Icon className="h-7 w-7" style={{ color: C.sageDeep }} strokeWidth={1.5} />
                <h3 className="mt-4 text-xl" style={{ fontFamily: FONT_HEAD, fontWeight: 600 }}>{title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed" style={{ color: C.body }}>{body}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Services as soft community cards */}
      {t.services && (
        <section style={{ background: C.beige }}>
          <div className="mx-auto max-w-5xl px-6 py-20">
            <div className="max-w-xl">
              <span className="text-sm italic" style={{ fontFamily: FONT_HEAD, color: C.blueDark }}>
                What I help with
              </span>
              <h2 className="mt-2 text-3xl sm:text-4xl" style={{ fontFamily: FONT_HEAD, fontWeight: 600 }}>
                Real coverage for real life.
              </h2>
            </div>
            <div className="mt-10 grid gap-5 sm:grid-cols-3">
              {benefits.map((b) => (
                <div
                  key={b.title}
                  className="rounded-3xl p-7"
                  style={{ background: C.bg, border: `1px solid ${C.blueSoft}` }}
                >
                  <span
                    className="grid h-12 w-12 place-items-center rounded-2xl"
                    style={{ background: C.blueSoft, color: C.blueDark }}
                  >
                    <b.icon className="h-5 w-5" strokeWidth={1.75} />
                  </span>
                  <h3 className="mt-5 text-lg font-semibold" style={{ fontFamily: FONT_HEAD }}>{b.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed" style={{ color: C.body }}>{b.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Testimonials with profile circles */}
      {t.testimonials && (
        <section className="mx-auto max-w-5xl px-6 py-20">
          <div className="grid gap-5 sm:grid-cols-2">
            {[
              { name: "Linda M.", quote: `${data.agentName} treated my mom like family. We finally feel like we understand our coverage.` },
              { name: "Marcus T.", quote: `Real person who actually answers. Saved us hours of confusion.` },
            ].map((q, i) => (
              <div key={q.name} className="rounded-3xl bg-white p-7" style={{ boxShadow: "0 6px 22px -10px rgba(63,46,31,0.18)" }}>
                <div className="flex items-center gap-3">
                  <span
                    className="grid h-12 w-12 place-items-center rounded-full text-sm font-semibold text-white"
                    style={{ background: i === 0 ? C.blueDark : C.sageDeep, fontFamily: FONT_HEAD }}
                  >
                    {q.name.split(" ").map(n => n[0]).join("")}
                  </span>
                  <div>
                    <p className="text-sm font-semibold">{q.name}</p>
                    <p className="text-xs" style={{ color: C.body }}>{data.city} neighbor</p>
                  </div>
                </div>
                <p className="mt-4 text-[15px] leading-relaxed" style={{ color: C.body }}>"{q.quote}"</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Contact */}
      <section id="contact" style={{ background: C.bg }}>
        <div className="mx-auto grid max-w-5xl gap-10 px-6 py-20 lg:grid-cols-[1fr_1fr]">
          <div>
            <span className="text-sm italic" style={{ fontFamily: FONT_HEAD, color: C.blueDark }}>Get in touch</span>
            <h2 className="mt-2 text-3xl sm:text-4xl" style={{ fontFamily: FONT_HEAD, fontWeight: 600 }}>
              Let's talk — coffee or phone, your call.
            </h2>
            <p className="mt-4 text-base" style={{ color: C.body }}>
              I'll reach out by {data.contactMethod} — usually the same day.
            </p>
            <ul className="mt-8 space-y-3 text-sm" style={{ color: C.body }}>
              <li className="flex items-center gap-3"><Phone className="h-4 w-4" style={{ color: C.sageDeep }} />{data.phone}</li>
              <li className="flex items-center gap-3"><Mail className="h-4 w-4" style={{ color: C.sageDeep }} />{data.email}</li>
              <li className="flex items-center gap-3"><MapPin className="h-4 w-4" style={{ color: C.sageDeep }} />{data.city}, {data.state}</li>
            </ul>
          </div>
          <form onSubmit={(e) => e.preventDefault()} className="rounded-3xl p-7 sm:p-9" style={{ background: "#fff", boxShadow: "0 10px 36px -16px rgba(63,46,31,0.25)" }}>
            <div className="grid gap-4 sm:grid-cols-2">
              <SoftField placeholder="Your name" />
              <SoftField placeholder="Phone or email" />
            </div>
            <div className="mt-4">
              <SoftField placeholder={`What's on your mind about ${typeLabel.toLowerCase()}?`} />
            </div>
            <button
              type="submit"
              className="mt-6 w-full rounded-full py-4 text-base font-semibold text-white transition-transform hover:scale-[1.01]"
              style={{ background: C.sageDeep }}
            >
              {cta}
            </button>
            <p className="mt-3 text-center text-xs" style={{ color: C.body }}>
              Friendly. No spam. Promise.
            </p>
          </form>
        </div>
      </section>

      {/* Footer with personal bio */}
      <footer style={{ background: C.beige, borderTop: `1px solid ${C.blueSoft}` }}>
        <div className="mx-auto grid max-w-5xl gap-8 px-6 py-12 sm:grid-cols-[1.5fr_1fr]">
          <div className="flex items-start gap-4">
            <span
              className="grid h-14 w-14 place-items-center rounded-full text-lg font-semibold text-white"
              style={{ background: C.blueDark, fontFamily: FONT_HEAD }}
            >
              {initials(data.agentName)}
            </span>
            <div>
              <p className="text-base font-semibold" style={{ fontFamily: FONT_HEAD }}>{data.agentName}</p>
              <p className="text-xs uppercase tracking-wider" style={{ color: C.blueDark }}>Licensed agent · {data.state}</p>
              <p className="mt-2 max-w-md text-sm" style={{ color: C.body }}>
                Born and raised in {data.city}. I treat clients like neighbors — because they are.
              </p>
            </div>
          </div>
          <div className="text-sm" style={{ color: C.body }}>
            <p className="font-semibold">{data.businessName}</p>
            <p className="mt-1">{data.phone} · {data.email}</p>
            <p className="mt-3 text-xs">© {new Date().getFullYear()} · Made with care in {data.city}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function SoftField({ placeholder }: { placeholder: string }) {
  return (
    <input
      placeholder={placeholder}
      className="w-full rounded-2xl px-4 py-3 text-sm outline-none transition-colors"
      style={{ background: C.beige, color: C.ink, border: `1px solid ${C.beige}` }}
      onFocus={(e) => (e.currentTarget.style.borderColor = C.sageDeep)}
      onBlur={(e) => (e.currentTarget.style.borderColor = C.beige)}
    />
  );
}

/** Mini preview — blob photo on left, soft pill button on right. */
export function FriendlyLocalMini(_props: ThemeProps) {
  return (
    <div className="flex h-full w-full p-1.5" style={{ background: C.bg }}>
      <div className="relative w-[42%]">
        <span className="absolute -left-1 -top-1 h-5 w-5 rounded-full" style={{ background: C.blueSoft }} />
        <span className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full" style={{ background: C.sage, opacity: 0.6 }} />
        <div
          className="relative h-full w-full"
          style={{
            background: `linear-gradient(160deg, ${C.beige}, ${C.blueSoft})`,
            borderRadius: "60% 40% 50% 50% / 50% 40% 60% 50%",
          }}
        />
      </div>
      <div className="ml-1.5 flex flex-1 flex-col justify-center gap-1">
        <span className="block h-1 w-[60%] rounded-full" style={{ background: C.beige }} />
        <span className="mt-0.5 block h-1.5 w-[90%] rounded-full" style={{ background: C.ink, fontFamily: FONT_HEAD }} />
        <span className="mt-0.5 block h-1.5 w-[70%] rounded-full" style={{ background: C.ink, opacity: 0.7 }} />
        <span className="mt-1 block h-2 w-[50%] rounded-full" style={{ background: C.sageDeep }} />
        <div className="mt-1 flex gap-0.5">
          {[0, 1, 2].map((i) => (
            <span key={i} className="block h-1 w-3 rounded-full" style={{ background: C.blueSoft }} />
          ))}
        </div>
      </div>
    </div>
  );
}