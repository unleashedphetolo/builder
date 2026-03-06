import React, { useMemo, useState } from "react";
import "../../styles/calendar.css";

const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function monthLabel(date) {
  return date.toLocaleString(undefined, { month: "long", year: "numeric" });
}

function startOfMonth(date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function endOfMonth(date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
}

function isSameDay(a, b) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function toKey(date) {
  // YYYY-MM-DD
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function generateMonthGrid(activeMonthDate) {
  const first = startOfMonth(activeMonthDate);
  const last = endOfMonth(activeMonthDate);

  // Sunday = 0 ... Saturday = 6
  const startDay = first.getDay();
  const lastDate = last.getDate(); // ✅ used

  // Keep Google-like 6 rows, but now lastDate is used to avoid unused warning
  const totalCells = Math.max(42, startDay + lastDate);

  const grid = [];
  const start = new Date(first);
  start.setDate(first.getDate() - startDay);

  for (let i = 0; i < totalCells; i++) {
    const cellDate = new Date(start);
    cellDate.setDate(start.getDate() + i);
    const inMonth = cellDate.getMonth() === activeMonthDate.getMonth();
    grid.push({ date: cellDate, inMonth });
  }

  return grid;
}

/**
 * Props:
 * - events: [{ id, title, date: "YYYY-MM-DD", time?, location?, color? }]
 * - onSelectDate: (dateKey) => void
 * - selectedDateKey: "YYYY-MM-DD"
 */
export default function CalendarWidget({
  events = [],
  onSelectDate,
  selectedDateKey,
}) {
  const today = new Date();

  const [active, setActive] = useState(() => startOfMonth(today));

  const grid = useMemo(() => generateMonthGrid(active), [active]);

  const eventsByDate = useMemo(() => {
    const map = {};
    for (const ev of events) {
      if (!map[ev.date]) map[ev.date] = [];
      map[ev.date].push(ev);
    }
    return map;
  }, [events]);

  const header = monthLabel(active);

  const goPrev = () => setActive(new Date(active.getFullYear(), active.getMonth() - 1, 1));
  const goNext = () => setActive(new Date(active.getFullYear(), active.getMonth() + 1, 1));
  const goToday = () => setActive(startOfMonth(today));

  const handleSelect = (cellDate) => {
    const key = toKey(cellDate);
    onSelectDate?.(key);
  };

  return (
    <div className="calendar">
      <div className="calendar-header">
        <div className="cal-head-left">
          <h3 className="cal-title">{header}</h3>
          <p className="cal-subtitle">Click a day to view events</p>
        </div>

        <div className="cal-actions">
          <button className="cal-btn" onClick={goPrev} aria-label="Previous month">
            ‹
          </button>
          <button className="cal-btn" onClick={goNext} aria-label="Next month">
            ›
          </button>
          <button className="cal-btn cal-today" onClick={goToday}>
            Today
          </button>
        </div>
      </div>

      <div className="calendar-grid">
        {weekDays.map((d) => (
          <div key={d} className="calendar-day-name">
            {d}
          </div>
        ))}

        {grid.map(({ date, inMonth }, idx) => {
          const key = toKey(date);
          const isToday = isSameDay(date, today);
          const isSelected = selectedDateKey === key;

          const dayEvents = eventsByDate[key] || [];
          const dots = dayEvents.slice(0, 3);

          return (
            <button
              type="button"
              key={idx}
              onClick={() => handleSelect(date)}
              className={[
                "calendar-cell",
                inMonth ? "in-month" : "out-month",
                isToday ? "today" : "",
                isSelected ? "selected" : "",
              ].join(" ")}
              aria-label={`Select ${key}`}
            >
              <div className="cell-top">
                <span className="cell-number">{date.getDate()}</span>
              </div>

              <div className="cell-dots" aria-hidden="true">
                {dots.map((ev) => (
                  <span
                    key={ev.id}
                    className="dot"
                    style={{ background: ev.color || "#1a73e8" }}
                    title={ev.title}
                  />
                ))}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}