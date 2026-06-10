"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";
import type { ReactNode } from "react";

/**
 * Lightweight scroll-reveal primitives built on Framer Motion.
 *
 *  - <Reveal>      single element that fades + lifts into view
 *  - <RevealGroup> parent that staggers its <RevealItem> children
 *  - <RevealItem>  a staggered child (must sit inside a RevealGroup)
 *
 * All motion is disabled under prefers-reduced-motion — content renders
 * statically with no transforms.
 */

const EASE = [0.16, 1, 0.3, 1] as const;

type Tag = "div" | "section" | "ul" | "li" | "span" | "h2" | "p";

const MOTION = {
  div: motion.div,
  section: motion.section,
  ul: motion.ul,
  li: motion.li,
  span: motion.span,
  h2: motion.h2,
  p: motion.p,
} as const;

type RevealProps = {
  children: ReactNode;
  as?: Tag;
  className?: string;
  delay?: number;
  y?: number;
  /** viewport amount before triggering (0–1) */
  amount?: number;
  id?: string;
};

export function Reveal({
  children,
  as = "div",
  className,
  delay = 0,
  y = 28,
  amount = 0.2,
  id,
}: RevealProps) {
  const reduced = useReducedMotion();
  const M = MOTION[as];

  if (reduced) {
    const Plain = as;
    return (
      <Plain className={className} id={id}>
        {children}
      </Plain>
    );
  }

  return (
    <M
      id={id}
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount }}
      transition={{ duration: 0.7, ease: EASE, delay }}
    >
      {children}
    </M>
  );
}

const groupVariants: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.09, delayChildren: 0.05 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};

type RevealGroupProps = {
  children: ReactNode;
  as?: Tag;
  className?: string;
  amount?: number;
};

export function RevealGroup({
  children,
  as = "div",
  className,
  amount = 0.15,
}: RevealGroupProps) {
  const reduced = useReducedMotion();
  const M = MOTION[as];

  if (reduced) {
    const Plain = as;
    return <Plain className={className}>{children}</Plain>;
  }

  return (
    <M
      className={className}
      variants={groupVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount }}
    >
      {children}
    </M>
  );
}

export function RevealItem({
  children,
  as = "div",
  className,
}: {
  children: ReactNode;
  as?: Tag;
  className?: string;
}) {
  const reduced = useReducedMotion();
  const M = MOTION[as];

  if (reduced) {
    const Plain = as;
    return <Plain className={className}>{children}</Plain>;
  }

  return (
    <M className={className} variants={itemVariants}>
      {children}
    </M>
  );
}
