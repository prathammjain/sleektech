import { fetchRows, fetchRelationOptions } from "@/lib/admin-data";
import EntityView from "@/components/admin/EntityView";
import type { Deliverable } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function DeliverablesPage() {
  const [{ rows, error, configured }, projects] = await Promise.all([
    fetchRows<Deliverable>("deliverables"),
    fetchRelationOptions("projects"),
  ]);
  return (
    <EntityView
      entity="deliverables"
      rows={rows}
      relations={{ projects }}
      configured={configured}
      error={error}
    />
  );
}
