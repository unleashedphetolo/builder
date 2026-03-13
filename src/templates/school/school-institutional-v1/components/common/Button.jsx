import React from "react";

export default function Button({
  to,
  href,
  onClick,
  children,
  variant = "primary",
  style,
}) {
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
    outline: {
      background: "transparent",
      color: "#111827",
      borderColor: "#e5e7eb",
    },
  };

  const finalStyle = { ...base, ...(variants[variant] || variants.primary) };

  function handleClick(e) {
    if (to) {
      e.preventDefault();

      window.dispatchEvent(
        new CustomEvent("builder:navigate", { detail: to })
      );

      window.scrollTo({ top: 0, behavior: "smooth" });
    }

    if (onClick) onClick(e);
  }

  if (href) {
    return (
      <a href={href} style={finalStyle}>
        {children}
      </a>
    );
  }

  if (to) {
    return (
      <a href="#" onClick={handleClick} style={finalStyle}>
        {children}
      </a>
    );
  }

  return (
    <button type="button" onClick={onClick} style={finalStyle}>
      {children}
    </button>
  );
}