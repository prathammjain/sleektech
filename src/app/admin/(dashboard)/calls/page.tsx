import { fetchRows, fetchRelationOptions } from "@/lib/admin-data";
import EntityView from "@/components/admin/EntityView";
import type { Call } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function CallsPage() {
  const [{ rows, error, configured }, clients] = await Promise.all([
    fetchRows<Call>("calls", "scheduled_at"),
    fetchRelationOptions("clients"),
  ]);
  return (
    <EntityView
      entity="calls"
      rows={rows}
      relations={{ clients }}
      configured={configured}
      error={error}
    />
  );
}
