import { fetchRows } from "@/lib/admin-data";
import { NotConfiguredBanner, ErrorBanner, EmptyState } from "@/components/admin/Banners";
import StatusSelect from "@/components/admin/StatusSelect";
import { STATUS_OPTIONS, type Lead } from "@/lib/types";
import { fmtDate, dash } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function LeadsPage() {
  const { rows, error, configured } = await fetchRows<Lead>("leads");

  return (
    <div className="admin-page">
      <div className="admin-page-head">
        <h1>Leads</h1>
        <p>Project briefs submitted from the site.</p>
      </div>

      {!configured && <NotConfiguredBanner />}
      {error && <ErrorBanner message={error} />}
      {configured && !error && rows.length === 0 && <EmptyState label="leads" />}

      {rows.length > 0 && (
        <div className="admin-table-wrap n-card">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Contact</th>
                <th>Need</th>
                <th>Message</th>
                <th>Status</th>
                <th>Received</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((l) => (
                <tr key={l.id}>
                  <td className="admin-cell-strong">{l.name}</td>
                  <td>
                    <div className="admin-stack-sm">
                      <span>{dash(l.email)}</span>
                      <span className="admin-muted">{dash(l.phone)}</span>
                    </div>
                  </td>
                  <td>{dash(l.need)}</td>
                  <td className="admin-cell-clamp" title={l.message ?? ""}>
                    {dash(l.message)}
                  </td>
                  <td>
                    <StatusSelect
                      entity="leads"
                      id={l.id}
                      value={l.status}
                      options={STATUS_OPTIONS.leads}
                    />
                  </td>
                  <td className="admin-muted">{fmtDate(l.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
