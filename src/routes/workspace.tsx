import { useEffect, useMemo, useRef, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import ReactMarkdown from "react-markdown";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowUp,
  ChevronLeft,
  ChevronRight,
  RotateCw,
  Edit3,
  ExternalLink,
  Lock,
  Sparkles,
  Smartphone,
  Monitor,
  Tablet,
  Loader2,
  CheckCircle2,
  Share2,
  ChevronDown,
  CreditCard,
} from "lucide-react";
import { ThemeLanding } from "@/components/themes/registry";
import {
  loadBuilder,
  saveBuilder,
  type BuilderData,
  DEFAULT_BUILDER,
} from "@/lib/builder-storage";
import { useUserCredits, ACTION_COSTS } from "@/lib/user-credits";
import { toast } from "sonner";
import { useServerFn } from "@tanstack/react-start";
import { editWebsite } from "@/lib/ai-editor.functions";
import type { ChatTurn } from "@/lib/ai-editor.types";
import { AuthGuard } from "@/components/app/auth-guard";
import diploofly from "@/assets/diploofly-logo.png";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useNavigate } from "@tanstack/react-router";

export const Route = createFileRoute("/workspace")({
  component: GuardedWorkspace,
  head: () => ({
    meta: [
      { title: "Builder workspace — Diploo" },
      {
        name: "description",
        content:
          "Live AI website builder for insurance agents. Chat on the left, live preview on the right.",
      },
    ],
  }),
});

function GuardedWorkspace() {
  return (
    <AuthGuard>
      <WorkspacePage />
    </AuthGuard>
  );
}

interface ChatMessage {
  id: string;
  role: "assistant" | "user";
  text: string;
}

const STARTER_MESSAGE: ChatMessage = {
  id: "starter",
  role: "assistant",
  text: "Hi — I'm your AI designer. Tell me what to change and I'll edit the site live on the right.",
};

const SUGGESTIONS = [
  "Make the tone warmer and more local",
  "Add a testimonials section",
  "Switch to a coastal theme",
  "Stronger call-to-action",
];

function selfCheck(data: BuilderData): {
  patch: Partial<BuilderData> | null;
  fixes: string[];
} {
  const fixes: string[] = [];
  const patch: Partial<BuilderData> = {};
  if (!data.ctaText.trim()) {
    patch.ctaText = "Get My Free Quote";
    fixes.push("Added a primary call-to-action");
  }
  if (!data.headline.trim()) {
    patch.headline = "Coverage made simple, made for you";
    fixes.push("Restored a clear headline");
  }
  if (!data.subheadline.trim()) {
    patch.subheadline =
      "Friendly, transparent guidance to help you choose the right coverage with confidence.";
    fixes.push("Added a supporting subheadline");
  }
  return { patch: Object.keys(patch).length ? patch : null, fixes };
}

function slugFor(name: string): string {
  const slug = name.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  return slug || "untitled";
}

