"use client";

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
    title: "AI Agents",
    result: "Tools, not chat",
    outcome: "Agents that call your tools, make decisions and finish the task end-to-end.",
    capabilities: ["Tool-calling agents", "Multi-step workflows", "Evals & guardrails", "Human-in-the-loop"],
    stack: ["Claude", "LangGraph", "MCP", "pgvector"],
  },
  {
    n: "02",
    title: "n8n Automations",
    result: "No human in the loop",
    outcome: "Workflows that run themselves — triggers, branches, AI steps, all wired up.",
    capabilities: ["Workflow design", "API & webhook glue", "Scheduled jobs", "Self-hosted n8n"],
    stack: ["n8n", "Webhooks", "Cron", "REST"],
  },
  {
    n: "03",
    title: "AI Chatbots",
    result: "Grounded in your data",
    outcome: "Support & sales bots that know your docs and call your APIs mid-chat.",
    capabilities: ["RAG over your docs", "WhatsApp / web / Slack", "Live API tool calls", "Human handoff"],
    stack: ["Claude", "pgvector", "Twilio", "Next.js"],
  },
  {
    n: "04",
    title: "AI-Enabled Teams",
    result: "Bigger team, no headcount",
    outcome: "Squads that ship with agents in the loop — drafting, testing, monitoring.",
    capabilities: ["Agent-augmented squads", "AI code review", "Automated QA", "24/7 monitoring"],
    stack: ["Cursor", "CI/CD", "Sentry", "Slack"],
  },
  {
    n: "05",
    title: "SaaS MVPs & Platforms",
    result: "~3 weeks to launch",
    outcome: "Zero-to-one products — AI-native by default, built to scale past launch.",
    capabilities: ["Auth & billing", "Dashboards", "Full-stack builds", "Production infra"],
    stack: ["Next.js", "Postgres", "Stripe", "AWS"],
  },
  {
    n: "06",
    title: "Data & Dashboards",
    result: "Decision-ready",
    outcome: "Move it, model it, surface it — plus vector search to make it AI-ready.",
    capabilities: ["ETL / ELT", "Warehousing", "BI dashboards", "Vector search"],
    stack: ["dbt", "BigQuery", "pgvector", "Metabase"],
  },
];

export default function ServicesShowcase() {
  return (
    <section id="services" className="section services-section">
      <Reveal as="div" className="section-header">
        <div className="tag">What we build</div>
        <h2>AI that ships outcomes, not hours.</h2>
        <p>
          Agents, automations and chatbots are the core of what we do — wrapped in
          full-stack engineering and run by teams that build with AI every day.
        </p>
      </Reveal>

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
    </section>
  );
}
