"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ENTITY_CONFIG,
  type FieldConfig,
  type RelationMap,
} from "@/lib/admin-config";
import type { AdminEntity } from "@/lib/types";

type Mode = "create" | "edit";
type Record_ = Record<string, unknown>;

const pad = (n: number) => String(n).padStart(2, "0");

/** ISO -> value for <input type="datetime-local"> in local time. */
function toLocalInput(iso: unknown): string {
  if (!iso) return "";
  const d = new Date(String(iso));
  if (Number.isNaN(d.getTime())) return "";
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function initialValue(field: FieldConfig, record: Record_ | null, mode: Mode): string {
  if (mode === "create") {
    if (field.type === "select" && field.key === "status" && field.options?.length) {
      return field.options[0];
    }
    return "";
  }
  const raw = record?.[field.key];
  if (raw == null) return "";
  if (field.type === "datetime") return toLocalInput(raw);
  return String(raw);
}

export default function RecordDrawer({
  entity,
  mode,
  record,
  relations,
  onClose,
  onDone,
}: {
  entity: AdminEntity;
  mode: Mode;
  record: Record_ | null;
  relations: RelationMap;
  onClose: () => void;
  onDone: (message: string) => void;
}) {
  const config = ENTITY_CONFIG[entity];
  const editable = useMemo(
    () => config.fields.filter((f) => !f.readOnly),
    [config.fields],
  );
  const readOnly = useMemo(
    () => config.fields.filter((f) => f.readOnly && record?.[f.key]),
    [config.fields, record],
  );

  const [values, setValues] = useState<Record<string, string>>(() => {
    const v: Record<string, string> = {};
    editable.forEach((f) => (v[f.key] = initialValue(f, record, mode)));
    return v;
  });
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && !saving && onClose();
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose, saving]);

  const set = (key: string, val: string) =>
    setValues((p) => ({ ...p, [key]: val }));

  const buildPayload = () => {
    const out: Record<string, unknown> = {};
    editable.forEach((f) => {
      let v: string | null = values[f.key] ?? "";
      if (f.type === "datetime" && v) v = new Date(v).toISOString();
      out[f.key] = v === "" ? null : v;
    });
    return out;
  };

  const save = async () => {
    setError(null);
    const missing = editable.find(
      (f) => f.required && !(values[f.key] ?? "").trim(),
    );
    if (missing) {
      setError(`${missing.label} is required.`);
      return;
    }
    setSaving(true);
    try {
      const payload = buildPayload();
      const res = await fetch(`/api/admin/${entity}`, {
        method: mode === "create" ? "POST" : "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          mode === "create" ? payload : { id: record?.id, ...payload },
        ),
      });
      if (!res.ok) {
        const b = await res.json().catch(() => ({}));
        throw new Error(b.error || "Something went wrong.");
      }
      onDone(mode === "create" ? `${config.singular} created.` : "Changes saved.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
      setSaving(false);
    }
  };

  const remove = async () => {
    if (!record?.id) return;
    if (!confirm(`Delete this ${config.singular.toLowerCase()}? This can't be undone.`)) return;
    setDeleting(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/${entity}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: record.id }),
      });
      if (!res.ok) throw new Error("Delete failed.");
      onDone(`${config.singular} deleted.`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Delete failed.");
      setDeleting(false);
    }
  };

  const busy = saving || deleting;

  return (
    <div className="drawer-backdrop" onClick={() => !busy && onClose()}>
      <aside
        className="drawer"
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="drawer-head">
          <div>
            <span className="drawer-kicker">{mode === "create" ? "New" : "Edit"}</span>
            <h2>{config.singular}</h2>
          </div>
          <button className="drawer-x" onClick={onClose} aria-label="Close" disabled={busy}>
            ✕
          </button>
        </header>

        <div className="drawer-body">
          {editable.map((f) => (
            <Field
              key={f.key}
              field={f}
              value={values[f.key] ?? ""}
              relations={relations}
              onChange={(v) => set(f.key, v)}
            />
          ))}

          {readOnly.length > 0 && (
            <div className="drawer-meta">
              {readOnly.map((f) => (
                <div key={f.key} className="drawer-meta-row">
                  <span>{f.label}</span>
                  <span>{formatReadOnly(f, record?.[f.key])}</span>
                </div>
              ))}
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
            <button className="drawer-cancel" onClick={onClose} disabled={busy}>
              Cancel
            </button>
            <button className="btn-primary" onClick={save} disabled={busy}>
              {saving ? "Saving…" : mode === "create" ? "Create" : "Save"}
            </button>
          </div>
        </footer>
      </aside>
    </div>
  );
}

function Field({
  field,
  value,
  relations,
  onChange,
}: {
  field: FieldConfig;
  value: string;
  relations: RelationMap;
  onChange: (v: string) => void;
}) {
  const id = `f-${field.key}`;
  const common = {
    id,
    value,
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      onChange(e.target.value),
  };

  let control: React.ReactNode;
  if (field.type === "textarea") {
    control = <textarea {...common} placeholder={field.placeholder} rows={3} />;
  } else if (field.type === "select") {
    control = (
      <select {...common}>
        {field.key !== "status" && <option value="">—</option>}
        {field.options?.map((o) => (
          <option key={o} value={o}>
            {o.replace(/_/g, " ")}
          </option>
        ))}
      </select>
    );
  } else if (field.type === "relation") {
    const opts = (field.relation && relations[field.relation]) || [];
    control = (
      <select {...common}>
        <option value="">— none —</option>
        {opts.map((o) => (
          <option key={o.id} value={o.id}>
            {o.label}
          </option>
        ))}
      </select>
    );
  } else {
    const inputType =
      field.type === "datetime" ? "datetime-local" : field.type === "date" ? "date" : field.type;
    control = <input {...common} type={inputType} placeholder={field.placeholder} />;
  }

  return (
    <div className="form-group">
      <label htmlFor={id}>
        {field.label}
        {field.required && <span className="req-dot"> *</span>}
      </label>
      {control}
    </div>
  );
}

function formatReadOnly(field: FieldConfig, value: unknown): string {
  if (value == null || value === "") return "—";
  if (field.key === "resume_url") return "Uploaded";
  if (field.type === "datetime") {
    const d = new Date(String(value));
    return Number.isNaN(d.getTime()) ? "—" : d.toLocaleString("en-IN");
  }
  return String(value);
}
