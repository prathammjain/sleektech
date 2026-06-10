import { fetchRows } from "@/lib/admin-data";
import { NotConfiguredBanner, ErrorBanner, EmptyState } from "@/components/admin/Banners";
import StatusSelect from "@/components/admin/StatusSelect";
import { STATUS_OPTIONS, type Application } from "@/lib/types";
import { fmtDate, dash, linkLabel } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function ApplicationsPage() {
  const { rows, error, configured } = await fetchRows<Application>("applications");

  return (
    <div className="admin-page">
      <div className="admin-page-head">
        <h1>Applications</h1>
        <p>Engineers applying to the collective.</p>
      </div>

      {!configured && <NotConfiguredBanner />}
      {error && <ErrorBanner message={error} />}
      {configured && !error && rows.length === 0 && <EmptyState label="applications" />}

      {rows.length > 0 && (
        <div className="admin-table-wrap n-card">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Role</th>
                <th>Links</th>
                <th>Shipped</th>
                <th>Resume</th>
                <th>Status</th>
                <th>Applied</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((a) => (
                <tr key={a.id}>
                  <td className="admin-cell-strong">{a.name}</td>
                  <td>{dash(a.role)}</td>
                  <td>
                    <div className="admin-stack-sm">
                      {a.github ? (
                        <a href={hrefify(a.github)} target="_blank" rel="noreferrer">
                          {linkLabel(a.github)}
                        </a>
                      ) : (
                        <span className="admin-muted">no github</span>
                      )}
                      {a.linkedin ? (
                        <a
                          href={hrefify(a.linkedin)}
                          target="_blank"
                          rel="noreferrer"
                          className="admin-muted"
                        >
                          {linkLabel(a.linkedin)}
                        </a>
                      ) : null}
                    </div>
                  </td>
                  <td className="admin-cell-clamp" title={a.shipped ?? ""}>
                    {dash(a.shipped)}
                  </td>
                  <td>
                    {a.resume_url ? (
                      <span className="admin-pill-sm">on file</span>
                    ) : (
                      <span className="admin-muted">—</span>
                    )}
                  </td>
                  <td>
                    <StatusSelect
                      entity="applications"
                      id={a.id}
                      value={a.status}
                      options={STATUS_OPTIONS.applications}
                    />
                  </td>
                  <td className="admin-muted">{fmtDate(a.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function hrefify(url: string): string {
  return /^https?:\/\//.test(url) ? url : `https://${url}`;
}