function WorkspacePage() {
  const [data, setData] = useState<BuilderData | null>(null);
  const [device, setDevice] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [messages, setMessages] = useState<ChatMessage[]>([STARTER_MESSAGE]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const [version, setVersion] = useState(1);
  const [refreshKey, setRefreshKey] = useState(0);
  const credits = useUserCredits();
  const scrollRef = useRef<HTMLDivElement>(null);
  const composerRef = useRef<HTMLTextAreaElement>(null);
  const editFn = useServerFn(editWebsite);
  const autoRanRef = useRef(false);
  // While the very first AI build is running, hide the (generic) cached
  // preview so the user never sees a placeholder template.
  const [firstBuildPending, setFirstBuildPending] = useState(true);

  useEffect(() => {
    setData(loadBuilder() ?? DEFAULT_BUILDER);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, thinking]);

  // Cmd/Ctrl-K focuses composer
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        composerRef.current?.focus();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // First-run AI generation
  useEffect(() => {
    if (autoRanRef.current || !data || thinking) return;
    if (!credits.hydrated) return;
    // If the AI has already produced a custom version (we mark this via
    // freestyleInstructions on first build), skip — the preview is real.
    if (data.freestyleInstructions && data.freestyleInstructions.trim().length > 0) {
      autoRanRef.current = true;
      setFirstBuildPending(false);
      return;
    }
    if (!credits.canAfford("regenerate_section")) {
      autoRanRef.current = true;
      setFirstBuildPending(false);
      return;
    }
    autoRanRef.current = true;
    void runFirstGeneration(data);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, credits.hydrated]);

  async function runFirstGeneration(current: BuilderData) {
    setThinking(true);
    const seed: ChatTurn = {
      role: "user",
      text:
        "FRESH BUILD. Generate the complete first version of my landing page right now from the data I gave you. Treat the themeId I already selected as the design brief — match its mood, palette and density. Write a custom headline that names my insurance niche AND my city. Write a concrete, specific subheadline (not generic). Pick a punchy ctaText that fits my contact method. Set ALL FIVE section toggles (showServices, showTestimonials, showFaq, showBookingCta, showAboutAgent) opinionatedly for my niche and audience. Save your one-line design rationale in freestyleInstructions so future edits stay consistent. If phone/email/city/state/insuranceType are blank, also ask me for the missing ones at the end of your reply in one short sentence.",
    };
    try {
      const result = await editFn({ data: { messages: [seed], builderData: current } });
      let next = current;
      if (result.patch) {
        next = { ...current, ...result.patch };
        // Force-mark this build as "generated" so we never re-run it
        // unnecessarily, even if the model forgot to set freestyleInstructions.
        if (!next.freestyleInstructions || !next.freestyleInstructions.trim()) {
          next = { ...next, freestyleInstructions: "ai-first-build" };
        }
        setData(next);
        saveBuilder(next);
        setSavedAt(Date.now());
        setVersion((v) => v + 1);
        if (!result.error) void credits.charge("regenerate_section");
      }
      setMessages((m) => [
        ...m,
        { id: `a-init-${Date.now()}`, role: "assistant", text: result.reply },
      ]);
    } catch (err) {
      console.error("First-run AI generation failed", err);
    } finally {
      setThinking(false);
      setFirstBuildPending(false);
    }
  }

  const statusPill = useMemo(() => {
    if (thinking) {
      return { icon: Loader2, label: "Generating…", spin: true };
    }
    if (savedAt && Date.now() - savedAt < 2500) {
      return { icon: CheckCircle2, label: "Updated", spin: false };
    }
    return { icon: CheckCircle2, label: "Saved", spin: false };
  }, [thinking, savedAt]);

  async function send(textOverride?: string) {
    const text = (textOverride ?? input).trim();
    if (!text || thinking || !data) return;

    if (credits.isEmpty) {
      toast.error("You're out of credits", {
        description: "Upgrade to keep tweaking your site with AI.",
      });
      return;
    }
    if (!credits.canAfford("regenerate_section")) {
      toast.error(`Tweaks cost ${ACTION_COSTS.regenerate_section} credit each`, {
        description: `You have ${credits.credits} left. Upgrade to continue.`,
      });
      return;
    }

    const userMsg: ChatMessage = { id: `u-${Date.now()}`, role: "user", text };
    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    setInput("");
    setThinking(true);

    const history: ChatTurn[] = nextMessages
      .filter((m) => m.id !== "starter")
      .slice(-20)
      .map((m) => ({ role: m.role, text: m.text }));

    try {
      const result = await editFn({ data: { messages: history, builderData: data } });
      if (result.error) toast.error(result.reply);

      let next: BuilderData = data;
      if (result.patch) {
        next = { ...data, ...result.patch };
        setData(next);
        saveBuilder(next);
        setSavedAt(Date.now());
        setVersion((v) => v + 1);
        if (!result.error) void credits.charge("regenerate_section");
      }

      const qc = selfCheck(next);
      let qcReply = "";
      if (qc.patch) {
        next = { ...next, ...qc.patch };
        setData(next);
        saveBuilder(next);
        setSavedAt(Date.now());
        qcReply = "\n\n_Quality check: " + qc.fixes.map((f) => `✓ ${f}`).join(" · ") + "_";
      }

      setMessages((m) => [
        ...m,
        { id: `a-${Date.now()}`, role: "assistant", text: result.reply + qcReply },
      ]);
    } catch (err) {
      console.error("AI edit failed", err);
      toast.error("AI request failed", { description: "Check your connection and try again." });
      setMessages((m) => [
        ...m,
        {
          id: `a-${Date.now()}`,
          role: "assistant",
          text: "Something went wrong reaching the AI. Try again in a moment.",
        },
      ]);
    } finally {
      setThinking(false);
    }
  }

  function tryPublish() {
    toast.error("Add a payment method to publish", {
      description:
        "Your site is ready, but publishing requires a valid card on file and an active subscription.",
    });
  }

  if (!data) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const slug = slugFor(data.businessName);
  const isStarterOnly = messages.length <= 1;

  return (
    <div className="flex min-h-screen flex-col bg-[var(--surface-espresso)]">
      {/* Top bar (Lovable-style) */}
      <header className="flex h-12 items-center justify-between gap-3 border-b border-white/10 bg-[var(--surface-espresso)] px-3 text-[var(--surface-cream)] sm:px-4">
        <div className="flex min-w-0 items-center gap-2.5">
          <Link to="/" className="flex items-center gap-2">
            <img src={diploofly} alt="Diploo" className="h-6 w-6 rounded-md" />
          </Link>
          <span className="text-white/30">/</span>
          <span className="truncate text-sm font-medium text-white/90">
            {data.businessName?.trim() || "Untitled site"}
          </span>
          <span className="ml-1 hidden rounded-md border border-white/15 bg-white/5 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-white/60 sm:inline">
            Draft
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="h-8 gap-1 px-2.5 text-white/80 hover:bg-white/10 hover:text-white"
          >
            <a
              href="/preview"
              target="_blank"
              rel="noreferrer"
              onClick={() => {
                if (data) saveBuilder(data);
              }}
            >
              <ExternalLink className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Preview</span>
              <ChevronDown className="h-3 w-3 opacity-60" />
            </a>
          </Button>
          <BackToBuilderDialog />
          <Button
            variant="ghost"
            size="sm"
            disabled
            title="Publish first to share"
            className="hidden h-8 gap-1 px-2.5 text-white/50 sm:inline-flex"
          >
            <Share2 className="h-3.5 w-3.5" />
            Share
          </Button>
          <Button
            onClick={tryPublish}
            size="sm"
            className="h-8 gap-1 rounded-md bg-[var(--surface-cream)] px-3 text-[var(--surface-espresso)] hover:bg-white"
          >
            <Lock className="h-3.5 w-3.5" />
            Publish
          </Button>
        </div>
      </header>

      {/* Sub-bar: status + credits + add card */}
      <div className="flex h-8 items-center justify-between gap-3 border-b border-white/10 bg-[var(--surface-espresso)]/95 px-3 text-[11px] text-white/60 sm:px-4">
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5">
            <statusPill.icon
              className={`h-3 w-3 ${statusPill.spin ? "animate-spin" : ""}`}
            />
            {statusPill.label}
          </span>
          <span className="text-white/20">·</span>
          <span>v{version}</span>
          <span className="text-white/20">·</span>
          <span>{credits.credits} credits</span>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/pricing"
            className="inline-flex items-center gap-1 text-amber-200/80 hover:text-amber-100"
          >
            <CreditCard className="h-3 w-3" />
            Add a card to publish
          </Link>
        </div>
      </div>

      {/* Body — chat left, preview right */}
      <main className="grid flex-1 grid-cols-1 gap-0 lg:grid-cols-[360px_1fr]">
        {/* Chat */}
        <aside className="flex min-h-0 flex-col border-r border-white/10 bg-[var(--surface-espresso)] text-[var(--surface-cream)] lg:max-h-[calc(100vh-5rem)]">
          <div className="flex items-center gap-2 border-b border-white/10 px-3 py-2.5">
            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-white/10">
              <Sparkles className="h-3.5 w-3.5" />
            </span>
            <p className="text-sm font-semibold">Diploo AI</p>
            <span className="rounded-md border border-white/10 bg-white/5 px-1.5 py-0.5 text-[10px] font-medium text-white/60">
              Gemini 3 Flash
            </span>
          </div>

          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-3 py-3">
            {messages.map((m) => (
              <ChatBubble key={m.id} message={m} />
            ))}
            {thinking && (
              <div className="lp-chat-bubble flex items-center gap-2 text-xs text-white/55">
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                Updating your site…
              </div>
            )}
          </div>

          {/* Suggestion chips when chat is empty */}
          {isStarterOnly && !thinking && (
            <div className="border-t border-white/10 px-3 py-2">
              <div className="flex flex-wrap gap-1.5">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => void send(s)}
                    className="rounded-full border border-white/15 bg-white/5 px-2.5 py-1 text-[11px] text-white/75 transition-colors hover:border-white/30 hover:bg-white/10 hover:text-white"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="border-t border-white/10 p-2.5">
            <div className="relative rounded-lg border border-white/15 bg-white/[0.04] focus-within:border-white/35 focus-within:bg-white/[0.06]">
              <Textarea
                ref={composerRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey && !e.metaKey && !e.ctrlKey) {
                    e.preventDefault();
                    void send();
                  }
                  if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
                    e.preventDefault();
                    void send();
                  }
                }}
                rows={2}
                maxLength={500}
                autoFocus
                placeholder="Ask Diploo to edit your site…"
                className="min-h-[60px] resize-none border-0 bg-transparent px-3 py-2.5 pr-11 text-sm text-white placeholder:text-white/35 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
              />
              <button
                type="button"
                onClick={() => void send()}
                disabled={thinking || !input.trim() || credits.isEmpty}
                aria-label="Send"
                className="absolute bottom-2 right-2 flex h-7 w-7 items-center justify-center rounded-md bg-[var(--surface-cream)] text-[var(--surface-espresso)] transition-opacity hover:bg-white disabled:cursor-not-allowed disabled:opacity-30"
              >
                <ArrowUp className="h-3.5 w-3.5" />
              </button>
            </div>
            <div className="mt-1.5 flex items-center justify-between text-[10px] text-white/40">
              <span>⌘↵ to send · Shift+↵ for newline</span>
              <span>{ACTION_COSTS.regenerate_section} credit / edit</span>
            </div>
          </div>
        </aside>

        {/* Preview */}
        <section className="flex min-h-0 flex-col bg-[var(--surface-sand)]/30 p-3 sm:p-4 lg:max-h-[calc(100vh-5rem)]">
          <div className="flex h-full flex-col overflow-hidden rounded-xl border border-border bg-background shadow-[var(--shadow-md)] ring-1 ring-border/40">
            {/* Browser-chrome */}
            <div className="flex items-center gap-2 border-b border-border/60 bg-[var(--surface-sand)]/50 px-3 py-2">
              <div className="flex items-center gap-0.5 text-foreground/40">
                <button
                  type="button"
                  className="flex h-6 w-6 items-center justify-center rounded hover:bg-foreground/5"
                  aria-label="Back"
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  className="flex h-6 w-6 items-center justify-center rounded hover:bg-foreground/5"
                  aria-label="Forward"
                >
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setRefreshKey((k) => k + 1)}
                  className="flex h-6 w-6 items-center justify-center rounded hover:bg-foreground/5"
                  aria-label="Refresh"
                >
                  <RotateCw className="h-3 w-3" />
                </button>
              </div>
              <div className="flex flex-1 items-center justify-center">
                <div className="flex max-w-[420px] items-center gap-1.5 rounded-md border border-border/70 bg-background px-2.5 py-1 font-mono text-[11px] text-muted-foreground">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500/70" />
                  <span className="truncate">{slug}.diploo.app</span>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <div className="inline-flex items-center rounded-md border border-border bg-background p-0.5">
                  {[
                    { id: "desktop", icon: Monitor, label: "Desktop" },
                    { id: "tablet", icon: Tablet, label: "Tablet" },
                    { id: "mobile", icon: Smartphone, label: "Mobile" },
                  ].map((d) => (
                    <button
                      key={d.id}
                      type="button"
                      onClick={() => setDevice(d.id as typeof device)}
                      aria-label={d.label}
                      title={d.label}
                      className={`flex h-6 w-6 items-center justify-center rounded transition-colors ${
                        device === d.id
                          ? "bg-[var(--surface-mocha)] text-[var(--surface-cream)]"
                          : "text-foreground/55 hover:text-foreground"
                      }`}
                    >
                      <d.icon className="h-3 w-3" />
                    </button>
                  ))}
                </div>
                <a
                  href="/preview"
                  target="_blank"
                  rel="noreferrer"
                  className="ml-1 flex h-6 w-6 items-center justify-center rounded text-foreground/55 hover:text-foreground"
                  aria-label="Open preview in new tab"
                  title="Open in new tab"
                  onClick={() => {
                    if (data) saveBuilder(data);
                  }}
                >
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>

            {/* Preview body */}
            <div key={refreshKey} className="flex-1 overflow-auto bg-[var(--surface-sand)]/20">
              {firstBuildPending ? (
                <div className="flex h-full min-h-[400px] flex-col items-center justify-center gap-3 px-6 text-center">
                  <Loader2 className="h-6 w-6 animate-spin text-[var(--surface-mocha)]" />
                  <p className="text-sm font-semibold text-foreground">
                    Generating your custom site…
                  </p>
                  <p className="max-w-sm text-xs text-muted-foreground">
                    Building from your business details and the theme you picked. This takes a few seconds.
                  </p>
                </div>
              ) : (
                <>
              {device === "desktop" && <ThemeLanding data={data} />}
              {device === "tablet" && (
                <div className="flex min-h-full justify-center px-4 py-6">
                  <div className="overflow-hidden rounded-2xl border border-border bg-background shadow-[var(--shadow-md)]">
                    <ScaledFramePreview data={data} targetWidth={768} />
                  </div>
                </div>
              )}
              {device === "mobile" && (
                <div className="flex min-h-full justify-center px-4 py-6">
                  <div className="w-[390px] overflow-hidden rounded-[2rem] border border-border bg-background shadow-[var(--shadow-md)]">
                    <ScaledFramePreview data={data} targetWidth={390} />
                  </div>
                </div>
              )}
                </>
              )}
            </div>

            {/* Footer strip */}
            <div className="flex items-center justify-between border-t border-border/60 bg-[var(--surface-sand)]/40 px-3 py-1.5 text-[10px] text-muted-foreground">
              <span>
                Version {version} · {statusPill.label}
              </span>
              <span>{credits.credits} credits left</span>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

function ChatBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === "user";
  return (
    <div className={`lp-chat-bubble flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[88%] rounded-xl px-3 py-2 text-[13px] leading-relaxed ${
          isUser
            ? "bg-[var(--surface-cream)] text-[var(--surface-espresso)]"
            : "border border-white/10 bg-white/[0.03] text-white/85"
        }`}
      >
        {isUser ? (
          message.text
        ) : (
          <div className="prose prose-sm prose-invert max-w-none [&_p]:my-1 [&_ul]:my-1 [&_li]:my-0">
            <ReactMarkdown>{message.text}</ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Renders the desktop landing into a fixed-width frame and downscales it
 * with CSS transform. Compensates parent height so there's no empty space.
 */
function ScaledFramePreview({
  data,
  targetWidth,
}: {
  data: BuilderData;
  targetWidth: number;
}) {
  const innerRef = useRef<HTMLDivElement>(null);
  const [innerH, setInnerH] = useState<number>(2200);
  const SOURCE_WIDTH = 1024;
  const scale = targetWidth / SOURCE_WIDTH;

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
        width: targetWidth,
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
        <ThemeLanding data={data} />
      </div>
    </div>
  );
}

function BackToBuilderDialog() {
  const navigate = useNavigate();
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 gap-1 px-2.5 text-white/80 hover:bg-white/10 hover:text-white"
        >
          <Edit3 className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Edit details</span>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Go back to edit business details?</AlertDialogTitle>
          <AlertDialogDescription>
            Returning to the details form and re-generating will use{" "}
            <strong>{ACTION_COSTS.generate} credits</strong>. Your current
            site is saved — you can come back to the workspace anytime without
            losing it.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Stay here</AlertDialogCancel>
          <AlertDialogAction onClick={() => navigate({ to: "/builder" })}>
            Go to builder
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
