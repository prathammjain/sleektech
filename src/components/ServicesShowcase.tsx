"use client";

import { useEffect, useRef, useState } from "react";
import { RevealGroup, RevealItem, Reveal } from "./motion/Reveal";

type Service = {
  n: string;
  title: string;
  result: string;
  outcome: string;
  capabilities: string[];
  stack: string[];
};

const services: Service[] = [
  {
    n: "01",
    title: "Websites & Landing Pages",
    result: "Live in days",
    outcome: "Fast, modern marketing sites and landing pages built to convert.",
    capabilities: ["Design to build", "CMS & content", "SEO & analytics", "Edge performance"],
    stack: ["Next.js", "Tailwind", "Sanity", "Vercel"],
  },
  {
    n: "02",
    title: "Web Apps & SaaS",
    result: "~3 weeks to launch",
    outcome: "Full products with auth, billing and dashboards, built to scale.",
    capabilities: ["Auth & billing", "Dashboards", "Multi-tenancy", "Production infra"],
    stack: ["Next.js", "Postgres", "Stripe", "AWS"],
  },
  {
    n: "03",
    title: "Mobile Apps",
    result: "iOS + Android",
    outcome: "One codebase, both stores, a genuinely native feel.",
    capabilities: ["iOS & Android", "Push & deep links", "Offline first", "Store delivery"],
    stack: ["React Native", "Expo", "Reanimated", "EAS"],
  },
  {
    n: "04",
    title: "Automations",
    result: "Manual ops, gone",
    outcome: "Workflows that run themselves across all your tools.",
    capabilities: ["n8n workflows", "API & webhooks", "Scheduled jobs", "Integrations"],
    stack: ["n8n", "Webhooks", "Cron", "REST"],
  },
  {
    n: "05",
    title: "AI Agents & Chatbots",
    result: "Grounded in your data",
    outcome: "Agents and bots that know your docs and call your APIs to finish tasks.",
    capabilities: ["Tool-calling agents", "RAG chatbots", "Human handoff", "Evals & guardrails"],
    stack: ["Claude", "pgvector", "LangGraph", "Twilio"],
  },
  {
    n: "06",
    title: "Data & Internal Tools",
    result: "Decision-ready",
    outcome: "Pipelines, dashboards and admin tools your team actually trusts.",
    capabilities: ["ETL / ELT", "BI dashboards", "Admin panels", "Vector search"],
    stack: ["dbt", "BigQuery", "Metabase", "pgvector"],
  },
];

/** Distance between two snap points = card width + gap. 0 if not laid out yet. */
function stepOf(track: HTMLElement): number {
  const a = track.children.item(0) as HTMLElement | null;
  const b = track.children.item(1) as HTMLElement | null;
  if (!a || !b) return 0;
  return b.offsetLeft - a.offsetLeft;
}

export default function ServicesShowcase() {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const root = carouselRef.current;
    const track = root?.querySelector<HTMLElement>(".services-grid");
    if (!root || !track) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mobile = window.matchMedia("(max-width: 640px)");

    // Active dot follows the swipe (rAF-throttled, no churn).
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const step = stepOf(track);
        if (step <= 0) return;
        const i = Math.round(track.scrollLeft / step);
        setActive(Math.max(0, Math.min(services.length - 1, i)));
      });
    };
    track.addEventListener("scroll", onScroll, { passive: true });

    // One-time "it's swipeable" hint: nudge to card 2 and back. Mobile only,
    // never under reduced motion, and abandoned the moment the user takes over.
    let userTook = false;
    const timers: number[] = [];
    const restoreSnap = () => {
      track.style.scrollSnapType = "";
    };
    const markUser = () => {
      userTook = true;
      timers.forEach(window.clearTimeout);
      restoreSnap();
    };
    track.addEventListener("pointerdown", markUser, { once: true });
    track.addEventListener("touchstart", markUser, { once: true, passive: true });
    track.addEventListener("wheel", markUser, { once: true, passive: true });

    const runHint = () => {
      if (userTook || reduced || !mobile.matches) return;
      const step = stepOf(track);
      if (step <= 0) return;
      // Suspend snapping so the smooth scroll isn't yanked to a snap point.
      track.style.scrollSnapType = "none";
      timers.push(
        window.setTimeout(() => {
          if (userTook) return;
          track.scrollTo({ left: step, behavior: "smooth" });
          timers.push(
            window.setTimeout(() => {
              if (userTook) return;
              track.scrollTo({ left: 0, behavior: "smooth" });
              timers.push(window.setTimeout(restoreSnap, 700));
            }, 850),
          );
        }, 650),
      );
    };

    // Fire when the section first scrolls into view.
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          io.disconnect();
          runHint();
        }
      },
      { threshold: 0.4 },
    );
    io.observe(root);

    return () => {
      track.removeEventListener("scroll", onScroll);
      track.removeEventListener("pointerdown", markUser);
      track.removeEventListener("touchstart", markUser);
      track.removeEventListener("wheel", markUser);
      io.disconnect();
      if (raf) cancelAnimationFrame(raf);
      timers.forEach(window.clearTimeout);
    };
  }, []);

  const goTo = (i: number) => {
    const track = carouselRef.current?.querySelector<HTMLElement>(".services-grid");
    if (!track) return;
    const step = stepOf(track);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    track.scrollTo({ left: step * i, behavior: reduced ? "auto" : "smooth" });
  };

  return (
    <section id="services" className="section services-section">
      <Reveal as="div" className="section-header">
        <div className="tag">What we build</div>
        <h2>Software that ships outcomes, not hours.</h2>
        <p>
          Websites, web and mobile apps, automations and AI. Tell us the problem,
          we assemble a focused team and ship the system end to end.
        </p>
      </Reveal>

      <div className="services-carousel" ref={carouselRef}>
        <RevealGroup className="services-grid">
          {services.map((s) => (
            <RevealItem as="div" key={s.n} className="n-card service-card">
              <div className="service-card-top">
                <span className="service-index">{s.n}</span>
                <span className="service-result">{s.result}</span>
              </div>
              <h3>{s.title}</h3>
              <p className="service-outcome">{s.outcome}</p>
              <ul className="service-caps">
                {s.capabilities.map((c) => (
                  <li key={c}>{c}</li>
                ))}
              </ul>
              <div className="service-stack" aria-label="Stack">
                {s.stack.map((t) => (
                  <span className="stack-tag" key={t}>
                    {t}
                  </span>
                ))}
              </div>
            </RevealItem>
          ))}
        </RevealGroup>

        <div className="services-dots" aria-label="Slide between what we build">
          {services.map((s, i) => (
            <button
              key={s.n}
              type="button"
              className="services-dot"
              aria-label={`Show ${s.title}`}
              aria-current={active === i}
              onClick={() => goTo(i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
