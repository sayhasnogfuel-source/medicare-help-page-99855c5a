import { useCallback } from "react";
import { useNavigate, type NavigateOptions } from "@tanstack/react-router";

/**
 * Returns a `transitionTo` helper that navigates immediately. The destination
 * route plays its own enter animation via <PageTransition>, so we no longer
 * hold the current page in a leave state — that hold was perceived as the
 * tab "reloading" before switching.
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
      navigate(opts);
    },
    [navigate]
  );

  return { transitionTo };
}