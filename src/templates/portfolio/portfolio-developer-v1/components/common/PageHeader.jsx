import React from "react";

export default function PageHeader({ eyebrow = "Portfolio", title, subtitle }) {
  return (
    <header className="portfolio-page-header">
      <div className="portfolio-container">
        <span className="portfolio-eyebrow">{eyebrow}</span>
        <h1>{title}</h1>
        {subtitle ? <p>{subtitle}</p> : null}
      </div>
    </header>
  );
}
