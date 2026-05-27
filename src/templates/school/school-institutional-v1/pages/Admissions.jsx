import React from "react";
import "../styles/admissions.css";
import SchoolStats from "../components/home/SchoolStats";

function buildSiteHref(siteId, path = "") {
  const clean = path ? `/${String(path).replace(/^\/+/, "")}` : "";
  return `/#/site/${siteId || ""}${clean}`;
}

function normalizeHref(href = "/") {
  if (!href) return "/";

  if (String(href).startsWith("http")) {
    return String(href);
  }

  const clean = String(href)
    .replace(/^#/, "")
    .split("?")[0]
    .split("#")[0]
    .replace(/^\/+|\/+$/g, "");

  const withoutSitePrefix = clean.replace(/^site\/[^/]+\/?/, "");

  if (!withoutSitePrefix || withoutSitePrefix.toLowerCase() === "home") {
    return "/";
  }

  return `/${withoutSitePrefix.replace(/^\/+|\/+$/g, "")}`;
}

function isExternalHref(href = "") {
  return /^https?:\/\//i.test(String(href || ""));
}

function isVisibleByNav(navItems = [], paths = [], fallbackVisible = true) {
  const cleanPaths = paths.map((path) => normalizeHref(path));

  const matches = (Array.isArray(navItems) ? navItems : []).filter((item) => {
    if (!item?.href) return false;

    const itemHref = normalizeHref(item.href);

    return cleanPaths.includes(itemHref);
  });

  if (!matches.length) return fallbackVisible;

  if (matches.some((item) => item.is_visible === false)) {
    return false;
  }

  return matches.some((item) => item.is_visible !== false);
}

function isFeatureEnabled(settings = {}, keys = [], fallback = true) {
  const features = settings?.features || {};

  for (const key of keys) {
    if (Object.prototype.hasOwnProperty.call(features, key)) {
      return features[key] !== false;
    }
  }

  return fallback;
}

function pickFirstValue(...values) {
  for (const value of values) {
    const clean = String(value || "").trim();

    if (clean) return clean;
  }

  return "";
}

export default function Admissions({ settings = {}, navItems = [] }) {
  const siteId = settings?.site_id || "";

  const admissionsPhone = pickFirstValue(
    settings?.admissions_phone,
    settings?.phone,
    "+27 11 345 6789",
  );

  const admissionsEmail = pickFirstValue(
    settings?.admissions_email,
    settings?.email,
    "admissions@school.org",
  );

  const admissionsFormUrl = pickFirstValue(
    settings?.admissions_form_url,
    settings?.admission_form_url,
    settings?.application_form_url,
    settings?.download_form_url,
    settings?.admissions_pdf_url,
  );

  const showApplyButton =
    isFeatureEnabled(
      settings,
      ["admissionsApply", "admissions_apply", "applyNow", "apply_now"],
      true,
    ) && isVisibleByNav(navItems, ["/admissions/apply"], true);

  const showDownloadButton = isFeatureEnabled(
    settings,
    [
      "admissionsDownload",
      "admissions_download",
      "downloadForm",
      "download_form",
      "admissionsForm",
      "admissions_form",
    ],
    true,
  );

  const showSchoolStats =
    isFeatureEnabled(
      settings,
      ["schoolStats", "school_stats", "admissionsStats", "admissions_stats"],
      true,
    ) && isVisibleByNav(navItems, ["/home/school-stats"], true);

  const showBookVisit =
    isFeatureEnabled(
      settings,
      ["bookVisit", "book_visit", "contact", "admissionsContact"],
      true,
    ) && isVisibleByNav(navItems, ["/contact"], true);

  const showPolicies =
    isFeatureEnabled(
      settings,
      [
        "admissionsRequirements",
        "admissions_requirements",
        "policies",
        "requirements",
      ],
      true,
    ) && isVisibleByNav(navItems, ["/admissions/requirements"], true);

  const showActions = showDownloadButton || showApplyButton;
  const showQuickLinks = showBookVisit || showPolicies;

  const downloadHref = admissionsFormUrl || "#download";
  const downloadIsExternal = isExternalHref(downloadHref);

  const navigate = (slug) => {
    window.dispatchEvent(new CustomEvent("builder:navigate", { detail: slug }));
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

        {showApplyButton && (
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
        )}
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

          {showActions && (
            <div className="admissions-page__actions">
              {showDownloadButton && (
                <a
                  className="admissions-page__btn admissions-page__btn--secondary"
                  href={downloadHref}
                  target={downloadIsExternal ? "_blank" : undefined}
                  rel={downloadIsExternal ? "noopener noreferrer" : undefined}
                  onClick={(e) => {
                    if (downloadIsExternal) return;

                    if (downloadHref === "#download") {
                      return;
                    }

                    e.preventDefault();
                    navigate(normalizeHref(downloadHref));
                  }}
                >
                  Download Form
                </a>
              )}

              {showApplyButton && (
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
              )}
            </div>
          )}

          <div className="admissions-page__notes">
            <p>
              <strong>Eligibility:</strong> Learners must be between ages 12 — 20
              for secondary placements. Special assessments may apply.
            </p>

            {(admissionsPhone || admissionsEmail) && (
              <p className="admissions-page__muted">
                For any questions call the admissions office at
                {admissionsPhone && (
                  <a href={`tel:${admissionsPhone}`}> {admissionsPhone}</a>
                )}
                {admissionsPhone && admissionsEmail ? " or email" : ""}
                {admissionsEmail && (
                  <a href={`mailto:${admissionsEmail}`}> {admissionsEmail}</a>
                )}
                .
              </p>
            )}
          </div>
        </article>

        <aside className="admissions-page__side">
          <div className="admissions-page__side-card">
            <h3 className="admissions-page__side-title">School Overview</h3>
            <p className="admissions-page__small admissions-page__muted">
              Established 1990 • Co-educational • Grades 8–12
            </p>

            {showSchoolStats && (
              <div className="admissions-page__stats-wrapper">
                <SchoolStats settings={settings} />
              </div>
            )}

            {showQuickLinks && (
              <div className="admissions-page__quick-links">
                {showBookVisit && (
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
                )}

                {showPolicies && (
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
                )}
              </div>
            )}
          </div>
        </aside>
      </section>
    </main>
  );
}