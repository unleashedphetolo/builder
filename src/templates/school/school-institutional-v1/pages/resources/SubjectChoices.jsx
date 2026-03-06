import React from "react";
import Card from "../../components/common/Card";
import "../../styles/subject-choices.css";
import Breadcrumbs from "../../components/common/Breadcrumbs";

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

export default function SubjectChoices() {
  return (
    <main className="subject-choices-page container">
      <Breadcrumbs />
      <header className="sc-hero">
        <h1 className="sc-title">Subject Choices</h1>
        <p className="sc-subtitle">
          Use this guide to understand subject options by grade and choose the best pathway based on interests,
          strengths and career goals.
        </p>
      </header>

      {/* Grade 8-9 */}
      <section className="sc-section">
        <div className="sc-section-head">
          <h2 className="sc-h2">Grade 8–9 Core Subjects</h2>
          <p className="sc-desc">
            These are the standard compulsory subjects offered in the Senior Phase.
          </p>
        </div>

        <Card>
          <ul className="sc-list">
            {GRADE_8_9_CORE.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
          <p className="sc-note">
            Note: Exact subjects may vary depending on school offerings. Update this list to match Sebone’s official curriculum.
          </p>
        </Card>
      </section>

      {/* Grade 10-12 */}
      <section className="sc-section">
        <div className="sc-section-head">
          <h2 className="sc-h2">Grade 10–12 Streams</h2>
          <p className="sc-desc">
            In Grade 10–12, learners usually select a stream (pathway). The final subject package should meet promotion
            and NSC requirements.
          </p>
        </div>

        <div className="sc-grid">
          {STREAMS.map((stream) => (
            <Card key={stream.title}>
              <h3 className="sc-h3">{stream.title}</h3>
              <p className="sc-summary">{stream.summary}</p>

              <div className="sc-subjects">
                <div className="sc-subjects-title">Typical subject package:</div>
                <ul className="sc-list compact">
                  {stream.subjects.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
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
          <h2 className="sc-h2">Electives & Additional Options</h2>
          <p className="sc-desc">
            These subjects depend on availability and class capacity. Confirm with the school before selecting.
          </p>
        </div>

        <Card>
          <div className="sc-electives">
            {ELECTIVES.map((e) => (
              <div className="sc-elective" key={e.name}>
                <div className="sc-elective-name">{e.name}</div>
                <div className="sc-elective-desc">{e.desc}</div>
              </div>
            ))}
          </div>

          <p className="sc-note">
            If your school does not offer some options above, remove them and replace with Sebone’s real electives.
          </p>
        </Card>
      </section>

      {/* Downloads */}
      <section className="sc-section">
        <div className="sc-section-head">
          <h2 className="sc-h2">Downloads</h2>
          <p className="sc-desc">
            You can upload PDF documents to the <code>public</code> folder and link them here.
          </p>
        </div>

        <Card>
          <div className="sc-downloads">
            <a className="sc-download" href="/site/docs/subject-choice-form.pdf" target="_blank" rel="noreferrer">
              Subject Choice Form (PDF) →
            </a>
            <a className="sc-download" href="/site/docs/grade-10-subject-guide.pdf" target="_blank" rel="noreferrer">
              Grade 10 Subject Guide (PDF) →
            </a>
          </div>

          <p className="sc-note">
            If you don’t have PDFs yet, keep the section and remove these links until documents are available.
          </p>
        </Card>
      </section>
    </main>
  );
}