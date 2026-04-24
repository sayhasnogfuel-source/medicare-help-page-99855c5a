import { useEffect, useState } from "react";
import diploo from "@/assets/diploofly-logo.png";

/**
 * Arcads-style intro splash. Shows a centered logo + wordmark on a dark
 * surface, fades the brand in, holds, then fades the whole overlay out
 * to reveal the page underneath. Plays once per browser session.
 */
const SESSION_KEY = "diploo_intro_played_v1";

export function IntroSplash() {
  const [stage, setStage] = useState<"hidden" | "in" | "out" | "done">("hidden");

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.sessionStorage.getItem(SESSION_KEY)) {
      setStage("done");
      return;
    }
    setStage("in");
    const t1 = window.setTimeout(() => setStage("out"), 1600);
    const t2 = window.setTimeout(() => {
      window.sessionStorage.setItem(SESSION_KEY, "1");
      setStage("done");
    }, 2400);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, []);

  if (stage === "done") return null;

  return (
    <div
      aria-hidden
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-[var(--surface-espresso)] transition-opacity duration-700 ease-out ${
        stage === "out" ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
    >
      <div
        className={`flex flex-col items-center gap-5 transition-all duration-[900ms] ease-out ${
          stage === "in" ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
        }`}
      >
        <img
          src={diploo}
          alt=""
          className="h-20 w-20 object-contain drop-shadow-[0_4px_30px_rgba(255,255,255,0.15)]"
        />
        <div className="flex flex-col items-center gap-1.5">
          <span className="text-3xl font-semibold tracking-tight text-[var(--surface-cream)] sm:text-4xl">
            Diploo
          </span>
          <span className="text-[10px] font-semibold uppercase tracking-[0.32em] text-[var(--surface-cream)]/45">
            Websites for insurance agents
          </span>
        </div>
      </div>
    </div>
  );
}