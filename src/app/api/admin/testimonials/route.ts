import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import { TESTIMONIALS_TAG } from "@/lib/admin-data";

export const runtime = "nodejs";

const BUCKET = "testimonials";
const MAX_FILE_BYTES = 20 * 1024 * 1024; // 20 MB (covers small videos)
const MAX_TESTIMONIALS = 5;

/** Bust the cached testimonials so the landing page updates immediately. */
function refreshSite() {
  revalidateTag(TESTIMONIALS_TAG, "max");
}

/** Upload a media file to the public bucket, return its public URL. */
async function uploadMedia(
  supabase: ReturnType<typeof getSupabaseAdmin>,
  file: File,
): Promise<string | null> {
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
  const path = `${crypto.randomUUID()}.${ext}`;
  const bytes = new Uint8Array(await file.arrayBuffer());
  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, bytes, { contentType: file.type || "application/octet-stream", upsert: false });
  if (error) throw error;
  return supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
}

/** POST multipart — create a testimonial with optional photo/video. */
export async function POST(request: Request) {
  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ error: "Invalid form data." }, { status: 400 });
  }

  const name = String(form.get("name") ?? "").trim();
  const quote = String(form.get("quote") ?? "").trim();
  if (!name || !quote) {
    return NextResponse.json({ error: "Name and quote are required." }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();

  const { count } = await supabase
    .from("testimonials")
    .select("*", { count: "exact", head: true })
    .eq("active", true);
  if ((count ?? 0) >= MAX_TESTIMONIALS) {
    return NextResponse.json(
      { error: `Maximum ${MAX_TESTIMONIALS} active testimonials. Deactivate one first.` },
      { status: 400 },
    );
  }

  let mediaUrl: string | null = null;
  const file = form.get("image");
  if (file instanceof File && file.size > 0) {
    if (file.size > MAX_FILE_BYTES) {
      return NextResponse.json({ error: "File too large (max 20 MB)." }, { status: 400 });
    }
    try {
      mediaUrl = await uploadMedia(supabase, file);
    } catch (err) {
      console.error("testimonial media upload failed:", err);
    }
  }

  const { data: orderData } = await supabase
    .from("testimonials")
    .select("display_order")
    .order("display_order", { ascending: false })
    .limit(1);
  const nextOrder = ((orderData?.[0]?.display_order as number) ?? 0) + 1;

  const row = {
    name,
    role: str(form.get("role")),
    company: str(form.get("company")),
    quote,
    caption: str(form.get("caption")),
    social_url: str(form.get("social_url")),
    social_platform: str(form.get("social_platform")) ?? "linkedin",
    image_url: mediaUrl,
    display_order: nextOrder,
    active: true,
  };

  try {
    const { data, error } = await supabase.from("testimonials").insert(row).select("id").single();
    if (error) throw error;
    refreshSite();
    return NextResponse.json({ ok: true, id: data?.id }, { status: 201 });
  } catch (err) {
    console.error("testimonials insert failed:", err);
    return NextResponse.json({ error: "Could not save testimonial." }, { status: 500 });
  }
}

/** PATCH — update fields (including active toggle and order). */
export async function PATCH(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Invalid body." }, { status: 400 });
  }
  const id = String(body.id ?? "");
  if (!id) return NextResponse.json({ error: "Missing id." }, { status: 400 });

  const supabase = getSupabaseAdmin();
  const allowed = [
    "name", "role", "company", "quote", "caption",
    "social_url", "social_platform", "display_order", "active", "image_url",
  ];
  const update: Record<string, unknown> = {};
  for (const k of allowed) if (k in body) update[k] = body[k] ?? null;
  if (!Object.keys(update).length) {
    return NextResponse.json({ error: "Nothing to update." }, { status: 400 });
  }

  const { error } = await supabase.from("testimonials").update(update).eq("id", id);
  if (error) {
    console.error("testimonials update failed:", error);
    return NextResponse.json({ error: "Update failed." }, { status: 500 });
  }
  refreshSite();
  return NextResponse.json({ ok: true });
}

/** DELETE — remove a testimonial and its media. */
export async function DELETE(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Invalid body." }, { status: 400 });
  }
  const id = String(body.id ?? "");
  if (!id) return NextResponse.json({ error: "Missing id." }, { status: 400 });

  const supabase = getSupabaseAdmin();
  const { data: row } = await supabase
    .from("testimonials")
    .select("image_url")
    .eq("id", id)
    .single();
  const { error } = await supabase.from("testimonials").delete().eq("id", id);
  if (error) return NextResponse.json({ error: "Delete failed." }, { status: 500 });

  const mediaUrl = row?.image_url as string | undefined;
  if (mediaUrl && mediaUrl.includes("/testimonials/")) {
    const path = mediaUrl.split("/testimonials/").pop();
    if (path) await supabase.storage.from(BUCKET).remove([path]).catch(() => {});
  }
  refreshSite();
  return NextResponse.json({ ok: true });
}

function str(v: FormDataEntryValue | null | unknown): string | null {
  const s = String(v ?? "").trim();
  return s.length ? s : null;
}
