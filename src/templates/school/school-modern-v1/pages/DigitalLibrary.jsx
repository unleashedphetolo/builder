// DigitalLibrary.js
// Institutional Digital Library – Resource Modal, Search & Filters, PDF Viewer, NSC Exam Portal (Grade 12)

import React, { useState } from "react";
import "../styles/digital-library.css";
import Breadcrumbs from "../components/common/Breadcrumbs";

const grades = [8, 9, 10, 11, 12];
const terms = ["Term 1", "Term 2", "Term 3", "Term 4"];

const provinces = [
  "National",
  "Gauteng",
  "Limpopo",
  "Western Cape",
  "Mpumalanga",
  "Free State",
  "KwaZulu-Natal",
  "North West",
  "Eastern Cape",
  "Northern Cape",
];

const subjects = {
  Languages: [
    "English HL",
    "English FAL",
    "Afrikaans",
    "IsiXhosa",
    "IsiZulu",
    "Sepedi",
    "Sesotho",
    "Setswana",
    "Xitsonga",
    "Tshivenda",
    "Siswati",
    "IsiNdebele",
  ],
  "Mathematics & Life Skills": [
    "Mathematics",
    "Mathematical Literacy",
    "Life Orientation",
  ],
  Sciences: ["Physical Sciences", "Life Sciences"],
  Commerce: ["Accounting", "Business Studies", "Economics"],
  Humanities: ["History", "Geography", "Tourism"],
  Technology: [
    "Computer Applications Technology (CAT)",
    "Information Technology (IT)",
    "Engineering Graphics & Design (EGD)",
  ],
  "Arts & Creative": [
"Visual Arts",
"Music",
"Dramatic Arts",
"Dance Studies",
"Hospitality Studies",
],
  Other: ["Agricultural Sciences", "Consumer Studies", "Religion Studies"],
};

/* ================= RESOURCE DATA (REQUIRED) ================= */
const resources = [
  {
    title: "NSC Mathematics Final Examination",
    grade: 12,
    subject: "Mathematics",
    type: "Exam",
    year: 2023,
    province: "National",
    pdf: "/pdfs/maths-nsc-2023.pdf",
  },
  {
    title: "NSC Mathematics Final Memorandum",
    grade: 12,
    subject: "Mathematics",
    type: "Memo",
    year: 2023,
    province: "National",
    pdf: "/pdfs/maths-nsc-2023-memo.pdf",
  },
  {
    title: "Physical Sciences November Exam",
    grade: 11,
    subject: "Physical Sciences",
    type: "Exam",
    year: 2022,
    province: "Gauteng",
    pdf: "/pdfs/physics-2022.pdf",
  },
];

