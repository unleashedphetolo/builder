import React, { useEffect, useMemo, useRef } from "react";
import "../../styles/notice.css";
import {
  convertAnnouncementToNotice,
  getActiveAnnouncements,
} from "../../utils/announcements";

export const NOTICES = [
  {
    id: 1,
    title: "Issuing Term 4 Report Cards",
    publishedAt: "2025-12-07T08:00:00",
    startAt: "2025-12-07T08:00:00",
    endAt: "2025-12-07T14:00:00",
    location: "Administration Office",
    status: "Active",
  },
  {
    id: 2,
    title: "Awards Ceremony",
    publishedAt: "2025-11-25T07:30:00",
    startAt: "2025-11-25T10:00:00",
    endAt: "2025-11-25T12:30:00",
    location: "School Hall",
    status: "Active",
  },
  {
    id: 3,
    title: "School Awards Day",
    publishedAt: "2025-11-25T07:35:00",
    startAt: "2025-11-25T13:30:00",
    endAt: "2025-11-25T15:30:00",
    location: "School Hall",
    status: "Active",
  },
  {
    id: 4,
    title: "Examinations Period",
    publishedAt: "2025-11-10T06:45:00",
    startAt: "2025-11-10T08:00:00",
    endAt: "2025-11-28T13:30:00",
    location: "Examination Venues",
    status: "Active",
  },
];

function buildSiteHref(siteId, path = "") {
  const clean = path ? `/${String(path).replace(/^\/+/, "")}` : "";
  return `/#/site/${siteId || ""}${clean}`;
}

function formatDateTime(iso) {
  if (!iso) return "";

  const d = new Date(iso);

  if (Number.isNaN(d.getTime())) {
    return "";
  }

  return d.toLocaleString(undefined, {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatRange(startIso, endIso) {
  if (!startIso || !endIso) return "";

  const start = new Date(startIso);
  const end = new Date(endIso);

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    return "";
  }

  const sameDay =
    start.getFullYear() === end.getFullYear() &&
    start.getMonth() === end.getMonth() &&
    start.getDate() === end.getDate();

  const startDate = start.toLocaleDateString(undefined, {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const endDate = end.toLocaleDateString(undefined, {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const startTime = start.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  });

  const endTime = end.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  });

  if (sameDay) return `${startDate} • ${startTime} – ${endTime}`;

  return `${startDate} ${startTime} → ${endDate} ${endTime}`;
}

export default function NoticeBoard({
  settings = {},
  notices = [],
  content = {},
}) {
  const scrollRef = useRef(null);
  const siteId = settings?.site_id || "";

  const items = useMemo(() => {
    const activeAnnouncementItems = getActiveAnnouncements(
      settings?.announcements || [],
      "notice_board",
      "/",
    ).map(convertAnnouncementToNotice);

    const sectionItems =
      Array.isArray(content?.items) && content.items.length > 0
        ? content.items
        : Array.isArray(notices) && notices.length > 0
          ? notices
          : NOTICES;

    return [...activeAnnouncementItems, ...sectionItems];
  }, [settings?.announcements, content?.items, notices]);

  useEffect(() => {
    const box = scrollRef.current;
    if (!box) return undefined;

    let scroll = 0;
    let paused = false;

    const interval = window.setInterval(() => {
      if (paused) return;

      scroll += 0.5;
      box.scrollTop = scroll;

      if (scroll >= box.scrollHeight / 2) {
        scroll = 0;
      }
    }, 20);

    const pause = () => {
      paused = true;
    };

    const resume = () => {
      paused = false;
    };

    box.addEventListener("mouseenter", pause);
    box.addEventListener("mouseleave", resume);

    return () => {
      window.clearInterval(interval);
      box.removeEventListener("mouseenter", pause);
      box.removeEventListener("mouseleave", resume);
    };
  }, [items]);

  const viewAllPath = content?.button_href || "/notices";
  const viewAllLabel = content?.button_label || "View All";
  const title = content?.section_title || "Notice Board";

  return (
    <section className="notice-wrapper container">
      <div className="notice-board">
        <div className="notice-header">
          <h2 style={{ color: "#fff" }}>{title}</h2>

          <a
            href={buildSiteHref(siteId, viewAllPath)}
            className="view-all"
            onClick={(event) => {
              event.preventDefault();
              window.dispatchEvent(
                new CustomEvent("builder:navigate", { detail: viewAllPath }),
              );
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          >
            {viewAllLabel}
          </a>
        </div>

        <div className="notice-scroll" ref={scrollRef}>
          <div className="notice-list">
            {[...items, ...items].map((item, index) => (
              <div
                key={`${item.id || item.title}-${index}`}
                className="notice-row"
              >
                <span className="notice-date">
                  {item.publishedAt
                    ? `Published: ${formatDateTime(item.publishedAt)}`
                    : ""}
                </span>

                <span className="notice-title">{item.title}</span>

                <span className="notice-meta">
                  {formatRange(item.startAt, item.endAt)}
                  {item.location ? ` • ${item.location}` : ""}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
