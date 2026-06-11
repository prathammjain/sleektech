"use client";

import { useEffect } from "react";

export default function Error({
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
    <main className="status-page">
      <div className="status-card">
        <span className="tag">Error</span>
        <h1>Something went sideways.</h1>
        <p>An unexpected error occurred. You can try again.</p>
        <button type="button" className="btn-primary" onClick={reset}>
          Try again
        </button>
      </div>
    </main>
  );
}
