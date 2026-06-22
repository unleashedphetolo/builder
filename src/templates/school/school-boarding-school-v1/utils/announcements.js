/*
  Boarding School announcement utilities.

  This file supports:
  - Announcement Bar above navigation
  - Notice Board announcements
  - Pop-up Notice display
  - Scheduling and page targeting
  - Safe session-storage keys

  Saved data comes from Builder > Announcements through:
    settings.announcements
*/

const VALID_PLACEMENTS = new Set(["header_bar", "notice_board", "popup"]);
const PRIORITY_RANK = Object.freeze({
  normal: 1,
  important: 2,
  urgent: 3,
});

function isObject(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function validTimestamp(value) {
  if (!value) return null;

  const timestamp = new Date(value).getTime();
  return Number.isFinite(timestamp) ? timestamp : null;
}

export function normalizeAnnouncementPath(value = "/") {
  const raw = String(value || "/")
    .trim()
    .replace(/^#/, "")
    .split("?")[0]
    .split("#")[0]
    .replace(/^\/+|\/+$/g, "");

  const withoutSitePrefix = raw.replace(/^site\/[^/]+\/?/, "");
  const normalized = withoutSitePrefix.toLowerCase() === "home"
    ? ""
    : withoutSitePrefix;

  return normalized ? `/${normalized}` : "/";
}

function normalizeTargetValue(value) {
  if (isObject(value)) {
    return {
      id: String(value.id || value.page_id || "").trim(),
      slug: normalizeAnnouncementPath(value.slug || value.href || value.path || "/"),
    };
  }

  const raw = String(value || "").trim();

  return {
    id: raw,
    slug: raw.startsWith("/") || raw.startsWith("#") || raw.includes("/")
      ? normalizeAnnouncementPath(raw)
      : "",
  };
}

function matchesPageTarget(item = {}, currentSlug = "/", currentPageId = "") {
  const scope = item.target_scope || "all_pages";
  const normalizedCurrentSlug = normalizeAnnouncementPath(currentSlug);
  const normalizedPageId = String(currentPageId || "").trim();

  if (scope === "home_only") {
    return normalizedCurrentSlug === "/";
  }

  if (scope !== "selected_pages") {
    return true;
  }

  const targets = Array.isArray(item.target_page_ids)
    ? item.target_page_ids
    : Array.isArray(item.target_pages)
      ? item.target_pages
      : [];

  return targets.some((target) => {
    const normalizedTarget = normalizeTargetValue(target);

    if (normalizedPageId && normalizedTarget.id === normalizedPageId) {
      return true;
    }

    return Boolean(
      normalizedTarget.slug &&
        normalizedTarget.slug === normalizedCurrentSlug,
    );
  });
}

export function normalizeAnnouncement(item = {}, index = 0) {
  const safeItem = isObject(item) ? item : {};
  const placement = VALID_PLACEMENTS.has(safeItem.placement)
    ? safeItem.placement
    : "header_bar";

  return {
    ...safeItem,
    id: safeItem.id || `announcement-${index + 1}`,
    label: String(safeItem.label || ""),
    title: String(safeItem.title || ""),
    body: String(safeItem.body || ""),
    enabled: safeItem.enabled !== false,
    placement,
    priority: PRIORITY_RANK[safeItem.priority]
      ? safeItem.priority
      : "normal",
    link_label: String(safeItem.link_label || ""),
    link_href: String(safeItem.link_href || ""),
    starts_at: safeItem.starts_at || "",
    ends_at: safeItem.ends_at || "",
    dismissible: safeItem.dismissible !== false,
    show_once_per_session: safeItem.show_once_per_session === true,
    target_scope: safeItem.target_scope || "all_pages",
    target_page_ids: Array.isArray(safeItem.target_page_ids)
      ? safeItem.target_page_ids
      : [],
    style: {
      background_color:
        safeItem?.style?.background_color || "var(--site-theme-primary, #1e40af)",
      text_color: safeItem?.style?.text_color || "#ffffff",
      accent_style: safeItem?.style?.accent_style || "solid",
    },
  };
}

export function isActiveAnnouncement(
  item = {},
  currentSlug = "/",
  currentPageId = "",
) {
  const announcement = normalizeAnnouncement(item);

  if (!announcement.enabled) return false;
  if (!matchesPageTarget(announcement, currentSlug, currentPageId)) return false;

  const now = Date.now();
  const startsAt = validTimestamp(announcement.starts_at);
  const endsAt = validTimestamp(announcement.ends_at);

  if (startsAt !== null && startsAt > now) return false;
  if (endsAt !== null && endsAt < now) return false;

  return true;
}

export function getActiveAnnouncements(
  announcements = [],
  placement = "header_bar",
  currentSlug = "/",
  currentPageId = "",
) {
  return (Array.isArray(announcements) ? announcements : [])
    .map(normalizeAnnouncement)
    .filter((item) => item.placement === placement)
    .filter((item) => isActiveAnnouncement(item, currentSlug, currentPageId))
    .sort((first, second) => {
      const priorityDifference =
        PRIORITY_RANK[second.priority] - PRIORITY_RANK[first.priority];

      if (priorityDifference !== 0) return priorityDifference;

      const firstStart = validTimestamp(first.starts_at) || 0;
      const secondStart = validTimestamp(second.starts_at) || 0;

      return secondStart - firstStart;
    });
}

/*
  Must accept null safely because the popup component creates no active item
  when there is no live pop-up announcement.
*/
export function announcementStorageKey(item, placement = "announcement") {
  const safeItem = isObject(item) ? item : {};
  const identifier = String(safeItem.id || safeItem.title || "announcement")
    .trim()
    .replace(/\s+/g, "-")
    .toLowerCase();

  return `institutional-school:${placement}:${identifier || "announcement"}`;
}

export function isExternalAnnouncementLink(href = "") {
  return /^(https?:\/\/|mailto:|tel:)/i.test(String(href || "").trim());
}

export function buildSiteAnnouncementHref(siteId = "", href = "/") {
  const safeHref = String(href || "").trim();

  if (!safeHref || safeHref === "#") return "#";
  if (isExternalAnnouncementLink(safeHref)) return safeHref;

  const path = normalizeAnnouncementPath(safeHref);
  return `/#/site/${siteId || ""}${path === "/" ? "" : path}`;
}

export function convertAnnouncementToNotice(item = {}, index = 0) {
  const announcement = normalizeAnnouncement(item, index);

  return {
    id: announcement.id,
    title: announcement.title || "Announcement",
    body: announcement.body,
    publishedAt: announcement.starts_at || "",
    startAt: announcement.starts_at || "",
    endAt: announcement.ends_at || "",
    location: announcement.label || "",
    category: announcement.priority,
    link_label: announcement.link_label,
    link_href: announcement.link_href,
  };
}