export default function DigitalLibrary() {
  const [selectedGrade, setSelectedGrade] = useState(10);
  const [selectedTerm, setSelectedTerm] = useState("Term 1");
  const [openCategory, setOpenCategory] = useState(null);

  /* Filters */
  const [search, setSearch] = useState("");
  const [filterSubject, setFilterSubject] = useState("All");
  const [filterYear, setFilterYear] = useState("All");
  const [filterProvince, setFilterProvince] = useState("All");
  const [activePDF, setActivePDF] = useState(null);

  const clearFilters = () => {
    setSearch("");
    setFilterSubject("All");
    setFilterYear("All");
    setFilterProvince("All");
  };

  /* ================= FILTER LOGIC ================= */
  const filteredResources = resources.filter((r) => {
    return (
      r.grade === selectedGrade &&
      (filterSubject === "All" || r.subject === filterSubject) &&
      (filterYear === "All" || r.year === Number(filterYear)) &&
      (filterProvince === "All" || r.province === filterProvince) &&
      r.title.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <section className="digital-library container">
      <Breadcrumbs />
      {/* Header */}
      <header className="library-header">
        <h1>Digital Academic Library</h1>
        <p>Grades 8–12 | CAPS Curriculum | South Africa</p>
      </header>

      {/* ================= SEARCH & FILTERS ================= */}
      <div className="library-filters">
        <input
          type="text"
          placeholder="Search by title or keyword"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select value={filterSubject} onChange={(e) => setFilterSubject(e.target.value)}>
          <option value="All">All Subjects</option>
          {Object.values(subjects).flat().map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>

        <select value={filterYear} onChange={(e) => setFilterYear(e.target.value)}>
          <option value="All">All Years</option>
          <option value="2024">2024</option>
          <option value="2023">2023</option>
          <option value="2022">2022</option>
        </select>

        <select value={filterProvince} onChange={(e) => setFilterProvince(e.target.value)}>
          <option value="All">All Provinces</option>
          {provinces.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>

        <button className="clear-btn" onClick={clearFilters}>
          Clear Filters
        </button>
      </div>

      <div className="library-layout">
        {/* ================= SIDEBAR ================= */}
        <aside className="library-sidebar">
          <div className="sidebar-block">
            <h3>Grade</h3>
            {grades.map((g) => (
              <button
                key={g}
                className={g === selectedGrade ? "active" : ""}
                onClick={() => setSelectedGrade(g)}
              >
                Grade {g}
              </button>
            ))}
          </div>

          <div className="sidebar-block">
            <h3>Term</h3>
            {terms.map((t) => (
              <button
                key={t}
                className={t === selectedTerm ? "active" : ""}
                onClick={() => setSelectedTerm(t)}
              >
                {t}
              </button>
            ))}
          </div>
        </aside>

        {/* ================= MAIN CONTENT ================= */}
        <main className="library-content">
          <h2>Grade {selectedGrade} – {selectedTerm}</h2>

          {Object.entries(subjects).map(([category, subjectList]) => (
            <div key={category} className="subject-category">
              <button
                className="category-header"
                onClick={() =>
                  setOpenCategory(openCategory === category ? null : category)
                }
              >
                {category}
                <span>{openCategory === category ? "−" : "+"}</span>
              </button>

              {openCategory === category && (
                <div className="subject-grid">
                  {subjectList.map((subject) => (
                    <div key={subject} className="subject-card">
                      <h4>{subject}</h4>
                      <ul>
                        <li>📘 Notes & Textbooks</li>
                        <li>📝 Tests</li>
                        <li>📄 Exams</li>
                        <li>✅ Memorandums</li>
                        <li>📂 Past Question Papers</li>
                      </ul>
                      <button
                        className="open-btn"
                        onClick={() => setFilterSubject(subject)}
                      >
                        Open Resources
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}

          {/* ================= RESOURCE LIST ================= */}
          <div className="resource-grid">
            {filteredResources.length === 0 && (
              <p style={{ color: "#64748b", marginTop: 16 }}>
                No resources found for the selected filters.
              </p>
            )}

            {filteredResources.map((r, i) => (
              <div key={i} className="resource-card">
                <h4>{r.title}</h4>
                <p>Grade {r.grade} | {r.subject}</p>
                <p>{r.type} • {r.year} • {r.province}</p>
                <button onClick={() => setActivePDF(r.pdf)}>
                  Open Resource
                </button>
              </div>
            ))}
          </div>
        </main>

        {/* ================= RIGHT PANEL ================= */}
        <aside className="library-right">
          <div className="info-card">
            <h3>NSC Examination Portal – Grade 12</h3>
            <p>
              Official National Senior Certificate examination papers,
              trial examinations, supplementary exams and memorandums
              from national and provincial departments.
            </p>
          </div>
        </aside>
      </div>

      {/* ================= PDF VIEWER ================= */}
      {activePDF && (
        <div className="pdf-modal">
          <div className="pdf-content">
            <button className="close-btn" onClick={() => setActivePDF(null)}>
              ✕ Close
            </button>
            <iframe src={activePDF} title="PDF Viewer" />
          </div>
        </div>
      )}
    </section>
  );
}
