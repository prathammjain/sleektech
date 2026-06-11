"use client";

import { usePathname } from "next/navigation";
import MeshBackground from "./MeshBackground";
import ScrollAura from "./ScrollAura";
import SiteEffects from "./SiteEffects";
import ScrollReveal from "./ScrollReveal";

/**
 * Ambient marketing effects (animated mesh, scroll-reactive aurora, cursor/gyro
 * spotlight, scroll reveals). These are GPU-heavy by design and belong only on
 * the public site — they must NOT run on the admin dashboard, where they would
 * composite huge blur layers under data tables and tank performance.
 */
export default function SiteChrome() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;

  return (
    <>
      <MeshBackground />
      <ScrollAura />
      <SiteEffects />
      <ScrollReveal />
    </>
  );
}
