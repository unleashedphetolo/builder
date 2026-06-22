import React from "react";
import BuilderSectionTarget from "../../../../../builder/BuilderSectionTarget";
import Card from "../../components/common/Card";
import "../../styles/subject-choices.css";

const GRADE_8_9_CORE = [
  "Home Language",
  "First Additional Language",
  "Mathematics",
  "Natural Sciences",
  "Social Sciences",
  "Technology",
  "Economic & Management Sciences (EMS)",
  "Life Orientation",
  "Creative Arts",
];

const STREAMS = [
  {
    title: "Science & Technology Stream",
    summary: "Best for learners interested in engineering, health sciences, IT and technical careers.",
    subjects: [
      "Mathematics",
      "Physical Sciences",
      "Life Sciences",
      "Geography or Information Technology (if offered)",
      "Life Orientation",
      "Home Language",
      "First Additional Language",
    ],
    note: "Some schools offer CAT/IT; replace with the correct option at Sebone.",
  },
  {
    title: "Commerce Stream",
    summary: "Best for learners interested in business, finance, accounting, economics and management.",
    subjects: [
      "Mathematics or Mathematical Literacy (depending on requirements)",
      "Accounting",
      "Business Studies",
      "Economics",
      "Life Orientation",
      "Home Language",
      "First Additional Language",
    ],
  },
  {
    title: "Humanities Stream",
    summary: "Best for learners interested in law, education, languages, social sciences and public service.",
    subjects: [
      "Mathematics or Mathematical Literacy",
      "History or Geography",
      "Life Sciences or Tourism (if offered)",
      "Religious Studies / Consumer Studies (if offered)",
      "Life Orientation",
      "Home Language",
      "First Additional Language",
    ],
    note: "Replace optional subjects with what your school offers.",
  },
];

const ELECTIVES = [
  { name: "Computer Applications Technology (CAT)", desc: "Office tools, productivity, basic computer skills." },
  { name: "Information Technology (IT)", desc: "Programming and computing concepts (if offered)." },
  { name: "Tourism", desc: "Tourism industry knowledge and practical learning." },
  { name: "Consumer Studies", desc: "Food, nutrition and consumer management (if offered)." },
  { name: "Agricultural Sciences", desc: "Agriculture and life sciences focus (if offered)." },
];

const DOWNLOADS = [
  {
    id: "subject-choice-form",
    label: "Subject Choice Form (PDF) →",
    href: "/site/docs/subject-choice-form.pdf",
  },
  {
    id: "grade-10-subject-guide",
    label: "Grade 10 Subject Guide (PDF) →",
    href: "/site/docs/grade-10-subject-guide.pdf",
  },
];

