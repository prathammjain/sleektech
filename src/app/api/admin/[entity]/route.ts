import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import { STATUS_OPTIONS, type AdminEntity } from "@/lib/types";
import { ENTITY_CONFIG, writableFields } from "@/lib/admin-config";

export const runtime = "nodejs";

const VALID = Object.keys(STATUS_OPTIONS) as AdminEntity[];

function isValidEntity(e: string): e is AdminEntity {
  return VALID.includes(e as AdminEntity);
}

/** Keep only writable columns, trim strings, turn blanks into null. */
function sanitize(entity: AdminEntity, input: Record<string, unknown>) {
  const allowed = writableFields(entity);
  const out: Record<string, unknown> = {};
  for (const key of allowed) {
    if (!(key in input)) continue;
    let v = input[key];
    if (typeof v === "string") {
      v = v.trim();
      if (v === "") v = null;
    }
    out[key] = v;
  }
  return out;
}

/** Validate status against the entity's enum, if present. */
function statusError(entity: AdminEntity, row: Record<string, unknown>): string | null {
  const statusKey = ENTITY_CONFIG[entity].statusKey;
  if (statusKey && row[statusKey] != null) {
    const allowed = STATUS_OPTIONS[entity] as readonly string[];
    if (!allowed.includes(String(row[statusKey]))) return "Invalid status.";
  }
  return null;
}

async function parse(request: Request): Promise<Record<string, unknown> | null> {
  try {
    return (await request.json()) as Record<string, unknown>;
  } catch {
    return null;
  }
}

/** POST — create a record. */
export async function POST(
  request: Request,
  ctx: { params: Promise<{ entity: string }> },
) {
  const { entity } = await ctx.params;
  if (!isValidEntity(entity)) {
    return NextResponse.json({ error: "Unknown entity." }, { status: 404 });
  }
  if (!ENTITY_CONFIG[entity].creatable) {
    return NextResponse.json({ error: "This record type can't be created here." }, { status: 400 });
  }

  const body = await parse(request);
  if (!body) return NextResponse.json({ error: "Invalid body." }, { status: 400 });

  const row = sanitize(entity, body);

  for (const f of ENTITY_CONFIG[entity].fields) {
    if (f.required && !f.readOnly && (row[f.key] == null || row[f.key] === "")) {
      return NextResponse.json({ error: `${f.label} is required.` }, { status: 400 });
    }
  }
  const sErr = statusError(entity, row);
  if (sErr) return NextResponse.json({ error: sErr }, { status: 400 });

  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase.from(entity).insert(row).select("id").single();
    if (error) throw error;
    return NextResponse.json({ ok: true, id: data?.id }, { status: 201 });
  } catch (err) {
    console.error(`create ${entity} failed:`, err);
    return NextResponse.json({ error: "Could not create record." }, { status: 500 });
  }
}

/** PATCH — update fields on a record. */
export async function PATCH(
  request: Request,
  ctx: { params: Promise<{ entity: string }> },
) {
  const { entity } = await ctx.params;
  if (!isValidEntity(entity)) {
    return NextResponse.json({ error: "Unknown entity." }, { status: 404 });
  }

  const body = await parse(request);
  if (!body) return NextResponse.json({ error: "Invalid body." }, { status: 400 });

  const id = String(body.id ?? "");
  if (!id) return NextResponse.json({ error: "Missing id." }, { status: 400 });

  const update = sanitize(entity, body);
  if (Object.keys(update).length === 0) {
    return NextResponse.json({ error: "Nothing to update." }, { status: 400 });
  }
  const sErr = statusError(entity, update);
  if (sErr) return NextResponse.json({ error: sErr }, { status: 400 });

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

/** DELETE — remove a record. */
export async function DELETE(
  request: Request,
  ctx: { params: Promise<{ entity: string }> },
) {
  const { entity } = await ctx.params;
  if (!isValidEntity(entity)) {
    return NextResponse.json({ error: "Unknown entity." }, { status: 404 });
  }

  const body = await parse(request);
  const id = String(body?.id ?? "");
  if (!id) return NextResponse.json({ error: "Missing id." }, { status: 400 });

  try {
    const supabase = getSupabaseAdmin();
    const { error } = await supabase.from(entity).delete().eq("id", id);
    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(`delete ${entity} failed:`, err);
    return NextResponse.json({ error: "Delete failed." }, { status: 500 });
  }
}
