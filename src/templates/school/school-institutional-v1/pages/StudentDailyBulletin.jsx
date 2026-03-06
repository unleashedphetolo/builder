import React, { useMemo, useState } from "react";
import "../styles/bulletin.css";
import Breadcrumbs from "../components/common/Breadcrumbs";

const BULLETINS = [
  {
    id: 1,
    date: "18 March 2026",
    title: "Mathematics Extra Classes",
    category: "Academics",
    urgent: false,
    content:
      "Grade 12 learners will attend Mathematics extra classes from 14:30 – 16:00 in Room 12.",
  },
  {
    id: 2,
    date: "18 March 2026",
    title: "School Assembly Reminder",
    category: "General",
    urgent: true,
    content:
      "All learners must report to the assembly ground at 07:30 sharp in full school uniform.",
  },
  {
    id: 3,
    date: "17 March 2026",
    title: "Soccer Trials",
    category: "Sports",
    urgent: false,
    content:
      "Soccer trials will take place at 15:00 on the main field. Bring training kit.",
  },
  {
    id: 4,
    date: "17 March 2026",
    title: "Life Sciences Practical",
    category: "Academics",
    urgent: false,
    content:
      "Grade 11 learners must bring lab coats for the Life Sciences practical session.",
  },
];

export default function StudentDailyBulletin() {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    if (!search) return BULLETINS;
    return BULLETINS.filter(
      (item) =>
        item.title.toLowerCase().includes(search.toLowerCase()) ||
        item.content.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  return (
    <main className="bulletin-page container">
      <Breadcrumbs />
      <header className="bulletin-header">
        <div>
          <h1 className="bulletin-title">Student Daily Bulletin</h1>
          <p className="bulletin-subtitle">
            Official daily announcements for learners at M.O.M Sebone Secondary School.
          </p>
        </div>

        <input
          type="text"
          placeholder="Search bulletin..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bulletin-search"
        />
      </header>

      <section className="bulletin-list">
        {filtered.map((item) => (
          <article
            key={item.id}
            className={`bulletin-card ${item.urgent ? "urgent" : ""}`}
          >
            <div className="bulletin-meta">
              <span className="bulletin-date">{item.date}</span>
              <span className="bulletin-category">{item.category}</span>
              {item.urgent && <span className="urgent-badge">URGENT</span>}
            </div>

            <h3 className="bulletin-heading">{item.title}</h3>
            <p className="bulletin-content">{item.content}</p>
          </article>
        ))}

        {filtered.length === 0 && (
          <div className="bulletin-empty">
            No announcements matched your search.
          </div>
        )}
      </section>
    </main>
  );
}