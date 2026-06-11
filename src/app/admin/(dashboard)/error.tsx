"use client";

import { useEffect } from "react";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="admin-page">
      <div className="admin-banner admin-banner--error">
        <strong>Couldn&apos;t load this page.</strong>
        <p>Something went wrong fetching the data. Try again.</p>
      </div>
      <button type="button" className="btn-primary admin-add" onClick={reset}>
        Retry
      </button>
    </div>
  );
}
