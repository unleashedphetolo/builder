import { useMemo, useState } from "react";
import "../styles/builderCanvas.css";

export default function BuilderCanvas({ siteId, page }) {
  const [device, setDevice] = useState("desktop");

  const previewUrl = useMemo(() => {
    if (!siteId) return "";

    const slug = page?.slug && page.slug !== "/" ? page.slug : "";
    const cleanSlug = slug ? `/${slug.replace(/^\/+/, "")}` : "";

    return `/#/site/${siteId}${cleanSlug}?builder=1&preview=1`;
  }, [siteId, page]);

  return (
    <div className="builder-canvas">
      <div className="device-switch">
        <button
          className={device === "desktop" ? "active" : ""}
          onClick={() => setDevice("desktop")}
        >
          Desktop
        </button>

        <button
          className={device === "tablet" ? "active" : ""}
          onClick={() => setDevice("tablet")}
        >
          Tablet
        </button>

        <button
          className={device === "mobile" ? "active" : ""}
          onClick={() => setDevice("mobile")}
        >
          Mobile
        </button>
      </div>

      <div className={`canvas-inner ${device}`}>
        {!previewUrl ? (
          <div className="placeholder-content">
            <h2>No page selected</h2>
            <p>Select a page to preview it.</p>
          </div>
        ) : (
          <iframe
            key={previewUrl}
            src={previewUrl}
            title="Website Preview"
            className="builder-preview-frame"
            loading="lazy"
          />
        )}
      </div>
    </div>
  );
}