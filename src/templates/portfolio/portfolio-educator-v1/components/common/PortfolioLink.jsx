import React from "react";
import { Link } from "react-router-dom";
import { normalizeHref } from "../../utils/nav";

function isTemplatePreview(settings = {}) {
  if (settings?.site_id === "template-preview") return true;
  if (typeof window === "undefined") return false;

  return String(window.location.hash || "").includes("/template-preview/");
}

function notifyPortfolioNavigation(href) {
  if (typeof window === "undefined") return;

  window.dispatchEvent(
    new CustomEvent("portfolio:navigate", {
      detail: { href },
    }),
  );
}

function buildTemplatePreviewHash(href = "/") {
  const cleanHref = normalizeHref(href);
  const path = cleanHref === "/" ? "" : cleanHref;

  if (typeof window === "undefined") return path || "/";

  const currentHash = String(window.location.hash || "").replace(/^#/, "");
  const [hashPath, hashSearch = "preview=1"] = currentHash.split("?");
  const parts = hashPath.split("/").filter(Boolean);

  const previewIndex = parts.indexOf("template-preview");

  if (previewIndex === -1) return path || "/";

  const layoutKey = parts[previewIndex + 1] || "portfolio";
  const templateKey = parts[previewIndex + 2] || "portfolio-developer-v1";
  const query = hashSearch || "preview=1";

  return `#/template-preview/${layoutKey}/${templateKey}${path}?${query}`;
}

export default function PortfolioLink({
  settings = {},
  href = "/",
  className = "",
  children,
  onClick,
  ...rest
}) {
  const cleanHref = normalizeHref(href);
  const isExternal =
    cleanHref.startsWith("http") ||
    cleanHref.startsWith("mailto:") ||
    cleanHref.startsWith("tel:") ||
    cleanHref.startsWith("#");

  if (isExternal) {
    return (
      <a className={className} href={cleanHref} onClick={onClick} {...rest}>
        {children}
      </a>
    );
  }

  if (isTemplatePreview(settings)) {
    const previewHref = buildTemplatePreviewHash(cleanHref);

    return (
      <a
        className={className}
        href={previewHref}
        onClick={(event) => {
          event.preventDefault();
          if (typeof onClick === "function") onClick(event);
          if (typeof window !== "undefined") {
            window.location.hash = previewHref.replace(/^#/, "");
            notifyPortfolioNavigation(cleanHref);
            window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
          }
        }}
        {...rest}
      >
        {children}
      </a>
    );
  }

  const to = settings?.site_id
    ? cleanHref === "/"
      ? `/site/${settings.site_id}`
      : `/site/${settings.site_id}${cleanHref}`
    : cleanHref;

  return (
    <Link
      className={className}
      to={to}
      onClick={(event) => {
        if (typeof onClick === "function") onClick(event);
        notifyPortfolioNavigation(cleanHref);
        if (typeof window !== "undefined") {
          window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
        }
      }}
      {...rest}
    >
      {children}
    </Link>
  );
}
