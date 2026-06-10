"use client";

import WorkflowCanvas from "./WorkflowCanvas";
import AgentConsole from "./AgentConsole";
import ChatbotDemo from "./ChatbotDemo";
import { Reveal } from "../motion/Reveal";

/**
 * "Under the hood" proof section. A few of the harder things we ship, running
 * live: an automation, an agent, a chatbot. Kept as one section among the
 * software work, not the whole story. All demos are reduced-motion safe.
 */
export default function AILab() {
  return (
    <section id="ai-lab" className="section ai-lab">
      <Reveal as="div" className="section-header">
        <div className="tag">Under the hood</div>
        <h2>Some of the harder stuff, running live.</h2>
        <p>
          A peek at things we ship beyond the usual build. An automation, an agent,
          a chatbot. Not slides, the real thing.
        </p>
      </Reveal>

      <Reveal as="div" className="lab-card lab-card--wide">
        <div className="lab-card-head">
          <span className="lab-pill">Automation</span>
          <p>A lead hits a webhook, gets qualified, routed and stored. No human in the loop.</p>
        </div>
        <WorkflowCanvas />
      </Reveal>

      <div className="lab-grid">
        <Reveal as="div" className="lab-card" delay={0.05}>
          <div className="lab-card-head">
            <span className="lab-pill">AI Agent</span>
            <p>Agents that call tools, make decisions and finish the task.</p>
          </div>
          <AgentConsole />
        </Reveal>

        <Reveal as="div" className="lab-card" delay={0.12}>
          <div className="lab-card-head">
            <span className="lab-pill">Chatbot</span>
            <p>Support and sales bots grounded in your data, wired to your APIs.</p>
          </div>
          <ChatbotDemo />
        </Reveal>
      </div>
    </section>
  );
}
