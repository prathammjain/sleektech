import { fetchRows } from "@/lib/admin-data";
import EntityView from "@/components/admin/EntityView";
import type { Lead } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function LeadsPage() {
  const { rows, error, configured } = await fetchRows<Lead>("leads");
  return (
    <EntityView entity="leads" rows={rows} relations={{}} configured={configured} error={error} />
  );
}
