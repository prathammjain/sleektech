import { fetchRows } from "@/lib/admin-data";
import EntityView from "@/components/admin/EntityView";
import type { Application } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function ApplicationsPage() {
  const { rows, error, configured } = await fetchRows<Application>("applications");
  return (
    <EntityView entity="applications" rows={rows} relations={{}} configured={configured} error={error} />
  );
}
