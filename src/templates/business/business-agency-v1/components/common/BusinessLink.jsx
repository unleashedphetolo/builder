import React from "react";
import { buildSiteLink, emitBusinessPreviewNavigation, isExternalUrl } from "../../utils/nav";

export default function BusinessLink({
  settings,
  navigateTo,
  href = "/",
  children,
  className = "",
  builderMode = false,
  onClick,
  ...rest
}) {
  const external = isExternalUrl(href);
  const safeHref = external ? href : buildSiteLink(settings, href);

  return (
    <a
      {...rest}
      className={className}
      href={safeHref}
      target={String(href || "").startsWith("http") ? "_blank" : undefined}
      rel={String(href || "").startsWith("http") ? "noreferrer" : undefined}
      onClick={(event) => {
        if (typeof onClick === "function") onClick(event);
        if (event.defaultPrevented || external) return;

        event.preventDefault();

        if (typeof navigateTo === "function") {
          navigateTo(href || "/");
          return;
        }

        emitBusinessPreviewNavigation(href || "/");
      }}
    >
      {children}
    </a>
  );
}
