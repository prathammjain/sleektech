import Link from "next/link";

export const metadata = {
  title: "Page not found",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <main className="status-page">
      <div className="status-card">
        <span className="tag">404</span>
        <h1>This page took a different route.</h1>
        <p>The page you&apos;re after doesn&apos;t exist or has moved.</p>
        <Link href="/" className="btn-primary">
          Back to home →
        </Link>
      </div>
    </main>
  );
}
