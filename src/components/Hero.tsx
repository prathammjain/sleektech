"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";
import ApplyModal from "./ApplyModal";

const EASE = [0.16, 1, 0.3, 1] as const;

/** Headline lines. The accented words get the flame gradient. */
const LINES: { text: string; accent?: boolean }[][] = [
  [{ text: "We" }, { text: "build" }, { text: "software" }],
  [{ text: "that", accent: true }, { text: "just", accent: true }, { text: "works.", accent: true }],
];

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.1 } },
};

const word: Variants = {
  hidden: { opacity: 0, y: "0.5em", filter: "blur(6px)" },
  show: {
    opacity: 1,
    y: "0em",
    filter: "blur(0px)",
    transition: { duration: 0.7, ease: EASE },
  },
};

const fade: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};

export default function Hero() {
  const reduced = useReducedMotion();

  return (
    <section id="hero" className="hero-section">
      <div className="hero-grid">
        <motion.div
          className="hero-copy"
          variants={reduced ? undefined : container}
          initial={reduced ? undefined : "hidden"}
          animate={reduced ? undefined : "show"}
        >
          <motion.div className="tag" variants={reduced ? undefined : fade}>
            Software engineering collective · India + remote
          </motion.div>

          <h1 className="hero-headline">
            {LINES.map((line, li) => (
              <span className="hero-line" key={li}>
                {line.map((w, wi) => (
                  <motion.span
                    className={w.accent ? "hero-word accent" : "hero-word"}
                    key={`${li}-${wi}`}
                    variants={reduced ? undefined : word}
                  >
                    {w.text}
                  </motion.span>
                ))}
              </span>
            ))}
          </h1>

          <motion.p variants={reduced ? undefined : fade}>
            Websites, web and mobile apps, automations and the AI inside them. We
            design, build and ship production software for teams that need execution.
          </motion.p>

          <motion.p className="hero-pillars" variants={reduced ? undefined : fade}>
            Design. Build. Ship. No theatre.
          </motion.p>

          <motion.div className="hero-cta" variants={reduced ? undefined : fade}>
            <a href="#services" className="btn-primary" data-magnetic>
              See what we build →
            </a>
            <a href="#for-companies" className="btn-primary dark">
              Start a project
            </a>
          </motion.div>

          <motion.div
            className="hero-engineer-line"
            variants={reduced ? undefined : fade}
          >
            <span>Engineer?</span>
            <ApplyModal
              triggerClassName="hero-text-link"
              triggerLabel="Join the collective →"
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
