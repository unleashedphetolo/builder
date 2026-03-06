import React, { useMemo, useState } from "react";
import "../../styles/events.css";
import CalendarWidget from "../common/CalendarWidget";

const EVENTS = [
  {
    id: 1,
    title: "New Year's day",
    date: "2025-01-01",
    period: "01/01/2025 To 01/01/2025",
    location: "Public",
    color: "#1a73e8",
  },
  {
    id: 2,
    title: "Day of goodwill",
    date: "2024-12-26",
    period: "26/12/2024 To 26/12/2024",
    location: "Public",
    color: "#34a853",
  },
  {
    id: 3,
    title: "Christmas day",
    date: "2024-12-25",
    period: "25/12/2024 To 25/12/2024",
    location: "Public",
    color: "#ea4335",
  },
  {
    id: 4,
    title: "Day of Reconciliation",
    date: "2024-12-16",
    period: "16/12/2024 To 16/12/2024",
    location: "Public",
    color: "#fbbc05",
  },
];

function toBadgeParts(dateKey) {
  // YYYY-MM-DD -> day + short month
  const d = new Date(dateKey + "T00:00:00");
  const day = String(d.getDate());
  const month = d.toLocaleString(undefined, { month: "short" });
  return { day, month };
}

export default function EventsList() {
  const [selectedDateKey, setSelectedDateKey] = useState(() => {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, "0");
    const d = String(now.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  });

  const eventsForSelected = useMemo(() => {
    return EVENTS.filter((e) => e.date === selectedDateKey);
  }, [selectedDateKey]);

  return (
    <section className="school-calendar-section">
      <div className="calendar-heading-row">
        <h1 className="page-title">School Calendar</h1>
      </div>

      <div className="calendar-inner-grid">
        <div className="calendar-left">
          <CalendarWidget
            events={EVENTS}
            selectedDateKey={selectedDateKey}
            onSelectDate={setSelectedDateKey}
          />
        </div>

        <div className="events-right">
          <div className="events-top">
            <div>
              <div className="events-tag">#JOIN EVENTS</div>
              <h2 className="events-title">Events on {selectedDateKey}</h2>
              <p className="events-sub">
                Click a day on the calendar to see events.
              </p>
            </div>

            <button className="view-all-btn" onClick={() => setSelectedDateKey("")}>
              View All Events
            </button>
          </div>

          <div className="events-table-wrap">
            <table className="events-table" role="table" aria-label="School events">
              <thead>
                <tr>
                  <th className="th-date">Date</th>
                  <th className="th-event">Event</th>
                  <th className="th-time">Time</th>
                  <th className="th-location">Location</th>
                  <th className="th-details">Details</th>
                </tr>
              </thead>

              <tbody>
                {(selectedDateKey ? eventsForSelected : EVENTS).map((ev, idx) => {
                  const badge = toBadgeParts(ev.date);
                  return (
                    <tr key={ev.id} className={idx % 2 === 0 ? "row even" : "row odd"}>
                      <td className="td-date">
                        <div className="date-badge">
                          <strong className="date-day">{badge.day}</strong>
                          <span className="date-month">{badge.month}</span>
                        </div>
                      </td>

                      <td className="td-event">
                        <div className="event-name">{ev.title}</div>
                      </td>

                      <td className="td-time">
                        <span className="clock">⏱</span>
                        <span className="time-text">{ev.period}</span>
                      </td>

                      <td className="td-location">
                        <span className="pin">📍</span>
                        <span className="loc-text">{ev.location}</span>
                      </td>

                      <td className="td-details">→</td>
                    </tr>
                  );
                })}

                {selectedDateKey && eventsForSelected.length === 0 && (
                  <tr>
                    <td colSpan="5" style={{ padding: 18 }}>
                      No events found for this day.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}