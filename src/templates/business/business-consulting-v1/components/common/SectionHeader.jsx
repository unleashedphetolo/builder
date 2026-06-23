import React from "react";

export default function SectionHeader({ eyebrow, title, subtitle, centered = false }) {
  return (
    <div className={`business-section-header ${centered ? "is-centered" : ""}`}>
      {eyebrow ? <span className="business-eyebrow">{eyebrow}</span> : null}
      {title ? <h2>{title}</h2> : null}
      {subtitle ? <p>{subtitle}</p> : null}
    </div>
  );
}
