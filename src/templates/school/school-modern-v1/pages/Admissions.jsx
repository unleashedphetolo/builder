import React from "react";
import BuilderSectionTarget from "../../../../builder/BuilderSectionTarget";
import "../styles/admissions.css";
import SchoolStats from "../components/home/SchoolStats";

const DEFAULT_PROCESS = [
  {
    id: "download",
    title: "Download",
    body: "Get the official admission form (PDF).",
  },
  {
    id: "complete",
    title: "Complete",
    body:
      "Fill guardian details and attach required documents (ID, proof of residence, reports).",
  },
  {
    id: "submit",
    title: "Submit",
    body:
      "Upload online or hand-deliver to the school office during working hours.",
  },
  {
    id: "await",
    title: "Await",
    body:
      "You will receive confirmation via email or SMS about assessment and intake.",
  },
];

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

export default function Admissions({
  settings = {},
  navItems = [],
  section = null,
  content = {},
  builderMode = false,
}) {
  const siteId = settings?.site_id || "";

  const admissionsPhone = pickFirstValue(
    content?.phone,
    settings?.admissions_phone,
    settings?.phone,
    "+27 11 345 6789",
  );

  const admissionsEmail = pickFirstValue(
    content?.email,
    settings?.admissions_email,
    settings?.email,
    "admissions@school.org",
  );

  const admissionsFormUrl = pickFirstValue(
    content?.secondary_button_href,
    settings?.admissions_form_url,
    settings?.admission_form_url,
    settings?.application_form_url,
    settings?.download_form_url,
    settings?.admissions_pdf_url,
  );

  const applicationPath =
    content?.primary_button_href || "/admissions/apply";

  const process =
    Array.isArray(content?.process) && content.process.length > 0
      ? content.process
      : DEFAULT_PROCESS;

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

  const pageContent = (
    <main className="admissions-page admissions-page__container">
      <header className="admissions-page__hero">
        <div className="admissions-page__hero-left">
          <h1 className="admissions-page__hero-title">
            {content?.section_title || "Admission"}
          </h1>
          <p className="admissions-page__hero-sub">
            {content?.subtitle ||
              "Join a school that shapes character, curiosity and leadership."}
          </p>
        </div>

        {showApplyButton && (
          <div className="admissions-page__hero-cta">
            <a
              className="admissions-page__btn admissions-page__btn--primary admissions-page__apply-cta"
              href={buildSiteHref(siteId, applicationPath)}
              onClick={(event) => {
                event.preventDefault();
                navigate(applicationPath);
              }}
            >
              {content?.primary_button_label || "Start Application"}
            </a>
          </div>
        )}
      </header>

      <section className="admissions-page__grid">
        <article className="admissions-page__card">
          <h2 className="admissions-page__card-title">
            {content?.heading ||
              "Are you ready for the adventure of your life?"}
          </h2>

          <p className="admissions-page__lead">
            {content?.description ||
              "View the admissions process and requirements. We admit learners from Grade 8 through Grade 12. Follow the clear steps below to apply — we review each application with care."}
          </p>

          <div className="admissions-page__process">
            <ol>
              {process.map((step, index) => (
                <li key={step.id || `${step.title || "step"}-${index}`}>
                  <strong>{step.title || `Step ${index + 1}`}:</strong>{" "}
                  {step.body || ""}
                </li>
              ))}
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
                  onClick={(event) => {
                    if (downloadIsExternal) return;

                    if (downloadHref === "#download") {
                      return;
                    }

                    event.preventDefault();
                    navigate(normalizeHref(downloadHref));
                  }}
                >
                  {content?.secondary_button_label || "Download Form"}
                </a>
              )}

              {showApplyButton && (
                <a
                  className="admissions-page__btn admissions-page__btn--primary"
                  id="apply"
                  href={buildSiteHref(siteId, applicationPath)}
                  onClick={(event) => {
                    event.preventDefault();
                    navigate(applicationPath);
                  }}
                >
                  {content?.primary_button_label || "Start Application"}
                </a>
              )}
            </div>
          )}

          <div className="admissions-page__notes">
            <p>
              <strong>Eligibility:</strong>{" "}
              {content?.eligibility ||
                "Learners must be between ages 12 — 20 for secondary placements. Special assessments may apply."}
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
            <h3 className="admissions-page__side-title">
              {content?.overview_title || "School Overview"}
            </h3>
            <p className="admissions-page__small admissions-page__muted">
              {content?.overview_subtitle ||
                "Established 1990 • Co-educational • Grades 8–12"}
            </p>

            {showSchoolStats && (
              <div className="admissions-page__stats-wrapper">
                <SchoolStats
                  settings={settings}
                  items={content?.stats || []}
                />
              </div>
            )}

            {showQuickLinks && (
              <div className="admissions-page__quick-links">
                {showBookVisit && (
                  <a
                    className="admissions-page__link"
                    href={buildSiteHref(siteId, "/contact")}
                    onClick={(event) => {
                      event.preventDefault();
                      navigate("/contact");
                    }}
                  >
                    {content?.book_visit_label || "Book a Visit"}
                  </a>
                )}

                {showPolicies && (
                  <a
                    className="admissions-page__link"
                    href={buildSiteHref(siteId, "/admissions/requirements")}
                    onClick={(event) => {
                      event.preventDefault();
                      navigate("/admissions/requirements");
                    }}
                  >
                    {content?.requirements_label || "Policies"}
                  </a>
                )}
              </div>
            )}
          </div>
        </aside>
      </section>
    </main>
  );

  if (!section) {
    return pageContent;
  }

  return (
    <BuilderSectionTarget
      builderMode={builderMode}
      section={section}
      sectionType="admissions"
      label={content?.section_title || "Admission"}
      templateCategory="school"
      templateKey="school-modern-v1"
    >
      {pageContent}
    </BuilderSectionTarget>
  );
}
