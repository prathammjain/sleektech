import { fetchRows } from "@/lib/admin-data";
import EntityView from "@/components/admin/EntityView";
import type { Client } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function ClientsPage() {
  const { rows, error, configured } = await fetchRows<Client>("clients");
  return (
    <EntityView entity="clients" rows={rows} relations={{}} configured={configured} error={error} />
  );
}
