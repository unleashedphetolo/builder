import React, { useEffect, useState } from "react";
import "../../styles/stats.css";

const ITEMS = [
  { label: "Established", value: 1990 },
  { label: "No. Of Learners", value: 1525 },
  { label: "No. Of Staff", value: 18 },
  { label: "Grades", value: "8 to 12" }, // Will not animate
  { label: "Quintile", value: 3 },
  { label: "EMIS Number", value: 600112192 },
];

export default function SchoolStats() {
  const items = ITEMS;

  const [counts, setCounts] = useState(
    items.map((it) => (typeof it.value === "number" ? 0 : it.value))
  );

  useEffect(() => {
    items.forEach((item, index) => {
      if (typeof item.value !== "number") return; // Skip text values

      let start = 0;
      const end = item.value;
      const duration = 1500; // ms
      const increment = end / (duration / 16); // 60fps

      const timer = setInterval(() => {
        start += increment;
        if (start >= end) {
          start = end;
          clearInterval(timer);
        }
        setCounts((prev) => {
          const copy = [...prev];
          copy[index] = Math.floor(start);
          return copy;
        });
      }, 16);
    });
  }, [items]);

  return (
    <div className="stats-card">
      {items.map((it, idx) => (
        <div key={it.label} className="stat">
          <div className="num">{counts[idx]}</div>
          <div className="lbl">{it.label}</div>
        </div>
      ))}
    </div>
  );
}