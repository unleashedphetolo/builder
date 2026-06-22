import React from "react";
import BuilderSectionTarget from "../../../../../builder/BuilderSectionTarget";
import "../../styles/requirements.css";
import Card from "../../components/common/Card";

const DEFAULT_REQUIRED_DOCUMENTS = [
  "Certified copy of learner's birth certificate or ID",
  "Certified copy of parent/guardian ID",
  "Latest school report",
  "Proof of residential address",
  "Transfer letter from previous school if applicable",
  "Immunisation card if available",
];

const DEFAULT_APPLICATION_PROCESS = [
  "Complete the official school application form.",
  "Submit all required supporting documents.",
  "Applications may be submitted online or at the school office.",
  "Parents will be contacted once the application has been reviewed.",
];

const DEFAULT_IMPORTANT_NOTES = [
  "All documents must be certified.",
  "Incomplete applications may not be processed.",
  "Submission of an application does not guarantee admission.",
  "Admission decisions are subject to the school's capacity.",
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

export default function Requirements({
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
    The editable-section value is only a fallback when no saved school setting
    exists yet.
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

  const requiredDocuments =
    Array.isArray(content?.required_documents) &&
    content.required_documents.length > 0
      ? content.required_documents
      : DEFAULT_REQUIRED_DOCUMENTS;

  const applicationProcess =
    Array.isArray(content?.application_process) &&
    content.application_process.length > 0
      ? content.application_process
      : DEFAULT_APPLICATION_PROCESS;

  const importantNotes =
    Array.isArray(content?.important_notes) &&
    content.important_notes.length > 0
      ? content.important_notes
      : DEFAULT_IMPORTANT_NOTES;

  const showApplyOnline = isVisibleByNav(navItems, ["/admissions/apply"], true);

  const showDownloadForm = settings?.features?.admissionsDownload !== false;

  const showViewForm = settings?.features?.admissionsViewForm !== false;

  const downloadIsExternal = isExternalHref(admissionsFormUrl);

  const navigate = (slug) => {
    window.dispatchEvent(new CustomEvent("builder:navigate", { detail: slug }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const pageContent = (
    <main className="container requirements-page">
      <h2 className="section-title">
        {content?.section_title || "Entry Requirements"}
      </h2>

      <Card>
        <div className="requirements-content">
          <p>
            {content?.introduction || (
              <>
                {schoolName}{" "} welcomes applications from learners who are committed
                to academic excellence, discipline, and positive participation in
                school life. Admission is subject to available space and compliance
                with the school&apos;s admission policy.
              </>
            )}
          </p>

          <h3 className="requirements-heading">
            {content?.documents_title || "Required Documents"}
          </h3>
          <p>
            {content?.documents_description ||
              "All applications must include the following certified documents:"}
          </p>

          <ul className="requirements-list">
            {requiredDocuments.map((document, index) => (
              <li key={`${document}-${index}`}>{document}</li>
            ))}
          </ul>

          <h3 className="requirements-heading">
            {content?.grades_title || "Grade Admissions"}
          </h3>

          <p>
            {content?.grades_description || (
              <>
                Applications are primarily accepted for <strong>Grade 8</strong>,
                which is the entry level for the school. Applications for higher
                grades, Grades 9–12, may be considered depending on space
                availability.
              </>
            )}
          </p>

          <h3 className="requirements-heading">
            {content?.process_title || "Application Process"}
          </h3>

          <ul className="requirements-list">
            {applicationProcess.map((step, index) => (
              <li key={`${step}-${index}`}>{step}</li>
            ))}
          </ul>

          <h3 className="requirements-heading">
            {content?.notes_title || "Important Notes"}
          </h3>

          <ul className="requirements-list">
            {importantNotes.map((note, index) => (
              <li key={`${note}-${index}`}>{note}</li>
            ))}
          </ul>

          {(showApplyOnline || showDownloadForm || showViewForm) && (
            <div className="requirements-actions">
              {showApplyOnline && (
                <a
                  href={buildSiteHref(siteId, "/admissions/apply")}
                  onClick={(e) => {
                    e.preventDefault();
                    navigate("/admissions/apply");
                  }}
                  className="requirements-btn primary"
                >
                  {content?.apply_button_label || "Apply Online"}
                </a>
              )}

              {showDownloadForm && (
                <a
                  href={admissionsFormUrl}
                  download={!downloadIsExternal}
                  target={downloadIsExternal ? "_blank" : undefined}
                  rel={downloadIsExternal ? "noreferrer" : undefined}
                  className="requirements-btn navy"
                >
                  {content?.download_button_label || "Manual Application PDF"}
                </a>
              )}

              {showViewForm && (
                <a
                  href={admissionsFormUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="requirements-btn gray"
                >
                  {content?.view_button_label || "View Form"}
                </a>
              )}
            </div>
          )}

          <p className="requirements-note">
            {content?.footer_note ||
              "You can apply online, or download the manual form, complete it, and submit it to the school office with the required certified documents."}
          </p>
        </div>
      </Card>
    </main>
  );

  if (!section && !builderMode) {
    return pageContent;
  }

  return (
    <BuilderSectionTarget
      builderMode={builderMode}
      section={section}
      sectionType="school_entry_requirements"
      label={content?.section_title || "Entry Requirements"}
      templateCategory="school"
      templateKey="school-academic-tweed-v1"
    >
      {pageContent}
    </BuilderSectionTarget>
  );
}
