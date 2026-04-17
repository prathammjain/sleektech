"use client";

import { FormEvent, useState } from "react";

export default function HeroWaitlist() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    if (!email || !email.includes("@")) {
      setError("Enter a valid email.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setSubmitted(true);
      setLoading(false);
    }, 800);
  };

  return (
    <div className="waitlist-card" id="waitlist">
      {!submitted ? (
        <form onSubmit={handleSubmit} className="waitlist-form">
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="sleektechventures@gmail.com"
            className="field flex-1"
            required
          />
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? (
              <span className="spinner" />
            ) : (
              <>
                Join the waitlist
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </>
            )}
          </button>
        </form>
      ) : (
        <div className="n-card waitlist-success">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#22c55e"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
          <div>
            <p className="waitlist-success-title">You&apos;re on the list.</p>
            <p className="waitlist-success-copy">We&apos;ll reach out in a day.</p>
          </div>
        </div>
      )}
      {error && <p className="waitlist-error">{error}</p>}
      <div className="waitlist-perks">
        {["Invite-only", "Proof of work first", "Reply < 24 hrs"].map((perk) => (
          <span key={perk}>
            <svg
              width="10"
              height="10"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
            {perk}
          </span>
        ))}
      </div>
    </div>
  );
}
