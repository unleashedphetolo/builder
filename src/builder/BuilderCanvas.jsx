import { useMemo, useState, useEffect } from "react";
import "../styles/builderCanvas.css";

function normalizePreviewSlug(slug = "/") {
  const raw = String(slug || "/").trim();

  const cleanRaw = raw
    .split("?")[0]
    .split("#")[0]
    .replace(/^\/+|\/+$/g, "");

  if (!cleanRaw || cleanRaw.toLowerCase() === "home") return "/";

  return `/${cleanRaw}`;
}

function buildPreviewUrl(siteId, slug = "/") {
  if (!siteId) return "";

  const cleanSlug = normalizePreviewSlug(slug);
  const path = cleanSlug === "/" ? "" : cleanSlug;

  return `#/site/${siteId}${path}?builder=1`;
}

function extractSlugFromHash(hash = "") {
  const cleanHash = String(hash || "")
    .replace(/^#/, "")
    .split("?")[0];

  const parts = cleanHash.split("/").filter(Boolean);

  // expected:
  // #/site/{siteId}
  // #/site/{siteId}/about
  // #/site/{siteId}/about/history
  if (parts[0] !== "site") return "/";

  const slugParts = parts.slice(2);

  if (!slugParts.length) return "/";

  return normalizePreviewSlug(`/${slugParts.join("/")}`);
}

export default function BuilderCanvas({
  siteId,
  page,
  onUndo,
  onRedo,
  canUndo = false,
  canRedo = false,
}) {
  const [device, setDevice] = useState(() => {
    if (typeof window === "undefined") return "desktop";
    if (window.innerWidth <= 768) return "mobile";
    if (window.innerWidth <= 1024) return "tablet";
    return "desktop";
  });

  const previewUrl = useMemo(() => {
    if (!siteId) return "";

    return buildPreviewUrl(siteId, page?.slug || "/");
  }, [siteId, page]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setDevice("mobile");
      } else if (window.innerWidth <= 1024) {
        setDevice("tablet");
      } else {
        setDevice("desktop");
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    function handleNavigate(e) {
      const slug = normalizePreviewSlug(e.detail || "/");
      const nextPreviewUrl = buildPreviewUrl(siteId, slug);

      if (window.previewFrame && nextPreviewUrl) {
        const currentSrc = window.previewFrame.getAttribute("src") || "";

        if (currentSrc !== nextPreviewUrl) {
          window.previewFrame.setAttribute("src", nextPreviewUrl);
        }
      }

      if (window.previewFrame?.contentWindow) {
        window.previewFrame.contentWindow.postMessage(
          { type: "navigate", slug },
          "*",
        );

        window.previewFrame.contentWindow.postMessage(
          { type: "builder:navigate", slug },
          "*",
        );
      }
    }

    function handleSettingsUpdate(e) {
      const settings = e.detail || {};

      if (window.previewFrame?.contentWindow) {
        window.previewFrame.contentWindow.postMessage(
          { type: "builder:settings-updated", settings },
          "*",
        );

        window.previewFrame.contentWindow.postMessage(
          { type: "site-settings-updated", settings },
          "*",
        );
      }
    }

    window.addEventListener("builder:navigate", handleNavigate);
    window.addEventListener("builder:settings-updated", handleSettingsUpdate);
    window.addEventListener("site-settings-updated", handleSettingsUpdate);

    return () => {
      window.removeEventListener("builder:navigate", handleNavigate);
      window.removeEventListener(
        "builder:settings-updated",
        handleSettingsUpdate,
      );
      window.removeEventListener("site-settings-updated", handleSettingsUpdate);
    };
  }, [siteId]);

  const handleIframeLoad = (e) => {
    try {
      const iframe = e.target;
      const url = new URL(iframe.contentWindow.location.href);
      const hash = url.hash || "";

      if (!hash.includes("/site/")) return;

      const slug = extractSlugFromHash(hash);
      const currentPageSlug = normalizePreviewSlug(page?.slug || "/");

      if (slug !== currentPageSlug) {
        window.dispatchEvent(
          new CustomEvent("builder:navigate", { detail: slug }),
        );
      }

      if (window.previewFrame?.contentWindow) {
        window.previewFrame.contentWindow.postMessage(
          { type: "builder:request-sync" },
          "*",
        );
      }
    } catch (err) {
      // ignore cross-origin errors
    }
  };

  return (
    <div className="builder-canvas">
      <div className="canvas-toolbar">
        <div className="device-switch">
          <button
            type="button"
            className={device === "desktop" ? "active" : ""}
            onClick={() => setDevice("desktop")}
          >
            Desktop
          </button>

          <button
            type="button"
            className={device === "tablet" ? "active" : ""}
            onClick={() => setDevice("tablet")}
          >
            Tablet
          </button>

          <button
            type="button"
            className={device === "mobile" ? "active" : ""}
            onClick={() => setDevice("mobile")}
          >
            Mobile
          </button>
        </div>

        <div className="canvas-history-actions">
          <button
            type="button"
            className="history-btn"
            onClick={onUndo}
            disabled={!canUndo}
          >
            Undo
          </button>

          <button
            type="button"
            className="history-btn"
            onClick={onRedo}
            disabled={!canRedo}
          >
            Redo
          </button>
        </div>
      </div>

      <div className={`canvas-inner ${device}`}>
        {!previewUrl ? (
          <div className="placeholder-content">
            <h2>No page selected</h2>
            <p>Select a page to preview it.</p>
          </div>
        ) : (
          <div className="builder-preview-frame-wrap">
            <iframe
              ref={(el) => (window.previewFrame = el)}
              src={previewUrl}
              title="Website Preview"
              className="builder-preview-frame"
              loading="lazy"
              onLoad={handleIframeLoad}
            />
          </div>
        )}
      </div>
    </div>
  );
}