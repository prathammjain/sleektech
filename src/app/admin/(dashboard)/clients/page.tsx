import { fetchRows } from "@/lib/admin-data";
import { NotConfiguredBanner, ErrorBanner, EmptyState } from "@/components/admin/Banners";
import StatusSelect from "@/components/admin/StatusSelect";
import { STATUS_OPTIONS, type Client } from "@/lib/types";
import { fmtDate, dash } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function ClientsPage() {
  const { rows, error, configured } = await fetchRows<Client>("clients");

  return (
    <div className="admin-page">
      <div className="admin-page-head">
        <h1>Clients</h1>
        <p>Companies you&apos;re actively building for.</p>
      </div>

      {!configured && <NotConfiguredBanner />}
      {error && <ErrorBanner message={error} />}
      {configured && !error && rows.length === 0 && <EmptyState label="clients" />}

      {rows.length > 0 && (
        <div className="admin-table-wrap n-card">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Company</th>
                <th>Contact</th>
                <th>Status</th>
                <th>Since</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((c) => (
                <tr key={c.id}>
                  <td className="admin-cell-strong">{c.name}</td>
                  <td>{dash(c.company)}</td>
                  <td>{dash(c.contact)}</td>
                  <td>
                    <StatusSelect
                      entity="clients"
                      id={c.id}
                      value={c.status}
                      options={STATUS_OPTIONS.clients}
                    />
                  </td>
                  <td className="admin-muted">{fmtDate(c.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
