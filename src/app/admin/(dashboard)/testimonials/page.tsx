import { fetchAllTestimonials } from "@/lib/admin-data";
import TestimonialsAdmin from "@/components/admin/TestimonialsAdmin";

export const dynamic = "force-dynamic";

export default async function TestimonialsPage() {
  const { rows, configured, error } = await fetchAllTestimonials();
  return (
    <TestimonialsAdmin
      rows={rows as Record<string, unknown>[]}
      configured={configured}
      error={error}
    />
  );
}
