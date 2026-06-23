import React, { useState } from "react";
import SectionHeader from "../common/SectionHeader";

export default function ContactSection({ data }) {
  const [form, setForm] = useState({ name: "", email: "", service: "Portfolio enquiry", message: "" });

  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }));

  const submit = (event) => {
    event.preventDefault();
    const subject = encodeURIComponent(`${form.service} - ${data.siteName}`);
    const body = encodeURIComponent(
      `Good day ${data.siteName},\n\nMy name is ${form.name || ""}.\nEmail: ${form.email || ""}\nService/Topic: ${form.service}\n\nMessage:\n${form.message || ""}\n\nKind regards,\n${form.name || ""}`,
    );
    window.location.href = `mailto:${data.email}?subject=${subject}&body=${body}`;
  };

  return (
    <section className="portfolio-section portfolio-contact-section">
      <div className="portfolio-container portfolio-contact-grid">
        <div>
          <SectionHeader eyebrow="Contact" title="Let’s discuss the next project" subtitle="Use the form and your email app will open with a prepared professional enquiry." />
          <div className="portfolio-contact-card">
            <p><strong>Email:</strong> {data.email}</p>
            <p><strong>Phone:</strong> {data.phone}</p>
            <p><strong>Location:</strong> {data.location}</p>
          </div>
        </div>

        <form className="portfolio-contact-form" onSubmit={submit}>
          <label>
            <span>Your name</span>
            <input value={form.name} onChange={(event) => update("name", event.target.value)} placeholder="Your full name" />
          </label>
          <label>
            <span>Email address</span>
            <input type="email" value={form.email} onChange={(event) => update("email", event.target.value)} placeholder="you@example.com" />
          </label>
          <label>
            <span>Service / topic</span>
            <select value={form.service} onChange={(event) => update("service", event.target.value)}>
              <option>Portfolio enquiry</option>
              <option>Website project</option>
              <option>Consulting request</option>
              <option>Recruitment opportunity</option>
              <option>Collaboration</option>
            </select>
          </label>
          <label>
            <span>Message</span>
            <textarea rows={5} value={form.message} onChange={(event) => update("message", event.target.value)} placeholder="Tell me what you need help with..." />
          </label>
          <button type="submit" className="portfolio-btn portfolio-btn--primary">Open Email</button>
        </form>
      </div>
    </section>
  );
}
