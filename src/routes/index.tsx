import { createFileRoute } from "@tanstack/react-router";
import { AppHeader } from "@/components/app/app-header";
import { AppFooter } from "@/components/app/app-footer";
import { PageTransition } from "@/components/app/page-transition";
import { usePageTransition } from "@/hooks/use-page-transition";
import {
  ArrowRight,
  Check,
  Smartphone,
  Palette,
  Zap,
  Shield,
  Target,
  HeartHandshake,
  UserPlus,
  Globe,
  FileText,
  Layout,
  RefreshCw,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { signInWithGoogle, useAccount } from "@/lib/account";
import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/")({
  component: HomePage,
  head: () => ({
    meta: [
      { title: "Diploo — A modern website builder for insurance agents" },
      {
        name: "description",
        content:
          "A clean, simple website builder for insurance agents — Medicare, ACA, Life, Health, Auto, Home, and more. Launch a modern lead-gen site in minutes.",
      },
      { property: "og:title", content: "Diploo — A modern website builder for insurance agents" },
      {
        property: "og:description",
        content:
          "Launch a beautiful, mobile-friendly website for your insurance practice in minutes — no designer required.",
      },
    ],
  }),
});

/* ── Page load animation ── */
function PageLoader() {
  const [hidden, setHidden] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setHidden(true), 2500);
    return () => clearTimeout(t);
  }, []);
  if (hidden) return null;
  return (
    <div className="dp-loader" aria-hidden>
      <div className="dp-loader-logo">
        <div className="dp-loader-icon">D</div>
        <div className="dp-loader-wordmark">Diploo</div>
      </div>
      <div className="dp-loader-bar-wrap">
        <div className="dp-loader-bar" />
      </div>
    </div>
  );
}

/* ── Scroll reveal hook ── */
function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.classList.add("dp-visible"); obs.unobserve(el); } },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

