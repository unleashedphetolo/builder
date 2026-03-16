import React, { useMemo, useState } from "react";
import "../styles/notices-page.css";
import { NOTICES } from "../components/home/NoticeBoard";

function fmtDate(iso) {
  if (!iso) return "-";
  const d = new Date(iso);
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
  return d.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
}

export default function Notices() {
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return NOTICES;

    return NOTICES.filter((n) => {
      const text =
        `${n.title} ${n.location || ""} ${n.status || ""} ` +
        `${n.publishedAt || ""} ${n.startAt || ""} ${n.endAt || ""}`.toLowerCase();

      return text.includes(q);
    });
  }, [query]);

  return (
    <main className="notices-page container">
      <header className="np-header">
        <div>
          <h1 className="np-title">School Notices</h1>
          <p className="np-subtitle">
            Official communications and announcements from M.O.M Sebone Secondary School.
          </p>
        </div>

        <div className="np-search">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search notices (exams, awards, report cards, hall...)"
            aria-label="Search notices"
          />
        </div>
      </header>

      <section className="np-card">
        <div className="np-card-head">
          <div className="np-count">
            Showing <strong>{results.length}</strong> notice(s)
          </div>
          <div className="np-badge">Official Notice Board</div>
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
              {results.map((n) => (
                <tr key={n.id}>
                  <td className="td-date">
                    <div className="stack">
                      <div className="stack-main">{fmtDate(n.publishedAt)}</div>
                      <div className="stack-sub">{fmtTime(n.publishedAt)}</div>
                    </div>
                  </td>

                  <td className="td-title">{n.title}</td>

                  <td>
                    <div className="stack">
                      <div className="stack-main">{fmtDate(n.startAt)}</div>
                      <div className="stack-sub">{fmtTime(n.startAt)}</div>
                    </div>
                  </td>

                  <td>
                    <div className="stack">
                      <div className="stack-main">{fmtDate(n.endAt)}</div>
                      <div className="stack-sub">{fmtTime(n.endAt)}</div>
                    </div>
                  </td>

                  <td>{n.location || "-"}</td>

                  <td className="td-status">
                    <span className={`status-pill ${String(n.status || "").toLowerCase()}`}>
                      {n.status || "Active"}
                    </span>
                  </td>
                </tr>
              ))}

              {results.length === 0 && (
                <tr>
                  <td colSpan="6" className="np-empty">
                    No notices matched your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <footer className="np-footer">
          <div className="np-note">
            For official confirmation, contact the school administration office.
          </div>
        </footer>
      </section>
    </main>
  );
}