"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/admin", label: "Overview", exact: true },
  { href: "/admin/leads", label: "Leads" },
  { href: "/admin/applications", label: "Applications" },
  { href: "/admin/clients", label: "Clients" },
  { href: "/admin/projects", label: "Projects" },
  { href: "/admin/deliverables", label: "Deliverables" },
  { href: "/admin/calls", label: "Calls" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="admin-sidebar">
      <Link href="/admin" className="admin-brand logo-type">
        SleekTech
      </Link>
      <span className="admin-brand-sub">Operations</span>

      <nav className="admin-nav">
        {links.map((l) => {
          const active = l.exact
            ? pathname === l.href
            : pathname.startsWith(l.href);
          return (
            <Link
              key={l.href}
              href={l.href}
              className={active ? "admin-nav-link active" : "admin-nav-link"}
            >
              {l.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
