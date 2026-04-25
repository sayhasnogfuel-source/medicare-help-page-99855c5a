import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Sparkles } from "lucide-react";
import { useBuilderData } from "@/lib/builder-storage";
import { ThemeLanding } from "@/components/themes/registry";
import { AuthGuard } from "@/components/app/auth-guard";

export const Route = createFileRoute("/preview")({
  component: GuardedPreviewPage,
  head: () => ({
    meta: [
      { title: "Preview — Diploo" },
      { name: "description", content: "Fullscreen preview of your generated landing page." },
    ],
  }),
});

function GuardedPreviewPage() {
  return (
    <AuthGuard>
      <PreviewPage />
    </AuthGuard>
  );
}

function PreviewPage() {
  const data = useBuilderData();

  if (data === null) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-5">
        <div className="max-w-md rounded-3xl border border-border/60 bg-background p-10 text-center shadow-[var(--shadow-md)]">
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[var(--surface-sand)] text-[var(--surface-mocha)]">
            <Sparkles className="h-5 w-5" />
          </span>
          <h1 className="mt-5 text-2xl font-semibold tracking-tight text-foreground">
            Nothing to preview yet
          </h1>
          <p className="mt-2 text-muted-foreground">
            Set up your business details in the builder first.
          </p>
          <Button
            asChild
            className="mt-6 rounded-full bg-[var(--surface-mocha)] text-[var(--surface-cream)] hover:bg-[var(--surface-espresso)]"
          >
            <Link to="/builder">Open the builder</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-background">
      {/* Floating back-to-workspace pill, doesn't take layout space */}
      <div className="pointer-events-none fixed left-4 top-4 z-50">
        <Link
          to="/workspace"
          className="pointer-events-auto inline-flex items-center gap-1.5 rounded-full border border-border bg-background/95 px-3 py-1.5 text-xs font-medium text-foreground shadow-[var(--shadow-md)] backdrop-blur hover:bg-background"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to workspace
        </Link>
      </div>
      <ThemeLanding data={data} />
    </div>
  );
}