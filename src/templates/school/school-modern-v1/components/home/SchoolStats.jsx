import React, { useEffect, useMemo, useState } from "react";
import "../../styles/stats.css";

const ITEMS = [
  { label: "Established", value: 1990 },
  { label: "No. Of Learners", value: 1525 },
  { label: "No. Of Staff", value: 18 },
  { label: "Grades", value: "8 to 12" }, // Will not animate
  { label: "Quintile", value: 3 },
  { label: "EMIS Number", value: 600112192 },
];

function getNumericValue(value) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (
    typeof value === "string" &&
    value.trim() !== "" &&
    Number.isFinite(Number(value))
  ) {
    return Number(value);
  }

  return null;
}

export default function SchoolStats({ items = [] }) {
  const displayItems = useMemo(() => {
    return Array.isArray(items) && items.length > 0 ? items : ITEMS;
  }, [items]);

  const [counts, setCounts] = useState(
    displayItems.map((item) =>
      getNumericValue(item.value) !== null ? 0 : item.value,
    ),
  );

  useEffect(() => {
    const timers = [];

    setCounts(
      displayItems.map((item) =>
        getNumericValue(item.value) !== null ? 0 : item.value,
      ),
    );

    displayItems.forEach((item, index) => {
      const numericValue = getNumericValue(item.value);

      if (numericValue === null) return; // Skip text values

      let start = 0;
      const end = numericValue;
      const duration = 1500; // ms
      const increment = end / (duration / 16); // 60fps

      const timer = window.setInterval(() => {
        start += increment;

        if (start >= end) {
          start = end;
          window.clearInterval(timer);
        }

        setCounts((previousCounts) => {
          const copy = [...previousCounts];
          copy[index] = Math.floor(start);
          return copy;
        });
      }, 16);

      timers.push(timer);
    });

    return () => {
      timers.forEach((timer) => window.clearInterval(timer));
    };
  }, [displayItems]);

  return (
    <div className="stats-card">
      {displayItems.map((item, index) => (
        <div key={item.id || item.label} className="stat">
          <div className="num">{counts[index]}</div>
          <div className="lbl">{item.label}</div>
        </div>
      ))}
    </div>
  );
}
