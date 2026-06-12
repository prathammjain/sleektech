import "server-only";
import { unstable_cache } from "next/cache";
import { getSupabaseAdmin } from "./supabase/server";
import type { AdminEntity } from "./types";
import type { RelationOption } from "./admin-config";

export const TESTIMONIALS_TAG = "testimonials";

export type FetchResult<T> = {
  rows: T[];
  error: string | null;
  configured: boolean;
};

function isConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  return Boolean(
    url &&
      key &&
      !url.includes("YOUR-PROJECT") &&
      !key.includes("YOUR-SERVICE-ROLE-KEY"),
  );
}

/** Fetch all rows from a table, newest first. Never throws — returns a result. */
export async function fetchRows<T>(
  table: string,
  orderColumn = "created_at",
): Promise<FetchResult<T>> {
  if (!isConfigured()) {
    return { rows: [], error: null, configured: false };
  }
  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from(table)
      .select("*")
      .order(orderColumn, { ascending: false });
    if (error) throw error;
    return { rows: (data ?? []) as T[], error: null, configured: true };
  } catch (err) {
    console.error(`fetch ${table} failed:`, err);
    return {
      rows: [],
      error: err instanceof Error ? err.message : "Query failed.",
      configured: true,
    };
  }
}

/** Count rows in each of the named tables. Returns 0s when unconfigured. */
export async function fetchCounts(
  tables: string[],
): Promise<{ counts: Record<string, number>; configured: boolean }> {
  const counts: Record<string, number> = {};
  if (!isConfigured()) {
    tables.forEach((t) => (counts[t] = 0));
    return { counts, configured: false };
  }
  const supabase = getSupabaseAdmin();
  await Promise.all(
    tables.map(async (t) => {
      const { count, error } = await supabase
        .from(t)
        .select("*", { count: "exact", head: true });
      counts[t] = error ? 0 : (count ?? 0);
    }),
  );
  return { counts, configured: true };
}

/** Fetch {id, label} options for a relation dropdown (clients, projects). */
export async function fetchRelationOptions(
  entity: AdminEntity,
): Promise<RelationOption[]> {
  if (!isConfigured()) return [];
  const labelCol = entity === "projects" || entity === "deliverables" ? "title" : "name";
  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from(entity)
      .select(`id, ${labelCol}`)
      .order("created_at", { ascending: false });
    if (error) throw error;
    return (data ?? []).map((r) => {
      const rec = r as Record<string, unknown>;
      return { id: String(rec.id), label: String(rec[labelCol] ?? rec.id) };
    });
  } catch (err) {
    console.error(`fetch relation ${entity} failed:`, err);
    return [];
  }
}

/** Counts of items that need attention, for the sidebar badges. */
export async function fetchSidebarBadges(): Promise<Record<string, number>> {
  const empty = { leads: 0, applications: 0, calls: 0 };
  if (!isConfigured()) return empty;
  try {
    const supabase = getSupabaseAdmin();
    const head = (table: string, col: string, val: string) =>
      supabase.from(table).select("*", { count: "exact", head: true }).eq(col, val);
    const [leads, apps, calls] = await Promise.all([
      head("leads", "status", "new"),
      head("applications", "status", "new"),
      head("calls", "status", "scheduled"),
    ]);
    return {
      leads: leads.count ?? 0,
      applications: apps.count ?? 0,
      calls: calls.count ?? 0,
    };
  } catch {
    return empty;
  }
}

/** Fetch active testimonials ordered by display_order. image_url is a public URL. */
async function queryTestimonials() {
  if (!isConfigured()) return [];
  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("testimonials")
      .select("*")
      .eq("active", true)
      .order("display_order", { ascending: true })
      .limit(5);
    if (error) throw error;
    return data ?? [];
  } catch (err) {
    console.error("fetch testimonials failed:", err);
    return [];
  }
}

/**
 * Cached active testimonials for the public landing page. Cached so the page
 * stays static/ISR; busted on demand via revalidateTag(TESTIMONIALS_TAG) from
 * the admin mutation routes, with a 10-min safety revalidate.
 */
export const fetchTestimonials = unstable_cache(
  async () => ({ rows: await queryTestimonials() }),
  ["public-testimonials"],
  { revalidate: 600, tags: [TESTIMONIALS_TAG] },
);

/** Fetch ALL testimonials (active + inactive) for the admin. */
export async function fetchAllTestimonials() {
  if (!isConfigured()) return { rows: [], configured: false, error: null };
  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("testimonials")
      .select("*")
      .order("display_order", { ascending: true });
    if (error) throw error;
    return { rows: data ?? [], configured: true, error: null };
  } catch (err) {
    console.error("fetch all testimonials failed:", err);
    return {
      rows: [],
      configured: true,
      error: err instanceof Error ? err.message : "Query failed.",
    };
  }
}

export { isConfigured };
