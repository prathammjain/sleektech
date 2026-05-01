"use client";

import { useEffect } from "react";

/**
 * Ambient interaction effects:
 *  - Top scroll-progress stripe (data-progress)
 *  - Cursor spotlight in the hero (--mx, --my CSS vars on .hero-section)
 *  - 3D tilt on [data-tilt] cards based on cursor position
 *  - Magnetic pull on [data-magnetic] buttons
 * All effects are bypassed when prefers-reduced-motion is set.
 */
export default function SiteEffects() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const cleanups: Array<() => void> = [];

    /* ---------- Scroll progress bar ---------- */
    const bar = document.querySelector<HTMLElement>("[data-progress]");
    const onScroll = () => {
      if (!bar) return;
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      const pct = max > 0 ? (h.scrollTop / max) * 100 : 0;
      bar.style.transform = `scaleX(${pct / 100})`;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    cleanups.push(() => window.removeEventListener("scroll", onScroll));

    /* ---------- Hero cursor spotlight ---------- */
    const hero = document.querySelector<HTMLElement>(".hero-section");
    if (hero) {
      const onMove = (e: MouseEvent) => {
        const rect = hero.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        hero.style.setProperty("--mx", `${x}%`);
        hero.style.setProperty("--my", `${y}%`);
      };
      hero.addEventListener("mousemove", onMove);
      cleanups.push(() => hero.removeEventListener("mousemove", onMove));
    }

    /* ---------- 3D tilt on cards ---------- */
    const tiltEls = Array.from(document.querySelectorAll<HTMLElement>("[data-tilt]"));
    tiltEls.forEach((el) => {
      const onMove = (e: MouseEvent) => {
        const rect = el.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        const max = 6; // degrees
        el.style.setProperty("--tx", `${(-y * max).toFixed(2)}deg`);
        el.style.setProperty("--ty", `${(x * max).toFixed(2)}deg`);
      };
      const onLeave = () => {
        el.style.setProperty("--tx", `0deg`);
        el.style.setProperty("--ty", `0deg`);
      };
      el.addEventListener("mousemove", onMove);
      el.addEventListener("mouseleave", onLeave);
      cleanups.push(() => {
        el.removeEventListener("mousemove", onMove);
        el.removeEventListener("mouseleave", onLeave);
      });
    });

    /* ---------- Magnetic buttons ---------- */
    const magEls = Array.from(document.querySelectorAll<HTMLElement>("[data-magnetic]"));
    magEls.forEach((el) => {
      const strength = 0.18;
      const onMove = (e: MouseEvent) => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        el.style.transform = `translate(${(x * strength).toFixed(1)}px, ${(y * strength).toFixed(1)}px)`;
      };
      const onLeave = () => {
        el.style.transform = "";
      };
      el.addEventListener("mousemove", onMove);
      el.addEventListener("mouseleave", onLeave);
      cleanups.push(() => {
        el.removeEventListener("mousemove", onMove);
        el.removeEventListener("mouseleave", onLeave);
      });
    });

    return () => {
      cleanups.forEach((fn) => fn());
    };
  }, []);

  return <div className="scroll-progress" data-progress aria-hidden="true" />;
}