function Reveal({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useReveal();
  return (
    <div ref={ref} className={`dp-reveal ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

function HomePage() {
  return (
    <div className="dp-dark flex min-h-screen flex-col">
      <PageLoader />
      <AppHeader />
      <PageTransition>
        <main className="flex-1">
          <Hero />
          <Marquee />
          <StatsBar />
          <HowItWorks />
          <Benefits />
          <SocialProof />
          <Faq />
          <FinalCta />
        </main>
      </PageTransition>
      <AppFooter />
      <FloatingCta />
    </div>
  );
}

/* ────────── HERO ────────── */
function Hero() {
  const { transitionTo } = usePageTransition();
  const [googleLoading, setGoogleLoading] = useState(false);
  const account = useAccount();
  const signedIn = account.hydrated && account.signedIn;

  const handleGoogle = async () => {
    if (googleLoading) return;
    setGoogleLoading(true);
    try { await signInWithGoogle("/start"); }
    catch (err) { toast.error(err instanceof Error ? err.message : "Google sign-in failed"); setGoogleLoading(false); }
  };

  return (
    <section className="dp-hero">
      <div className="dp-grid-bg" aria-hidden />
      <div className="dp-orb dp-orb-1" aria-hidden />
      <div className="dp-orb dp-orb-2" aria-hidden />
      <div className="dp-orb dp-orb-3" aria-hidden />

      <div className="dp-hero-inner">
        <div className="dp-badge-wrap">
          <span className="dp-badge"><span className="dp-badge-dot" />Built for independent insurance agents</span>
        </div>

        <h1 className="dp-hero-h1">
          Your insurance website,{" "}
          <span className="dp-grad">live in minutes</span>
        </h1>

        <p className="dp-hero-sub">
          Medicare, ACA, Life, Health, Auto & Home. Diploo builds you a polished,
          mobile-ready lead-gen site — no designer, no developer, no headaches.
        </p>

        <div className="dp-cta-row">
          {signedIn ? (
            <>
              <button onClick={() => transitionTo({ to: "/start" })} className="dp-btn-primary">
                Open Builder <ArrowRight className="dp-btn-arrow" />
              </button>
              <button onClick={() => transitionTo({ to: "/workspace" })} className="dp-btn-ghost">
                Go to Workspace
              </button>
            </>
          ) : (
            <>
              <button onClick={() => transitionTo({ to: "/signup" })} className="dp-btn-primary">
                <UserPlus className="dp-btn-icon" />
                Create Your Account
                <ArrowRight className="dp-btn-arrow" />
              </button>
              <button disabled={googleLoading} onClick={handleGoogle} className="dp-btn-ghost">
                <GoogleGlyph />
                {googleLoading ? "Connecting…" : "Continue with Google"}
              </button>
            </>
          )}
        </div>

        <div className="dp-trust-pills">
          {["5-minute setup", "Mobile-friendly", "Lead-ready", "No coding needed"].map((t) => (
            <span key={t} className="dp-pill"><Check className="dp-pill-icon" />{t}</span>
          ))}
        </div>
      </div>
    </section>
  );
}

function GoogleGlyph() {
  return (
    <svg className="dp-btn-icon" viewBox="0 0 48 48" aria-hidden>
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.6-6 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.7 1.1 7.8 3l5.7-5.7C33.6 6.1 29.1 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.3-.4-3.5z" />
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.4 19 12 24 12c3 0 5.7 1.1 7.8 3l5.7-5.7C33.6 6.1 29.1 4 24 4 16.3 4 9.7 8.4 6.3 14.7z" />
      <path fill="#4CAF50" d="M24 44c5 0 9.6-1.9 13-5l-6-5.1C29.1 35.5 26.7 36 24 36c-5.3 0-9.7-3.4-11.3-8l-6.6 5.1C9.5 39.5 16.2 44 24 44z" />
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4-4 5.4l6 5.1C40.7 34.7 44 30.1 44 24c0-1.3-.1-2.3-.4-3.5z" />
    </svg>
  );
}

/* ────────── MARQUEE ────────── */
function Marquee() {
  const items = ["Medicare agents","ACA agents","Life insurance","Health insurance","Final expense","Auto & home","Commercial agents","Independent brokers"];
  const doubled = [...items, ...items];
  return (
    <div className="dp-marquee-wrap">
      <p className="dp-marquee-label">Built for every type of agent</p>
      <div className="dp-marquee">
        <div className="dp-marquee-track">
          {doubled.map((n, i) => (
            <span key={i} className="dp-marquee-item"><span className="dp-marquee-dot" />{n}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ────────── STATS BAR ────────── */
function StatsBar() {
  const stats = [
    { num: "500+", label: "Agents using Diploo" },
    { num: "5 min", label: "Average setup time" },
    { num: "100%", label: "Mobile-ready sites" },
    { num: "8+", label: "Insurance niches supported" },
  ];
  return (
    <div className="dp-stats-bar">
      {stats.map((s) => (
        <Reveal key={s.label} className="dp-stat-item">
          <div className="dp-stat-num">{s.num}</div>
          <div className="dp-stat-label">{s.label}</div>
        </Reveal>
      ))}
    </div>
  );
}

/* ────────── HOW IT WORKS ────────── */
function HowItWorks() {
  const steps = [
    { n: "01", icon: FileText, title: "Tell us about your practice", desc: "Share your name, niche, contact info, and branding. Takes two minutes." },
    { n: "02", icon: Layout,   title: "Describe your perfect site",  desc: "Use the AI prompt to shape the look, feel, and sections you want." },
    { n: "03", icon: Globe,    title: "Generate & go live",          desc: "Preview your polished, mobile-ready page and publish in one click." },
  ];
  return (
    <section className="dp-section">
      <div className="dp-section-inner">
        <Reveal><div className="dp-s-label">How it works</div></Reveal>
        <Reveal><h2 className="dp-s-heading">From idea to live site <span className="dp-grad">in 5 minutes</span></h2></Reveal>
        <Reveal><p className="dp-s-sub">Designed for agents, not designers. The whole flow takes about five minutes.</p></Reveal>
        <div className="dp-steps">
          {steps.map((s, i) => (
            <Reveal key={s.title} delay={i * 80}>
              <div className="dp-step">
                <div className="dp-step-num">{s.n}</div>
                <div className="dp-step-icon"><s.icon className="h-4 w-4" /></div>
                <div className="dp-step-title">{s.title}</div>
                <div className="dp-step-desc">{s.desc}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ────────── BENEFITS ────────── */
function Benefits() {
  const items = [
    { icon: Zap,           title: "No coding needed",          desc: "Just answer a few questions — we handle the rest.",                       accent: "#f59e0b" },
    { icon: Smartphone,    title: "Mobile-friendly by default", desc: "Every site looks great on phones, tablets, and desktops.",                accent: "#3b82f6" },
    { icon: Palette,       title: "Your branding, your way",   desc: "Upload your logo, headshot, and pick your style.",                        accent: "#8b5cf6" },
    { icon: Target,        title: "Lead-focused structure",    desc: "Designed to capture inquiries, not just look pretty.",                    accent: "#ef4444" },
    { icon: Shield,        title: "Built for insurance",       desc: "Copy and sections tuned for Medicare, ACA, Life, P&C.",                  accent: "#10b981" },
    { icon: HeartHandshake,title: "Easy to update",            desc: "Edit copy, swap photos, and republish anytime.",                          accent: "#f97316" },
  ];
  return (
    <section className="dp-section dp-section-alt">
      <div className="dp-section-inner">
        <Reveal><div className="dp-s-label">Why agents choose Diploo</div></Reveal>
        <Reveal><h2 className="dp-s-heading">Everything you need, <span className="dp-grad">nothing you don't</span></h2></Reveal>
        <div className="dp-benefits-grid">
          {items.map((b, i) => (
            <Reveal key={b.title} delay={i * 60}>
              <div className="dp-benefit-card">
                <div className="dp-benefit-icon" style={{ "--ba": b.accent } as React.CSSProperties}>
                  <b.icon className="h-4 w-4" />
                </div>
                <div className="dp-benefit-title">{b.title}</div>
                <div className="dp-benefit-desc">{b.desc}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ────────── SOCIAL PROOF ────────── */
function SocialProof() {
  const testimonials = [
    { quote: "I had a professional Medicare site live in under 10 minutes. My clients actually comment on how clean it looks compared to other agents they've talked to.", name: "Marcus R.", role: "Medicare agent · Texas", initials: "MR", color: "linear-gradient(135deg,#d4a96a,#c49456)" },
    { quote: "Finally a website builder that actually understands insurance. I didn't have to explain what ACA was or remove irrelevant sections. It just worked.", name: "Jennifer L.", role: "ACA & Life agent · Florida", initials: "JL", color: "linear-gradient(135deg,#8b5cf6,#6d28d9)" },
    { quote: "I've tried Wix, Squarespace, even hired a developer. Diploo is the only one that gave me a site that actually converts leads — and I set it up myself.", name: "David T.", role: "Independent broker · Ohio", initials: "DT", color: "linear-gradient(135deg,#10b981,#059669)" },
  ];
  return (
    <section className="dp-section">
      <div className="dp-section-inner">
        <Reveal><div className="dp-proof-stars">{"★★★★★"}</div></Reveal>
        <Reveal><h2 className="dp-s-heading">Agents love Diploo</h2></Reveal>
        <Reveal><p className="dp-s-sub">Real feedback from independent agents using Diploo every day.</p></Reveal>
        <div className="dp-proof-grid">
          {testimonials.map((t, i) => (
            <Reveal key={t.name} delay={i * 80}>
              <div className="dp-proof-card">
                <p className="dp-proof-quote">{t.quote}</p>
                <div className="dp-proof-author">
                  <div className="dp-proof-avatar" style={{ background: t.color }}>{t.initials}</div>
                  <div>
                    <div className="dp-proof-name">{t.name}</div>
                    <div className="dp-proof-role">{t.role}</div>
                  </div>
                  <div className="dp-proof-rating">{"★★★★★"}</div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ────────── FAQ ────────── */
function Faq() {
  const faqs = [
    { q: "Will my site show up on Google?", a: "Yes. Every Diploo site is built with SEO-friendly structure — proper headings, meta tags, fast load times, and mobile responsiveness. You can also add your own keywords and location info to help rank for searches like "Medicare agent in [your city]."" },
    { q: "Can I use my own domain name?", a: "Yes. You can connect your own custom domain to your Diploo site. We walk you through the setup — it takes about 5 minutes and no technical knowledge is required." },
    { q: "Do I need design or coding skills?", a: "None whatsoever. The AI handles layout, structure, and the standard sections every insurance site needs. You answer a few questions about your practice, and we generate a professional site." },
    { q: "What happens if I cancel?", a: "No contracts, no penalties. Cancel anytime from your account settings. Your site will stay up until the end of your current billing period." },
    { q: "Is there a free trial?", a: "Yes — you can build and preview your full site for free before choosing a plan. You only need to subscribe when you're ready to publish and go live." },
    { q: "Can I update my site after it's live?", a: "Absolutely. Edit your copy, swap your headshot, update your services, and republish anytime — all without touching a single line of code." },
    { q: "What's the done-for-you option?", a: "Our team will build your site for you starting at $206 one-time plus an active subscription. We handle everything — layout, copy, branding, and launch. You just approve the final result." },
  ];
  return (
    <section className="dp-section dp-section-alt">
      <div className="dp-section-inner dp-faq-inner">
        <Reveal><div className="dp-s-label">Got questions?</div></Reveal>
        <Reveal><h2 className="dp-s-heading">Everything agents ask <span className="dp-grad">before signing up</span></h2></Reveal>
        <Reveal>
          <div className="dp-faq-wrap">
            <Accordion type="single" collapsible>
              {faqs.map((f, i) => (
                <AccordionItem key={i} value={`faq-${i}`} className="dp-faq-item">
                  <AccordionTrigger className="dp-faq-trigger">{f.q}</AccordionTrigger>
                  <AccordionContent className="dp-faq-content">{f.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ────────── FINAL CTA ────────── */
function FinalCta() {
  const { transitionTo } = usePageTransition();
  const account = useAccount();
  const signedIn = account.hydrated && account.signedIn;
  return (
    <section className="dp-cta-section">
      <div className="dp-cta-orb dp-cta-orb-1" aria-hidden />
      <div className="dp-cta-orb dp-cta-orb-2" aria-hidden />
      <div className="dp-cta-inner">
        <Reveal><h2 className="dp-cta-heading">Ready to launch your <span className="dp-grad">insurance website?</span></h2></Reveal>
        <Reveal><p className="dp-cta-sub">Try the AI builder free, or have our team build it for you. It only takes 5 minutes to get started.</p></Reveal>
        <Reveal>
          <div className="dp-cta-row">
            <button onClick={() => transitionTo({ to: signedIn ? "/start" : "/signup" })} className="dp-btn-primary">
              {signedIn ? "Open Builder" : "Get Started Free"} <ArrowRight className="dp-btn-arrow" />
            </button>
            <button onClick={() => transitionTo({ to: "/pricing" })} className="dp-btn-ghost">
              See pricing
            </button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ────────── FLOATING CTA ────────── */
function FloatingCta() {
  const { transitionTo } = usePageTransition();
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > window.innerHeight * 0.7);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <div className={`dp-float-cta ${show ? "dp-float-show" : ""}`}>
      <button onClick={() => transitionTo({ to: "/signup" })} className="dp-float-btn">
        <Zap className="h-3 w-3" /> Get Started Free
      </button>
    </div>
  );
}
