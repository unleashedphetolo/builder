import React from "react";
import "../../styles/requirements.css";
import Card from "../../components/common/Card";

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

export default function Requirements({ settings = {}, navItems = [] }) {
  const organization = settings?.organization || {};
  const siteId = settings?.site_id || "";

  const schoolName = pickFirstValue(
    settings?.site_name,
    settings?.organization_name,
    organization?.name,
    settings?.name,
    "the school",
  );

  const admissionsFormUrl = pickFirstValue(
    settings?.admissions_form_url,
    settings?.admission_form_url,
    settings?.application_form_url,
    settings?.download_form_url,
    settings?.admissions_pdf_url,
    "/site/docs/admission-form.pdf",
  );

  const showApplyOnline = isVisibleByNav(navItems, ["/admissions/apply"], true);

  const showDownloadForm = settings?.features?.admissionsDownload !== false;

  const showViewForm = settings?.features?.admissionsViewForm !== false;

  const downloadIsExternal = isExternalHref(admissionsFormUrl);

  const navigate = (slug) => {
    window.dispatchEvent(new CustomEvent("builder:navigate", { detail: slug }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <main className="container requirements-page">
      <h2 className="section-title">Entry Requirements</h2>

      <Card>
        <div className="requirements-content">
          <p>
            {schoolName}{" "} welcomes applications from learners who are committed
            to academic excellence, discipline, and positive participation in
            school life. Admission is subject to available space and compliance
            with the school&apos;s admission policy.
          </p>

          <h3 className="requirements-heading">Required Documents</h3>
          <p>All applications must include the following certified documents:</p>

          <ul className="requirements-list">
            <li>Certified copy of learner&apos;s birth certificate or ID</li>
            <li>Certified copy of parent/guardian ID</li>
            <li>Latest school report</li>
            <li>Proof of residential address</li>
            <li>Transfer letter from previous school if applicable</li>
            <li>Immunisation card if available</li>
          </ul>

          <h3 className="requirements-heading">Grade Admissions</h3>

          <p>
            Applications are primarily accepted for <strong>Grade 8</strong>,
            which is the entry level for the school. Applications for higher
            grades, Grades 9–12, may be considered depending on space
            availability.
          </p>

          <h3 className="requirements-heading">Application Process</h3>

          <ul className="requirements-list">
            <li>Complete the official school application form.</li>
            <li>Submit all required supporting documents.</li>
            <li>Applications may be submitted online or at the school office.</li>
            <li>
              Parents will be contacted once the application has been reviewed.
            </li>
          </ul>

          <h3 className="requirements-heading">Important Notes</h3>

          <ul className="requirements-list">
            <li>All documents must be certified.</li>
            <li>Incomplete applications may not be processed.</li>
            <li>Submission of an application does not guarantee admission.</li>
            <li>Admission decisions are subject to the school&apos;s capacity.</li>
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
                  Apply Online
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
                  Manual Application PDF
                </a>
              )}

              {showViewForm && (
                <a
                  href={admissionsFormUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="requirements-btn gray"
                >
                  View Form
                </a>
              )}
            </div>
          )}

          <p className="requirements-note">
            You can apply online, or download the manual form, complete it, and
            submit it to the school office with the required certified
            documents.
          </p>
        </div>
      </Card>
    </main>
  );
}