import React from "react";
import BuilderSectionTarget from "../../../../../builder/BuilderSectionTarget";
import Card from "../../components/common/Card";
import termPlanPdf from "../../assets/term-plan.pdf";

export default function TermPlan({
  section = null,
  content = {},
  builderMode = false,
}) {
  const pdfPath = content?.pdf_url || termPlanPdf;

  const pageContent = (
    <section className="container" style={{ paddingTop: 10, paddingBottom: 40 }}>
      <h2 className="section-title">
        {content?.section_title || "Academic Term Plan"}
      </h2>

      <Card>
        <div style={{ maxWidth: 900 }}>
          <p style={{ opacity: 0.9, lineHeight: 1.6 }}>
            {content?.description ||
              content?.subtitle ||
              "The Academic Term Plan provides important information about the school academic year including term dates, examination periods, school holidays, and other key academic activities."}
          </p>

          <p style={{ opacity: 0.9, lineHeight: 1.6 }}>
            {content?.supporting_text ||
              "Learners, parents, and educators are encouraged to review the official term plan regularly to stay informed about important academic dates and school events."}
          </p>

          {/* Buttons */}
          <div
            style={{
              marginTop: 20,
              display: "flex",
              gap: 12,
              flexWrap: "wrap",
            }}
          >
            <a
              href={pdfPath}
              target="_blank"
              rel="noreferrer"
              className="btn-primary"
              style={{
                padding: "10px 18px",
                borderRadius: 8,
                textDecoration: "none",
                fontWeight: 700,
              }}
            >
              {content?.view_button_label || "View Term Plan"}
            </a>

            <a
              href={pdfPath}
              download
              className="btn-secondary"
              style={{
                padding: "10px 18px",
                borderRadius: 8,
                textDecoration: "none",
                fontWeight: 700,
              }}
            >
              {content?.download_button_label || "Download PDF"}
            </a>
          </div>

          {/* PDF Preview */}
          <div style={{ marginTop: 28 }}>
            <iframe
              src={pdfPath}
              title={content?.pdf_title || "Academic Term Plan"}
              style={{
                width: "100%",
                height: "600px",
                border: "1px solid #e5e7eb",
                borderRadius: "10px",
              }}
            />
          </div>
        </div>
      </Card>
    </section>
  );

  if (!section && !builderMode) {
    return pageContent;
  }

  return (
    <BuilderSectionTarget
      builderMode={builderMode}
      section={section}
      sectionType="school_term_plan"
      label={content?.section_title || "Academic Term Plan"}
      templateCategory="school"
      templateKey="school-prestige-v1"
    >
      {pageContent}
    </BuilderSectionTarget>
  );
}
