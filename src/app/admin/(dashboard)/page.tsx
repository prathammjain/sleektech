import Link from "next/link";
import { fetchRows } from "@/lib/admin-data";
import { NotConfiguredBanner } from "@/components/admin/Banners";
import { relativeTime, fmtDateTime } from "@/lib/format";
import type {
  Lead,
  Application,
  Client,
  Project,
  Deliverable,
  Call,
} from "@/lib/types";

export const dynamic = "force-dynamic";

const WEEK = 7 * 24 * 3600 * 1000;
const within = (iso: string | null, ms: number) =>
  iso ? Date.now() - new Date(iso).getTime() <= ms : false;
const future = (iso: string | null) => (iso ? new Date(iso).getTime() >= Date.now() : false);
const dueSoon = (iso: string | null) =>
  iso ? new Date(iso).getTime() - Date.now() <= WEEK : false;

export default async function OverviewPage() {
  const [leads, apps, clients, projects, deliverables, calls] = await Promise.all([
    fetchRows<Lead>("leads"),
    fetchRows<Application>("applications"),
    fetchRows<Client>("clients"),
    fetchRows<Project>("projects"),
    fetchRows<Deliverable>("deliverables"),
    fetchRows<Call>("calls", "scheduled_at"),
  ]);

  const newLeads = leads.rows.filter((l) => l.status === "new");
  const toReview = apps.rows.filter((a) => a.status === "new");
  const activeClients = clients.rows.filter((c) => c.status === "active");
  const openProjects = projects.rows.filter((p) =>
    ["discovery", "building", "review"].includes(p.status),
  );
  const upcomingCalls = calls.rows.filter((c) => c.status === "scheduled" && future(c.scheduled_at));
  const dueDeliverables = deliverables.rows.filter((d) => d.status !== "done" && dueSoon(d.due_date));
  const leadsThisWeek = leads.rows.filter((l) => within(l.created_at, WEEK)).length;

  const clientName = new Map(clients.rows.map((c) => [c.id, c.name]));

  const kpis = [
    { label: "New leads", value: newLeads.length, sub: `${leadsThisWeek} this week`, href: "/admin/leads" },
    { label: "To review", value: toReview.length, sub: `${apps.rows.length} total`, href: "/admin/applications" },
    { label: "Active clients", value: activeClients.length, sub: `${clients.rows.length} total`, href: "/admin/clients" },
    { label: "Open projects", value: openProjects.length, sub: `${projects.rows.length} total`, href: "/admin/projects" },
    { label: "Upcoming calls", value: upcomingCalls.length, sub: "scheduled", href: "/admin/calls" },
    { label: "Due soon", value: dueDeliverables.length, sub: "deliverables", href: "/admin/deliverables" },
  ];

  const attention = [
    newLeads.length && { text: `${newLeads.length} new lead${newLeads.length > 1 ? "s" : ""} to triage`, href: "/admin/leads" },
    toReview.length && { text: `${toReview.length} application${toReview.length > 1 ? "s" : ""} to review`, href: "/admin/applications" },
    upcomingCalls.length && { text: `${upcomingCalls.length} upcoming call${upcomingCalls.length > 1 ? "s" : ""}`, href: "/admin/calls" },
    dueDeliverables.length && { text: `${dueDeliverables.length} deliverable${dueDeliverables.length > 1 ? "s" : ""} due soon`, href: "/admin/deliverables" },
  ].filter(Boolean) as { text: string; href: string }[];

  const activity = [
    ...leads.rows.map((l) => ({ type: "Lead", label: l.name, at: l.created_at, href: "/admin/leads" })),
    ...apps.rows.map((a) => ({ type: "Application", label: a.name, at: a.created_at, href: "/admin/applications" })),
    ...clients.rows.map((c) => ({ type: "Client", label: c.name, at: c.created_at, href: "/admin/clients" })),
    ...projects.rows.map((p) => ({ type: "Project", label: p.title, at: p.created_at, href: "/admin/projects" })),
  ]
    .sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime())
    .slice(0, 7);

  return (
    <div className="admin-page">
      <div className="admin-page-head">
        <h1>Overview</h1>
        <p>Everything coming in, and the work in flight.</p>
      </div>

      {!leads.configured && <NotConfiguredBanner />}

      <div className="admin-kpis">
        {kpis.map((k) => (
          <Link key={k.label} href={k.href} className="admin-kpi n-card">
            <span className="admin-kpi-value">{k.value}</span>
            <span className="admin-kpi-label">{k.label}</span>
            <span className="admin-kpi-sub">{k.sub}</span>
          </Link>
        ))}
      </div>

      <div className="admin-overview-grid">
        <section className="admin-recent n-card">
          <header>
            <h2>Needs attention</h2>
          </header>
          {attention.length === 0 ? (
            <p className="admin-recent-empty">All clear. Nothing waiting on you.</p>
          ) : (
            <ul className="admin-attention">
              {attention.map((a) => (
                <li key={a.href}>
                  <Link href={a.href}>
                    <span className="admin-attention-dot" />
                    {a.text}
                    <span className="admin-attention-arrow">→</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}

          {upcomingCalls.length > 0 && (
            <div className="admin-next-calls">
              <span className="admin-next-calls-title">Next calls</span>
              {upcomingCalls.slice(0, 3).map((c) => (
                <div key={c.id} className="admin-next-call">
                  <span>{c.client_id ? clientName.get(c.client_id) ?? "Client" : "Client"}</span>
                  <span className="admin-muted">{fmtDateTime(c.scheduled_at)}</span>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="admin-recent n-card">
          <header>
            <h2>Recent activity</h2>
          </header>
          {activity.length === 0 ? (
            <p className="admin-recent-empty">No activity yet.</p>
          ) : (
            <ul className="admin-activity">
              {activity.map((a, i) => (
                <li key={i}>
                  <Link href={a.href}>
                    <span className="admin-activity-type">{a.type}</span>
                    <span className="admin-activity-name">{a.label}</span>
                    <span className="admin-activity-time">{relativeTime(a.at)}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
