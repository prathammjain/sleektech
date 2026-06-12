import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/server";

export const runtime = "nodejs";

const BUCKET = "testimonials";
const MAX_FILE_BYTES = 20 * 1024 * 1024; // 20 MB

/** POST multipart { image } — upload media, return its public URL. */
export async function POST(request: Request) {
  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ error: "Invalid form data." }, { status: 400 });
  }

  const file = form.get("image");
  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json({ error: "No file provided." }, { status: 400 });
  }
  if (file.size > MAX_FILE_BYTES) {
    return NextResponse.json({ error: "File too large (max 20 MB)." }, { status: 400 });
  }

  try {
    const supabase = getSupabaseAdmin();
    const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
    const path = `${crypto.randomUUID()}.${ext}`;
    const bytes = new Uint8Array(await file.arrayBuffer());
    const { error } = await supabase.storage
      .from(BUCKET)
      .upload(path, bytes, { contentType: file.type || "application/octet-stream", upsert: false });
    if (error) throw error;
    const publicUrl = supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
    return NextResponse.json({ path: publicUrl });
  } catch (err) {
    console.error("upload failed:", err);
    return NextResponse.json({ error: "Upload failed." }, { status: 500 });
  }
}
