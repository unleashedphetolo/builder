import React, { useMemo, useState } from "react";
import { EVENTS } from "./SchoolCalendar";
import "../styles/school-calendar.css";
import Breadcrumbs from "../components/common/Breadcrumbs";

function formatDateTime(iso) {
  const d = new Date(iso);
  return d.toLocaleString(undefined, {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function AllEvents({ settings = {} }) {
  const [q, setQ] = useState("");

  const list = useMemo(() => {
    const query = q.trim().toLowerCase();
    const sorted = [...EVENTS].sort((a, b) => new Date(a.start) - new Date(b.start));

    if (!query) return sorted;

    return sorted.filter((ev) => {
      return (
        ev.title.toLowerCase().includes(query) ||
        ev.location.toLowerCase().includes(query) ||
        ev.category.toLowerCase().includes(query)
      );
    });
  }, [q]);

  return (
    <main className="scal-page container">
      <Breadcrumbs settings={settings} />

      <header className="scal-hero">
        <div>
          <h1 className="scal-title">All Calendar Events</h1>
          <p className="scal-subtitle">
            Browse and search all school events, academic dates, and public holidays.
          </p>
        </div>

        <div className="scal-search">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search events (e.g. exams, awards, term 1)"
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
            {list.map((ev) => (
              <tr key={ev.id}>
                <td className="td-title">{ev.title}</td>
                <td className="td-dt">{formatDateTime(ev.start)}</td>
                <td className="td-dt">{formatDateTime(ev.end)}</td>
                <td className="td-loc">{ev.location}</td>
                <td>
                  <span className="scal-pill">{ev.category}</span>
                </td>
              </tr>
            ))}

            {list.length === 0 && (
              <tr>
                <td colSpan={5} className="scal-empty">
                  No events matched your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="scal-note">
        Tip: Upload a PDF to <code>public/docs/school-calendar.pdf</code> and the download button will work.
      </div>
    </main>
  );
}