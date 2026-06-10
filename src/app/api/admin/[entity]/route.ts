import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import { STATUS_OPTIONS, type AdminEntity } from "@/lib/types";

export const runtime = "nodejs";

const VALID_ENTITIES = Object.keys(STATUS_OPTIONS) as AdminEntity[];

/** PATCH /api/admin/:entity  body { id, status?, notes? } — guarded by proxy. */
export async function PATCH(
  request: Request,
  ctx: { params: Promise<{ entity: string }> },
) {
  const { entity } = await ctx.params;
  if (!VALID_ENTITIES.includes(entity as AdminEntity)) {
    return NextResponse.json({ error: "Unknown entity." }, { status: 404 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid body." }, { status: 400 });
  }

  const id = String(body.id ?? "");
  if (!id) {
    return NextResponse.json({ error: "Missing id." }, { status: 400 });
  }

  const update: Record<string, unknown> = {};

  if (body.status !== undefined) {
    const allowed = STATUS_OPTIONS[entity as AdminEntity] as readonly string[];
    const status = String(body.status);
    if (!allowed.includes(status)) {
      return NextResponse.json({ error: "Invalid status." }, { status: 400 });
    }
    update.status = status;
  }

  if (body.notes !== undefined) {
    update.notes = String(body.notes ?? "").trim() || null;
  }

  if (Object.keys(update).length === 0) {
    return NextResponse.json({ error: "Nothing to update." }, { status: 400 });
  }

  try {
    const supabase = getSupabaseAdmin();
    const { error } = await supabase.from(entity).update(update).eq("id", id);
    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(`update ${entity} failed:`, err);
    return NextResponse.json({ error: "Update failed." }, { status: 500 });
  }
}
