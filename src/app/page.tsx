import ApplyModal, { ApplyModalProvider } from "@/components/ApplyModal";
import BusinessForm from "@/components/BusinessForm";

const companySteps = [
  { n: "01", title: "Submit your project", body: "Drop us a brief. Scope, stack, timelines — anything you have." },
  { n: "02", title: "Get a curated team", body: "Backend, frontend, AI, DevOps — assembled around your problem." },
  { n: "03", title: "Track progress transparently", body: "Async updates, live milestones, no monthly status theatre." },
  { n: "04", title: "Receive production-ready delivery", body: "Shipped to prod. Documented. Handed off cleanly." },
];

const engineerSteps = [
  { n: "01", title: "Apply & get vetted", body: "We look at what you've built — not where you went to school." },
  { n: "02", title: "Join project-based teams", body: "Slot into a small, focused squad with a real client outcome." },
  { n: "03", title: "Work async, flexible hours", body: "Moonlighting allowed. Output matters, not your calendar." },
  { n: "04", title: "Get paid per milestone", body: "Transparent payouts tied to contribution. No exclusivity." },
];

const differentiators = [
  { left: "Teams", right: "Individuals" },
  { left: "Output", right: "Interviews" },
  { left: "Proof of work", right: "Resumes" },
  { left: "Speed", right: "Hiring cycles" },
  { left: "Flexibility", right: "9–5" },
];

const useCases = [
  { title: "SaaS MVPs", body: "Zero-to-one product builds with auth, billing, dashboards." },
  { title: "AI-powered tools", body: "LLM features, RAG pipelines, custom agents wired into your stack." },
  { title: "Internal automation", body: "Replace manual ops with workflows that actually run." },
  { title: "Data pipelines & dashboards", body: "Move data, model it, surface it. End to end." },
  { title: "Full-stack platforms", body: "Production-grade systems built to scale past launch." },
];

const tickerItems = [
  "SaaS MVPs",
  "AI Agents",
  "RAG Pipelines",
  "Internal Tools",
  "Data Dashboards",
  "Workflow Automation",
  "Mobile Apps",
  "API Integrations",
  "DevOps & Infra",
];

const earlyResults = [
  { quote: "Built MVP in 3 weeks with a 4-person team.", who: "Seed-stage founder" },
  { quote: "Cut development cost by 40%.", who: "Series A operations lead" },
  { quote: "Shipped faster than our in-house team.", who: "VP Engineering, fintech" },
];

