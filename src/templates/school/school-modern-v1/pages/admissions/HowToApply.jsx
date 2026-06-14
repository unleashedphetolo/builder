import React from "react";
import BuilderSectionTarget from "../../../../../builder/BuilderSectionTarget";
import "../../styles/howtoapply.css";

const DEFAULT_ONLINE_STEPS = [
  "Fill in learner details and parent/guardian details.",
  "Provide previous school information if applicable.",
  "Upload required documents in PDF, JPG, or PNG format.",
  "Review and submit your application.",
];

const DEFAULT_MANUAL_STEPS = [
  "Download and print the form.",
  "Complete clearly in block letters.",
  "Attach certified supporting documents.",
  "Submit to the Administration Office during school hours.",
];

const DEFAULT_REQUIRED_DOCUMENTS = [
  "Certified copy of learner Birth Certificate / ID",
  "Certified copy of parent/guardian ID",
  "Latest school report",
  "Proof of address",
  "Transfer letter if applicable",
  "Immunisation card / clinic card if applicable",
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

function pickFirstValue(...values) {
  for (const value of values) {
    const clean = String(value || "").trim();

    if (clean) return clean;
  }

  return "";
}

export default function HowToApply({
  settings = {},
  navItems = [],
  section = null,
  content = {},
  builderMode = false,
}) {
  const organization = settings?.organization || {};
  const siteId = settings?.site_id || "";

  const schoolName = pickFirstValue(
    settings?.site_name,
    settings?.organization_name,
    organization?.name,
    settings?.name,
    "the school",
  );

  /*
    Keep the existing organisation/settings-driven form source first.
    The editable-section value is only a fallback when no saved school
    application-form URL exists yet.
  */
  const admissionsFormUrl = pickFirstValue(
    settings?.admissions_form_url,
    settings?.admission_form_url,
    settings?.application_form_url,
    settings?.download_form_url,
    settings?.admissions_pdf_url,
    content?.form_url,
    content?.pdf_url,
    "/site/docs/admission-form.pdf",
  );

  const onlineSteps =
    Array.isArray(content?.online_steps) && content.online_steps.length > 0
      ? content.online_steps
      : DEFAULT_ONLINE_STEPS;

  const manualSteps =
    Array.isArray(content?.manual_steps) && content.manual_steps.length > 0
      ? content.manual_steps
      : DEFAULT_MANUAL_STEPS;

  const requiredDocuments =
    Array.isArray(content?.required_documents) &&
    content.required_documents.length > 0
      ? content.required_documents
      : DEFAULT_REQUIRED_DOCUMENTS;

  const showApplyOnline = isVisibleByNav(navItems, ["/admissions/apply"], true);
  const showRequirements = isVisibleByNav(
    navItems,
    ["/admissions/requirements"],
    true,
  );
  const showContact = isVisibleByNav(navItems, ["/contact"], true);
  const showDownloadForm = settings?.features?.admissionsDownload !== false;

  const downloadIsExternal = isExternalHref(admissionsFormUrl);

  const scrollTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  const navigate = (slug) => {
    window.dispatchEvent(new CustomEvent("builder:navigate", { detail: slug }));
    scrollTop();
  };

  const pageContent = (
    <main
      className="howtoapply container"
      style={{ paddingTop: 10, paddingBottom: 40 }}
    >
      {/* HERO */}
      <header className="howtoapply-hero">
        <div className="howtoapply-left">
          <h1 className="howtoapply-title">
            {content?.section_title || "How to Apply"}
          </h1>

          <p className="howtoapply-sub">
            {content?.subtitle || (
              <>
                Apply to {schoolName} using the online application or submit a
                manual form at the school. Please ensure all supporting documents
                are certified where required.
              </>
            )}
          </p>

          <div className="howtoapply-badges">
            <span className="howtoapply-pill">
              {content?.primary_badge || "Admissions"}
            </span>
            <span className="howtoapply-pill ghost">
              {content?.secondary_badge || "Grade 8–12"}
            </span>
          </div>
        </div>

        {/* CTA */}
        <div className="howtoapply-cta">
          {showApplyOnline && (
            <a
              href={buildSiteHref(siteId, "/admissions/apply")}
              onClick={(e) => {
                e.preventDefault();
                navigate("/admissions/apply");
              }}
              className="howtoapply-btn primary"
            >
              {content?.apply_button_label || "Apply Online"}
            </a>
          )}

          {showDownloadForm && (
            <a
              href={admissionsFormUrl}
              download={!downloadIsExternal}
              target={downloadIsExternal ? "_blank" : undefined}
              rel={downloadIsExternal ? "noopener noreferrer" : undefined}
              className="howtoapply-btn ghost"
              aria-label="Download manual admission form PDF"
            >
              {content?.hero_download_label || "Download Manual Form (PDF)"}
            </a>
          )}

          {showContact && (
            <a
              href={buildSiteHref(siteId, "/contact")}
              onClick={(e) => {
                e.preventDefault();
                navigate("/contact");
              }}
              className="howtoapply-btn outline"
            >
              {content?.help_button_label || "Need Help?"}
            </a>
          )}
        </div>
      </header>

      {/* TWO OPTIONS */}
      <section className="howtoapply-grid">
        {showApplyOnline && (
          <article className="howtoapply-card">
            <h2 className="howtoapply-card-title">
              {content?.online_title || "Option A: Apply Online"}
            </h2>

            <p className="howtoapply-text">
              {content?.online_description ||
                "Complete the online form and upload the required documents. You will receive an application reference number."}
            </p>

            <ol className="howtoapply-steps">
              {onlineSteps.map((step, index) => (
                <li key={`${step}-${index}`}>{step}</li>
              ))}
            </ol>

            <div className="howtoapply-actions">
              <a
                href={buildSiteHref(siteId, "/admissions/apply")}
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/admissions/apply");
                }}
                className="howtoapply-btn primary"
              >
                {content?.online_start_label || "Start Online Application"}
              </a>

              {showRequirements && (
                <a
                  href={buildSiteHref(siteId, "/admissions/requirements")}
                  onClick={(e) => {
                    e.preventDefault();
                    navigate("/admissions/requirements");
                  }}
                  className="howtoapply-btn ghost"
                >
                  {content?.requirements_button_label || "View Requirements"}
                </a>
              )}
            </div>
          </article>
        )}

        {showDownloadForm && (
          <article className="howtoapply-card">
            <h2 className="howtoapply-card-title">
              {content?.manual_title || "Option B: Manual Application"}
            </h2>

            <p className="howtoapply-text">
              {content?.manual_description ||
                "Download the manual application form, complete it and submit it at the school office with certified copies."}
            </p>

            <ul className="howtoapply-list">
              {manualSteps.map((step, index) => (
                <li key={`${step}-${index}`}>{step}</li>
              ))}
            </ul>

            <div className="howtoapply-actions">
              <a
                href={admissionsFormUrl}
                download={!downloadIsExternal}
                target={downloadIsExternal ? "_blank" : undefined}
                rel={downloadIsExternal ? "noopener noreferrer" : undefined}
                className="howtoapply-btn primary"
              >
                {content?.manual_download_label || "Download Manual Form"}
              </a>

              {showContact && (
                <a
                  href={buildSiteHref(siteId, "/contact")}
                  onClick={(e) => {
                    e.preventDefault();
                    navigate("/contact");
                  }}
                  className="howtoapply-btn ghost"
                >
                  {content?.contact_button_label || "Contact the School"}
                </a>
              )}
            </div>
          </article>
        )}
      </section>

      {/* DOCUMENTS QUICK LIST */}
      <section className="howtoapply-card howtoapply-card-wide">
        <h2 className="howtoapply-card-title">
          {content?.documents_title || "Required Documents Summary"}
        </h2>

        <p className="howtoapply-text">
          {content?.documents_description ||
            "The documents below are typically required. Please confirm on the Entry Requirements page for the latest list."}
        </p>

        <div className="docs-grid">
          {requiredDocuments.map((document, index) => (
            <div key={`${document}-${index}`} className="doc-item">
              {document}
            </div>
          ))}
        </div>

        <div className="howtoapply-note">
          {content?.footer_note ||
            "For official confirmation of placement and deadlines, please contact the Administration Office."}
        </div>
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
      label={content?.section_title || "How to Apply"}
      templateCategory="school"
      templateKey="school-modern-v1"
    >
      {pageContent}
    </BuilderSectionTarget>
  );
}
