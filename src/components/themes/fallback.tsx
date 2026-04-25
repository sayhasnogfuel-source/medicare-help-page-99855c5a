import { GeneratedLanding } from "@/components/generated/generated-landing";
import type { ThemeProps } from "./shared";
import { getThemeById } from "@/lib/builder-storage";

/** Used for theme ids that have not been rebuilt yet. Renders the legacy
 *  generic landing so the workspace keeps working during the rollout. */
export function FallbackLanding({ data }: ThemeProps) {
  return <GeneratedLanding data={data} />;
}

/** A minimal placeholder thumbnail shown for themes not yet rebuilt. */
export function FallbackMini({ data }: ThemeProps) {
  const theme = getThemeById(data.themeId);
  return (
    <div
      className="flex h-full w-full flex-col gap-1 rounded-md p-2"
      style={{ background: theme.palette.surface, color: theme.palette.text }}
    >
      <div className="flex items-center gap-1">
        <span className="h-1.5 w-1.5 rounded-full" style={{ background: theme.palette.primary }} />
        <span className="block h-1 w-8 rounded-full bg-current opacity-40" />
      </div>
      <div className="mt-1 flex flex-1 gap-1.5">
        <div className="flex flex-1 flex-col justify-center gap-1">
          <span className="block h-1.5 w-[80%] rounded-full bg-current opacity-90" />
          <span className="block h-1 w-[60%] rounded-full bg-current opacity-40" />
          <span className="mt-1 block h-2 w-[40%] rounded" style={{ background: theme.palette.accent }} />
        </div>
        <div
          className="aspect-[3/4] w-[28%] rounded"
          style={{ background: theme.palette.accent2 || theme.palette.accent, opacity: 0.7 }}
        />
      </div>
    </div>
  );
}