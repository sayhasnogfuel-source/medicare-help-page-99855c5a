import { useLocation } from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

/**
 * Wraps a route's content and replays the `lp-page-enter` animation on every
 * route change by keying off the current pathname. Also scrolls the window to
 * the top so users land at the top of every new page (otherwise the next
 * route can appear identical when the previous page was scrolled down).
 */
export function PageTransition({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
  }, [pathname]);

  return (
    <div key={pathname} className="lp-page-enter">
      {children}
    </div>
  );
}