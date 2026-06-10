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

export default function ServicesShowcase() {
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
