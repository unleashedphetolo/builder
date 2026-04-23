import { useMemo, useState, useEffect } from "react";
import "../styles/builderCanvas.css";

export default function BuilderCanvas({
  siteId,
  page,
  onUndo,
  onRedo,
  canUndo = false,
  canRedo = false,
}) {
  const [device, setDevice] = useState("desktop");

  const previewUrl = useMemo(() => {
    if (!siteId) return "";

    const slug = page?.slug && page.slug !== "/" ? `/${page.slug}` : "";

    return `#/site/${siteId}${slug}?builder=1`;
  }, [siteId, page]);

  useEffect(() => {
    function handleNavigate(e) {
      const slug = e.detail || "/";

      if (window.previewFrame?.contentWindow) {
        window.previewFrame.contentWindow.postMessage(
          { type: "navigate", slug },
          "*",
        );
      }
    }

    window.addEventListener("builder:navigate", handleNavigate);

    return () => {
      window.removeEventListener("builder:navigate", handleNavigate);
    };
  }, []);

  const handleIframeLoad = (e) => {
    try {
      const iframe = e.target;
      const url = new URL(iframe.contentWindow.location.href);

      const hash = url.hash || "";

      if (!hash.includes("/site/")) return;

      const parts = hash.split("/");

      // expected: #/site/{siteId}/{slug}
      const slug = parts.slice(3).join("/") || "/";

      if (slug !== page?.slug) {
        window.dispatchEvent(
          new CustomEvent("builder:navigate", { detail: slug }),
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