import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/server";

export const runtime = "nodejs";

/** Public endpoint: a company submits a project brief from the landing page. */
export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const name = String(body.name ?? "").trim();
  if (!name) {
    return NextResponse.json({ error: "Name is required." }, { status: 400 });
  }

  const row = {
    name,
    email: str(body.email),
    phone: str(body.phone),
    need: str(body.need),
    message: str(body.message),
  };

  try {
    const supabase = getSupabaseAdmin();
    const { error } = await supabase.from("leads").insert(row);
    if (error) throw error;
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (err) {
    console.error("leads insert failed:", err);
    return NextResponse.json(
      { error: "Could not save your enquiry. Please try again or email us." },
      { status: 500 },
    );
  }
}

function str(v: unknown): string | null {
  const s = String(v ?? "").trim();
  return s.length ? s : null;
}
