import type { ComponentType } from "react";
import type { BuilderData } from "@/lib/builder-storage";
import type { ThemeProps } from "./shared";

import { ModernLuxuryLanding, ModernLuxuryMini } from "./modern-luxury";
import { BoldMedicareLanding, BoldMedicareMini } from "./bold-medicare";
import { FriendlyLocalLanding, FriendlyLocalMini } from "./friendly-local";
import { TechStartupLanding, TechStartupMini } from "./tech-startup";

import { FallbackLanding, FallbackMini } from "./fallback";

export interface ThemeEntry {
  /** Theme id (matches InsuranceTheme.id). */
  id: string;
  /** Full landing component used in /workspace and /preview. */
  Landing: ComponentType<ThemeProps>;
  /** Compact mini-render used inside the theme picker thumbnail. */
  Mini: ComponentType<ThemeProps>;
}

/** Registry mapping each theme id to its real landing + mini components.
 *  Themes not yet rebuilt fall back to the generic FallbackLanding so the
 *  app keeps working while we ship batches. */
const REGISTRY: Record<string, ThemeEntry> = {
  // Batch 1
  "soft-luxury": { id: "soft-luxury", Landing: ModernLuxuryLanding, Mini: ModernLuxuryMini },
  "modern-medicare": { id: "modern-medicare", Landing: BoldMedicareLanding, Mini: BoldMedicareMini },
  "warm-local-advisor": { id: "warm-local-advisor", Landing: FriendlyLocalLanding, Mini: FriendlyLocalMini },
  "modern-saas": { id: "modern-saas", Landing: TechStartupLanding, Mini: TechStartupMini },
};

function entryFor(themeId: string): ThemeEntry {
  return (
    REGISTRY[themeId] ?? {
      id: themeId,
      Landing: FallbackLanding,
      Mini: FallbackMini,
    }
  );
}

export function ThemeLanding({ data }: { data: BuilderData }) {
  const { Landing } = entryFor(data.themeId);
  return <Landing data={data} />;
}

export function ThemeMini({ data }: { data: BuilderData }) {
  const { Mini } = entryFor(data.themeId);
  return <Mini data={data} />;
}