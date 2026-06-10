import Link from "next/link";
import { fetchCounts, fetchRows } from "@/lib/admin-data";
import { NotConfiguredBanner } from "@/components/admin/Banners";
import { fmtDate } from "@/lib/format";
import type { Lead, Application } from "@/lib/types";

export const dynamic = "force-dynamic";

const TABLES = [
  "leads",
  "applications",
  "clients",
  "projects",
  "deliverables",
  "calls",
];

const cards: { key: string; label: string; href: string }[] = [
  { key: "leads", label: "Leads", href: "/admin/leads" },
  { key: "applications", label: "Applications", href: "/admin/applications" },
  { key: "clients", label: "Clients", href: "/admin/clients" },
  { key: "projects", label: "Projects", href: "/admin/projects" },
  { key: "deliverables", label: "Deliverables", href: "/admin/deliverables" },
  { key: "calls", label: "Calls", href: "/admin/calls" },
];

export default async function OverviewPage() {
  const { counts, configured } = await fetchCounts(TABLES);
  const leads = await fetchRows<Lead>("leads");
  const apps = await fetchRows<Application>("applications");

  return (
    <div className="admin-page">
      <div className="admin-page-head">
        <h1>Overview</h1>
        <p>Everything coming in, and the work in flight.</p>
      </div>

      {!configured && <NotConfiguredBanner />}

      <div className="admin-stat-cards">
        {cards.map((c) => (
          <Link key={c.key} href={c.href} className="admin-stat-card n-card">
            <span className="admin-stat-num">{counts[c.key] ?? 0}</span>
            <span className="admin-stat-label">{c.label}</span>
          </Link>
        ))}
      </div>

      <div className="admin-overview-grid">
        <section className="admin-recent n-card">
          <header>
            <h2>Latest leads</h2>
            <Link href="/admin/leads">View all →</Link>
          </header>
          {leads.rows.length === 0 ? (
            <p className="admin-recent-empty">No leads yet.</p>
          ) : (
            <ul>
              {leads.rows.slice(0, 5).map((l) => (
                <li key={l.id}>
                  <span className="admin-recent-name">{l.name}</span>
                  <span className="admin-recent-meta">
                    {l.need || "—"} · {fmtDate(l.created_at)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="admin-recent n-card">
          <header>
            <h2>Latest applications</h2>
            <Link href="/admin/applications">View all →</Link>
          </header>
          {apps.rows.length === 0 ? (
            <p className="admin-recent-empty">No applications yet.</p>
          ) : (
            <ul>
              {apps.rows.slice(0, 5).map((a) => (
                <li key={a.id}>
                  <span className="admin-recent-name">{a.name}</span>
                  <span className="admin-recent-meta">
                    {a.role || "—"} · {fmtDate(a.created_at)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
