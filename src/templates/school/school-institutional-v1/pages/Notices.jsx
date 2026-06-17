import React, { useMemo, useState } from "react";
import BuilderSectionTarget from "../../../../builder/BuilderSectionTarget";
import "../styles/notices-page.css";
import { NOTICES } from "../components/home/NoticeBoard";

function fmtDate(iso) {
  if (!iso) return "-";
  const d = new Date(iso);

  if (Number.isNaN(d.getTime())) {
    return "-";
  }

  return d.toLocaleDateString(undefined, {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function fmtTime(iso) {
  if (!iso) return "-";
  const d = new Date(iso);

  if (Number.isNaN(d.getTime())) {
    return "-";
  }

  return d.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function normalizeNotice(notice = {}, index = 0) {
  return {
    id: notice.id || `notice-${index + 1}`,
    title: notice.title || "",
    publishedAt: notice.publishedAt || notice.published_at || "",
    startAt: notice.startAt || notice.start_at || "",
    endAt: notice.endAt || notice.end_at || "",
    location: notice.location || notice.venue || "",
    status: notice.status || "Active",
  };
}

export default function Notices({
  section = null,
  content = {},
  builderMode = false,
}) {
  const [query, setQuery] = useState("");

  const notices = useMemo(() => {
    const source =
      Array.isArray(content?.items) && content.items.length > 0
        ? content.items
        : NOTICES;

    return source.map(normalizeNotice);
  }, [content?.items]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();

    if (!q) return notices;

    return notices.filter((notice) => {
      const text =
        `${notice.title} ${notice.location || ""} ${notice.status || ""} ` +
        `${notice.publishedAt || ""} ${notice.startAt || ""} ${notice.endAt || ""}`.toLowerCase();

      return text.includes(q);
    });
  }, [notices, query]);

  const pageContent = (
    <main className="notices-page container">
      <header className="np-header">
        <div>
          <h1 className="np-title">
            {content?.section_title || "School Notices"}
          </h1>
          <p className="np-subtitle">
            {content?.subtitle ||
              "Official communications and announcements from M.O.M Sebone Secondary School."}
          </p>
        </div>

        <div className="np-search">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={
              content?.search_placeholder ||
              "Search notices (exams, awards, report cards, hall...)"
            }
            aria-label="Search notices"
          />
        </div>
      </header>

      <section className="np-card">
        <div className="np-card-head">
          <div className="np-count">
            Showing <strong>{results.length}</strong> notice(s)
          </div>
          <div className="np-badge">
            {content?.badge_label || "Official Notice Board"}
          </div>
        </div>

        <div className="np-table-wrap" role="region" aria-label="Notices list">
          <table className="np-table">
            <thead>
              <tr>
                <th>Published</th>
                <th>Notice</th>
                <th>Start</th>
                <th>End</th>
                <th>Venue</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {results.map((notice) => (
                <tr key={notice.id}>
                  <td className="td-date">
                    <div className="stack">
                      <div className="stack-main">
                        {fmtDate(notice.publishedAt)}
                      </div>
                      <div className="stack-sub">
                        {fmtTime(notice.publishedAt)}
                      </div>
                    </div>
                  </td>

                  <td className="td-title">{notice.title}</td>

                  <td>
                    <div className="stack">
                      <div className="stack-main">{fmtDate(notice.startAt)}</div>
                      <div className="stack-sub">{fmtTime(notice.startAt)}</div>
                    </div>
                  </td>

                  <td>
                    <div className="stack">
                      <div className="stack-main">{fmtDate(notice.endAt)}</div>
                      <div className="stack-sub">{fmtTime(notice.endAt)}</div>
                    </div>
                  </td>

                  <td>{notice.location || "-"}</td>

                  <td className="td-status">
                    <span
                      className={`status-pill ${String(
                        notice.status || "",
                      ).toLowerCase()}`}
                    >
                      {notice.status || "Active"}
                    </span>
                  </td>
                </tr>
              ))}

              {results.length === 0 && (
                <tr>
                  <td colSpan="6" className="np-empty">
                    {content?.empty_message ||
                      "No notices matched your search."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <footer className="np-footer">
          <div className="np-note">
            {content?.footer_note ||
              "For official confirmation, contact the school administration office."}
          </div>
        </footer>
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
      sectionType="school_notices"
      label={content?.section_title || "School Notices"}
      templateCategory="school"
      templateKey="school-institutional-v1"
    >
      {pageContent}
    </BuilderSectionTarget>
  );
}
