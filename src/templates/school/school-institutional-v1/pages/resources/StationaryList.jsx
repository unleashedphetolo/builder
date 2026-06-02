import React, { useMemo, useState } from "react";
import BuilderSectionTarget from "../../../../../builder/BuilderSectionTarget";
import Card from "../../components/common/Card";
import "../../styles/stationary.css";

const STATIONERY = [
  // Grade 8
  { id: 1, grade: "Grade 8", subject: "All Subjects", items: "72-page exercise books, A4 hard cover books, file folder, pens/pencils/eraser, ruler, glue stick" },
  { id: 2, grade: "Grade 8", subject: "Mathematics", items: "Scientific calculator, mathematical set, graph book" },
  { id: 3, grade: "Grade 8", subject: "Natural Sciences", items: "A4 hard cover book, calculator (recommended), colour pencils" },

  // Grade 9
  { id: 4, grade: "Grade 9", subject: "All Subjects", items: "Exercise books, A4 hard cover books, file folder, highlighters, pens/pencils/eraser, ruler" },
  { id: 5, grade: "Grade 9", subject: "Mathematics", items: "Scientific calculator, mathematical set, graph book" },
  { id: 6, grade: "Grade 9", subject: "Natural Sciences", items: "A4 hard cover book, calculator (recommended), colour pencils" },

  // Grade 10–12
  { id: 7, grade: "Grade 10–12", subject: "All Subjects", items: "Subject exercise books, A4 hard cover books, file folder for assessments, pens/pencils/eraser, ruler" },
  { id: 8, grade: "Grade 10–12", subject: "Mathematics / Maths Lit", items: "Scientific calculator, mathematical set, graph book" },
  { id: 9, grade: "Grade 10–12", subject: "Physical Sciences", items: "Scientific calculator, A4 hard cover book, practical file/folder" },
];

export default function StationaryList({
  section = null,
  content = {},
  builderMode = false,
}) {
  const [grade, setGrade] = useState("All");
  const [q, setQ] = useState("");

  const stationeryItems =
    Array.isArray(content?.items) && content.items.length > 0
      ? content.items
      : STATIONERY;

  const gradeOptions = useMemo(() => {
    return [...new Set(stationeryItems.map((item) => item.grade).filter(Boolean))];
  }, [stationeryItems]);

  const rows = useMemo(() => {
    const query = q.trim().toLowerCase();

    return stationeryItems.filter((r) => {
      const rowGrade = String(r.grade || "");
      const rowSubject = String(r.subject || "");
      const rowItems = String(r.items || r.body || "");

      const gradeOk = grade === "All" ? true : rowGrade === grade;
      const queryOk =
        !query ||
        rowGrade.toLowerCase().includes(query) ||
        rowSubject.toLowerCase().includes(query) ||
        rowItems.toLowerCase().includes(query);

      return gradeOk && queryOk;
    });
  }, [stationeryItems, grade, q]);

  const pdfPath = content?.pdf_url || "/site/docs/stationary-list.pdf";

  const pageContent = (
    <section className="stationary-page container">
      <header className="stationary-head">
        <div>
          <h2 className="section-title">
            {content?.section_title || "Stationery Requirements"}
          </h2>
          <p className="stationary-sub">
            {content?.subtitle ||
              "Official stationery items per grade and subject. Please ensure learners have the required materials."}
          </p>
        </div>

        <div className="stationary-actions">
          <a className="stationary-btn" href={pdfPath} download>
            {content?.download_button_label || "Download PDF"}
          </a>
        </div>
      </header>

      <Card>
        <div className="stationary-tools">
          <div className="stationary-filter">
            <label className="st-label">Filter by Grade</label>
            <select value={grade} onChange={(e) => setGrade(e.target.value)}>
              <option value="All">All Grades</option>
              {gradeOptions.map((gradeOption) => (
                <option key={gradeOption} value={gradeOption}>
                  {gradeOption}
                </option>
              ))}
            </select>
          </div>

          <div className="stationary-search">
            <label className="st-label">Search</label>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search (e.g. calculator, maths, file folder)"
              aria-label="Search stationery"
            />
          </div>
        </div>

        <div className="stationary-table-wrap" role="region" aria-label="Stationery table">
          <table className="stationary-table">
            <thead>
              <tr>
                <th>Grade</th>
                <th>Subject</th>
                <th>Required Stationery</th>
              </tr>
            </thead>

            <tbody>
              {rows.map((r, index) => (
                <tr key={r.id || `${r.grade || "grade"}-${r.subject || "subject"}-${index}`}>
                  <td className="st-grade" data-label="Grade">{r.grade || ""}</td>
                  <td className="st-subject" data-label="Subject">{r.subject || ""}</td>
                  <td className="st-items" data-label="Required Stationery">
                    {r.items || r.body || ""}
                  </td>
                </tr>
              ))}

              {rows.length === 0 && (
                <tr>
                  <td colSpan={3} className="st-empty">
                    No results found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <p className="stationary-note">
          {content?.footer_note ||
            "Note: Teachers may issue additional subject-specific requirements during the first week of school."}
        </p>
      </Card>
    </section>
  );

  if (!section) {
    return pageContent;
  }

  return (
    <BuilderSectionTarget
      builderMode={builderMode}
      section={section}
      sectionType="services"
      label={content?.section_title || "Stationery Requirements"}
      templateCategory="school"
      templateKey="school-institutional-v1"
    >
      {pageContent}
    </BuilderSectionTarget>
  );
}
