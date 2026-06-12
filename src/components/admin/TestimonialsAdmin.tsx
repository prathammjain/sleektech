"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { NotConfiguredBanner, ErrorBanner } from "./Banners";
import type { Testimonial } from "@/lib/types";

const MAX = 5;
const PLATFORMS = ["linkedin", "twitter", "instagram", "website", "other"];
const VIDEO_RE = /\.(mp4|webm|mov|m4v|ogg)(\?|$)/i;
const isVideo = (url: string | null) => Boolean(url && VIDEO_RE.test(url));

type Row = Testimonial;

export default function TestimonialsAdmin({
  rows: rawRows,
  configured,
  error,
}: {
  rows: Record<string, unknown>[];
  configured: boolean;
  error: string | null;
}) {
  const rows = rawRows as Row[];
  const router = useRouter();
  const active = rows.filter((r) => r.active).length;
  const [drawer, setDrawer] = useState<{ mode: "create" | "edit"; row: Row | null } | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2600);
    return () => clearTimeout(t);
  }, [toast]);

  const onDone = (msg: string) => {
    setDrawer(null);
    setToast(msg);
    router.refresh();
  };

  return (
    <div className="admin-page">
      <div className="admin-page-head admin-page-head--row">
        <div>
          <h1>
            Testimonials
            <span className="admin-count">{rows.length}</span>
          </h1>
          <p>
            Manage client quotes on the public site. Max {MAX} active at a time.{" "}
            <span className={active >= MAX ? "testi-limit-hit" : "admin-muted"}>
              {active}/{MAX} active
            </span>
          </p>
        </div>
        {configured && (
          <button
            className="btn-primary admin-add"
            onClick={() => setDrawer({ mode: "create", row: null })}
            disabled={active >= MAX}
            title={active >= MAX ? `Deactivate one to add more (max ${MAX})` : undefined}
          >
            + New testimonial
          </button>
        )}
      </div>

      {!configured && <NotConfiguredBanner />}
      {error && <ErrorBanner message={error} />}

      {configured && rows.length === 0 && (
        <div className="admin-empty">
          <p>No testimonials yet.</p>
          <button
            className="admin-empty-link"
            onClick={() => setDrawer({ mode: "create", row: null })}
          >
            + Add the first one
          </button>
        </div>
      )}

      {rows.length > 0 && (
        <div className="testi-admin-grid">
          {rows.map((r) => (
            <div
              key={r.id}
              className={`testi-admin-card n-card${r.active ? "" : " testi-admin-card--inactive"}`}
              onClick={() => setDrawer({ mode: "edit", row: r })}
            >
              <div className="testi-admin-card-top">
                <div className="testi-admin-avatar">
                  {r.image_url && isVideo(r.image_url) ? (
                    <video src={r.image_url} muted loop autoPlay playsInline />
                  ) : r.image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={r.image_url} alt={r.name} />
                  ) : (
                    <span>
                      {r.name
                        .split(" ")
                        .map((w) => w[0])
                        .slice(0, 2)
                        .join("")
                        .toUpperCase()}
                    </span>
                  )}
                </div>
                <div className="testi-admin-meta">
                  <span className="testi-admin-name">{r.name}</span>
                  <span className="admin-muted">
                    {[r.role, r.company].filter(Boolean).join(", ") || "No role set"}
                  </span>
                </div>
                <span className={`admin-badge admin-status--${r.active ? "active" : "paused"}`}>
                  {r.active ? "active" : "inactive"}
                </span>
              </div>
              <p className="testi-admin-quote">&ldquo;{r.quote}&rdquo;</p>
              {r.caption && <p className="testi-admin-caption">{r.caption}</p>}
              <div className="testi-admin-order">
                <span className="admin-muted">Order {r.display_order}</span>
                {r.social_url && (
                  <a
                    href={r.social_url}
                    target="_blank"
                    rel="noreferrer"
                    className="testi-admin-social"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {r.social_platform ?? "link"} ↗
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {drawer && (
        <TestiDrawer
          mode={drawer.mode}
          row={drawer.row}
          activeCount={active}
          onClose={() => setDrawer(null)}
          onDone={onDone}
        />
      )}

      {toast && (
        <div className="admin-toast admin-toast--ok" role="status">
          {toast}
        </div>
      )}
    </div>
  );
}

function TestiDrawer({
  mode,
  row,
  activeCount,
  onClose,
  onDone,
}: {
  mode: "create" | "edit";
  row: Row | null;
  activeCount: number;
  onClose: () => void;
  onDone: (msg: string) => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState(row?.name ?? "");
  const [role, setRole] = useState(row?.role ?? "");
  const [company, setCompany] = useState(row?.company ?? "");
  const [quote, setQuote] = useState(row?.quote ?? "");
  const [caption, setCaption] = useState(row?.caption ?? "");
  const [socialUrl, setSocialUrl] = useState(row?.social_url ?? "");
  const [platform, setPlatform] = useState<string>(row?.social_platform ?? "linkedin");
  const [active, setActive] = useState(row?.active ?? true);
  const [order, setOrder] = useState(String(row?.display_order ?? ""));
  const [preview, setPreview] = useState<string | null>(row?.image_url ?? null);
  const [file, setFile] = useState<File | null>(null);
  const previewIsVideo = file
    ? file.type.startsWith("video")
    : isVideo(preview);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && !saving && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose, saving]);

  const save = async () => {
    setError(null);
    if (!name.trim() || !quote.trim()) {
      setError("Name and quote are required.");
      return;
    }
    setSaving(true);
    try {
      if (mode === "create") {
        const fd = new FormData();
        fd.append("name", name.trim());
        fd.append("role", role.trim());
        fd.append("company", company.trim());
        fd.append("quote", quote.trim());
        fd.append("caption", caption.trim());
        fd.append("social_url", socialUrl.trim());
        fd.append("social_platform", platform);
        if (file) fd.append("image", file);
        const res = await fetch("/api/admin/testimonials", { method: "POST", body: fd });
        if (!res.ok) {
          const b = await res.json().catch(() => ({}));
          throw new Error(b.error || "Something went wrong.");
        }
        onDone("Testimonial created.");
      } else {
        // Image update: if new file, upload first via the create endpoint (re-using multipart)
        // then delete old. For simplicity: patch text fields; image change creates new record.
        // (Practical approach: users rarely swap photos. Full re-create on photo change.)
        const payload: Record<string, unknown> = {
          id: row!.id,
          name: name.trim(),
          role: role.trim() || null,
          company: company.trim() || null,
          quote: quote.trim(),
          caption: caption.trim() || null,
          social_url: socialUrl.trim() || null,
          social_platform: platform,
          active,
          display_order: order ? parseInt(order, 10) : row!.display_order,
        };
        if (file) {
          // Upload new image first.
          const fd = new FormData();
          fd.append("name", "temp");
          fd.append("quote", "temp");
          fd.append("image", file);
          // We use a separate signed-upload approach: send to a dedicated endpoint.
          const upRes = await fetch("/api/admin/testimonials/upload-image", {
            method: "POST",
            body: fd,
          });
          if (upRes.ok) {
            const { path } = await upRes.json();
            payload.image_url = path;
          }
        }
        const res = await fetch("/api/admin/testimonials", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) {
          const b = await res.json().catch(() => ({}));
          throw new Error(b.error || "Something went wrong.");
        }
        onDone("Changes saved.");
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
      setSaving(false);
    }
  };

  const remove = async () => {
    if (!row?.id) return;
    if (!confirm("Delete this testimonial? This can't be undone.")) return;
    setDeleting(true);
    try {
      const res = await fetch("/api/admin/testimonials", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: row.id }),
      });
      if (!res.ok) throw new Error("Delete failed.");
      onDone("Testimonial deleted.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Delete failed.");
      setDeleting(false);
    }
  };

  const busy = saving || deleting;
  const wouldExceedMax = mode === "create" && activeCount >= MAX;

  return (
    <div className="drawer-backdrop" onClick={() => !busy && onClose()}>
      <aside className="drawer" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
        <header className="drawer-head">
          <div>
            <span className="drawer-kicker">{mode === "create" ? "New" : "Edit"}</span>
            <h2>Testimonial</h2>
          </div>
          <button className="drawer-x" onClick={onClose} disabled={busy}>✕</button>
        </header>

        <div className="drawer-body">
          {wouldExceedMax && (
            <div className="form-error">
              {MAX} active testimonials already. Deactivate one before adding more.
            </div>
          )}

          {/* Photo upload */}
          <div className="form-group">
            <label>Client photo</label>
            <div
              className="testi-upload"
              onClick={() => fileRef.current?.click()}
            >
              {preview && previewIsVideo ? (
                <video src={preview} className="testi-upload-preview" muted loop autoPlay playsInline />
              ) : preview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={preview} alt="Preview" className="testi-upload-preview" />
              ) : (
                <div className="testi-upload-placeholder">
                  <span className="file-upload-icon">↑</span>
                  <span>Upload photo or short video (max 20 MB)</span>
                </div>
              )}
            </div>
            <input
              ref={fileRef}
              type="file"
              accept="image/*,video/*"
              className="file-upload-input"
              onChange={onFile}
            />
          </div>

          <div className="form-group">
            <label htmlFor="t-name">Name <span className="req-dot">*</span></label>
            <input id="t-name" type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Rahul Mehta" />
          </div>

          <div className="testi-drawer-row">
            <div className="form-group">
              <label htmlFor="t-role">Role</label>
              <input id="t-role" type="text" value={role} onChange={e => setRole(e.target.value)} placeholder="VP Engineering" />
            </div>
            <div className="form-group">
              <label htmlFor="t-company">Company</label>
              <input id="t-company" type="text" value={company} onChange={e => setCompany(e.target.value)} placeholder="Acme Inc." />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="t-quote">Quote <span className="req-dot">*</span></label>
            <textarea id="t-quote" rows={3} value={quote} onChange={e => setQuote(e.target.value)} placeholder="The most impactful sentence from this client…" />
          </div>

          <div className="form-group">
            <label htmlFor="t-caption">Work caption</label>
            <input id="t-caption" type="text" value={caption} onChange={e => setCaption(e.target.value)} placeholder="e.g. Built a full-stack SaaS MVP in 3 weeks." />
          </div>

          <div className="testi-drawer-row">
            <div className="form-group">
              <label htmlFor="t-platform">Platform</label>
              <select id="t-platform" value={platform} onChange={e => setPlatform(e.target.value)}>
                {PLATFORMS.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="t-social">Profile URL</label>
              <input id="t-social" type="url" value={socialUrl} onChange={e => setSocialUrl(e.target.value)} placeholder="https://linkedin.com/in/…" />
            </div>
          </div>

          {mode === "edit" && (
            <div className="testi-drawer-row">
              <div className="form-group">
                <label htmlFor="t-order">Display order</label>
                <input id="t-order" type="number" min={0} value={order} onChange={e => setOrder(e.target.value)} />
              </div>
              <div className="form-group">
                <label htmlFor="t-active">Status</label>
                <select id="t-active" value={active ? "1" : "0"} onChange={e => setActive(e.target.value === "1")}>
                  <option value="1">Active (shown on site)</option>
                  <option value="0">Inactive (hidden)</option>
                </select>
              </div>
            </div>
          )}

          {error && <p className="form-error">{error}</p>}
        </div>

        <footer className="drawer-foot">
          {mode === "edit" && (
            <button className="drawer-delete" onClick={remove} disabled={busy}>
              {deleting ? "Deleting…" : "Delete"}
            </button>
          )}
          <div className="drawer-foot-main">
            <button className="drawer-cancel" onClick={onClose} disabled={busy}>Cancel</button>
            <button className="btn-primary" onClick={save} disabled={busy || wouldExceedMax}>
              {saving ? "Saving…" : mode === "create" ? "Create" : "Save"}
            </button>
          </div>
        </footer>
      </aside>
    </div>
  );
}
