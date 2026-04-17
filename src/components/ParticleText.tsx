"use client";

import { useEffect, useRef } from "react";

interface Particle {
  ox: number; oy: number;   // origin / resting position
  x: number;  y: number;   // current position
  sx: number; sy: number;  // entrance start position
  vx: number; vy: number;  // velocity
  radius: number;
  bucket: number;           // opacity bucket index
  delay: number;            // entrance delay (0 – 1)
  sc: number;               // spring constant
}

// Pre-defined opacity levels for batch drawing (avoids per-particle fillStyle)
const BUCKET_ALPHAS = [0.10, 0.20, 0.34, 0.48, 0.60, 0.72, 0.83, 0.94];
const BUCKETS = BUCKET_ALPHAS.length;

function easeOutExpo(t: number) {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
}

interface ParticleTextProps {
  lines: string[];
  /** Scale factor for line-height. 1.02 is tight (display). Use 1.12 for section headings. */
  lineHeight?: number;
  /** Height-width ratio hint. Caps font size so short lines don't grow unreadably tall. */
  maxFontFraction?: number;
}

export default function ParticleText({
  lines,
  lineHeight = 1.02,
  maxFontFraction = 0.88,
}: ParticleTextProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // Store mutable state outside React state to avoid re-renders
  const internalRef = useRef<{
    particles: Particle[];
    buckets: Particle[][];
    mouse: { x: number; y: number };
    startTime: number;
    running: boolean;
    raf: number;
  }>({
    particles: [],
    buckets: Array.from({ length: BUCKETS }, () => []),
    mouse: { x: -9999, y: -9999 },
    startTime: 0,
    running: false,
    raf: 0,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const state = internalRef.current;
    state.running = true;

    // ── 1. Size the canvas to its container ─────────────────────────
    const DPR = Math.min(window.devicePixelRatio || 1, 2);
    const parent = canvas.parentElement!;
    const W = parent.clientWidth;
    const H = parent.clientHeight;

    canvas.width = W * DPR;
    canvas.height = H * DPR;
    canvas.style.width = W + "px";
    canvas.style.height = H + "px";
    ctx.scale(DPR, DPR);

    const PW = W * DPR; // pixel-canvas dimensions
    const PH = H * DPR;

    // ── 2. Build the particle system ─────────────────────────────────
    const build = async () => {
      await document.fonts.ready;

      // Offscreen canvas → letter mask
      const off = document.createElement("canvas");
      off.width = PW;
      off.height = PH;
      const octx = off.getContext("2d")!;

      // ─ compute font size that makes the longest line span ~88% width
      let fSize = PW * 0.55;
      octx.font = `700 ${fSize}px 'Space Grotesk', sans-serif`;
      const longestLine = lines.reduce((a, b) =>
        octx.measureText(a).width > octx.measureText(b).width ? a : b
      );
      fSize = ((PW * maxFontFraction) / octx.measureText(longestLine).width) * fSize;
      // Cap by available vertical space so short lines don't blow up
      const maxFSizeByHeight = (PH * 0.92) / (lines.length * lineHeight);
      fSize = Math.min(fSize, maxFSizeByHeight);

      octx.font = `700 ${fSize}px 'Space Grotesk', sans-serif`;
      octx.textAlign = "center";
      octx.textBaseline = "alphabetic";
      octx.fillStyle = "white";

      const lineH = fSize * lineHeight;
      const totalH = lineH * lines.length;
      const baseY = (PH - totalH) / 2 + fSize * 0.8;

      lines.forEach((line, i) => {
        octx.fillText(line, PW / 2, baseY + i * lineH);
      });

      // ─ sample pixel data for the letter mask
      const imgData = octx.getImageData(0, 0, PW, PH);
      const pixels = imgData.data;

      const isIn = (px: number, py: number): boolean => {
        const xi = Math.round(px);
        const yi = Math.round(py);
        if (xi < 0 || yi < 0 || xi >= PW || yi >= PH) return false;
        return pixels[(yi * PW + xi) * 4 + 3] > 100;
      };

      // count how many of 12 angular samples at radius r are inside
      const countNbr = (px: number, py: number, r: number): number => {
        let c = 0;
        for (let i = 0; i < 12; i++) {
          const a = (i / 12) * Math.PI * 2;
          if (isIn(px + Math.cos(a) * r, py + Math.sin(a) * r)) c++;
        }
        return c;
      };

      // ─ place particles on a jittered grid
      const STEP = DPR * 1.55; // grid step in pixel space
      const newParticles: Particle[] = [];

      for (let ppy = STEP * 0.5; ppy < PH; ppy += STEP) {
        for (let ppx = STEP * 0.5; ppx < PW; ppx += STEP) {
          const jx = ppx + (Math.random() - 0.5) * STEP * 0.75;
          const jy = ppy + (Math.random() - 0.5) * STEP * 0.75;
          const sx = jx / DPR; // screen-space coords
          const sy = jy / DPR;

          const inside = isIn(jx, jy);

          if (!inside) {
            // ── bleed zone: scattered particles just outside the letterform
            const c4 = countNbr(jx, jy, 4 * DPR);
            if (c4 === 0) continue;
            if (Math.random() > (c4 / 12) * 0.16) continue;

            newParticles.push({
              ox: sx, oy: sy,
              x: Math.random() * W, y: Math.random() * H,
              sx: Math.random() * W, sy: Math.random() * H,
              vx: 0, vy: 0,
              radius: 0.45 + Math.random() * 0.55,
              bucket: Math.floor(Math.random() * 2),
              delay: Math.random(),
              sc: 0.055 + Math.random() * 0.045,
            });
            continue;
          }

          // ── interior: density gradient from edge inward
          const c8 = countNbr(jx, jy, 8 * DPR);
          const edgeFactor = c8 / 12; // 0 = near edge, 1 = deep interior

          const density = 0.28 + edgeFactor * 0.54;
          if (Math.random() > density) continue;

          const extraR = Math.random() < 0.03 ? 1.05 : 0;
          const radius = 0.62 + Math.random() * 1.45 + extraR;

          const rawOpacity = 0.45 + edgeFactor * 0.5;
          const bucket = Math.min(BUCKETS - 1, Math.floor(rawOpacity * BUCKETS));

          newParticles.push({
            ox: sx, oy: sy,
            x: Math.random() * W, y: Math.random() * H,
            sx: Math.random() * W, sy: Math.random() * H,
            vx: 0, vy: 0,
            radius,
            bucket,
            delay: Math.random() * 0.65,
            sc: 0.038 + Math.random() * 0.082,
          });
        }
      }

      state.particles = newParticles;
      // Assign particles to opacity buckets
      for (let b = 0; b < BUCKETS; b++) state.buckets[b] = [];
      for (const p of newParticles) state.buckets[p.bucket].push(p);

      state.startTime = performance.now();
    };

    // ── 3. Mouse / touch events ──────────────────────────────────────
    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      state.mouse.x = e.clientX - rect.left;
      state.mouse.y = e.clientY - rect.top;
    };
    const onLeave = () => {
      state.mouse.x = -9999;
      state.mouse.y = -9999;
    };
    canvas.addEventListener("mousemove", onMove);
    canvas.addEventListener("mouseleave", onLeave);

    // ── 4. Render loop ───────────────────────────────────────────────
    const ENTRANCE_MS = 1700;
    const REPEL_R     = 105;
    const REPEL_F     = 68;

    const render = (ts: number) => {
      if (!state.running) return;
      state.raf = requestAnimationFrame(render);

      ctx.clearRect(0, 0, W, H);
      if (!state.particles.length) return;

      const elapsed = ts - state.startTime;
      const mx = state.mouse.x;
      const my = state.mouse.y;

      // Global fade-in during entrance so scattered particles don't pop
      const globalFade = easeOutExpo(Math.min(elapsed / (ENTRANCE_MS * 0.7), 1));

      // ─ batch draw per opacity bucket ────────────────────────────────
      for (let b = 0; b < BUCKETS; b++) {
        const bParticles = state.buckets[b];
        if (!bParticles.length) continue;

        const alpha = BUCKET_ALPHAS[b] * globalFade;
        if (alpha < 0.005) continue;

        ctx.fillStyle = `rgba(255,255,255,${alpha.toFixed(3)})`;
        ctx.beginPath();

        for (const p of bParticles) {
          // Compute per-particle entrance progress
          const eff = Math.max(0, elapsed - p.delay * 700);
          const t   = Math.min(eff / ENTRANCE_MS, 1);
          const et  = easeOutExpo(t);

          if (t < 1) {
            // Still converging toward origin
            p.x = p.sx + (p.ox - p.sx) * et;
            p.y = p.sy + (p.oy - p.sy) * et;
          } else {
            // Spring physics + mouse repulsion
            const dx    = p.x - mx;
            const dy    = p.y - my;
            const dist2 = dx * dx + dy * dy;

            if (dist2 < REPEL_R * REPEL_R) {
              const dist  = Math.sqrt(dist2) + 0.001;
              const force = (1 - dist / REPEL_R) * REPEL_F;
              p.vx += (dx / dist) * force * 0.20;
              p.vy += (dy / dist) * force * 0.20;
            }

            p.vx += (p.ox - p.x) * p.sc;
            p.vy += (p.oy - p.y) * p.sc;
            p.vx *= 0.79;
            p.vy *= 0.79;
            p.x  += p.vx;
            p.y  += p.vy;
          }

          ctx.moveTo(p.x + p.radius, p.y);
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        }

        ctx.fill();
      }
    };

    build().then(() => {
      state.raf = requestAnimationFrame(render);
    });

    return () => {
      state.running = false;
      cancelAnimationFrame(state.raf);
      canvas.removeEventListener("mousemove", onMove);
      canvas.removeEventListener("mouseleave", onLeave);
    };
  }, [lines, lineHeight, maxFontFraction]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        cursor: "crosshair",
      }}
    />
  );
}
