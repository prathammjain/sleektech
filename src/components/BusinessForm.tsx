"use client";

import { useState, FormEvent } from "react";

export default function BusinessForm() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const form = e.currentTarget;
    const data = new FormData(form);
    const payload = {
      name: data.get("name"),
      email: data.get("email"),
      phone: data.get("phone"),
      need: data.get("need"),
      message: data.get("message"),
    };

    setLoading(true);
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Something went wrong.");
      }
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="form-success">
        <div className="form-success-icon">✓</div>
        <h3>Enquiry Received</h3>
        <p>
          We&apos;ve received your message. A member of our team will respond
          within 24 hours.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="form-group">
        <label htmlFor="biz-name">Full Name</label>
        <input type="text" id="biz-name" name="name" placeholder="Your full name" required />
      </div>

      <div className="form-group">
        <label htmlFor="biz-email">Email</label>
        <input type="email" id="biz-email" name="email" placeholder="you@company.com" required />
      </div>

      <div className="form-group">
        <label htmlFor="biz-phone">Phone Number</label>
        <input type="tel" id="biz-phone" name="phone" placeholder="+91 00000 00000" required />
      </div>

      <div className="form-group">
        <label htmlFor="biz-need">What do you need built?</label>
        <select id="biz-need" name="need" required defaultValue="">
          <option value="" disabled>
            Select a category
          </option>
          <option value="automation">Automation Workflow</option>
          <option value="website">Website or Landing Page</option>
          <option value="software">Software Tool</option>
          <option value="other">Something Else</option>
          <option value="unsure">Not Sure Yet</option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="biz-message">Message</label>
        <textarea
          id="biz-message"
          name="message"
          placeholder="Describe your problem or idea briefly."
          required
        />
      </div>

      {error && <p className="form-error">{error}</p>}

      <button type="submit" className="btn-primary btn-full" disabled={loading}>
        {loading ? "Sending…" : "Send Enquiry"}
      </button>
      <p className="form-below-text">We&apos;ll respond within 24 hours.</p>
    </form>
  );
}
