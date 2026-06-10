import "server-only";
import { getSupabaseAdmin } from "./supabase/server";

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

export { isConfigured };
