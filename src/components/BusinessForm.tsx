"use client";

import { useState, FormEvent } from "react";

export default function BusinessForm() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);
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
        <input
          type="text"
          id="biz-name"
          placeholder="Your full name"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="biz-email">Email</label>
        <input
          type="email"
          id="biz-email"
          placeholder="you@company.com"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="biz-phone">Phone Number</label>
        <input
          type="tel"
          id="biz-phone"
          placeholder="+91 00000 00000"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="biz-need">What do you need built?</label>
        <select id="biz-need" required defaultValue="">
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
          placeholder="Describe your problem or idea briefly."
          required
        />
      </div>

      <button type="submit" className="btn-primary btn-full">
        Send Enquiry
      </button>
      <p className="form-below-text">We&apos;ll respond within 24 hours.</p>
    </form>
  );
}
