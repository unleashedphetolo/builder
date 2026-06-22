import React, { useEffect, useState } from "react";
import {
  announcementStorageKey,
  buildSiteAnnouncementHref,
  isExternalAnnouncementLink,
} from "../../utils/announcements";

export default function SiteAnnouncementBar({
  announcement,
  siteId = "",
  navigateTo,
}) {
  const storageKey = announcement
    ? announcementStorageKey(announcement, "bar")
    : "";

  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (!announcement || !storageKey) {
      setDismissed(false);
      return;
    }

    const alreadyDismissed =
      announcement.dismissible !== false &&
      window.sessionStorage.getItem(storageKey) === "dismissed";

    setDismissed(alreadyDismissed);
  }, [announcement, storageKey]);

  if (!announcement || dismissed) return null;

  const linkHref = String(announcement.link_href || "").trim();
  const hasActionLink = Boolean(linkHref && linkHref !== "#");
  const externalLink = isExternalAnnouncementLink(linkHref);
  const resolvedHref = buildSiteAnnouncementHref(siteId, linkHref);

  const dismissAnnouncement = () => {
    setDismissed(true);

    if (storageKey) {
      window.sessionStorage.setItem(storageKey, "dismissed");
    }
  };

  const handleActionClick = (event) => {
    if (!hasActionLink || externalLink) return;

    event.preventDefault();
    navigateTo?.(linkHref);
  };

  return (
    <aside
      className={`site-announcement-bar priority-${
        announcement.priority || "normal"
      }`}
      style={{
        "--announcement-background":
          announcement?.style?.background_color ||
          "var(--site-theme-primary, #991b1b)",
        "--announcement-text": announcement?.style?.text_color || "#ffffff",
      }}
      role="status"
      aria-label="Website announcement"
    >
      <div className="site-announcement-bar__inner">
        {announcement.label && (
          <span className="site-announcement-bar__label">
            {announcement.label}
          </span>
        )}

        <strong>{announcement.title || "Important update"}</strong>

        {announcement.body && (
          <span className="site-announcement-bar__body">
            {announcement.body}
          </span>
        )}

        {hasActionLink && announcement.link_label && (
          <a
            href={resolvedHref}
            target={externalLink ? "_blank" : undefined}
            rel={externalLink ? "noopener noreferrer" : undefined}
            onClick={handleActionClick}
          >
            {announcement.link_label} →
          </a>
        )}

        {announcement.dismissible !== false && (
          <button
            type="button"
            onClick={dismissAnnouncement}
            aria-label="Close announcement"
          >
            ×
          </button>
        )}
      </div>
    </aside>
  );
}
