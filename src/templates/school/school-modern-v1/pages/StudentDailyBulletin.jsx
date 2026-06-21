import React, { useMemo, useState } from "react";
import BuilderSectionTarget from "../../../../builder/BuilderSectionTarget";
import "../styles/bulletin.css";

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

function formatBulletinDate(item = {}) {
  if (item.date) {
    return item.date;
  }

  if (!item.publishedAt) {
    return "";
  }

  const date = new Date(item.publishedAt);

  if (Number.isNaN(date.getTime())) {
    return item.publishedAt;
  }

  return date.toLocaleDateString(undefined, {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function normalizeBulletin(item = {}, index = 0) {
  return {
    id: item.id || `bulletin-${index + 1}`,
    date: formatBulletinDate(item),
    title: item.title || "",
    category: item.category || "General",
    urgent: item.urgent === true,
    content: item.content || item.body || item.message || "",
  };
}

export default function StudentDailyBulletin({
  section = null,
  content = {},
  builderMode = false,
}) {
  const [search, setSearch] = useState("");

  const bulletins = useMemo(() => {
    const source =
      Array.isArray(content?.items) && content.items.length > 0
        ? content.items
        : BULLETINS;

    return source.map(normalizeBulletin);
  }, [content?.items]);

  const filtered = useMemo(() => {
    if (!search) return bulletins;

    return bulletins.filter(
      (item) =>
        item.title.toLowerCase().includes(search.toLowerCase()) ||
        item.content.toLowerCase().includes(search.toLowerCase()),
    );
  }, [bulletins, search]);

  const pageContent = (
    <main className="bulletin-page container">
      <header className="bulletin-header">
        <div>
          <h1 className="bulletin-title">
            {content?.section_title || "Student Daily Bulletin"}
          </h1>
          <p className="bulletin-subtitle">
            {content?.subtitle ||
              "Official daily announcements for learners at M.O.M Sebone Secondary School."}
          </p>
        </div>

        <input
          type="text"
          placeholder={content?.search_placeholder || "Search bulletin..."}
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
            {content?.empty_message || "No announcements matched your search."}
          </div>
        )}
      </section>

      {content?.footer_note && (
        <p className="bulletin-footer-note">{content.footer_note}</p>
      )}
    </main>
  );

  if (!section && !builderMode) {
    return pageContent;
  }

  return (
    <BuilderSectionTarget
      builderMode={builderMode}
      section={section}
      sectionType="school_daily_bulletin"
      label={content?.section_title || "Student Daily Bulletin"}
      templateCategory="school"
      templateKey="school-modern-v1"
    >
      {pageContent}
    </BuilderSectionTarget>
  );
}
