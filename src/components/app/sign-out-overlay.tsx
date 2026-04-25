import { useEffect, useState } from "react";
import diploofly from "@/assets/diploofly-logo.png";
import { subscribeSignOut } from "@/lib/account";

/**
 * Full-screen overlay shown while the user is being signed out and sent
 * back to the home screen. Mirrors the visual language of the route
 * loading overlay so the transition feels native.
 */
export function SignOutOverlay() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    return subscribeSignOut(setVisible);
  }, []);

  return (
    <div
      aria-hidden={!visible}
      role="status"
      className={`pointer-events-none fixed inset-0 z-[110] flex items-center justify-center bg-background transition-opacity duration-200 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="flex flex-col items-center gap-4">
        <img
          src={diploofly}
          alt=""
          className="h-16 w-16 animate-pulse object-contain"
        />
        <div className="flex flex-col items-center gap-1">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Signing you out…
          </span>
          <span className="text-[11px] text-muted-foreground/80">
            Taking you back to the home screen
          </span>
        </div>
      </div>
    </div>
  );
}