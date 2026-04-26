import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Layers,
  Plus,
  ArrowRight,
  Trash2,
  Sparkles,
  Globe,
  Loader2,
} from "lucide-react";
import { useAuth } from "@/lib/account";
import {
  useProjects,
  createProject,
  deleteProject,
  setCurrentProjectId,
  type ProjectRow,
} from "@/lib/projects";
import { DEFAULT_BUILDER } from "@/lib/builder-storage";
import { toast } from "sonner";

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const s = Math.floor(diff / 1000);
  if (s < 60) return "just now";
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 30) return `${d}d ago`;
  const mo = Math.floor(d / 30);
  return `${mo}mo ago`;
}

export function ProjectsPanel() {
  const { user } = useAuth();
  const { projects, loading, refresh, hydrated } = useProjects();
  const navigate = useNavigate();
  const [creating, setCreating] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<ProjectRow | null>(null);

  async function handleNewProject() {
    if (!user || creating) return;
    setCreating(true);
    try {
      const proj = await createProject(user.id, {
        name: "Untitled site",
        builder: { ...DEFAULT_BUILDER, freestyleInstructions: "" },
      });
      setCurrentProjectId(proj.id);
      toast.success("New project created");
      navigate({ to: "/builder" });
    } catch (err) {
      console.error(err);
      toast.error("Could not create project");
    } finally {
      setCreating(false);
    }
  }

  function handleOpen(p: ProjectRow) {
    setCurrentProjectId(p.id);
    navigate({ to: "/workspace" });
  }

  async function handleConfirmDelete() {
    if (!pendingDelete) return;
    const id = pendingDelete.id;
    setPendingDelete(null);
    try {
      await deleteProject(id);
      toast.success("Project deleted");
      void refresh();
    } catch {
      toast.error("Could not delete project");
    }
  }

  return (
    <Card className="mt-6 rounded-3xl border-border/60 bg-background p-6 shadow-[var(--shadow-sm)]">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--surface-sand)] text-[var(--surface-mocha)]">
            <Layers className="h-4 w-4" />
          </span>
          <div>
            <h2 className="text-base font-semibold text-foreground">
              Your projects
            </h2>
            <p className="text-xs text-muted-foreground">
              {hydrated
                ? projects.length === 0
                  ? "No saved projects yet."
                  : `${projects.length} saved site${projects.length === 1 ? "" : "s"}`
                : "Loading…"}
            </p>
          </div>
        </div>
        <Button
          size="sm"
          onClick={handleNewProject}
          disabled={creating}
          className="rounded-full bg-[var(--surface-mocha)] text-[var(--surface-cream)] hover:bg-[var(--surface-espresso)]"
        >
          {creating ? (
            <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
          ) : (
            <Plus className="mr-1.5 h-3.5 w-3.5" />
          )}
          New project
        </Button>
      </div>

      {!hydrated || loading ? (
        <div className="mt-6 flex items-center justify-center py-10 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" />
        </div>
      ) : projects.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-dashed border-border/70 bg-[var(--surface-cream)]/40 p-8 text-center">
          <Sparkles className="mx-auto h-6 w-6 text-[var(--surface-mocha)]" />
          <p className="mt-3 text-sm font-medium text-foreground">
            Start your first website
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Spin up a draft and the AI will design it for you.
          </p>
          <Button
            asChild
            size="sm"
            className="mt-4 rounded-full bg-[var(--surface-mocha)] text-[var(--surface-cream)] hover:bg-[var(--surface-espresso)]"
          >
            <Link to="/builder">
              Get started <ArrowRight className="ml-1 h-3.5 w-3.5" />
            </Link>
          </Button>
        </div>
      ) : (
        <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((p) => (
            <li
              key={p.id}
              className="group relative flex flex-col overflow-hidden rounded-2xl border border-border/60 bg-[var(--surface-cream)]/40 transition-shadow hover:shadow-[var(--shadow-sm)]"
            >
              <div
                className="flex h-24 items-center justify-center text-xs font-semibold uppercase tracking-wider text-white/85"
                style={{
                  background:
                    p.thumbnail_color ??
                    "linear-gradient(135deg, var(--surface-mocha), var(--surface-espresso))",
                }}
              >
                <Globe className="mr-1.5 h-3.5 w-3.5" />
                {p.slug}.diploo.app
              </div>
              <div className="flex flex-1 flex-col gap-2 p-4">
                <p className="truncate text-sm font-semibold text-foreground">
                  {p.name || "Untitled site"}
                </p>
                <p className="text-[11px] text-muted-foreground">
                  Edited {timeAgo(p.updated_at)}
                </p>
                <div className="mt-auto flex items-center gap-2 pt-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-7 flex-1 rounded-full text-xs"
                    onClick={() => handleOpen(p)}
                  >
                    Open
                    <ArrowRight className="ml-1 h-3 w-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-7 w-7 rounded-full p-0 text-muted-foreground hover:text-destructive"
                    onClick={() => setPendingDelete(p)}
                    aria-label="Delete project"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      <AlertDialog
        open={!!pendingDelete}
        onOpenChange={(open) => !open && setPendingDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this project?</AlertDialogTitle>
            <AlertDialogDescription>
              <strong>{pendingDelete?.name || "This project"}</strong> will be
              permanently removed. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}
