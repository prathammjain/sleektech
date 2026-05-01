"use client";

import { useEffect } from "react";

// Global scroll-reveal: any element with data-reveal gets `.is-visible` once in view.
// Respects prefers-reduced-motion.
export default function ScrollReveal() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      document.querySelectorAll<HTMLElement>("[data-reveal]").forEach((el) => {
        el.classList.add("is-visible");
      });
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );

    document.querySelectorAll<HTMLElement>("[data-reveal]").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return null;
}
