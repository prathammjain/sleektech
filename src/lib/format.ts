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

/** A URL cell: strips protocol for display, falls back to a dash. */
export function linkLabel(value: string | null): string {
  if (!value) return "—";
  return value.replace(/^https?:\/\//, "").replace(/\/$/, "");
}

/** Compact relative time, e.g. "just now", "4h ago", "3d ago", "2w ago". */
export function relativeTime(value: string | null): string {
  if (!value) return "—";
  const then = new Date(value).getTime();
  if (Number.isNaN(then)) return "—";
  const diff = Date.now() - then;
  const past = diff >= 0;
  const s = Math.abs(diff) / 1000;
  if (s < 45) return "just now";
  let label: string;
  if (s < 3600) label = `${Math.round(s / 60)}m`;
  else if (s < 86400) label = `${Math.round(s / 3600)}h`;
  else if (s < 604800) label = `${Math.round(s / 86400)}d`;
  else if (s < 2629800) label = `${Math.round(s / 604800)}w`;
  else if (s < 31557600) label = `${Math.round(s / 2629800)}mo`;
  else label = `${Math.round(s / 31557600)}y`;
  return past ? `${label} ago` : `in ${label}`;
}

/** Ensure a URL has a protocol for use in href. */
export function hrefify(url: string | null): string {
  if (!url) return "#";
  return /^https?:\/\//.test(url) ? url : `https://${url}`;
}
