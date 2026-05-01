"use client";

// Pure CSS animated gradient mesh — three drifting orbs.
// Lightweight, GPU-only (transform/opacity), pauses for reduced motion via globals.css.
export default function MeshBackground() {
  return (
    <div className="mesh-bg" aria-hidden="true">
      <div className="mesh-orb mesh-orb-a" />
      <div className="mesh-orb mesh-orb-b" />
      <div className="mesh-orb mesh-orb-c" />
      <div className="mesh-grain" />
    </div>
  );
}
