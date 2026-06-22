import React from "react";
import BuilderSectionTarget from "../../../../builder/BuilderSectionTarget";
import "../styles/school-calendar.css";
import CalendarWidget from "../components/common/CalendarWidget";

export const EVENTS = [
  {
    id: 1,
    title: "New Year's Day",
    start: "2026-01-01T00:00",
    end: "2026-01-01T23:59",
    location: "Public Holiday",
    category: "Public Holiday",
  },
  {
    id: 2,
    title: "School Reopens (Term 1)",
    start: "2026-01-14T07:30",
    end: "2026-01-14T14:30",
    location: "School Campus",
    category: "Academic",
  },
  {
    id: 3,
    title: "Awards Ceremony",
    start: "2026-11-25T10:00",
    end: "2026-11-25T12:00",
    location: "School Hall",
    category: "School Event",
  },
  {
    id: 4,
    title: "Final Examinations Begin",
    start: "2026-11-10T08:00",
    end: "2026-11-10T15:00",
    location: "Exam Venues",
    category: "Exams",
  },
];

function formatDateTime(iso) {
  if (!iso) return "";

  const d = new Date(iso);

  if (Number.isNaN(d.getTime())) {
    return "";
  }

  return d.toLocaleString(undefined, {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function SchoolCalendar({ section = null, content = {}, builderMode = false }) {
  const navigate = (slug) => {
    window.dispatchEvent(new CustomEvent("builder:navigate", { detail: slug }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const events =
    Array.isArray(content?.items) && content.items.length > 0
      ? content.items
      : EVENTS;

  const preview = [...events]
    .sort(
      (a, b) =>
        new Date(a.startAt || a.start) - new Date(b.startAt || b.start),
    )
    .slice(0, 6);

  const viewAllHref = content?.view_all_href || "/calendar/events";
  const pdfHref = content?.pdf_url || "/docs/school-calendar.pdf";

  const pageContent = (
    <main className="scal-page container">
      <header className="scal-hero">
        <div>
          <h1 className="scal-title">
            {content?.section_title || "School Calendar"}
          </h1>
          <p className="scal-subtitle">
            {content?.subtitle ||
              "Key academic dates, examinations, school activities, and public holidays."}
          </p>
        </div>

        <div className="scal-actions">
          <a
            href="#"
            className="scal-btn"
            onClick={(e) => {
              e.preventDefault();
              navigate(viewAllHref);
            }}
          >
            {content?.view_all_label || "View All Events"}
          </a>

          <a
            className="scal-btn ghost"
            href={pdfHref}
            target="_blank"
            rel="noreferrer"
          >
            {content?.download_label || "Download PDF"}
          </a>
        </div>
      </header>

      <section className="scal-grid">
        <div className="scal-left">
          <div className="scal-card">
            <div className="scal-card-head">
              <div className="scal-tag">
                {content?.calendar_label || "Calendar"}
              </div>
              <div className="scal-headline">
                {content?.calendar_heading || "Monthly Overview"}
              </div>
              <div className="scal-muted">
                {content?.calendar_note ||
                  "Tap days to view events (optional upgrade)."}
              </div>
            </div>

            <CalendarWidget />
          </div>
        </div>

        <div className="scal-right">
          <div className="scal-right-head">
            <div>
              <div className="scal-tag">
                {content?.upcoming_label || "# Upcoming"}
              </div>
              <h2 className="scal-h2">
                {content?.upcoming_heading || "Upcoming Events"}
              </h2>
              <p className="scal-muted">
                {content?.upcoming_note ||
                  "This is a preview. Use “View All Events” for the full calendar list."}
              </p>
            </div>

            <a
              href="#"
              className="scal-link"
              onClick={(e) => {
                e.preventDefault();
                navigate(viewAllHref);
              }}
            >
              {content?.view_all_link_label || "View All →"}
            </a>
          </div>

          <div
            className="scal-table-wrap"
            role="region"
            aria-label="School events preview"
          >
            <table className="scal-table">
              <thead>
                <tr>
                  <th>Date & Time</th>
                  <th>Event</th>
                  <th>Location</th>
                  <th>Category</th>
                </tr>
              </thead>

              <tbody>
                {preview.map((ev, index) => (
                  <tr key={ev.id || `${ev.title || "event"}-${index}`}>
                    <td className="td-dt">
                      {formatDateTime(ev.startAt || ev.start)}
                    </td>
                    <td className="td-title">{ev.title}</td>
                    <td className="td-loc">{ev.location}</td>
                    <td>
                      <span className="scal-pill">{ev.category}</span>
                    </td>
                  </tr>
                ))}

                {preview.length === 0 && (
                  <tr>
                    <td colSpan={4} className="scal-empty">
                      No events available yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="scal-note">
            {content?.footer_note ||
              "For official confirmation of dates, please contact the Administration Office."}
          </div>
        </div>
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
      sectionType="school_calendar"
      label={content?.section_title || content?.title || "School Calendar"}
      templateCategory="school"
      templateKey="school-technical-school-v1"
    >
      {pageContent}
    </BuilderSectionTarget>
  );
}
