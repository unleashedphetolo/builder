import React from "react";

export default function PageHeader({ page, eyebrow = "Business" }) {
  return (
    <header className="business-page-header">
      <div className="business-container">
        <span className="business-eyebrow">{eyebrow}</span>
        <h1>{page?.title || "Business Page"}</h1>
        {page?.description ? <p>{page.description}</p> : null}
      </div>
    </header>
  );
}
