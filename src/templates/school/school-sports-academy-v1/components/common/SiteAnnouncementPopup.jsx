import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  announcementStorageKey,
  buildSiteAnnouncementHref,
  getActiveAnnouncements,
  isExternalAnnouncementLink,
} from "../../utils/announcements";

export default function SiteAnnouncementPopup({
  settings = {},
  currentSlug = "/",
  currentPageId = "",
  navigateTo,
}) {
  const closeButtonRef = useRef(null);

  const announcement = useMemo(
    () =>
      getActiveAnnouncements(
        settings?.announcements || [],
        "popup",
        currentSlug,
        currentPageId,
      )[0] || null,
    [settings?.announcements, currentSlug, currentPageId],
  );

  /*
    No key is created when no active popup exists. This prevents the previous
    null.id crash when announcements are empty or scheduled for another page.
  */
  const storageKey = announcement
    ? announcementStorageKey(announcement, "popup")
    : "";

  const [closed, setClosed] = useState(false);

  useEffect(() => {
    if (!announcement || !storageKey) {
      setClosed(false);
      return;
    }

    const alreadyViewed =
      announcement.show_once_per_session === true &&
      window.sessionStorage.getItem(storageKey) === "viewed";

    setClosed(alreadyViewed);

    if (!alreadyViewed && announcement.show_once_per_session === true) {
      window.sessionStorage.setItem(storageKey, "viewed");
    }
  }, [announcement, storageKey]);

  useEffect(() => {
    if (!announcement || closed) return undefined;

    if (announcement.dismissible !== false) {
      closeButtonRef.current?.focus();
    }

    const handleKeyDown = (event) => {
      if (event.key === "Escape" && announcement.dismissible !== false) {
        setClosed(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [announcement, closed]);

  if (!announcement || closed) return null;

  const linkHref = announcement.link_href || "";
  const externalLink = isExternalAnnouncementLink(linkHref);
  const resolvedHref = buildSiteAnnouncementHref(settings?.site_id, linkHref);

  const closePopup = () => {
    setClosed(true);

    if (storageKey) {
      window.sessionStorage.setItem(storageKey, "dismissed");
    }
  };

  const handleActionClick = (event) => {
    if (!linkHref || externalLink) return;

    event.preventDefault();
    closePopup();
    navigateTo?.(linkHref);
  };

  return (
    <div
      className="site-announcement-popup-backdrop"
      role="presentation"
      onMouseDown={(event) => {
        if (
          event.target === event.currentTarget &&
          announcement.dismissible !== false
        ) {
          closePopup();
        }
      }}
    >
      <section
        className={`site-announcement-popup priority-${
          announcement.priority || "normal"
        }`}
        style={{
          "--announcement-background":
            announcement?.style?.background_color ||
            "var(--site-theme-background, #ffffff)",
          "--announcement-text":
            announcement?.style?.text_color ||
            "var(--site-theme-secondary, #0f172a)",
        }}
        role="dialog"
        aria-modal="true"
        aria-labelledby={`announcement-title-${announcement.id}`}
        aria-describedby={
          announcement.body ? `announcement-body-${announcement.id}` : undefined
        }
      >
        {announcement.dismissible !== false && (
          <button
            ref={closeButtonRef}
            type="button"
            className="site-announcement-popup__close"
            onClick={closePopup}
            aria-label="Close announcement"
          >
            ×
          </button>
        )}

        {announcement.label && (
          <small className="site-announcement-popup__label">
            {announcement.label}
          </small>
        )}

        <h2 id={`announcement-title-${announcement.id}`}>
          {announcement.title || "Announcement"}
        </h2>

        {announcement.body && (
          <p id={`announcement-body-${announcement.id}`}>
            {announcement.body}
          </p>
        )}

        {linkHref && announcement.link_label && (
          <a
            className="site-announcement-popup__action"
            href={resolvedHref}
            target={externalLink ? "_blank" : undefined}
            rel={externalLink ? "noopener noreferrer" : undefined}
            onClick={handleActionClick}
          >
            {announcement.link_label}
          </a>
        )}
      </section>
    </div>
  );
}
