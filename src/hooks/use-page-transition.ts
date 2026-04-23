import { useCallback } from "react";
import { useNavigate } from "@tanstack/react-router";

type NavigateArg = Parameters<ReturnType<typeof useNavigate>>[0];

/**
 * Returns a `transitionTo` helper that navigates immediately. The destination
 * route plays its own enter animation via <PageTransition>, so we no longer
 * hold the current page in a leave state — that hold was perceived as the
 * tab "reloading" before switching.
 */
export function usePageTransition() {
  const navigate = useNavigate();

  const transitionTo = useCallback(
    (options: NavigateArg | string) => {
      if (typeof options === "string") {
        navigate({ to: options } as NavigateArg);
        return;
      }
      navigate(options);
    },
    [navigate]
  );

  return { transitionTo };
}