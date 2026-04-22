import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AppHeader } from "@/components/app/app-header";
import { AppFooter } from "@/components/app/app-footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Edit3, Smartphone, Monitor, Sparkles } from "lucide-react";
import { useState } from "react";
import { useBuilderData } from "@/lib/builder-storage";
import { GeneratedLanding } from "@/components/generated/generated-landing";

export const Route = createFileRoute("/preview")({
  component: PreviewPage,
  head: () => ({
    meta: [
      { title: "Preview your landing page — Lumen.pages" },
      { name: "description", content: "Preview the landing page generated from your business details." },
    ],
  }),
});

function PreviewPage() {
  const data = useBuilderData();
  const navigate = useNavigate();
  const [device, setDevice] = useState<"desktop" | "mobile">("desktop");

  if (data === null) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <AppHeader />
        <main className="flex-1">
          <div className="mx-auto max-w-2xl px-5 py-20 text-center">
            <Card className="rounded-3xl border-border/60 bg-background p-10 shadow-[var(--shadow-md)]">
              <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[var(--surface-sand)] text-[var(--surface-mocha)]">
                <Sparkles className="h-5 w-5" />
              </span>
              <h1 className="mt-5 text-2xl font-semibold tracking-tight text-foreground">
                No page yet
              </h1>
              <p className="mt-2 text-muted-foreground">
                Fill in your details in the builder to generate your first landing page.
              </p>
              <Button
                className="mt-6 rounded-full bg-[var(--surface-mocha)] text-[var(--surface-cream)] hover:bg-[var(--surface-espresso)]"
                onClick={() => navigate({ to: "/builder" })}
              >
                Open the builder
              </Button>
            </Card>
          </div>
        </main>
        <AppFooter />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-[var(--surface-sand)]/40">
      <AppHeader />
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-5 py-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Preview
              </p>
              <h1 className="mt-1.5 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                {data.businessName}
              </h1>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center rounded-full border border-border bg-background p-1 shadow-[var(--shadow-xs)]">
                <button
                  type="button"
                  onClick={() => setDevice("desktop")}
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                    device === "desktop" ? "bg-[var(--surface-mocha)] text-[var(--surface-cream)]" : "text-foreground/70 hover:text-foreground"
                  }`}
                >
                  <Monitor className="h-3.5 w-3.5" />
                  Desktop
                </button>
                <button
                  type="button"
                  onClick={() => setDevice("mobile")}
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                    device === "mobile" ? "bg-[var(--surface-mocha)] text-[var(--surface-cream)]" : "text-foreground/70 hover:text-foreground"
                  }`}
                >
                  <Smartphone className="h-3.5 w-3.5" />
                  Mobile
                </button>
              </div>
              <Button asChild variant="outline" className="rounded-full">
                <Link to="/builder">
                  <Edit3 className="mr-1 h-4 w-4" />
                  Edit details
                </Link>
              </Button>
              <Button asChild className="rounded-full bg-[var(--surface-mocha)] text-[var(--surface-cream)] hover:bg-[var(--surface-espresso)]">
                <Link to="/">
                  <ArrowLeft className="mr-1 h-4 w-4" />
                  Back home
                </Link>
              </Button>
            </div>
          </div>

          <div className="mt-7 overflow-hidden rounded-3xl border border-border/60 bg-background shadow-[var(--shadow-lg)]">
            <div className="flex items-center gap-2 border-b border-border/60 bg-[var(--surface-sand)]/60 px-4 py-2.5">
              <span className="h-2.5 w-2.5 rounded-full bg-[oklch(0.78_0.13_25)]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[oklch(0.85_0.13_85)]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[oklch(0.78_0.13_145)]" />
              <span className="ml-3 truncate rounded-md bg-background px-3 py-1 text-xs text-muted-foreground">
                {data.businessName.toLowerCase().replace(/\s+/g, "")}.lumen.pages
              </span>
            </div>
            <div className={device === "mobile" ? "flex justify-center bg-[var(--surface-sand)]/30 py-8" : ""}>
              <div className={device === "mobile" ? "w-[390px] overflow-hidden rounded-[2rem] border border-border bg-background shadow-[var(--shadow-md)]" : ""}>
                <GeneratedLanding data={data} />
              </div>
            </div>
          </div>
        </div>
      </main>
      <AppFooter />
    </div>
  );
}