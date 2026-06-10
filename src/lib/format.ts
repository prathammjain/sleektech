export function fmtDate(value: string | null): string {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function fmtDateTime(value: string | null): string {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/** Render a possibly-empty value as a dash. */
export function dash(value: string | null | undefined): string {
  const s = (value ?? "").trim();
  return s.length ? s : "—";
}

/** A URL cell — strips protocol for display, falls back to a dash. */
export function linkLabel(value: string | null): string {
  if (!value) return "—";
  return value.replace(/^https?:\/\//, "").replace(/\/$/, "");
}
