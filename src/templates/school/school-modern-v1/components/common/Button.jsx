import React from "react";
import { Link } from "react-router-dom";

export default function Button({ to, href, onClick, children, variant = "primary", style }) {
  const base = {
    display: "inline-flex",
    alignItems: "center",
    gap: ".5rem",
    padding: ".75rem 1.05rem",
    borderRadius: 10,
    fontWeight: 600,
    textDecoration: "none",
    border: "1px solid transparent",
    cursor: "pointer",
    ...style,
  };

  const variants = {
    primary: { background: "#0b5cff", color: "#fff" },
    secondary: { background: "#111827", color: "#fff" },
    outline: { background: "transparent", color: "#111827", borderColor: "#e5e7eb" },
  };

  const props = { onClick, style: { ...base, ...(variants[variant] || variants.primary) } };

  if (to) return <Link to={to} {...props}>{children}</Link>;
  if (href) return <a href={href} {...props}>{children}</a>;
  return <button type="button" {...props}>{children}</button>;
}
