"use client";

import React from "react";

export function HeroVisual() {
  const queue = [
    { title: "AI onboarding assistant", status: "Ready", dot: "#22c55e" },
    { title: "Internal ops dashboard", status: "Ready", dot: "#22c55e" },
    { title: "Infra cost sweeper", status: "Scoping", dot: "#d1d3d9" },
  ];

  return (
    <div className="hero-visual">
      <div className="n-lg hero-card">
        <div className="hero-card-head">
          <div className="icon-box icon-sm rounded-soft">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="#111">
              <path d="M4.459 4.208c.746.606 1.026.56 2.428.466l13.215-.793c.28 0 .047-.28-.046-.326L17.86 1.968c-.42-.326-.981-.7-2.055-.607L3.01 2.295c-.466.046-.56.28-.374.466zm.793 3.08v13.904c0 .747.373 1.027 1.214.98l14.523-.84c.841-.046.935-.56.935-1.167V6.354c0-.606-.233-.933-.748-.887l-15.177.887c-.56.047-.747.327-.747.933zm14.337.745c.093.42 0 .84-.42.888l-.7.14v10.264c-.608.327-1.168.514-1.635.514-.748 0-.935-.234-1.495-.933l-4.577-7.186v6.952L12.21 19s0 .84-1.168.84l-3.222.186c-.093-.186 0-.653.327-.746l.84-.233V9.854L7.822 9.76c-.094-.42.14-1.026.793-1.073l3.456-.233 4.764 7.279v-6.44l-1.215-.139c-.093-.514.28-.887.747-.933z" />
            </svg>
          </div>
          <div>
            <p className="hero-card-title">Internal Build Room</p>
            <p className="hero-card-sub">3 briefs ready</p>
          </div>
        </div>
        <div className="hero-card-list">
          {queue.map((item) => (
            <div key={item.title} className="n-inset-sm hero-queue-row">
              <div className="hero-queue-title">
                <span
                  className="hero-dot"
                  style={{ background: item.dot }}
                />
                {item.title}
              </div>
              <span
                className={`hero-status ${
                  item.status === "Ready" ? "is-ready" : "is-draft"
                }`}
              >
                {item.status}
              </span>
            </div>
          ))}
        </div>
      </div>

        <div className="hero-connector">
          <div className="divider" />
          <div className="icon-box icon-sm rounded-full">
          <svg
            width="11"
            height="11"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#666"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z" />
          </svg>
        </div>
        <div className="divider flex-1" />
      </div>

      <div className="n-lg hero-card">
        <div className="hero-card-head">
          <div className="icon-box icon-sm rounded-soft">
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#666"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="2" y="2" width="20" height="20" rx="5" />
              <circle cx="12" cy="12" r="4" />
            </svg>
          </div>
          <div>
            <p className="hero-card-title">Client Delivery</p>
            <p className="hero-card-sub">Publishing now</p>
          </div>
        </div>
        <div className="n-inset hero-shot">
          <span>sleektech · Ops cockpit</span>
        </div>
        <div className="hero-metrics">
          {["⚡ Velocity", "🛡️ Reliability", "📈 Impact"].map((metric) => (
            <span key={metric}>{metric}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

export function HeroWatermark() {
  return (
    <div className="hero-watermark">
      <svg viewBox="0 0 500 500" fill="none" stroke="#111" strokeWidth="1">
        <circle cx="250" cy="250" r="230" strokeDasharray="4 16" strokeWidth="1.5" />
        <circle cx="250" cy="250" r="180" strokeWidth="0.5" />
        <circle cx="250" cy="250" r="130" strokeDasharray="1 8" strokeWidth="2" />
        <path d="M 250 250 A 10 10 0 0 1 260 260 A 20 20 0 0 1 240 280 A 40 40 0 0 1 200 240 A 80 80 0 0 1 280 160 A 160 160 0 0 1 440 320" strokeWidth="0.5" strokeDasharray="3 3" />
        <path d="M 120 120 A 220 220 0 0 0 380 380" strokeWidth="3" strokeLinecap="round" />
        <path d="M 100 100 A 250 250 0 0 0 400 400" strokeWidth="0.5" strokeDasharray="5 5" />
        <line x1="120" y1="120" x2="200" y2="300" strokeWidth="1" />
        <line x1="380" y1="380" x2="200" y2="300" strokeWidth="1" />
        <path d="M 120 120 Q 250 250 380 380" strokeWidth="0.5" strokeDasharray="2 4" />
        <line x1="60" y1="440" x2="440" y2="60" strokeWidth="2" strokeLinecap="round" />
        <line x1="20" y1="480" x2="480" y2="20" strokeWidth="0.5" strokeDasharray="8 8" />
        <line x1="250" y1="50" x2="250" y2="450" strokeWidth="0.25" />
        <line x1="50" y1="250" x2="450" y2="250" strokeWidth="0.25" />
        <g transform="translate(440, 60) rotate(45)">
          <path d="M 0 -24 C 20 -8, 12 12, 0 6 C -12 12, -20 -8, 0 -24 Z" fill="#111" />
          <circle cx="-6" cy="-2" r="8" strokeWidth="0.5" />
          <circle cx="6" cy="-2" r="8" strokeWidth="0.5" />
          <path d="M 0 -35 L 0 20" strokeWidth="0.5" strokeDasharray="2 2" />
          <path d="M -20 -2 L 20 -2" strokeWidth="0.5" strokeDasharray="2 2" />
        </g>
        <path d="M 60 440 L 40 480 M 80 420 L 60 460" strokeWidth="2" strokeLinecap="round" />
        <path d="M 60 440 L 20 460 M 80 420 L 40 440" strokeWidth="2" strokeLinecap="round" />
        <circle cx="120" cy="120" r="5" fill="#111" />
        <circle cx="380" cy="380" r="5" fill="#111" />
        <circle cx="200" cy="300" r="4" fill="#eff1f5" stroke="#111" strokeWidth="2" />
        <circle cx="250" cy="250" r="2" fill="#111" />
      </svg>
    </div>
  );
}

export default HeroVisual;