export default function Home() {
  return (
    <ApplyModalProvider>
      <div className="landing-shell">
        <nav className="landing-nav">
          <a href="#hero" className="logo-type">SleekTech</a>
          <div className="nav-links">
            <a href="#problem">Problem</a>
            <a href="#solution">Solution</a>
            <a href="#how">How it works</a>
            <a href="#use-cases">What we build</a>
            <a href="#pricing">Model</a>
          </div>
          <ApplyModal triggerClassName="btn-primary" triggerLabel="Join the Collective" />
        </nav>

        <main>
          {/* HERO */}
          <section id="hero" className="hero-section">
            <div className="hero-grid">
              <div className="hero-copy" data-reveal>
                <div className="tag">Engineering collective · India + remote</div>
                <h1>
                  Build with elite engineers.
                  <br />
                  Work like a startup.
                  <br />
                  Get paid per project.
                </h1>
                <p>
                  SleekTech is a modern engineering collective where companies get execution-ready teams,
                  and engineers earn through real-world projects — not broken hiring pipelines.
                </p>
                <p className="hero-pillars">
                  No resumes. No hiring delays. Pre-vetted teams with SLEEK execution.
                </p>
                <div className="hero-cta">
                  <a
                    href="#for-companies"
                    className="btn-primary"
                    data-magnetic
                  >
                    For Companies → Hire a Team
                  </a>
                  <ApplyModal
                    triggerClassName="btn-primary dark"
                    triggerLabel="For Engineers → Join the Collective"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* PROBLEM */}
          <section id="problem" className="section" data-reveal>
            <div className="section-header">
              <div className="tag">The problem</div>
              <h2>The old system is broken.</h2>
              <p>
                Hiring is slow, expensive and unreliable. Freelancing is chaotic and solo —
                companies do not trust random developers.
              </p>
            </div>
            <p className="punchline">
              <span className="punchline-marker" /> Everyone is stuck. No one is winning.
            </p>
          </section>

          {/* SOLUTION */}
          <section id="solution" className="section" data-reveal>
            <div className="section-header">
              <div className="tag">The solution</div>
              <h2>A sleek way to build and work.</h2>
              <p>
                SleekTech is not a company. It is a high-performance engineering network.
              </p>
            </div>
            <ul className="solution-list">
              <li>Form small, focused teams per project</li>
              <li>Match skills → real client needs</li>
              <li>Pay engineers based on project contribution</li>
              <li>Enable parallel work — moonlighting allowed</li>
              <li>Deliver production-ready outcomes, not experiments</li>
            </ul>
            <p className="key-line">
              Think startup execution teams, not freelancers.
            </p>
          </section>

          {/* TICKER */}
          <div className="marquee" aria-hidden="true">
            <div className="marquee-track">
              {[...tickerItems, ...tickerItems].map((item, i) => (
                <span key={`${item}-${i}`} className="marquee-item">
                  {item}
                </span>
              ))}
            </div>
          </div>

          {/* HOW IT WORKS */}
          <section id="how" className="section" data-reveal>
            <div className="section-header">
              <div className="tag">How it works</div>
              <h2>Two sides. One operating system.</h2>
            </div>
            <div className="how-grid">
              <div className="n-lg how-card" data-tilt>
                <div className="how-card-head">
                  <span className="how-pill">For Companies</span>
                  <h3>Hire a team. Skip the hiring.</h3>
                </div>
                <ol className="how-steps">
                  {companySteps.map((s) => (
                    <li key={s.n}>
                      <span className="how-n">{s.n}</span>
                      <div>
                        <h4>{s.title}</h4>
                        <p>{s.body}</p>
                      </div>
                    </li>
                  ))}
                </ol>
                <p className="how-foot">No hiring. No onboarding headaches.</p>
              </div>

              <div className="n-lg how-card" data-tilt>
                <div className="how-card-head">
                  <span className="how-pill">For Engineers</span>
                  <h3>Earn through real projects.</h3>
                </div>
                <ol className="how-steps">
                  {engineerSteps.map((s) => (
                    <li key={s.n}>
                      <span className="how-n">{s.n}</span>
                      <div>
                        <h4>{s.title}</h4>
                        <p>{s.body}</p>
                      </div>
                    </li>
                  ))}
                </ol>
                <p className="how-foot">No gatekeeping. No unpaid internships.</p>
              </div>
            </div>
          </section>

          {/* DIFFERENTIATION */}
          <section id="why" className="section" data-reveal>
            <div className="section-header">
              <div className="tag">Why it works</div>
              <h2>Why SleekTech is different.</h2>
            </div>
            <div className="compare-list">
              {differentiators.map((d) => (
                <div key={d.left} className="compare-row">
                  <span className="compare-left">{d.left}</span>
                  <span className="compare-arrow">&gt;</span>
                  <span className="compare-right">{d.right}</span>
                </div>
              ))}
            </div>
            <p className="bold-statement">
              We don&apos;t hire engineers. We deploy them.
            </p>
          </section>

          {/* USE CASES */}
          <section id="use-cases" className="section" data-reveal>
            <div className="section-header">
              <div className="tag">Use cases</div>
              <h2>What we build.</h2>
            </div>
            <div className="feature-grid">
              {useCases.map((c) => (
                <div key={c.title} className="n-card feature-card">
                  <h3>{c.title}</h3>
                  <p>{c.body}</p>
                </div>
              ))}
            </div>
          </section>

          {/* SOCIAL PROOF */}
          <section id="results" className="section" data-reveal>
            <div className="section-header">
              <div className="tag">Early results</div>
              <h2>Receipts beat promises.</h2>
            </div>
            <div className="quote-grid">
              {earlyResults.map((r) => (
                <figure key={r.quote} className="n-card quote-card">
                  <blockquote>&ldquo;{r.quote}&rdquo;</blockquote>
                  <figcaption>— {r.who}</figcaption>
                </figure>
              ))}
            </div>
          </section>

          {/* COMMUNITY */}
          <section id="community" className="section" data-reveal>
            <div className="section-header">
              <div className="tag">The network</div>
              <h2>More than work. A network.</h2>
            </div>
            <ul className="solution-list">
              <li>Collaborate with serious engineers</li>
              <li>Learn by building real systems</li>
              <li>Build a public portfolio of shipped work</li>
            </ul>
            <p className="key-line">Not a Discord. A battlefield.</p>
          </section>

          {/* PRICING */}
          <section id="pricing" className="section" data-reveal>
            <div className="section-header">
              <div className="tag">Model</div>
              <h2>Simple, transparent.</h2>
            </div>
            <div className="pricing-grid">
              <div className="n-lg pricing-card" data-tilt>
                <span className="how-pill">For Companies</span>
                <h3>Project pricing.</h3>
                <p>Fixed project pricing or milestone-based — agreed before we start. No hourly meter.</p>
                <ul className="pricing-points">
                  <li>Scoped, fixed-price builds</li>
                  <li>Or milestone-based releases</li>
                  <li>One invoice. One team.</li>
                </ul>
              </div>
              <div className="n-lg pricing-card" data-tilt>
                <span className="how-pill">For Engineers</span>
                <h3>Paid per contribution.</h3>
                <p>You get paid for milestones you ship. Stack projects. Keep your day job. No exclusivity.</p>
                <ul className="pricing-points">
                  <li>Per-milestone payouts</li>
                  <li>No salary lock-in</li>
                  <li>Moonlighting allowed</li>
                </ul>
              </div>
            </div>
          </section>

          {/* FOR COMPANIES — contact form */}
          <section id="for-companies" className="section" data-reveal>
            <div className="section-header">
              <div className="tag">Hire a team</div>
              <h2>You had an idea. We deploy a team.</h2>
              <p>Tell us what you need built. We&apos;ll come back within 24 hours with a team and a plan.</p>
            </div>
            <div className="business-grid">
              <div className="n-lg business-form">
                <h3>Project brief</h3>
                <BusinessForm />
              </div>
            </div>
          </section>

          {/* FINAL CTA */}
          <section className="cta-section" data-reveal>
            <div className="cta-content">
              <div>
                <h2>Ready to build or earn?</h2>
                <p>
                  Join the collective shipping the next wave of automation, AI, and internal tools —
                  for companies that need execution, not promises.
                </p>
              </div>
              <div className="cta-actions">
                <a href="#for-companies" className="btn-primary">Hire a Team</a>
                <ApplyModal triggerClassName="btn-primary dark" triggerLabel="Join as Engineer" />
              </div>
            </div>
          </section>

          {/* STUDIO PLAYLIST — a quiet sign-off */}
          <section className="studio" aria-label="Studio playlist" data-reveal>
            <div className="studio-meta">
              <span className="tag">studio · always on</span>
              <p className="studio-line">On rotation while we ship.</p>
            </div>
            <div className="studio-frame">
              <iframe
                title="SleekTech studio playlist"
                src="https://open.spotify.com/embed/playlist/6fRYnkKe7qdeOcin5yt8dq?utm_source=generator&theme=0"
                width="100%"
                height="152"
                loading="lazy"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                allowFullScreen
              />
            </div>
          </section>
        </main>

        <footer>
          <div className="footer-brand">
            <span className="logo-type">SleekTech</span>
            <span>Engineering collective. Production-grade outcomes.</span>
          </div>
          <ul>
            <li><a href="#solution">About</a></li>
            <li><a href="#how">How it works</a></li>
            <li><a href="#hero">Apply</a></li>
            <li><a href="mailto:sleektechventures@gmail.com">Contact</a></li>
            <li><a href="#pricing">Terms</a></li>
          </ul>
          <p>© 2026 SleekTech. All rights reserved.</p>
        </footer>
      </div>
    </ApplyModalProvider>
  );
}
