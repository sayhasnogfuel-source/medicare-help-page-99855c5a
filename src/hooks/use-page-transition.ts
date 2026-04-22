import { useCallback } from "react";
import { useNavigate, type NavigateOptions } from "@tanstack/react-router";

const LEAVE_CLASS = "lp-page-leave";
const LEAVE_DURATION_MS = 280;

/**
 * Returns a `transitionTo` helper that adds a float-away animation on the
 * current page before navigating to the next route. Falls back to a plain
 * navigation when reduced motion is requested or when called on the server.
 */
export function usePageTransition() {
  const navigate = useNavigate();

  const transitionTo = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (options: NavigateOptions | string) => {
      const opts: NavigateOptions =
        typeof options === "string"
          ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
            ({ to: options } as any)
          : options;

      if (typeof window === "undefined") {
        navigate(opts);
        return;
      }

      const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
      if (reduce) {
        navigate(opts);
        return;
      }

      document.body.classList.add(LEAVE_CLASS);
      window.setTimeout(() => {
        document.body.classList.remove(LEAVE_CLASS);
        navigate(opts);
      }, LEAVE_DURATION_MS);
    },
    [navigate]
  );

  return { transitionTo };
}