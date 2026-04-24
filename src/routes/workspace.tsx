import { useEffect, useMemo, useRef, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { AppHeader } from "@/components/app/app-header";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowLeft,
  Edit3,
  Globe,
  Lock,
  Send,
  Sparkles,
  Smartphone,
  Monitor,
  CreditCard,
  Loader2,
  Zap,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import { GeneratedLanding } from "@/components/generated/generated-landing";
import {
  loadBuilder,
  saveBuilder,
  type BuilderData,
  DEFAULT_BUILDER,
} from "@/lib/builder-storage";
import { useUserCredits, ACTION_COSTS } from "@/lib/user-credits";
import { CreditsBadge } from "@/components/app/credits-badge";
import { toast } from "sonner";

export const Route = createFileRoute("/workspace")({
  component: WorkspacePage,
  head: () => ({
    meta: [
      { title: "Builder workspace — Diploofly" },
      {
        name: "description",
        content:
          "Live AI website builder for insurance agents. Preview your site on the left, chat tweaks on the right.",
      },
    ],
  }),
});

interface ChatMessage {
  id: string;
  role: "assistant" | "user";
  text: string;
}

const STARTER_MESSAGE: ChatMessage = {
  id: "starter",
  role: "assistant",
  text:
    "Your website is on the left. If there are any tweaks you would like to make to the website, type here.",
};

/**
 * Apply a simulated AI tweak to the BuilderData based on the user's message.
 * Pattern-matches keywords and returns the patch + a friendly description.
 */
function applyTweak(
  data: BuilderData,
  message: string,
): { patch: Partial<BuilderData> | null; reply: string } {
  const m = message.toLowerCase().trim();
  if (!m) return { patch: null, reply: "Add a few words and I'll get to work." };

  // Headline change: "change headline to ..." / "headline: ..."
  const headlineMatch =
    /(?:change|update|make|set)?\s*(?:the\s+)?headline\s*(?:to|:)\s*["“]?(.+?)["”]?$/i.exec(
      message,
    );
  if (headlineMatch) {
    return {
      patch: { headline: headlineMatch[1].trim() },
      reply: `Updated your headline to "${headlineMatch[1].trim()}".`,
    };
  }

  const subMatch =
    /(?:change|update|make|set)?\s*(?:the\s+)?(?:subheadline|subhead|tagline|description)\s*(?:to|:)\s*["“]?(.+?)["”]?$/i.exec(
      message,
    );
  if (subMatch) {
    return {
      patch: { subheadline: subMatch[1].trim() },
      reply: `Subheadline updated.`,
    };
  }

  const ctaMatch =
    /(?:change|update|make|set)?\s*(?:the\s+)?(?:cta|button|call to action)\s*(?:text)?\s*(?:to|:)\s*["“]?(.+?)["”]?$/i.exec(
      message,
    );
  if (ctaMatch) {
    return {
      patch: { ctaText: ctaMatch[1].trim() },
      reply: `Button text updated to "${ctaMatch[1].trim()}".`,
    };
  }

  if (/(more|extra)\s+(friendly|warm|personal)/.test(m)) {
    return {
      patch: {
        subheadline:
          "Friendly, no-pressure guidance from a real local agent who answers the phone — and actually listens.",
      },
      reply: "Made the tone warmer and more personal.",
    };
  }

  if (/professional|formal|polished|corporate/.test(m)) {
    return {
      patch: {
        subheadline:
          "Professional, transparent guidance to help you choose the right coverage with confidence.",
      },
      reply: "Tightened the tone to feel more polished and professional.",
    };
  }

  if (/urgent|stronger|punchy|bold/.test(m)) {
    return {
      patch: {
        headline: data.headline.endsWith("!")
          ? data.headline
          : data.headline.replace(/[.?!]?$/, "!"),
        ctaText: "Get Started Now",
      },
      reply: "Made the headline punchier and the CTA more direct.",
    };
  }

  if (/medicare/.test(m)) {
    return {
      patch: {
        insuranceType: "Medicare",
        businessType: "Medicare insurance agency",
      },
      reply: "Reframed the page around Medicare clients.",
    };
  }
  if (/\baca\b|affordable care/.test(m)) {
    return {
      patch: { insuranceType: "ACA", businessType: "ACA brokerage" },
      reply: "Reframed the page around ACA clients.",
    };
  }
  if (/life insurance|life policy|whole life|term life/.test(m)) {
    return {
      patch: { insuranceType: "Life", businessType: "Life insurance agency" },
      reply: "Switched the niche focus to life insurance.",
    };
  }
  if (/auto|car insurance/.test(m)) {
    return {
      patch: { insuranceType: "Auto", businessType: "Auto insurance agency" },
      reply: "Switched the niche focus to auto insurance.",
    };
  }
  if (/home insurance|homeowners/.test(m)) {
    return {
      patch: { insuranceType: "Home", businessType: "Home insurance agency" },
      reply: "Switched the niche focus to home insurance.",
    };
  }

  if (/note from|author note|personal note/.test(m)) {
    return {
      patch: {
        authorNotes:
          `Hi, I'm ${data.agentName}. Thanks for stopping by — I'd love to help you find the right coverage for your family.`,
      },
      reply: "Added a warm personal note from you.",
    };
  }

  if (/call|phone preferred/.test(m)) {
    return { patch: { contactMethod: "call" }, reply: "Set the preferred contact method to call." };
  }
  if (/text|sms/.test(m)) {
    return { patch: { contactMethod: "text" }, reply: "Set the preferred contact method to text." };
  }
  if (/email preferred|prefer email/.test(m)) {
    return { patch: { contactMethod: "email" }, reply: "Set the preferred contact method to email." };
  }

  // Generic fallback — wedge it into the freestyle instructions so the user
  // sees their input has been captured.
  return {
    patch: {
      workspaceNotes:
        (data.workspaceNotes ? data.workspaceNotes + "\n• " : "• ") +
        message.trim(),
    },
    reply:
      "Got it — I've noted that for the next regeneration. Try a more specific tweak like 'change headline to ...' or 'make the tone more friendly' and I'll update the preview right away.",
  };
}

/**
 * Quality-control pass. Scans the builder data for common issues
 * (missing CTA, weak headline, missing contact, etc.) and returns
 * an auto-fix patch + a human-readable list of what was improved.
 */
function selfCheck(data: BuilderData): {
  patch: Partial<BuilderData> | null;
  fixes: string[];
} {
  const fixes: string[] = [];
  const patch: Partial<BuilderData> = {};

  if (!data.ctaText.trim()) {
    patch.ctaText = "Get My Free Quote";
    fixes.push("Added a primary call-to-action button");
  }
  if (!data.headline.trim()) {
    patch.headline = "Coverage made simple, made for you";
    fixes.push("Restored a clear headline");
  } else if (data.headline.length < 12) {
    patch.headline = data.headline + " — coverage made simple";
    fixes.push("Strengthened a too-short headline");
  }
  if (!data.subheadline.trim()) {
    patch.subheadline =
      "Friendly, transparent guidance to help you choose the right coverage with confidence.";
    fixes.push("Added a supporting subheadline");
  }
  if (!data.phone.trim() && !data.email.trim()) {
    patch.phone = "(555) 123-4567";
    fixes.push("Added a fallback contact path");
  }
  if (!data.businessType.trim()) {
    patch.businessType = `${data.insuranceType || "Insurance"} agency`;
    fixes.push("Filled in the business type");
  }

  return { patch: Object.keys(patch).length ? patch : null, fixes };
}

function WorkspacePage() {
  const [data, setData] = useState<BuilderData | null>(null);
  const [device, setDevice] = useState<"desktop" | "mobile">("desktop");
  const [messages, setMessages] = useState<ChatMessage[]>([STARTER_MESSAGE]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const credits = useUserCredits();
  const scrollRef = useRef<HTMLDivElement>(null);
  const launchedAt = useRef<number>(Date.now());

  useEffect(() => {
    setData(loadBuilder() ?? DEFAULT_BUILDER);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, thinking]);

  const statusPill = useMemo(() => {
    if (thinking) {
      return {
        icon: Loader2,
        label: "Generating…",
        className:
          "border-border bg-[var(--surface-sand)]/60 text-foreground/75",
        spin: true,
      };
    }
    if (savedAt && Date.now() - savedAt < 2500) {
      return {
        icon: CheckCircle2,
        label: "Updated",
        className:
          "border-emerald-300/60 bg-emerald-50/80 text-emerald-900",
        spin: false,
      };
    }
    return {
      icon: CheckCircle2,
      label: "Saved",
      className:
        "border-border bg-[var(--surface-sand)]/60 text-foreground/75",
      spin: false,
    };
  }, [thinking, savedAt]);

  function send() {
    const text = input.trim();
    if (!text || thinking || !data) return;

    if (credits.isEmpty) {
      toast.error("You're out of credits", {
        description: "Upgrade to keep tweaking your site with AI.",
      });
      return;
    }
    if (!credits.canAfford("regenerate_section")) {
      toast.error(
        `Tweaks cost ${ACTION_COSTS.regenerate_section} credit each`,
        {
          description: `You have ${credits.credits} left. Upgrade to continue.`,
        },
      );
      return;
    }

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      role: "user",
      text,
    };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setThinking(true);

    // Simulated thinking delay so it feels real.
    window.setTimeout(() => {
      const { patch, reply } = applyTweak(data, text);
      let next: BuilderData = data;
      if (patch) {
        next = { ...data, ...patch };
        void credits.charge("regenerate_section");
      }
      // Quality-control pass — auto-fix any obvious issues.
      const qc = selfCheck(next);
      let qcReply = "";
      if (qc.patch) {
        next = { ...next, ...qc.patch };
        qcReply =
          "\n\nQuality check: " +
          qc.fixes.map((f) => `✓ ${f}`).join(" · ");
      }
      if (patch || qc.patch) {
        setData(next);
        saveBuilder(next);
        setSavedAt(Date.now());
      }
      setMessages((m) => [
        ...m,
        { id: `a-${Date.now()}`, role: "assistant", text: reply + qcReply },
      ]);
      setThinking(false);
    }, 650);
  }

  function tryPublish() {
    toast.error("Add a payment method to publish", {
      description:
        "Your site is ready, but publishing requires a valid card on file and an active subscription.",
    });
  }

  if (!data) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <AppHeader />
        <main className="flex flex-1 items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-[var(--surface-sand)]/40">
      <AppHeader />
      <main className="flex flex-1 flex-col">
        {/* Workspace toolbar */}
        <div className="border-b border-border/60 bg-background/80 backdrop-blur">
          <div className="mx-auto flex max-w-[1400px] flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-foreground/70">
                <Sparkles className="h-3 w-3" />
                Workspace
              </span>
              <span
                className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium ${statusPill.className}`}
              >
                <statusPill.icon
                  className={`h-3.5 w-3.5 ${statusPill.spin ? "animate-spin" : ""}`}
                />
                {statusPill.label}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-[var(--surface-sand)]/60 px-3 py-1 text-xs font-medium text-foreground/75">
                <ShieldCheck className="h-3.5 w-3.5" />
                AI quality-check on
              </span>
              <CreditsBadge />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Button
                asChild
                variant="outline"
                size="sm"
                className="rounded-full"
              >
                <Link to="/builder">
                  <Edit3 className="mr-1 h-3.5 w-3.5" />
                  Edit details
                </Link>
              </Button>
              <Button
                onClick={tryPublish}
                size="sm"
                className="rounded-full bg-[var(--surface-mocha)] text-[var(--surface-cream)] hover:bg-[var(--surface-espresso)]"
              >
                <Lock className="mr-1 h-3.5 w-3.5" />
                Publish
              </Button>
            </div>
          </div>
        </div>

        {/* Card-required notice */}
        <div className="mx-auto w-full max-w-[1400px] px-4 pt-3 sm:px-6">
          <div className="flex flex-col items-start gap-2 rounded-2xl border border-amber-300/40 bg-amber-50/80 px-4 py-3 text-sm text-amber-900 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-2">
              <CreditCard className="mt-0.5 h-4 w-4 shrink-0" />
              <p>
                <span className="font-semibold">
                  Add a valid payment method to publish your website.
                </span>{" "}
                You can build and edit during your trial — going live requires an
                active subscription.
              </p>
            </div>
            <Button
              asChild
              size="sm"
              variant="outline"
              className="shrink-0 rounded-full border-amber-700/30 bg-background text-amber-900 hover:bg-amber-50"
            >
              <Link to="/pricing">Choose a plan</Link>
            </Button>
          </div>
        </div>

        {/* Split layout */}
        <div
          key={launchedAt.current}
          className="lp-workspace-launch mx-auto grid w-full max-w-[1400px] flex-1 gap-4 px-4 py-4 sm:px-6 lg:grid-cols-[1fr_400px]"
        >
          {/* Preview side */}
          <section className="flex min-h-[60vh] flex-col overflow-hidden rounded-2xl border border-border/60 bg-background shadow-[var(--shadow-md)]">
            <div className="flex items-center gap-2 border-b border-border/60 bg-[var(--surface-sand)]/60 px-4 py-2.5">
              <span className="h-2.5 w-2.5 rounded-full bg-[oklch(0.78_0.13_25)]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[oklch(0.85_0.13_85)]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[oklch(0.78_0.13_145)]" />
              <span className="ml-3 truncate rounded-md bg-background px-3 py-1 text-xs text-muted-foreground">
                {data.businessName.toLowerCase().replace(/\s+/g, "")}.diploofly
              </span>
              <div className="ml-auto inline-flex items-center rounded-full border border-border bg-background p-0.5">
                <button
                  type="button"
                  onClick={() => setDevice("desktop")}
                  aria-label="Desktop preview"
                  className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-medium transition-colors ${
                    device === "desktop"
                      ? "bg-[var(--surface-mocha)] text-[var(--surface-cream)]"
                      : "text-foreground/70"
                  }`}
                >
                  <Monitor className="h-3 w-3" />
                  Desktop
                </button>
                <button
                  type="button"
                  onClick={() => setDevice("mobile")}
                  aria-label="Mobile preview"
                  className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-medium transition-colors ${
                    device === "mobile"
                      ? "bg-[var(--surface-mocha)] text-[var(--surface-cream)]"
                      : "text-foreground/70"
                  }`}
                >
                  <Smartphone className="h-3 w-3" />
                  Mobile
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-auto">
              {device === "mobile" ? (
                <div className="flex min-h-full justify-center bg-[var(--surface-sand)]/30 px-4 py-6">
                  <div className="w-[390px] overflow-hidden rounded-[2rem] border border-border bg-background shadow-[var(--shadow-md)]">
                    {/* Render the desktop landing scaled into phone width.
                        Wrap height is compensated so nothing gets clipped or
                        leaves a giant empty space below. */}
                    <ScaledMobilePreview data={data} />
                  </div>
                </div>
              ) : (
                <GeneratedLanding data={data} />
              )}
            </div>
          </section>

          {/* Chat side */}
          <aside className="flex min-h-[60vh] flex-col overflow-hidden rounded-2xl border border-border/60 bg-background shadow-[var(--shadow-md)] lg:max-h-[calc(100vh-13rem)]">
            <div className="border-b border-border/60 bg-[var(--surface-sand)]/40 px-4 py-3">
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--surface-mocha)] text-[var(--surface-cream)]">
                  <Sparkles className="h-3.5 w-3.5" />
                </span>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-foreground">
                    AI website assistant
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    {ACTION_COSTS.regenerate_section} credit per tweak
                  </p>
                </div>
              </div>
            </div>

            <div
              ref={scrollRef}
              className="flex-1 space-y-3 overflow-y-auto px-4 py-4"
            >
              {messages.map((m) => (
                <ChatBubble key={m.id} message={m} />
              ))}
              {thinking && (
                <div className="lp-chat-bubble flex items-center gap-2 text-xs text-muted-foreground">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Updating your site…
                </div>
              )}
            </div>

            <div className="border-t border-border/60 bg-background p-3">
              <div className="rounded-xl border border-border bg-[var(--surface-cream)]/60 transition-colors focus-within:border-foreground/30 focus-within:bg-background">
                <Textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      send();
                    }
                  }}
                  rows={2}
                  maxLength={500}
                  placeholder="e.g. change headline to 'Coverage made simple', make the tone more friendly, switch focus to Medicare…"
                  className="min-h-[64px] resize-none border-0 bg-transparent p-3 text-sm shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
                />
                <div className="flex items-center justify-between gap-2 border-t border-border/60 px-3 py-2">
                  <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                    <Zap className="h-3 w-3" />
                    {credits.credits} credits left
                  </span>
                  <Button
                    type="button"
                    size="sm"
                    onClick={send}
                    disabled={thinking || !input.trim() || credits.isEmpty}
                    className="rounded-full bg-[var(--surface-mocha)] text-[var(--surface-cream)] hover:bg-[var(--surface-espresso)] disabled:opacity-50"
                  >
                    <Send className="mr-1 h-3.5 w-3.5" />
                    Send
                  </Button>
                </div>
              </div>
              <div className="mt-2 flex items-center justify-between text-[11px] text-muted-foreground">
                <Link
                  to="/builder"
                  className="inline-flex items-center gap-1 hover:text-foreground"
                >
                  <ArrowLeft className="h-3 w-3" />
                  Back to setup
                </Link>
                {credits.isEmpty && (
                  <Link
                    to="/pricing"
                    className="font-semibold text-destructive hover:underline"
                  >
                    Out of credits — upgrade
                  </Link>
                )}
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}

function ChatBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === "user";
  return (
    <div
      className={`lp-chat-bubble flex ${isUser ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
          isUser
            ? "bg-[var(--surface-mocha)] text-[var(--surface-cream)]"
            : "border border-border bg-[var(--surface-sand)]/50 text-foreground/90"
        }`}
      >
        {message.text}
      </div>
    </div>
  );
}

/**
 * Scales the full desktop landing into a 390px-wide phone frame.
 * Measures the rendered height and compensates the wrapper so the
 * scaled content doesn't leave empty whitespace below.
 */
function ScaledMobilePreview({ data }: { data: BuilderData }) {
  const innerRef = useRef<HTMLDivElement>(null);
  const [innerH, setInnerH] = useState<number>(2200);
  const SOURCE_WIDTH = 1024;
  const TARGET_WIDTH = 390;
  const scale = TARGET_WIDTH / SOURCE_WIDTH;

  useEffect(() => {
    if (!innerRef.current) return;
    const ro = new ResizeObserver(() => {
      if (innerRef.current) setInnerH(innerRef.current.offsetHeight);
    });
    ro.observe(innerRef.current);
    return () => ro.disconnect();
  }, [data]);

  return (
    <div
      style={{
        width: TARGET_WIDTH,
        height: innerH * scale,
        overflow: "hidden",
        position: "relative",
      }}
    >
      <div
        ref={innerRef}
        style={{
          width: SOURCE_WIDTH,
          transform: `scale(${scale})`,
          transformOrigin: "top left",
        }}
      >
        <GeneratedLanding data={data} />
      </div>
    </div>
  );
}
