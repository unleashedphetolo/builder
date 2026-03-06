import React from "react";
import { Link } from "react-router-dom";
import "../../styles/howtoapply.css";
import Button from "../../components/common/Button";
import Breadcrumbs from "../../components/common/Breadcrumbs";

export default function HowToApply() {
  const scrollTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <main className="howtoapply container" style={{ paddingTop: 10, paddingBottom: 40 }}>
        <Breadcrumbs />
      {/* HERO */}
      <header className="howtoapply-hero">
        <div className="howtoapply-left">
          <h1 className="howtoapply-title">How to Apply</h1>
          <p className="howtoapply-sub">
            Apply to M.O.M Sebone Secondary School using the online application or submit a manual form at the school.
            Please ensure all supporting documents are certified where required.
          </p>

          <div className="howtoapply-badges">
            <span className="howtoapply-pill">Admissions</span>
            <span className="howtoapply-pill ghost">Grade 8–12</span>
          </div>
        </div>

        {/* CTA */}
        <div className="howtoapply-cta">
          <Link to="/site/admissions/apply" onClick={scrollTop} className="howtoapply-btn primary">
            Apply Online
          </Link>

          <a
            href="/site/docs/admission-form.pdf"
            download
            className="howtoapply-btn ghost"
            aria-label="Download manual admission form PDF"
          >
            Download Manual Form (PDF)
          </a>

          <Button to="/site/contact" variant="outline">
            Need Help?
          </Button>
        </div>
      </header>

      {/* TWO OPTIONS */}
      <section className="howtoapply-grid">
        <article className="howtoapply-card">
          <h2 className="howtoapply-card-title">Option A: Apply Online</h2>
          <p className="howtoapply-text">
            Complete the online form and upload the required documents. You will receive an application reference number.
          </p>

          <ol className="howtoapply-steps">
            <li>Fill in learner details and parent/guardian details.</li>
            <li>Provide previous school information (if applicable).</li>
            <li>Upload required documents (PDF/JPG/PNG).</li>
            <li>Review and submit your application.</li>
          </ol>

          <div className="howtoapply-actions">
            <Link to="/site/admissions/apply" onClick={scrollTop} className="howtoapply-btn primary">
              Start Online Application
            </Link>
            <Link to="/site/admissions/requirements" onClick={scrollTop} className="howtoapply-btn ghost">
              View Requirements
            </Link>
          </div>
        </article>

        <article className="howtoapply-card">
          <h2 className="howtoapply-card-title">Option B: Manual Application</h2>
          <p className="howtoapply-text">
            Download the manual application form, complete it and submit it at the school office with certified copies.
          </p>

          <ul className="howtoapply-list">
            <li>Download and print the form.</li>
            <li>Complete clearly in block letters.</li>
            <li>Attach certified supporting documents.</li>
            <li>Submit to the Administration Office during school hours.</li>
          </ul>

          <div className="howtoapply-actions">
            <a href="/site/docs/admission-form.pdf" download className="howtoapply-btn primary">
              Download Manual Form
            </a>
            <Link to="/site/contact" onClick={scrollTop} className="howtoapply-btn ghost">
              Contact the School
            </Link>
          </div>
        </article>
      </section>

      {/* DOCUMENTS QUICK LIST */}
      <section className="howtoapply-card howtoapply-card-wide">
        <h2 className="howtoapply-card-title">Required Documents (Summary)</h2>
        <p className="howtoapply-text">
          The documents below are typically required. Please confirm on the “Entry Requirements” page for the latest list.
        </p>

        <div className="docs-grid">
          <div className="doc-item">Certified copy of learner Birth Certificate / ID</div>
          <div className="doc-item">Certified copy of parent/guardian ID</div>
          <div className="doc-item">Latest school report</div>
          <div className="doc-item">Proof of address</div>
          <div className="doc-item">Transfer letter (if applicable)</div>
          <div className="doc-item">Immunisation card / clinic card (if applicable)</div>
        </div>

        <div className="howtoapply-note">
          For official confirmation of placement and deadlines, please contact the Administration Office.
        </div>
      </section>
    </main>
  );
}