export default function SubjectChoices({
  section = null,
  content = {},
  builderMode = false,
}) {
  const coreSubjects =
    Array.isArray(content?.core_subjects) && content.core_subjects.length > 0
      ? content.core_subjects
      : GRADE_8_9_CORE;

  const streams =
    Array.isArray(content?.streams) && content.streams.length > 0
      ? content.streams
      : STREAMS;

  const electives =
    Array.isArray(content?.electives) && content.electives.length > 0
      ? content.electives
      : ELECTIVES;

  const downloads =
    Array.isArray(content?.downloads) && content.downloads.length > 0
      ? content.downloads
      : DOWNLOADS;

  const pageContent = (
    <main className="subject-choices-page container">
      <header className="sc-hero">
        <h1 className="sc-title">
          {content?.section_title || "Subject Choices"}
        </h1>
        <p className="sc-subtitle">
          {content?.subtitle ||
            "Use this guide to understand subject options by grade and choose the best pathway based on interests, strengths and career goals."}
        </p>
      </header>

      {/* Grade 8-9 */}
      <section className="sc-section">
        <div className="sc-section-head">
          <h2 className="sc-h2">
            {content?.core_title || "Grade 8–9 Core Subjects"}
          </h2>
          <p className="sc-desc">
            {content?.core_description ||
              "These are the standard compulsory subjects offered in the Senior Phase."}
          </p>
        </div>

        <Card>
          <ul className="sc-list">
            {coreSubjects.map((subject, index) => (
              <li key={`${subject}-${index}`}>{subject}</li>
            ))}
          </ul>
          <p className="sc-note">
            {content?.core_note ||
              "Note: Exact subjects may vary depending on school offerings. Update this list to match Sebone’s official curriculum."}
          </p>
        </Card>
      </section>

      {/* Grade 10-12 */}
      <section className="sc-section">
        <div className="sc-section-head">
          <h2 className="sc-h2">
            {content?.streams_title || "Grade 10–12 Streams"}
          </h2>
          <p className="sc-desc">
            {content?.streams_description ||
              "In Grade 10–12, learners usually select a stream (pathway). The final subject package should meet promotion and NSC requirements."}
          </p>
        </div>

        <div className="sc-grid">
          {streams.map((stream, index) => (
            <Card key={stream.id || stream.title || `stream-${index}`}>
              <h3 className="sc-h3">{stream.title || ""}</h3>
              <p className="sc-summary">
                {stream.summary || stream.body || ""}
              </p>

              <div className="sc-subjects">
                <div className="sc-subjects-title">
                  {stream.subjects_title || "Typical subject package:"}
                </div>
                <ul className="sc-list compact">
                  {(Array.isArray(stream.subjects) ? stream.subjects : []).map(
                    (subject, subjectIndex) => (
                      <li key={`${subject}-${subjectIndex}`}>{subject}</li>
                    ),
                  )}
                </ul>
              </div>

              {stream.note ? <p className="sc-note">{stream.note}</p> : null}
            </Card>
          ))}
        </div>
      </section>

      {/* Electives */}
      <section className="sc-section">
        <div className="sc-section-head">
          <h2 className="sc-h2">
            {content?.electives_title || "Electives & Additional Options"}
          </h2>
          <p className="sc-desc">
            {content?.electives_description ||
              "These subjects depend on availability and class capacity. Confirm with the school before selecting."}
          </p>
        </div>

        <Card>
          <div className="sc-electives">
            {electives.map((elective, index) => (
              <div
                className="sc-elective"
                key={elective.id || elective.name || `elective-${index}`}
              >
                <div className="sc-elective-name">
                  {elective.name || elective.title || ""}
                </div>
                <div className="sc-elective-desc">
                  {elective.desc || elective.body || elective.description || ""}
                </div>
              </div>
            ))}
          </div>

          <p className="sc-note">
            {content?.electives_note ||
              "If your school does not offer some options above, remove them and replace with Sebone’s real electives."}
          </p>
        </Card>
      </section>

      {/* Downloads */}
      <section className="sc-section">
        <div className="sc-section-head">
          <h2 className="sc-h2">
            {content?.downloads_title || "Downloads"}
          </h2>
          <p className="sc-desc">
            {content?.downloads_description || (
              <>
                You can upload PDF documents to the <code>public</code> folder
                and link them here.
              </>
            )}
          </p>
        </div>

        <Card>
          <div className="sc-downloads">
            {downloads.map((download, index) => (
              <a
                key={download.id || download.href || `download-${index}`}
                className="sc-download"
                href={download.href || download.link || "#"}
                target="_blank"
                rel="noreferrer"
              >
                {download.label || download.title || "Download →"}
              </a>
            ))}
          </div>

          <p className="sc-note">
            {content?.downloads_note ||
              "If you don’t have PDFs yet, keep the section and remove these links until documents are available."}
          </p>
        </Card>
      </section>
    </main>
  );

  if (!section && !builderMode) {
    return pageContent;
  }

  return (
    <BuilderSectionTarget
      builderMode={builderMode}
      section={section}
      sectionType="school_subject_choices"
      label={content?.section_title || "Subject Choices"}
      templateCategory="school"
      templateKey="school-sports-academy-v1"
    >
      {pageContent}
    </BuilderSectionTarget>
  );
}
