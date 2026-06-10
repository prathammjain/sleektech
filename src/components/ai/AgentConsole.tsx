"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "motion/react";

/**
 * A terminal that streams a real-feeling AI agent trace — prompt, reasoning,
 * tool calls and results — typed character-by-character, then loops. Reads like
 * an actual agent run, which is the point: proof over adjectives.
 */

type Kind = "cmd" | "think" | "tool" | "ok" | "done";
type Line = { kind: Kind; text: string };

const script: Line[] = [
  { kind: "cmd", text: "agent.run(\"triage inbound lead\")" },
  { kind: "think", text: "reasoning · is this a fit, and how hot?" },
  { kind: "tool", text: "→ enrich_company(domain: acme.io)" },
  { kind: "ok", text: "✓ ACME · Series A · fintech · 80 staff" },
  { kind: "tool", text: "→ score_lead(signals)" },
  { kind: "ok", text: "✓ score 87 / 100, hot lead" },
  { kind: "tool", text: "→ draft_reply() · route_to(\"sales\")" },
  { kind: "done", text: "✓ handled in 1.4s · 3 tools · 0 humans" },
];

const SPEED: Record<Kind, number> = {
  cmd: 26,
  think: 16,
  tool: 16,
  ok: 10,
  done: 14,
};

export default function AgentConsole() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.4 });
  const reduced = useReducedMotion();

  const [done, setDone] = useState<Line[]>(reduced ? script : []);
  const [partial, setPartial] = useState<Line | null>(null);

  useEffect(() => {
    if (reduced || !inView) return;
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout>;
    const out: Line[] = [];
    let li = 0;
    let ci = 0;

    const tick = () => {
      if (cancelled) return;
      if (li >= script.length) {
        timer = setTimeout(() => {
          if (cancelled) return;
          out.length = 0;
          li = 0;
          ci = 0;
          setDone([]);
          setPartial(null);
          tick();
        }, 2800);
        return;
      }
      const line = script[li];
      if (ci <= line.text.length) {
        setPartial({ kind: line.kind, text: line.text.slice(0, ci) });
        ci += 1;
        timer = setTimeout(tick, SPEED[line.kind]);
      } else {
        out.push(line);
        setDone(out.slice());
        setPartial(null);
        li += 1;
        ci = 0;
        timer = setTimeout(tick, 320);
      }
    };

    timer = setTimeout(tick, 500);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [inView, reduced]);

  return (
    <div ref={ref} className="term">
      <div className="term-bar">
        <span className="term-traffic" />
        <span className="term-traffic" />
        <span className="term-traffic" />
        <span className="term-bar-title">claude-agent · session</span>
      </div>
      <div className="term-body">
        {done.map((l, i) => (
          <Row key={i} line={l} />
        ))}
        {partial && <Row line={partial} cursor />}
        {!partial && !reduced && done.length < script.length && (
          <span className="term-cursor" />
        )}
      </div>
    </div>
  );
}

function Row({ line, cursor }: { line: Line; cursor?: boolean }) {
  return (
    <p className={`term-line term-line--${line.kind}`}>
      <span>{line.text}</span>
      {cursor && <span className="term-cursor" />}
    </p>
  );
}
