import React from "react";
import "../styles/admissions.css";
import SchoolStats from "../components/home/SchoolStats";

function buildSiteHref(siteId, path = "") {
  const clean = path ? `/${String(path).replace(/^\/+/, "")}` : "";
  return `/#/site/${siteId || ""}${clean}`;
}

export default function Admissions({ settings = {} }) {
  const siteId = settings?.site_id || "";
  const admissionsPhone =
    settings?.admissions_phone || settings?.phone || "+27 11 345 6789";
  const admissionsEmail =
    settings?.admissions_email || settings?.email || "admissions@school.org";

  const navigate = (slug) => {
    window.dispatchEvent(
      new CustomEvent("builder:navigate", { detail: slug })
    );
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <main className="admissions-page admissions-page__container">

      <header className="admissions-page__hero">
        <div className="admissions-page__hero-left">
          <h1 className="admissions-page__hero-title">Admission</h1>
          <p className="admissions-page__hero-sub">
            Join a school that shapes character, curiosity and leadership.
          </p>
        </div>

        <div className="admissions-page__hero-cta">
          <a
            className="admissions-page__btn admissions-page__btn--primary admissions-page__apply-cta"
            href={buildSiteHref(siteId, "/admissions/apply")}
            onClick={(e) => {
              e.preventDefault();
              navigate("/admissions/apply");
            }}
          >
            Start Application
          </a>
        </div>
      </header>

      <section className="admissions-page__grid">
        <article className="admissions-page__card">
          <h2 className="admissions-page__card-title">
            Are you ready for the adventure of your life?
          </h2>

          <p className="admissions-page__lead">
            View the admissions process and requirements. We admit learners from
            Grade 8 through Grade 12. Follow the clear steps below to apply — we
            review each application with care.
          </p>

          <div className="admissions-page__process">
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

          <div className="admissions-page__actions">
            <a
              className="admissions-page__btn admissions-page__btn--secondary"
              href="#download"
            >
              Download Form
            </a>

            <a
              className="admissions-page__btn admissions-page__btn--primary"
              id="apply"
              href={buildSiteHref(siteId, "/admissions/apply")}
              onClick={(e) => {
                e.preventDefault();
                navigate("/admissions/apply");
              }}
            >
              Start Application
            </a>
          </div>

          <div className="admissions-page__notes">
            <p>
              <strong>Eligibility:</strong> Learners must be between ages 12 — 20
              for secondary placements. Special assessments may apply.
            </p>

            <p className="admissions-page__muted">
              For any questions call the admissions office at
              <a href={`tel:${admissionsPhone}`}> {admissionsPhone}</a> or email
              <a href={`mailto:${admissionsEmail}`}> {admissionsEmail}</a>.
            </p>
          </div>
        </article>

        <aside className="admissions-page__side">
          <div className="admissions-page__side-card">
            <h3 className="admissions-page__side-title">School Overview</h3>
            <p className="admissions-page__small admissions-page__muted">
              Established 1990 • Co-educational • Grades 8–12
            </p>

            <div className="admissions-page__stats-wrapper">
              <SchoolStats settings={settings} />
            </div>

            <div className="admissions-page__quick-links">
              <a
                className="admissions-page__link"
                href={buildSiteHref(siteId, "/contact")}
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/contact");
                }}
              >
                Book a Visit
              </a>

              <a
                className="admissions-page__link"
                href={buildSiteHref(siteId, "/admissions/requirements")}
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/admissions/requirements");
                }}
              >
                Policies
              </a>
            </div>
          </div>
        </aside>
      </section>
    </main>
  );
}