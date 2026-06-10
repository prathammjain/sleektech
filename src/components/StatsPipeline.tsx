"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";

type Stat = { value: number; suffix: string; label: string };

const stats: Stat[] = [
  { value: 24, suffix: "h", label: "Brief → team, turnaround" },
  { value: 3, suffix: "wk", label: "Average MVP build" },
  { value: 40, suffix: "%", label: "Typical cost cut vs. hiring" },
  { value: 100, suffix: "%", label: "Production-ready handoff" },
];

const stages = ["Brief", "Team", "Build", "Ship"];

function CountUp({ value, suffix }: { value: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduced = useReducedMotion();
  const [n, setN] = useState(reduced ? value : 0);

  useEffect(() => {
    if (reduced || !inView) return;
    const duration = 1100;
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      // easeOutExpo
      const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
      setN(Math.round(eased * value));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, reduced, value]);

  return (
    <span ref={ref} className="stat-value">
      {n}
      <span className="stat-suffix">{suffix}</span>
    </span>
  );
}

export default function StatsPipeline() {
  const reduced = useReducedMotion();
  const wrapRef = useRef<HTMLDivElement>(null);
  const inView = useInView(wrapRef, { once: true, amount: 0.4 });

  return (
    <section className="section pipeline-section">
      <div ref={wrapRef} className="pipeline-wrap n-lg">
        <div className="pipeline-head">
          <span className="how-pill">How we deliver</span>
          <h3>From brief to production, on a tight loop.</h3>
        </div>

        {/* Animated build pipeline */}
        <div className="pipeline" role="img" aria-label="Brief to Team to Build to Ship">
          <div className="pipeline-track">
            {!reduced && (
              <motion.span
                className="pipeline-pulse"
                initial={{ left: "0%" }}
                animate={inView ? { left: "100%" } : { left: "0%" }}
                transition={{
                  duration: 2.6,
                  ease: "easeInOut",
                  repeat: Infinity,
                  repeatType: "loop",
                }}
              />
            )}
          </div>
          <div className="pipeline-nodes">
            {stages.map((s, i) => (
              <motion.div
                key={s}
                className="pipeline-node"
                initial={reduced ? false : { opacity: 0, scale: 0.6 }}
                animate={
                  reduced
                    ? undefined
                    : inView
                      ? { opacity: 1, scale: 1 }
                      : { opacity: 0, scale: 0.6 }
                }
                transition={{ delay: 0.15 * i, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              >
                <span className="pipeline-dot" />
                <span className="pipeline-label">{s}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Count-up stats */}
        <div className="stats-grid">
          {stats.map((s) => (
            <div className="stat" key={s.label}>
              <CountUp value={s.value} suffix={s.suffix} />
              <span className="stat-label">{s.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
