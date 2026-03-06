import React from "react";

export default function SectionTitle({ label, title, subtitle }) {
  return (
    <div style={{ margin: "0 0 1rem 0" }}>
      {label ? (
        <p style={{ letterSpacing: "0.14em", textTransform: "uppercase", fontSize: ".8rem", opacity: 0.8 }}>
          {label}
        </p>
      ) : null}
      {title ? <h2 style={{ fontSize: "1.8rem", margin: ".25rem 0" }}>{title}</h2> : null}
      {subtitle ? <p style={{ maxWidth: 820, opacity: 0.9 }}>{subtitle}</p> : null}
    </div>
  );
}
