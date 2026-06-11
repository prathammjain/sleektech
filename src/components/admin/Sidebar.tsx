"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links: { href: string; label: string; exact?: boolean; badgeKey?: string }[] = [
  { href: "/admin", label: "Overview", exact: true },
  { href: "/admin/leads", label: "Leads", badgeKey: "leads" },
  { href: "/admin/applications", label: "Applications", badgeKey: "applications" },
  { href: "/admin/clients", label: "Clients" },
  { href: "/admin/projects", label: "Projects" },
  { href: "/admin/deliverables", label: "Deliverables" },
  { href: "/admin/calls", label: "Calls", badgeKey: "calls" },
];

export default function Sidebar({ badges }: { badges: Record<string, number> }) {
  const pathname = usePathname();

  return (
    <aside className="admin-sidebar">
      <Link href="/admin" className="admin-brand logo-type">
        SleekTech
      </Link>
      <span className="admin-brand-sub">Operations</span>

      <nav className="admin-nav">
        {links.map((l) => {
          const active = l.exact ? pathname === l.href : pathname.startsWith(l.href);
          const count = l.badgeKey ? badges[l.badgeKey] ?? 0 : 0;
          return (
            <Link
              key={l.href}
              href={l.href}
              className={active ? "admin-nav-link active" : "admin-nav-link"}
            >
              {l.label}
              {count > 0 && <span className="admin-nav-badge">{count}</span>}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
