"use client";

import { Suspense, useState, FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import "../admin.css";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const from = params.get("from") || "/admin";

  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Login failed.");
      }
      router.replace(from.startsWith("/admin") ? from : "/admin");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed.");
      setLoading(false);
    }
  };

  return (
    <div className="admin-login">
      <form className="admin-login-card n-lg" onSubmit={handleSubmit}>
        <div className="admin-login-brand">
          <span className="logo-type">SleekTech</span>
          <span className="admin-login-tag">Internal · Admin</span>
        </div>
        <h1>Sign in</h1>
        <p className="admin-login-sub">Enter the team password to continue.</p>

        <div className="form-group">
          <label htmlFor="admin-pw">Password</label>
          <input
            id="admin-pw"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••••"
            autoFocus
            required
          />
        </div>

        {error && <p className="form-error">{error}</p>}

        <button type="submit" className="btn-primary btn-full" disabled={loading}>
          {loading ? "Checking…" : "Enter dashboard →"}
        </button>
      </form>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
