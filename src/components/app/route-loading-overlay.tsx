import { useEffect, useRef, useState } from "react";
import { useRouterState } from "@tanstack/react-router";
import diploofly from "@/assets/diploofly-logo.png";

/**
 * Full-screen loading overlay with the Diploofly logo. Shown immediately
 * when the router begins a transition and removed as soon as the new
 * route is committed — no artificial delays so navigation feels snappy.
 *
 * We do enforce a tiny minimum visible time (80ms) ONLY once the overlay
 * has actually appeared, so it doesn't flash off mid-fade.
 */
export function RouteLoadingOverlay() {
  const status = useRouterState({ select: (s) => s.status });
  const isPending = status === "pending";
  const [visible, setVisible] = useState(false);
  const shownAtRef = useRef<number | null>(null);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (isPending) {
      if (hideTimerRef.current) {
        clearTimeout(hideTimerRef.current);
        hideTimerRef.current = null;
      }
      if (!visible) {
        shownAtRef.current = Date.now();
        setVisible(true);
      }
      return;
    }

    // Pending finished — hide immediately, but enforce a tiny min display
    // so the overlay doesn't strobe on extremely fast transitions.
    const shownFor = shownAtRef.current ? Date.now() - shownAtRef.current : 0;
    const remaining = Math.max(0, 80 - shownFor);
    hideTimerRef.current = setTimeout(() => {
      setVisible(false);
      shownAtRef.current = null;
    }, remaining);

    return () => {
      if (hideTimerRef.current) {
        clearTimeout(hideTimerRef.current);
        hideTimerRef.current = null;
      }
    };
  }, [isPending, visible]);

  return (
    <div
      aria-hidden={!visible}
      className={`pointer-events-none fixed inset-0 z-[100] flex items-center justify-center bg-background transition-opacity duration-100 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="flex flex-col items-center gap-4">
        <img
          src={diploofly}
          alt=""
          className="h-16 w-16 animate-pulse object-contain"
        />
        <span className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
          Loading…
        </span>
      </div>
    </div>
  );
}