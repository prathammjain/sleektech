"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * A single word that flips through a list on a timer. Time-driven, so it plays
 * everywhere including touch devices. Place it at the end of a line so the
 * per-word width change doesn't shove neighbouring text around.
 */
export default function RotatingWord({
  words,
  interval = 1900,
  className = "",
}: {
  words: string[];
  interval?: number;
  className?: string;
}) {
  const reduced = useReducedMotion();
  const [i, setI] = useState(0);

  useEffect(() => {
    if (reduced) return;
    const t = setInterval(() => setI((p) => (p + 1) % words.length), interval);
    return () => clearInterval(t);
  }, [reduced, words.length, interval]);

  if (reduced) {
    return <span className={`rotor-word ${className}`}>{words[0]}</span>;
  }

  return (
    <span className="rotor">
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={words[i]}
          className={`rotor-word ${className}`}
          initial={{ y: "0.75em", opacity: 0, filter: "blur(7px)" }}
          animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
          exit={{ y: "-0.75em", opacity: 0, filter: "blur(7px)" }}
          transition={{ duration: 0.45, ease: EASE }}
        >
          {words[i]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
