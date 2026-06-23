import React from "react";

export default function SectionHeader({ eyebrow, title, subtitle, align = "left" }) {
  return (
    <div className={`portfolio-section-header portfolio-section-header--${align}`}>
      {eyebrow ? <span className="portfolio-eyebrow">{eyebrow}</span> : null}
      {title ? <h2>{title}</h2> : null}
      {subtitle ? <p>{subtitle}</p> : null}
    </div>
  );
}
