"use client";

import { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ENTITY_CONFIG, type RelationMap, type FieldConfig } from "@/lib/admin-config";
import type { AdminEntity } from "@/lib/types";
import { STATUS_OPTIONS } from "@/lib/types";
import { fmtDate, fmtDateTime, relativeTime, dash, linkLabel, hrefify } from "@/lib/format";
import StatusSelect from "./StatusSelect";
import RecordDrawer from "./RecordDrawer";
import { NotConfiguredBanner, ErrorBanner } from "./Banners";

type Row = Record<string, unknown> & { id: string };
type DrawerState = { mode: "create" | "edit"; record: Row | null } | null;

export default function EntityView({
  entity,
  rows: rawRows,
  relations,
  configured,
  error,
}: {
  entity: AdminEntity;
  rows: Record<string, unknown>[];
  relations: RelationMap;
  configured: boolean;
  error: string | null;
}) {
  const config = ENTITY_CONFIG[entity];
  const rows = rawRows as Row[];
  const router = useRouter();
  const columns = useMemo(() => config.fields.filter((f) => f.table), [config.fields]);
  const statusKey = config.statusKey;

  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<string>("all");
  const [drawer, setDrawer] = useState<DrawerState>(null);
  const [toast, setToast] = useState<{ msg: string; kind: "ok" | "err" } | null>(null);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2600);
    return () => clearTimeout(t);
  }, [toast]);

  const relLabel = useMemo(() => {
    const maps: Record<string, Map<string, string>> = {};
    for (const key of Object.keys(relations)) {
      maps[key] = new Map((relations[key as AdminEntity] ?? []).map((o) => [o.id, o.label]));
    }
    return maps;
  }, [relations]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter((r) => {
      if (filter !== "all" && statusKey && String(r[statusKey]) !== filter) return false;
      if (!q) return true;
      return config.searchKeys.some((k) =>
        String(r[k] ?? "").toLowerCase().includes(q),
      );
    });
  }, [rows, query, filter, statusKey, config.searchKeys]);

  const statusCounts = useMemo(() => {
    const c: Record<string, number> = {};
    if (statusKey) rows.forEach((r) => (c[String(r[statusKey])] = (c[String(r[statusKey])] ?? 0) + 1));
    return c;
  }, [rows, statusKey]);

  const onDone = (msg: string) => {
    setDrawer(null);
    setToast({ msg, kind: "ok" });
    router.refresh();
  };

  return (
    <div className="admin-page">
      <div className="admin-page-head admin-page-head--row">
        <div>
          <h1>
            {config.label}
            <span className="admin-count">{rows.length}</span>
          </h1>
          <p>{config.blurb}</p>
        </div>
        {config.creatable && configured && (
          <button className="btn-primary admin-add" onClick={() => setDrawer({ mode: "create", record: null })}>
            + New {config.singular.toLowerCase()}
          </button>
        )}
      </div>

      {!configured && <NotConfiguredBanner />}
      {error && <ErrorBanner message={error} />}

      {configured && !error && (
        <>
          <div className="admin-toolbar">
            <div className="admin-search">
              <span className="admin-search-icon">⌕</span>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={`Search ${config.label.toLowerCase()}…`}
              />
            </div>
            {statusKey && (
              <div className="admin-filters">
                <button
                  className={filter === "all" ? "admin-chip active" : "admin-chip"}
                  onClick={() => setFilter("all")}
                >
                  All <span>{rows.length}</span>
                </button>
                {(STATUS_OPTIONS[entity] as readonly string[]).map((s) => (
                  <button
                    key={s}
                    className={filter === s ? "admin-chip active" : "admin-chip"}
                    onClick={() => setFilter(s)}
                  >
                    {s.replace(/_/g, " ")} <span>{statusCounts[s] ?? 0}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {filtered.length === 0 ? (
            <div className="admin-empty">
              <p>{rows.length === 0 ? `No ${config.label.toLowerCase()} yet.` : "Nothing matches that filter."}</p>
              {config.creatable && rows.length === 0 && (
                <button className="admin-empty-link" onClick={() => setDrawer({ mode: "create", record: null })}>
                  + Add the first one
                </button>
              )}
            </div>
          ) : (
            <div className="admin-table-wrap n-card">
              <table className="admin-table">
                <thead>
                  <tr>
                    {columns.map((c) => (
                      <th key={c.key}>{c.label}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((row) => (
                    <tr key={row.id} onClick={() => setDrawer({ mode: "edit", record: row })}>
                      {columns.map((c) => (
                        <td key={c.key} className={c.clamp ? "admin-cell-clamp" : undefined}>
                          {renderCell(c, row, entity, relLabel, statusKey)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {drawer && (
        <RecordDrawer
          entity={entity}
          mode={drawer.mode}
          record={drawer.record}
          relations={relations}
          onClose={() => setDrawer(null)}
          onDone={onDone}
        />
      )}

      {toast && (
        <div className={`admin-toast admin-toast--${toast.kind}`} role="status">
          {toast.msg}
        </div>
      )}
    </div>
  );
}

function renderCell(
  field: FieldConfig,
  row: Row,
  entity: AdminEntity,
  relLabel: Record<string, Map<string, string>>,
  statusKey?: string,
) {
  const value = row[field.key];

  if (statusKey && field.key === statusKey) {
    return (
      <span onClick={(e) => e.stopPropagation()}>
        <StatusSelect
          entity={entity}
          id={row.id}
          value={String(value)}
          options={field.options ?? []}
        />
      </span>
    );
  }

  if (field.type === "relation" && field.relation) {
    const label = value ? relLabel[field.relation]?.get(String(value)) : null;
    return <span className={label ? "admin-cell-strong" : "admin-muted"}>{label ?? "—"}</span>;
  }

  if (field.link && value) {
    return (
      <a href={hrefify(String(value))} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()}>
        {linkLabel(String(value))}
      </a>
    );
  }

  if (field.type === "datetime") {
    const txt = field.key === "created_at" ? relativeTime(String(value)) : fmtDateTime(value ? String(value) : null);
    return <span className="admin-muted">{txt}</span>;
  }
  if (field.type === "date") return <span className="admin-muted">{fmtDate(value ? String(value) : null)}</span>;

  const isPrimary = field.required;
  return <span className={isPrimary ? "admin-cell-strong" : undefined}>{dash(value == null ? "" : String(value))}</span>;
}
