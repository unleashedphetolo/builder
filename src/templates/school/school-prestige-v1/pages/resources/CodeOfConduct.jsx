import React from "react";
import BuilderSectionTarget from "../../../../../builder/BuilderSectionTarget";
import Card from "../../components/common/Card";

const DEFAULT_RULES = [
  {
    id: "respect-behaviour",
    title: "Respect and Behaviour",
    body:
      "Learners must treat teachers, staff members, fellow learners, and visitors with respect and dignity at all times. Bullying, discrimination, harassment, or any form of violence is strictly prohibited.",
  },
  {
    id: "attendance",
    title: "Attendance",
    body:
      "Regular attendance is essential for academic success. Learners must attend school daily, arrive on time, and participate fully in all learning activities unless a valid reason is provided.",
  },
  {
    id: "school-uniform",
    title: "School Uniform",
    body:
      "Learners are required to wear the correct school uniform at all times during school hours and official school activities. The uniform must be clean, neat, and worn in accordance with school policy.",
  },
  {
    id: "academic-responsibility",
    title: "Academic Responsibility",
    body:
      "Learners are expected to complete all assignments, homework, and assessments honestly and on time. Cheating, plagiarism, or academic dishonesty will not be tolerated.",
  },
  {
    id: "safety-property",
    title: "Safety and School Property",
    body:
      "Learners must respect school property and maintain a clean environment. Any damage to school facilities or equipment may result in disciplinary action.",
  },
  {
    id: "discipline",
    title: "Discipline",
    body:
      "Failure to comply with school rules may result in disciplinary action in accordance with the school's disciplinary procedures and national education regulations.",
  },
];

export default function CodeOfConduct({
  section = null,
  content = {},
  builderMode = false,
}) {
  const pdfFile = content?.pdf_url || "/docs/code-of-conduct.pdf";

  const rules =
    Array.isArray(content?.rules) && content.rules.length > 0
      ? content.rules
      : Array.isArray(content?.items) && content.items.length > 0
        ? content.items
        : DEFAULT_RULES;

  const pageContent = (
    <section className="container" style={{ paddingTop: 10, paddingBottom: 40 }}>
      <h2 className="section-title">
        {content?.section_title || "Learner Code of Conduct"}
      </h2>

      <Card>
        <div style={{ lineHeight: 1.7, maxWidth: 900 }}>
          <p>
            {content?.body || content?.introduction ? (
              content?.body || content?.introduction
            ) : (
              <>
                The Learner Code of Conduct of{" "}
                <strong>{content?.school_name || "the school"}{" "}</strong>
                sets out the standards of behaviour expected from every learner.
                These rules are designed to create a safe, disciplined, and respectful
                environment that supports effective teaching and learning.
              </>
            )}
          </p>

          {rules.map((rule, index) => (
            <React.Fragment
              key={rule.id || rule.title || `conduct-rule-${index}`}
            >
              <h3>
                {index + 1}. {rule.title || ""}
              </h3>
              <p>{rule.body || rule.text || rule.description || ""}</p>
            </React.Fragment>
          ))}

          <p>
            {content?.closing_text ||
              "Parents and guardians are encouraged to review this policy together with learners to ensure that all expectations are clearly understood."}
          </p>

          {/* Buttons */}
          <div style={{ marginTop: 24, display: "flex", gap: 12, flexWrap: "wrap" }}>
            <a
              href={pdfFile}
              target="_blank"
              rel="noreferrer"
              style={{
                padding: "10px 16px",
                borderRadius: 8,
                background: "#2a1b6b",
                color: "#fff",
                fontWeight: 700,
                textDecoration: "none",
              }}
            >
              {content?.view_button_label || "View Full Document"}
            </a>

            <a
              href={pdfFile}
              download
              style={{
                padding: "10px 16px",
                borderRadius: 8,
                background: "#0b3b8f",
                color: "#fff",
                fontWeight: 700,
                textDecoration: "none",
              }}
            >
              {content?.download_button_label || "Download Code of Conduct (PDF)"}
            </a>
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
      sectionType="school_code_of_conduct"
      label={content?.section_title || "Learner Code of Conduct"}
      templateCategory="school"
      templateKey="school-prestige-v1"
    >
      {pageContent}
    </BuilderSectionTarget>
  );
}
