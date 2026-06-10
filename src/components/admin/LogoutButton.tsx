"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const logout = async () => {
    setLoading(true);
    await fetch("/api/admin/login", { method: "DELETE" });
    router.replace("/admin/login");
    router.refresh();
  };

  return (
    <button type="button" className="admin-logout" onClick={logout} disabled={loading}>
      {loading ? "…" : "Log out"}
    </button>
  );
}
