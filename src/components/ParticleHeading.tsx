"use client";

import { useEffect, useRef, useState } from "react";
import ParticleText from "./ParticleText";

interface ParticleHeadingProps {
  lines: string[];
  /** Visual height of the heading canvas container. */
  height?: string;
  /** Tight display vs slightly looser for multi-line section headings. */
  lineHeight?: number;
  maxFontFraction?: number;
  className?: string;
}

/**
 * Lazy-mounts a ParticleText canvas when the element scrolls into view.
 * Also keeps regular text rendered (screen-reader only) for accessibility.
 */
export default function ParticleHeading({
  lines,
  height = "clamp(150px, 22vh, 280px)",
  lineHeight = 1.1,
  maxFontFraction = 0.9,
  className = "",
}: ParticleHeadingProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setMounted(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px 0px", threshold: 0 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={wrapRef}
      className={`particle-heading ${className}`}
      style={{ height }}
    >
      {/* Accessible text for screen readers / SEO */}
      <h2 className="sr-only">{lines.join(" ")}</h2>
      {mounted && (
        <ParticleText
          lines={lines}
          lineHeight={lineHeight}
          maxFontFraction={maxFontFraction}
        />
      )}
    </div>
  );
}
