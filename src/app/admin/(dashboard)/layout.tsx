import type { ReactNode } from "react";
import Sidebar from "@/components/admin/Sidebar";
import LogoutButton from "@/components/admin/LogoutButton";
import "../admin.css";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "SleekTech — Admin",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="admin-shell">
      <Sidebar />
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
