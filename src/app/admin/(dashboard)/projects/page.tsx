import { fetchRows } from "@/lib/admin-data";
import { NotConfiguredBanner, ErrorBanner, EmptyState } from "@/components/admin/Banners";
import StatusSelect from "@/components/admin/StatusSelect";
import { STATUS_OPTIONS, type Project, type Client } from "@/lib/types";
import { fmtDate, dash } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function ProjectsPage() {
  const { rows, error, configured } = await fetchRows<Project>("projects");
  const clients = await fetchRows<Client>("clients");
  const clientName = new Map(clients.rows.map((c) => [c.id, c.name]));

  return (
    <div className="admin-page">
      <div className="admin-page-head">
        <h1>Projects</h1>
        <p>Active and upcoming builds.</p>
      </div>

      {!configured && <NotConfiguredBanner />}
      {error && <ErrorBanner message={error} />}
      {configured && !error && rows.length === 0 && <EmptyState label="projects" />}

      {rows.length > 0 && (
        <div className="admin-table-wrap n-card">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Project</th>
                <th>Client</th>
                <th>Status</th>
                <th>Start</th>
                <th>Due</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((p) => (
                <tr key={p.id}>
                  <td className="admin-cell-strong">{p.title}</td>
                  <td>{p.client_id ? clientName.get(p.client_id) ?? "—" : "—"}</td>
                  <td>
                    <StatusSelect
                      entity="projects"
                      id={p.id}
                      value={p.status}
                      options={STATUS_OPTIONS.projects}
                    />
                  </td>
                  <td className="admin-muted">{fmtDate(p.start_date)}</td>
                  <td className="admin-muted">{fmtDate(p.due_date)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
