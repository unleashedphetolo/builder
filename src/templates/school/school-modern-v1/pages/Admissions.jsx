// Admissions.jsx
import React from "react";
import "../styles/admissions.css";
import SchoolStats from "../components/home/SchoolStats";
import Breadcrumbs from "../components/common/Breadcrumbs";

export default function Admissions() {
  return (
    <main className="admissions container">
      <Breadcrumbs />
      <header className="admissions-hero">
        <div className="hero-left">
          <h1 className="hero-title">Admission</h1>
          <p className="hero-sub">
            Join a school that shapes character, curiosity and leadership.
          </p>
        </div>
        <div className="hero-cta">
          <a className="btn primary apply-cta" href="/site/admissions/apply">
            Start Application
          </a>
        </div>
      </header>

      <section className="admission-grid">
        <article className="admission-card">
          <h2 className="card-title">
            Are you ready for the adventure of your life?
          </h2>
          <p className="lead">
            View the admissions process and requirements. We admit learners from
            Grade 8 through Grade 12. Follow the clear steps below to apply — we
            review each application with care.
          </p>

          <div className="process">
            <ol>
              <li>
                <strong>Download:</strong> Get the official admission form
                (PDF).
              </li>
              <li>
                <strong>Complete:</strong> Fill guardian details and attach
                required documents (ID, proof of residence, reports).
              </li>
              <li>
                <strong>Submit:</strong> Upload online or hand-deliver to the
                school office during working hours.
              </li>
              <li>
                <strong>Await:</strong> You will receive confirmation via email
                or SMS about assessment and intake.
              </li>
            </ol>
          </div>

          <div className="card-actions">
            <a className="btn secondary" href="#download">
              Download Form
            </a>
            <a className="btn primary" id="apply" href="/site/admissions/apply">
              Start Application
            </a>
          </div>

          <div className="admission-notes">
            <p>
              <strong>Eligibility:</strong> Learners must be between ages 12 —
              20 for secondary placements. Special assessments may apply.
            </p>
            <p className="muted">
              For any questions call the admissions office at
              <a href="tel:+27123456789"> +27 11 345 6789</a> or email
              <a href="mailto:admissions@school.org"> admissions@school.org</a>.
            </p>
          </div>
        </article>

        <aside className="admission-side">
          <div className="side-card">
            <h3 className="side-title">School Overview</h3>
            <p className="small muted">
              Established 1990 • Co-educational • Grades 8–12
            </p>

            <div className="stats-wrapper">
              <SchoolStats />
            </div>

            <div className="quick-links">
              <a className="link" href="/site/contact">
                Book a Visit
              </a>
              <a className="link" href="/site/admissions/requirements">
                Policies
              </a>
            </div>
          </div>
        </aside>
      </section>
    </main>
  );
}
