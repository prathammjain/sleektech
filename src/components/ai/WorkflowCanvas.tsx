"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "motion/react";

/**
 * A live "n8n" automation graph. Nodes execute left-to-right in a loop:
 * a webhook fires, a Claude agent qualifies the lead, an IF branches, and the
 * result is pushed to Slack + Postgres. Edges carry traveling data packets and
 * a constant current; nodes pulse as they fire. Everything is SVG so it scales
 * cleanly, and all motion stops under prefers-reduced-motion.
 */

type Node = {
  id: string;
  x: number;
  y: number;
  tag: string;
  name: string;
  step: number;
};

const W = 176;
const H = 64;

const nodes: Node[] = [
  { id: "hook", x: 24, y: 158, tag: "Trigger", name: "Webhook", step: 0 },
  { id: "agent", x: 256, y: 158, tag: "AI · Claude", name: "Qualify agent", step: 1 },
  { id: "if", x: 470, y: 158, tag: "Logic", name: "Score ≥ 70?", step: 2 },
  { id: "slack", x: 720, y: 60, tag: "Action", name: "Notify #sales", step: 3 },
  { id: "pg", x: 720, y: 256, tag: "Data", name: "Save to CRM", step: 3 },
];

const edges: { d: string; step: number }[] = [
  { d: "M200,190 L256,190", step: 1 },
  { d: "M432,190 L470,190", step: 2 },
  { d: "M646,190 C690,190 676,92 720,92", step: 3 },
  { d: "M646,190 C690,190 676,288 720,288", step: 3 },
];

const TOTAL_STEPS = 4;

export default function WorkflowCanvas() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.4 });
  const reduced = useReducedMotion();
  const [active, setActive] = useState(reduced ? TOTAL_STEPS - 1 : 0);

  useEffect(() => {
    if (reduced || !inView) return;
    const t = setInterval(() => {
      setActive((s) => (s + 1) % (TOTAL_STEPS + 1)); // +1 = brief "idle" beat
    }, 920);
    return () => clearInterval(t);
  }, [inView, reduced]);

  return (
    <div ref={ref} className="wf">
      <div className="wf-bar">
        <span className="wf-dot" />
        <span className="wf-bar-title">lead-intake.workflow</span>
        <span className="wf-bar-status">{reduced ? "ready" : "running"}</span>
      </div>

      <svg className="wf-svg" viewBox="0 0 960 380" role="img"
        aria-label="An automated workflow: webhook to AI agent to branch to Slack and database">
        <defs>
          <linearGradient id="wf-flow" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#FFC700" />
            <stop offset="55%" stopColor="#FF6A1A" />
            <stop offset="100%" stopColor="#FF2D4F" />
          </linearGradient>
        </defs>

        {/* edges */}
        {edges.map((e, i) => {
          const hot = !reduced && e.step <= active && active < TOTAL_STEPS;
          return (
            <g key={i}>
              <path className="wf-edge" d={e.d} />
              <path
                className={hot ? "wf-edge-flow hot" : "wf-edge-flow"}
                d={e.d}
              />
              {hot && (
                <circle className="wf-packet" r="3.5">
                  <animateMotion dur="0.9s" repeatCount="indefinite" path={e.d} />
                </circle>
              )}
            </g>
          );
        })}

        {/* nodes */}
        {nodes.map((n) => {
          const done = reduced || n.step < active;
          const firing = !reduced && n.step === active && active < TOTAL_STEPS;
          const state = firing ? "firing" : done ? "done" : "idle";
          return (
            <g key={n.id} className={`wf-node wf-node--${state}`}>
              <rect x={n.x} y={n.y} width={W} height={H} rx="13" />
              <circle className="wf-node-dot" cx={n.x + 17} cy={n.y + H / 2} r="4.5" />
              <text className="wf-node-tag" x={n.x + 32} y={n.y + 26}>
                {n.tag.toUpperCase()}
              </text>
              <text className="wf-node-name" x={n.x + 32} y={n.y + 45}>
                {n.name}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
