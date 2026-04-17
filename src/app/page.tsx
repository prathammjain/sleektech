import ApplyModal, { ApplyModalProvider } from "@/components/ApplyModal";
import BusinessForm from "@/components/BusinessForm";
import { HeroWatermark } from "@/components/HeroVisual";

const heroStats = [
  { value: "40+", label: "engineers selected" },
  { value: "68", label: "projects delivered" },
  { value: "< 24 hr", label: "response time" },
];

const disciplines = [
  "AI Engineers & Automation Specialists",
  "Full Stack Developers",
  "DevOps & Cloud Infrastructure",
  "Technical Architects & Product Builders",
];

const offerings = [
  { title: "Workflow Automations", body: "Automate your business workflows" },
  { title: "Staff Augmentation", body: "Hire a dedicated developer" },
  { title: "ML Development", body: "Teach your software to learn" },
  { title: "Mobile App Development", body: "Craft a beautiful mobile app" },
  { title: "Web App Development", body: "Fast and sleek web applications" },
  { title: "Emerging Technologies", body: "Unlock the true potential of your business" },
  { title: "IT Consulting Services", body: "Build tailored solutions" },
];

export default function Home() {
  return (
    <ApplyModalProvider>
      <div className="landing-shell">
        <HeroWatermark />

        <nav className="landing-nav">
        <a href="#hero" className="logo-type">
          SleekTech
        </a>
        <div className="nav-links">
          <a href="#offerings">Offerings</a>
          <a href="#about">About</a>
          <a href="#collective">Collective</a>
          <a href="#for-businesses">For Businesses</a>
        </div>
        <ApplyModal triggerClassName="btn-primary" triggerLabel="Apply Now" />
      </nav>

      <main>
        <section id="hero" className="hero-section">
          <div className="hero-grid">
            <div className="hero-copy">
              <div className="tag">Membership window is open</div>
              <h1>
                ENGINEERING-FIRST.
                <br />
                VETTED COLLECTIVE.
              </h1>
              <p>
                Some engineers wait for the right opportunity. The best ones build the room they want to be in.
                SleekTech is that room.
              </p>
              <div className="hero-cta">
                <ApplyModal
                  triggerClassName="btn-primary"
                  triggerLabel="Apply and Join the Community"
                />
                <a href="#about">Learn More ↓</a>
              </div>
              <div className="hero-stats">
                {heroStats.map((stat) => (
                  <div key={stat.label}>
                    <p>{stat.value}</p>
                    <span>{stat.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="about" className="section">
          <div className="section-header">
            <h2>
              Who We Are, What We Do
            </h2>
            <p>
              We are building a private network of engineers, full stack devs, AI/ML specialists, and DevOps professionals
              who work together under a credible brand. We take on real client work: AI automations, full stack applications,
              and digital infrastructure.
            </p>
          </div>
        </section>

        <section id="offerings" className="section">
          <div className="section-header">
            <div className="tag">Offerings</div>
            <h2>Everything we ship, under one roof.</h2>
          </div>
          <div className="feature-grid">
            {offerings.map((card) => (
              <div key={card.title} className="n-card feature-card">
                <h3>{card.title}</h3>
                <p>{card.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="collective" className="section">
          <div className="section-header">
            <h2>Do We Hire?</h2>
            <p>
              We do not, we select. We select our members on one thing only: what they&apos;ve shipped. What they&apos;ve actually built.
            </p>
          </div>
          <div className="disciplines-grid">
            {disciplines.map((item, idx) => (
              <div key={item} className="n-card discipline-card">
                <span>{String(idx + 1).padStart(2, "0")}</span>
                <h3>{item}</h3>
              </div>
            ))}
          </div>
          <p className="who-below">
            The network is intentionally small. That&apos;s what makes it worth being part of.
          </p>
        </section>

        <section className="section" id="bar-for-entry">
          <div className="section-header">
            <h2>The Bar for Entry</h2>
            <p>
              One requirement. No exceptions. Proof that you have built things. A client project. A live product. A GitHub that tells
              a real story. Share your work and we&apos;ll review it within a few days and tell you where you stand.
            </p>
          </div>
        </section>

        <section id="for-businesses" className="section">
          <div className="section-header">
            <h2>
              You had an idea. We built it.
            </h2>
          </div>
          <div className="business-grid">
            <div className="n-lg business-form">
              <h3>Tell us what you need</h3>
              <BusinessForm />
            </div>
          </div>
        </section>

        <section className="cta-section">
          <div className="cta-content">
            <div>
              <h2>
                Stop auditioning for mediocre work. <br /> Start shipping with peers.
              </h2>
              <p>
                Join 40+ builders shaping the next wave of automation, AI, and internal tools across India and beyond.
              </p>
            </div>
            <ApplyModal triggerClassName="btn-primary dark" triggerLabel="Apply for the collective →" />
          </div>
        </section>
      </main>

      <footer>
        <div className="footer-brand">
          <span className="logo-type">SleekTech</span>
          <span>Outcome-driven builds. India-made.</span>
        </div>
        <ul>
          <li><a href="#hero">Waitlist</a></li>
          <li><a href="#for-businesses">For businesses</a></li>
          <li><a href="mailto:sleektechventures@gmail.com">sleektechventures@gmail.com</a></li>
        </ul>
        <p>© 2026 sleektech. All rights reserved.</p>
      </footer>
    </div>
    </ApplyModalProvider>
  );
}
