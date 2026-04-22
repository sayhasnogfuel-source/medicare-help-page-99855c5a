import { useLocation } from "@tanstack/react-router";
import type { ReactNode } from "react";

/**
 * Wraps a route's content and replays the `lp-page-enter` animation on every
 * route change by keying off the current pathname.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  return (
    <div key={pathname} className="lp-page-enter">
      {children}
    </div>
  );
}