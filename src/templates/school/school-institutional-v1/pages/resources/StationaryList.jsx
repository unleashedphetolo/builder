import React, { useMemo, useState } from "react";
import Card from "../../components/common/Card";
import "../../styles/stationary.css";
import Breadcrumbs from "../../components/common/Breadcrumbs";

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

export default function StationaryList() {
  const [grade, setGrade] = useState("All");
  const [q, setQ] = useState("");

  const rows = useMemo(() => {
    const query = q.trim().toLowerCase();
    return STATIONERY.filter((r) => {
      const gradeOk = grade === "All" ? true : r.grade === grade;
      const queryOk =
        !query ||
        r.grade.toLowerCase().includes(query) ||
        r.subject.toLowerCase().includes(query) ||
        r.items.toLowerCase().includes(query);
      return gradeOk && queryOk;
    });
  }, [grade, q]);

  return (
    <section className="stationary-page container">
      <Breadcrumbs />
      <header className="stationary-head">
        <div>
          <h2 className="section-title">Stationery Requirements</h2>
          <p className="stationary-sub">
            Official stationery items per grade and subject. Please ensure learners have the required materials.
          </p>
        </div>

        <div className="stationary-actions">
          <a className="stationary-btn" href="/site/docs/stationary-list.pdf" download>
            Download PDF
          </a>
        </div>
      </header>

      <Card>
        <div className="stationary-tools">
          <div className="stationary-filter">
            <label className="st-label">Filter by Grade</label>
            <select value={grade} onChange={(e) => setGrade(e.target.value)}>
              <option value="All">All Grades</option>
              <option value="Grade 8">Grade 8</option>
              <option value="Grade 9">Grade 9</option>
              <option value="Grade 10–12">Grade 10–12</option>
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
              {rows.map((r) => (
                <tr key={r.id}>
                  <td className="st-grade" data-label="Grade">{r.grade}</td>
                  <td className="st-subject" data-label="Subject">{r.subject}</td>
                  <td className="st-items" data-label="Required Stationery">{r.items}</td>
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
          Note: Teachers may issue additional subject-specific requirements during the first week of school.
        </p>
      </Card>
    </section>
  );
}