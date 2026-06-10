import { NextResponse } from "next/server";
import { getSupabaseAdmin, RESUME_BUCKET } from "@/lib/supabase/server";

export const runtime = "nodejs";

const MAX_RESUME_BYTES = 8 * 1024 * 1024; // 8 MB

/** Public endpoint: an engineer applies to the collective (multipart form). */
export async function POST(request: Request) {
  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ error: "Invalid form submission." }, { status: 400 });
  }

  const name = String(form.get("name") ?? "").trim();
  if (!name) {
    return NextResponse.json({ error: "Name is required." }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();

  // Optional resume upload → private storage bucket.
  let resumeUrl: string | null = null;
  const file = form.get("resume");
  if (file instanceof File && file.size > 0) {
    if (file.size > MAX_RESUME_BYTES) {
      return NextResponse.json(
        { error: "Resume is too large (max 8 MB)." },
        { status: 400 },
      );
    }
    try {
      const ext = file.name.split(".").pop()?.toLowerCase() ?? "pdf";
      const path = `${crypto.randomUUID()}.${ext}`;
      const bytes = new Uint8Array(await file.arrayBuffer());
      const { error: upErr } = await supabase.storage
        .from(RESUME_BUCKET)
        .upload(path, bytes, {
          contentType: file.type || "application/octet-stream",
          upsert: false,
        });
      if (upErr) throw upErr;
      resumeUrl = path; // store the object path; sign on read in the dashboard
    } catch (err) {
      console.error("resume upload failed:", err);
      // Non-fatal: keep the application even if the upload fails.
    }
  }

  const row = {
    name,
    role: str(form.get("role")),
    linkedin: str(form.get("linkedin")),
    github: str(form.get("github")),
    shipped: str(form.get("shipped")),
    message: str(form.get("message")),
    resume_url: resumeUrl,
  };

  try {
    const { error } = await supabase.from("applications").insert(row);
    if (error) throw error;
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (err) {
    console.error("applications insert failed:", err);
    return NextResponse.json(
      { error: "Could not submit your application. Please try again." },
      { status: 500 },
    );
  }
}

function str(v: FormDataEntryValue | null): string | null {
  const s = String(v ?? "").trim();
  return s.length ? s : null;
}
