import React from "react";

export default function Card({ children, style }) {
  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid #e5e7eb",
        borderRadius: 14,
        padding: "1rem",
        boxShadow: "0 10px 30px rgba(0,0,0,.06)",
        ...style,
      }}
    >
      {children}
    </div>
  );
}
