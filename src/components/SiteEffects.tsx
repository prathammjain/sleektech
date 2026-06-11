"use client";

import { useEffect } from "react";

/**
 * Ambient interaction effects:
 *  - Top scroll-progress stripe (data-progress)
 *  - Hero spotlight: follows the cursor on desktop, auto-sweeps on its own
 *    until you move (so it's never static), and follows device tilt on phones.
 *  - 3D tilt on [data-tilt] cards: cursor on desktop, gyroscope on mobile.
 *  - Magnetic pull on [data-magnetic] buttons (pointer only).
 * All effects are bypassed when prefers-reduced-motion is set.
 */
const clamp = (v: number, min: number, max: number) =>
  Math.max(min, Math.min(max, v));

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

    /* ---------- Page-wide cursor glow (follows the pointer everywhere) ---------- */
    const root = document.documentElement;
    let gx = window.innerWidth / 2;
    let gy = window.innerHeight * 0.3;
    let glowQueued = false;
    let glowRaf = 0;
    const applyGlow = () => {
      glowQueued = false;
      root.style.setProperty("--gx", `${gx}px`);
      root.style.setProperty("--gy", `${gy}px`);
    };
    const onGlowMove = (e: MouseEvent) => {
      gx = e.clientX;
      gy = e.clientY;
      if (!glowQueued) {
        glowQueued = true;
        glowRaf = requestAnimationFrame(applyGlow);
      }
    };
    applyGlow();
    window.addEventListener("mousemove", onGlowMove, { passive: true });
    cleanups.push(() => {
      window.removeEventListener("mousemove", onGlowMove);
      cancelAnimationFrame(glowRaf);
    });

    const hero = document.querySelector<HTMLElement>(".hero-section");
    const tiltEls = Array.from(document.querySelectorAll<HTMLElement>("[data-tilt]"));
    const magEls = Array.from(document.querySelectorAll<HTMLElement>("[data-magnetic]"));

    let pointerActive = false; // becomes true once a cursor or gyro drives it

    /* ---------- Hero cursor spotlight ---------- */
    if (hero) {
      const onMove = (e: MouseEvent) => {
        pointerActive = true;
        const rect = hero.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        hero.style.setProperty("--mx", `${x}%`);
        hero.style.setProperty("--my", `${y}%`);
      };
      hero.addEventListener("mousemove", onMove);
      cleanups.push(() => hero.removeEventListener("mousemove", onMove));
    }

    /* ---------- Auto-sweeping spotlight (until a pointer/gyro takes over) ----------
       Only runs while the hero is on screen, the tab is visible, and no pointer
       has taken over — so it never burns a rAF loop in the background. */
    let rafId = 0;
    let sweeping = false;
    let heroVisible = true;
    const t0 = performance.now();

    const shouldSweep = () =>
      Boolean(hero) && !pointerActive && heroVisible && !document.hidden;

    const autoSweep = (t: number) => {
      if (!shouldSweep()) {
        sweeping = false;
        return;
      }
      const s = (t - t0) / 1000;
      hero!.style.setProperty("--mx", `${50 + Math.sin(s * 0.42) * 32}%`);
      hero!.style.setProperty("--my", `${40 + Math.cos(s * 0.31) * 24}%`);
      rafId = requestAnimationFrame(autoSweep);
    };
    const startSweep = () => {
      if (sweeping || !shouldSweep()) return;
      sweeping = true;
      rafId = requestAnimationFrame(autoSweep);
    };

    if (hero) {
      const heroIO = new IntersectionObserver(
        ([entry]) => {
          heroVisible = entry.isIntersecting;
          startSweep();
        },
        { threshold: 0 },
      );
      heroIO.observe(hero);
      cleanups.push(() => heroIO.disconnect());
    }
    const onVisible = () => startSweep();
    document.addEventListener("visibilitychange", onVisible);
    cleanups.push(() => document.removeEventListener("visibilitychange", onVisible));

    startSweep();
    cleanups.push(() => cancelAnimationFrame(rafId));

    /* ---------- 3D tilt on cards (cursor) ---------- */
    tiltEls.forEach((el) => {
      const onMove = (e: MouseEvent) => {
        const rect = el.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        const max = 6;
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

    /* ---------- Magnetic buttons (pointer) ---------- */
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

    /* ---------- Gyroscope tilt + spotlight (mobile) ---------- */
    let baseBeta: number | null = null;
    let baseGamma: number | null = null;
    const onOrient = (e: DeviceOrientationEvent) => {
      if (e.beta == null || e.gamma == null) return;
      pointerActive = true; // hand the spotlight to the gyro
      if (baseBeta == null) {
        baseBeta = e.beta;
        baseGamma = e.gamma;
      }
      const dBeta = clamp(e.beta - baseBeta, -28, 28); // front/back
      const dGamma = clamp(e.gamma - baseGamma!, -28, 28); // left/right

      if (hero) {
        hero.style.setProperty("--mx", `${clamp(50 + dGamma * 1.7, 5, 95)}%`);
        hero.style.setProperty("--my", `${clamp(40 + dBeta * 1.3, 5, 95)}%`);
      }
      tiltEls.forEach((el) => {
        el.style.setProperty("--tx", `${clamp(-dBeta * 0.2, -7, 7).toFixed(2)}deg`);
        el.style.setProperty("--ty", `${clamp(dGamma * 0.2, -7, 7).toFixed(2)}deg`);
      });
    };

    const enableGyro = () => {
      document.body.classList.add("gyro-active");
      window.addEventListener("deviceorientation", onOrient);
      cleanups.push(() => {
        window.removeEventListener("deviceorientation", onOrient);
        document.body.classList.remove("gyro-active");
      });
    };

    type DOEStatic = typeof DeviceOrientationEvent & {
      requestPermission?: () => Promise<"granted" | "denied">;
    };
    const DOE =
      typeof DeviceOrientationEvent !== "undefined"
        ? (DeviceOrientationEvent as DOEStatic)
        : undefined;

    if (DOE && typeof DOE.requestPermission === "function") {
      // iOS 13+: permission must be requested from a user gesture.
      const ask = () => {
        DOE.requestPermission!()
          .then((state) => {
            if (state === "granted") enableGyro();
          })
          .catch(() => {});
        window.removeEventListener("touchend", ask);
        window.removeEventListener("click", ask);
      };
      window.addEventListener("touchend", ask, { once: true });
      window.addEventListener("click", ask, { once: true });
      cleanups.push(() => {
        window.removeEventListener("touchend", ask);
        window.removeEventListener("click", ask);
      });
    } else if (DOE) {
      enableGyro(); // Android and others: no permission needed
    }

    return () => {
      cleanups.forEach((fn) => fn());
    };
  }, []);

  return (
    <>
      <div className="cursor-glow" aria-hidden="true" />
      <div className="scroll-progress" data-progress aria-hidden="true" />
    </>
  );
}
