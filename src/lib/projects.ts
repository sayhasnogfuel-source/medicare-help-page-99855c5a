import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/account";
import { DEFAULT_BUILDER, type BuilderData } from "@/lib/builder-storage";

/**
 * Cloud-backed projects: each signed-in user can save many website drafts.
 * The full BuilderData snapshot is stored in `builder_data` (jsonb) on the
 * `projects` table. We also keep a tiny "current project id" pointer in
 * localStorage so the workspace knows which project to open by default.
 */

export interface ProjectRow {
  id: string;
  name: string;
  slug: string;
  builder_data: BuilderData;
  thumbnail_color: string | null;
  last_opened_at: string;
  created_at: string;
  updated_at: string;
}

const CURRENT_KEY = "lp_current_project_id_v1";

export function getCurrentProjectId(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(CURRENT_KEY);
  } catch {
    return null;
  }
}

export function setCurrentProjectId(id: string | null) {
  if (typeof window === "undefined") return;
  try {
    if (id) window.localStorage.setItem(CURRENT_KEY, id);
    else window.localStorage.removeItem(CURRENT_KEY);
  } catch {
    // ignore
  }
}

export function slugFor(name: string): string {
  const slug = name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  return slug || "untitled";
}

function pickThumbColor(name: string): string {
  const palette = [
    "#9A6B3F",
    "#1E3A8A",
    "#0E7490",
    "#7C3AED",
    "#15803D",
    "#DC2626",
    "#0F172A",
    "#B45309",
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = (hash * 31 + name.charCodeAt(i)) | 0;
  return palette[Math.abs(hash) % palette.length];
}

/* ------------------------------------------------------------------ */
/* CRUD                                                               */
/* ------------------------------------------------------------------ */

export async function listProjects(userId: string): Promise<ProjectRow[]> {
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("user_id", userId)
    .order("last_opened_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as unknown as ProjectRow[];
}

export async function getProject(id: string): Promise<ProjectRow | null> {
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return (data as unknown as ProjectRow | null) ?? null;
}

export async function createProject(
  userId: string,
  init?: { name?: string; builder?: BuilderData }
): Promise<ProjectRow> {
  const builder = init?.builder ?? DEFAULT_BUILDER;
  const name = init?.name?.trim() || builder.businessName?.trim() || "Untitled site";
  const insertRow = {
    user_id: userId,
    name,
    slug: slugFor(name),
    builder_data: builder as unknown as never,
    thumbnail_color: pickThumbColor(name),
    last_opened_at: new Date().toISOString(),
  };
  const { data, error } = await supabase
    .from("projects")
    .insert(insertRow)
    .select("*")
    .single();
  if (error) throw error;
  return data as unknown as ProjectRow;
}

export async function updateProjectBuilder(
  id: string,
  builder: BuilderData
): Promise<void> {
  const name = builder.businessName?.trim() || "Untitled site";
  const { error } = await supabase
    .from("projects")
    .update({
      name,
      slug: slugFor(name),
      builder_data: builder as unknown as never,
    })
    .eq("id", id);
  if (error) throw error;
}

export async function touchProjectOpened(id: string): Promise<void> {
  const { error } = await supabase
    .from("projects")
    .update({ last_opened_at: new Date().toISOString() })
    .eq("id", id);
  if (error) throw error;
}

export async function renameProject(id: string, name: string): Promise<void> {
  const clean = name.trim() || "Untitled site";
  const { error } = await supabase
    .from("projects")
    .update({ name: clean, slug: slugFor(clean) })
    .eq("id", id);
  if (error) throw error;
}

export async function deleteProject(id: string): Promise<void> {
  const { error } = await supabase.from("projects").delete().eq("id", id);
  if (error) throw error;
}

/* ------------------------------------------------------------------ */
/* Hook                                                               */
/* ------------------------------------------------------------------ */

export function useProjects(): {
  hydrated: boolean;
  projects: ProjectRow[];
  refresh: () => Promise<void>;
  loading: boolean;
  error: string | null;
} {
  const { user, hydrated: authHydrated } = useAuth();
  const [projects, setProjects] = useState<ProjectRow[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!user) {
      setProjects([]);
      setHydrated(true);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const rows = await listProjects(user.id);
      setProjects(rows);
    } catch (err) {
      console.error("listProjects failed", err);
      setError(err instanceof Error ? err.message : "Failed to load projects");
    } finally {
      setLoading(false);
      setHydrated(true);
    }
  }, [user]);

  useEffect(() => {
    if (!authHydrated) return;
    void refresh();
  }, [authHydrated, refresh]);

  return { hydrated, projects, refresh, loading, error };
}
