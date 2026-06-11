import type { ReactNode } from "react";
import Sidebar from "@/components/admin/Sidebar";
import LogoutButton from "@/components/admin/LogoutButton";
import { fetchSidebarBadges } from "@/lib/admin-data";
import "../admin.css";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const badges = await fetchSidebarBadges();

  return (
    <div className="admin-shell">
      <Sidebar badges={badges} />
      <div className="admin-main">
        <header className="admin-topbar">
          <span className="admin-topbar-tag">Internal dashboard</span>
          <LogoutButton />
        </header>
        <div className="admin-content">{children}</div>
      </div>
    </div>
  );
}
