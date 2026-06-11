import { fetchRows, fetchRelationOptions } from "@/lib/admin-data";
import EntityView from "@/components/admin/EntityView";
import type { Project } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function ProjectsPage() {
  const [{ rows, error, configured }, clients] = await Promise.all([
    fetchRows<Project>("projects"),
    fetchRelationOptions("clients"),
  ]);
  return (
    <EntityView
      entity="projects"
      rows={rows}
      relations={{ clients }}
      configured={configured}
      error={error}
    />
  );
}
