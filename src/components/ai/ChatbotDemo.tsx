"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "motion/react";

/**
 * A support chatbot demo. A scripted exchange plays out — user messages land,
 * a typing indicator shows, then the bot's reply streams in — and loops. The
 * conversation is about what we actually ship (RAG, handoff, WhatsApp), so it
 * doubles as a capability statement.
 */

type Msg = { from: "user" | "bot"; text: string };

const script: Msg[] = [
  { from: "user", text: "Do you build WhatsApp support bots?" },
  {
    from: "bot",
    text: "Yes. RAG over your docs, human handoff, deployed on your own number.",
  },
  { from: "user", text: "Can it pull live order status?" },
  { from: "bot", text: "It calls your API mid-chat. Tools, not canned replies." },
  { from: "user", text: "How fast can we go live?" },
  { from: "bot", text: "A working bot in ~5 days. Want a demo this week?" },
];

export default function ChatbotDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.4 });
  const reduced = useReducedMotion();

  const [shown, setShown] = useState<Msg[]>(reduced ? script : []);
  const [typing, setTyping] = useState(false);

  useEffect(() => {
    if (reduced || !inView) return;
    let cancelled = false;
    const timers: ReturnType<typeof setTimeout>[] = [];
    const wait = (ms: number) =>
      new Promise<void>((res) => timers.push(setTimeout(res, ms)));

    (async () => {
      // eslint-disable-next-line no-constant-condition
      while (!cancelled) {
        setShown([]);
        setTyping(false);
        await wait(700);
        for (const m of script) {
          if (cancelled) return;
          if (m.from === "bot") {
            setTyping(true);
            await wait(900 + m.text.length * 12);
            if (cancelled) return;
            setTyping(false);
          } else {
            await wait(650);
          }
          setShown((prev) => [...prev, m]);
          await wait(500);
        }
        await wait(3000);
      }
    })();

    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
    };
  }, [inView, reduced]);

  return (
    <div ref={ref} className="chat">
      <div className="chat-bar">
        <span className="chat-avatar">S</span>
        <div className="chat-bar-meta">
          <span className="chat-bar-name">SleekBot</span>
          <span className="chat-bar-status">
            <span className="chat-online" /> online · replies instantly
          </span>
        </div>
      </div>
      <div className="chat-body">
        {shown.map((m, i) => (
          <div key={i} className={`chat-msg chat-msg--${m.from}`}>
            {m.text}
          </div>
        ))}
        {typing && (
          <div className="chat-msg chat-msg--bot chat-typing">
            <span />
            <span />
            <span />
          </div>
        )}
      </div>
      <div className="chat-input">
        <span>Ask anything…</span>
        <span className="chat-send">↑</span>
      </div>
    </div>
  );
}
