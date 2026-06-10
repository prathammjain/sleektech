"use client";

import WorkflowCanvas from "./WorkflowCanvas";
import AgentConsole from "./AgentConsole";
import ChatbotDemo from "./ChatbotDemo";
import { Reveal } from "../motion/Reveal";

/**
 * "Watch the work happen" — the AI-first proof section. Three auto-playing,
 * real-feeling demos (an n8n automation, an agent trace, a chatbot) plus a
 * line on AI-enabled teams. Designed so visitors feel the company ships this,
 * rather than reading a wall of AI buzzwords.
 */
export default function AILab() {
  return (
    <section id="ai-lab" className="section ai-lab">
      <Reveal as="div" className="section-header">
        <div className="tag">AI, running live</div>
        <h2>This isn&apos;t a deck. It&apos;s the product.</h2>
        <p>
          Everything below is the real thing — an automation executing, an agent
          reasoning, a bot answering. We build these every week. Watch.
        </p>
      </Reveal>

      <Reveal as="div" className="lab-card lab-card--wide">
        <div className="lab-card-head">
          <span className="lab-pill">n8n Automations</span>
          <p>A lead hits a webhook and gets qualified, routed and stored — no human in the loop.</p>
        </div>
        <WorkflowCanvas />
      </Reveal>

      <div className="lab-grid">
        <Reveal as="div" className="lab-card" delay={0.05}>
          <div className="lab-card-head">
            <span className="lab-pill">AI Agents</span>
            <p>Agents that call tools, make decisions and finish the task — not just chat.</p>
          </div>
          <AgentConsole />
        </Reveal>

        <Reveal as="div" className="lab-card" delay={0.12}>
          <div className="lab-card-head">
            <span className="lab-pill">AI Chatbots</span>
            <p>Support and sales bots grounded in your data, wired to your APIs.</p>
          </div>
          <ChatbotDemo />
        </Reveal>
      </div>

      <Reveal as="div" className="lab-teams">
        <div className="lab-teams-pill">
          <span className="lab-pill">AI-Enabled Teams</span>
        </div>
        <p>
          Every squad ships with agents in the loop — drafting, testing, monitoring,
          automating the busywork. <strong>Engineers handle judgment. Agents handle
          the rest.</strong> You get the output of a bigger team, without the headcount.
        </p>
      </Reveal>
    </section>
  );
}
