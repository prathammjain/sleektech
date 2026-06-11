"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";

/**
 * Two large, blurred flame blobs fixed behind the page that drift and rotate as
 * you scroll. Scroll-driven (not pointer), so it gives the whole site a sense
 * of depth and life on touch devices as well as desktop.
 */
export default function ScrollAura() {
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll();

  const y1 = useTransform(scrollYProgress, [0, 1], ["-6%", "46%"]);
  const y2 = useTransform(scrollYProgress, [0, 1], ["8%", "-34%"]);
  const x1 = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const rot = useTransform(scrollYProgress, [0, 1], [0, 50]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1.25, 1]);

  if (reduced) return null;

  return (
    <div className="scroll-aura" aria-hidden="true">
      <motion.div
        className="aura-blob aura-blob-1"
        style={{ y: y1, x: x1, rotate: rot, scale }}
      />
      <motion.div className="aura-blob aura-blob-2" style={{ y: y2 }} />
    </div>
  );
}
