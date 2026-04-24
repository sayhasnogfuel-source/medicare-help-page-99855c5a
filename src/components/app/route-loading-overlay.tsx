import { useEffect, useState } from "react";
import { useRouterState } from "@tanstack/react-router";
import diploofly from "@/assets/diploofly-logo.png";

/**
 * Full-screen loading overlay with the Diploofly logo, shown while the
 * router is transitioning between routes. We delay the show by a small
 * amount so instant navigations don't flicker the overlay, and keep it
 * mounted briefly so the new page has time to paint before we hide it.
 */
export function RouteLoadingOverlay() {
  const status = useRouterState({ select: (s) => s.status });
  const isPending = status === "pending";
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let showTimer: ReturnType<typeof setTimeout> | undefined;
    let hideTimer: ReturnType<typeof setTimeout> | undefined;

    if (isPending) {
      // Only show the overlay if navigation takes longer than a frame —
      // avoids a flash on instant transitions.
      showTimer = setTimeout(() => setVisible(true), 80);
    } else {
      // Keep the overlay around for a moment so the new route has time
      // to render before we fade it out (prevents the "old page flashes
      // first" perception the user described).
      hideTimer = setTimeout(() => setVisible(false), 120);
    }

    return () => {
      if (showTimer) clearTimeout(showTimer);
      if (hideTimer) clearTimeout(hideTimer);
    };
  }, [isPending]);

  return (
    <div
      aria-hidden={!visible}
      className={`pointer-events-none fixed inset-0 z-[100] flex items-center justify-center bg-background transition-opacity duration-200 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="flex flex-col items-center gap-4">
        <img
          src={diploofly}
          alt=""
          className="h-14 w-14 animate-pulse object-contain"
        />
        <span className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
          Loading…
        </span>
      </div>
    </div>
  );
}