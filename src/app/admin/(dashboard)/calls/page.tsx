import { fetchRows } from "@/lib/admin-data";
import { NotConfiguredBanner, ErrorBanner, EmptyState } from "@/components/admin/Banners";
import StatusSelect from "@/components/admin/StatusSelect";
import { STATUS_OPTIONS, type Call, type Client } from "@/lib/types";
import { fmtDateTime, dash } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function CallsPage() {
  const { rows, error, configured } = await fetchRows<Call>("calls", "scheduled_at");
  const clients = await fetchRows<Client>("clients");
  const clientName = new Map(clients.rows.map((c) => [c.id, c.name]));

  return (
    <div className="admin-page">
      <div className="admin-page-head">
        <h1>Calls</h1>
        <p>Client calls — scheduled and logged.</p>
      </div>

      {!configured && <NotConfiguredBanner />}
      {error && <ErrorBanner message={error} />}
      {configured && !error && rows.length === 0 && <EmptyState label="calls" />}

      {rows.length > 0 && (
        <div className="admin-table-wrap n-card">
          <table className="admin-table">
            <thead>
              <tr>
                <th>When</th>
                <th>Client</th>
                <th>Purpose</th>
                <th>Outcome</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((c) => (
                <tr key={c.id}>
                  <td className="admin-muted">{fmtDateTime(c.scheduled_at)}</td>
                  <td className="admin-cell-strong">
                    {c.client_id ? clientName.get(c.client_id) ?? "—" : "—"}
                  </td>
                  <td>{dash(c.purpose)}</td>
                  <td className="admin-cell-clamp" title={c.outcome ?? ""}>
                    {dash(c.outcome)}
                  </td>
                  <td>
                    <StatusSelect
                      entity="calls"
                      id={c.id}
                      value={c.status}
                      options={STATUS_OPTIONS.calls}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
