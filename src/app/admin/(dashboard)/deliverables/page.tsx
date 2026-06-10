import { fetchRows } from "@/lib/admin-data";
import { NotConfiguredBanner, ErrorBanner, EmptyState } from "@/components/admin/Banners";
import StatusSelect from "@/components/admin/StatusSelect";
import { STATUS_OPTIONS, type Deliverable, type Project } from "@/lib/types";
import { fmtDate } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function DeliverablesPage() {
  const { rows, error, configured } = await fetchRows<Deliverable>("deliverables");
  const projects = await fetchRows<Project>("projects");
  const projectTitle = new Map(projects.rows.map((p) => [p.id, p.title]));

  return (
    <div className="admin-page">
      <div className="admin-page-head">
        <h1>Deliverables</h1>
        <p>Line items across every project.</p>
      </div>

      {!configured && <NotConfiguredBanner />}
      {error && <ErrorBanner message={error} />}
      {configured && !error && rows.length === 0 && <EmptyState label="deliverables" />}

      {rows.length > 0 && (
        <div className="admin-table-wrap n-card">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Deliverable</th>
                <th>Project</th>
                <th>Status</th>
                <th>Due</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((d) => (
                <tr key={d.id}>
                  <td className="admin-cell-strong">{d.title}</td>
                  <td>{d.project_id ? projectTitle.get(d.project_id) ?? "—" : "—"}</td>
                  <td>
                    <StatusSelect
                      entity="deliverables"
                      id={d.id}
                      value={d.status}
                      options={STATUS_OPTIONS.deliverables}
                    />
                  </td>
                  <td className="admin-muted">{fmtDate(d.due_date)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
