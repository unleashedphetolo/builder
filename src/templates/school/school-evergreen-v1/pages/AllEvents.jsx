import React, { useMemo, useState } from "react";
import BuilderSectionTarget from "../../../../builder/BuilderSectionTarget";
import { EVENTS } from "./SchoolCalendar";
import "../styles/school-calendar.css";

function getStartDate(event = {}) {
  return event.startAt || event.start || "";
}

function getEndDate(event = {}) {
  return event.endAt || event.end || "";
}

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

export default function AllEvents({
  section = null,
  content = {},
  builderMode = false,
}) {
  const [q, setQ] = useState("");

  const events =
    Array.isArray(content?.items) && content.items.length > 0
      ? content.items
      : EVENTS;

  const list = useMemo(() => {
    const query = q.trim().toLowerCase();
    const sorted = [...events].sort(
      (a, b) => new Date(getStartDate(a)) - new Date(getStartDate(b)),
    );

    if (!query) return sorted;

    return sorted.filter((ev) => {
      return (
        String(ev.title || "").toLowerCase().includes(query) ||
        String(ev.location || "").toLowerCase().includes(query) ||
        String(ev.category || "").toLowerCase().includes(query)
      );
    });
  }, [events, q]);

  const pageContent = (
    <main className="scal-page container">
      <header className="scal-hero">
        <div>
          <h1 className="scal-title">
            {content?.section_title || "All Calendar Events"}
          </h1>
          <p className="scal-subtitle">
            {content?.subtitle ||
              "Browse and search all school events, academic dates, and public holidays."}
          </p>
        </div>

        <div className="scal-search">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={
              content?.search_placeholder ||
              "Search events (e.g. exams, awards, term 1)"
            }
            aria-label="Search events"
          />
        </div>
      </header>

      <div className="scal-table-wrap" role="region" aria-label="All school events">
        <table className="scal-table">
          <thead>
            <tr>
              <th>Event</th>
              <th>Start</th>
              <th>End</th>
              <th>Location</th>
              <th>Category</th>
            </tr>
          </thead>

          <tbody>
            {list.map((ev, index) => (
              <tr key={ev.id || `${ev.title || "event"}-${index}`}>
                <td className="td-title">{ev.title || ""}</td>
                <td className="td-dt">{formatDateTime(getStartDate(ev))}</td>
                <td className="td-dt">{formatDateTime(getEndDate(ev))}</td>
                <td className="td-loc">{ev.location || ""}</td>
                <td>
                  <span className="scal-pill">{ev.category || ""}</span>
                </td>
              </tr>
            ))}

            {list.length === 0 && (
              <tr>
                <td colSpan={5} className="scal-empty">
                  {content?.empty_message || "No events matched your search."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="scal-note">
        {content?.footer_note || (
          <>
            Tip: Upload a PDF to <code>public/docs/school-calendar.pdf</code>{" "}
            and the download button will work.
          </>
        )}
      </div>
    </main>
  );

  if (!section && !builderMode) {
    return pageContent;
  }

  return (
    <BuilderSectionTarget
      builderMode={builderMode}
      section={section}
      sectionType="school_all_events"
      label={content?.section_title || "All Calendar Events"}
      templateCategory="school"
      templateKey="school-evergreen-v1"
    >
      {pageContent}
    </BuilderSectionTarget>
  );
}
