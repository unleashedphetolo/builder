import React from "react";
import "../../styles/howtoapply.css";

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

export default function HowToApply({ settings = {}, navItems = [] }) {
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

  return (
    <main
      className="howtoapply container"
      style={{ paddingTop: 10, paddingBottom: 40 }}
    >
      {/* HERO */}
      <header className="howtoapply-hero">
        <div className="howtoapply-left">
          <h1 className="howtoapply-title">How to Apply</h1>

          <p className="howtoapply-sub">
            Apply to {schoolName} using the online application or submit a
            manual form at the school. Please ensure all supporting documents
            are certified where required.
          </p>

          <div className="howtoapply-badges">
            <span className="howtoapply-pill">Admissions</span>
            <span className="howtoapply-pill ghost">Grade 8–12</span>
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
              Apply Online
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
              Download Manual Form (PDF)
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
              Need Help?
            </a>
          )}
        </div>
      </header>

      {/* TWO OPTIONS */}
      <section className="howtoapply-grid">
        {showApplyOnline && (
          <article className="howtoapply-card">
            <h2 className="howtoapply-card-title">Option A: Apply Online</h2>

            <p className="howtoapply-text">
              Complete the online form and upload the required documents. You
              will receive an application reference number.
            </p>

            <ol className="howtoapply-steps">
              <li>Fill in learner details and parent/guardian details.</li>
              <li>Provide previous school information if applicable.</li>
              <li>Upload required documents in PDF, JPG, or PNG format.</li>
              <li>Review and submit your application.</li>
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
                Start Online Application
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
                  View Requirements
                </a>
              )}
            </div>
          </article>
        )}

        {showDownloadForm && (
          <article className="howtoapply-card">
            <h2 className="howtoapply-card-title">
              Option B: Manual Application
            </h2>

            <p className="howtoapply-text">
              Download the manual application form, complete it and submit it at
              the school office with certified copies.
            </p>

            <ul className="howtoapply-list">
              <li>Download and print the form.</li>
              <li>Complete clearly in block letters.</li>
              <li>Attach certified supporting documents.</li>
              <li>Submit to the Administration Office during school hours.</li>
            </ul>

            <div className="howtoapply-actions">
              <a
                href={admissionsFormUrl}
                download={!downloadIsExternal}
                target={downloadIsExternal ? "_blank" : undefined}
                rel={downloadIsExternal ? "noopener noreferrer" : undefined}
                className="howtoapply-btn primary"
              >
                Download Manual Form
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
                  Contact the School
                </a>
              )}
            </div>
          </article>
        )}
      </section>

      {/* DOCUMENTS QUICK LIST */}
      <section className="howtoapply-card howtoapply-card-wide">
        <h2 className="howtoapply-card-title">Required Documents Summary</h2>

        <p className="howtoapply-text">
          The documents below are typically required. Please confirm on the Entry
          Requirements page for the latest list.
        </p>

        <div className="docs-grid">
          <div className="doc-item">
            Certified copy of learner Birth Certificate / ID
          </div>
          <div className="doc-item">Certified copy of parent/guardian ID</div>
          <div className="doc-item">Latest school report</div>
          <div className="doc-item">Proof of address</div>
          <div className="doc-item">Transfer letter if applicable</div>
          <div className="doc-item">
            Immunisation card / clinic card if applicable
          </div>
        </div>

        <div className="howtoapply-note">
          For official confirmation of placement and deadlines, please contact
          the Administration Office.
        </div>
      </section>
    </main>
  );
}