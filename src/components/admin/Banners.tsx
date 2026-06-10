import Link from "next/link";

/** Shown when Supabase env vars are still placeholders. */
export function NotConfiguredBanner() {
  return (
    <div className="admin-banner">
      <strong>Supabase isn&apos;t connected yet.</strong>
      <p>
        Create a project, run <code>supabase-schema.sql</code>, then set{" "}
        <code>NEXT_PUBLIC_SUPABASE_URL</code> and{" "}
        <code>SUPABASE_SERVICE_ROLE_KEY</code> in <code>.env.local</code>. Live
        submissions and tracking light up automatically once it&apos;s set.
      </p>
    </div>
  );
}

/** Inline error banner for a failed query. */
export function ErrorBanner({ message }: { message: string }) {
  return (
    <div className="admin-banner admin-banner--error">
      <strong>Couldn&apos;t load data.</strong>
      <p>{message}</p>
    </div>
  );
}

export function EmptyState({ label }: { label: string }) {
  return (
    <div className="admin-empty">
      <p>No {label} yet.</p>
      <Link href="/" className="admin-empty-link">
        View the public site →
      </Link>
    </div>
  );
}
