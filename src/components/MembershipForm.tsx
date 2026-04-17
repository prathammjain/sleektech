"use client";

import { useState, FormEvent, ChangeEvent } from "react";

export default function MembershipForm() {
  const [submitted, setSubmitted] = useState(false);
  const [fileName, setFileName] = useState("");

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setFileName(file ? file.name : "");
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="form-success">
        <div className="form-success-icon">✓</div>
        <h3>Application Received</h3>
        <p>
          We&apos;ve logged your submission. We review every application personally
          and will get back to you within a few days.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="modal-form">
      <div className="form-grid">
        <div className="form-group">
          <label htmlFor="mem-name">Full Name</label>
          <input
            type="text"
            id="mem-name"
            placeholder="Your full name"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="mem-role">What you do</label>
          <select id="mem-role" required defaultValue="">
            <option value="" disabled>
              Select your discipline
            </option>
            <option value="fullstack">Full Stack Developer</option>
            <option value="ai">AI Engineer</option>
            <option value="devops">DevOps Engineer</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="mem-linkedin">LinkedIn URL</label>
          <input
            type="url"
            id="mem-linkedin"
            placeholder="linkedin.com/in/you"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="mem-github">
            GitHub URL <span className="required-badge">required</span>
          </label>
          <input
            type="url"
            id="mem-github"
            placeholder="github.com/you"
            required
          />
        </div>

        <div className="form-group full-span">
          <label htmlFor="mem-resume">Resume / CV</label>
          <label className="file-upload-label" htmlFor="mem-resume">
            <span className="file-upload-icon">↑</span>
            <span>{fileName || "Upload file — PDF, DOC (optional)"}</span>
          </label>
          <input
            type="file"
            id="mem-resume"
            className="file-upload-input"
            onChange={handleFileChange}
            accept=".pdf,.doc,.docx"
          />
        </div>

        <div className="form-group">
          <label htmlFor="mem-shipped">Something you&apos;ve shipped</label>
          <input
            type="text"
            id="mem-shipped"
            placeholder="A live product, client project, or anything real."
            required
          />
        </div>

        <div className="form-group full-span">
          <label htmlFor="mem-message">Message</label>
          <textarea
            id="mem-message"
            placeholder="Anything else you&apos;d like us to know."
          />
        </div>
      </div>

      <div className="form-footer">
        <button type="submit" className="btn-primary">
          Apply for Membership →
        </button>
        <p className="form-below-text">
          We&apos;ll get back to you within a few days.
        </p>
      </div>
    </form>
  );
}
