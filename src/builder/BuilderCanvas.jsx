import { useMemo, useState, useEffect } from "react";
import "../styles/builderCanvas.css";
import "../styles/builder-media-editor.css";
import "../styles/builder-section-workspace.css";

const EMPTY_BUILDER_SECTIONS = Object.freeze([]);

function DesktopIcon() {
  return (
    <svg
      className="canvas-toolbar-icon"
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <rect x="3.5" y="4.5" width="17" height="11.5" rx="1.6" />
      <path d="M9 20h6" />
      <path d="M12 16v4" />
    </svg>
  );
}

function TabletIcon() {
  return (
    <svg
      className="canvas-toolbar-icon"
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <rect x="6" y="3" width="12" height="18" rx="2" />
      <path d="M10.5 17.8h3" />
    </svg>
  );
}

function MobileIcon() {
  return (
    <svg
      className="canvas-toolbar-icon"
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <rect x="7.3" y="2.5" width="9.4" height="19" rx="2" />
      <path d="M10.7 18.2h2.6" />
    </svg>
  );
}

function UndoIcon() {
  return (
    <svg
      className="canvas-toolbar-icon"
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M9 7 4 12l5 5" />
      <path d="M4 12h10a6 6 0 0 1 6 6v1" />
    </svg>
  );
}

function RedoIcon() {
  return (
    <svg
      className="canvas-toolbar-icon"
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="m15 7 5 5-5 5" />
      <path d="M20 12H10a6 6 0 0 0-6 6v1" />
    </svg>
  );
}

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
  layoutKey = null,
  templateKey = null,
  page,
  sections = EMPTY_BUILDER_SECTIONS,
  selectedSectionId = null,
  sectionEditorOpen = false,
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

  /*
    The editor is scoped to the current preview URL. When another page opens,
    the previous page's media editor is no longer displayed, without requiring
    a state update effect during navigation.
  */
  const [mediaEditorState, setMediaEditorState] = useState({
    open: false,
    previewUrl: "",
  });

  const safeSections = useMemo(
    () => (Array.isArray(sections) ? sections : EMPTY_BUILDER_SECTIONS),
    [sections],
  );

  const selectedSection = useMemo(
    () =>
      safeSections.find((section) => section?.id === selectedSectionId) || null,
    [safeSections, selectedSectionId],
  );

  const previewUrl = useMemo(() => {
    if (!siteId) return "";

    return buildPreviewUrl(siteId, page?.slug || "/");
  }, [siteId, page]);

  const mediaEditorOpen =
    mediaEditorState.open === true &&
    mediaEditorState.previewUrl === previewUrl;

  const anyEditorOpen = mediaEditorOpen || sectionEditorOpen;

  const postTemplateUpdateToPreview = (nextLayoutKey, nextTemplateKey) => {
    if (!window.previewFrame?.contentWindow) return;
    if (!nextLayoutKey && !nextTemplateKey) return;

    const detail = {
      layoutKey: nextLayoutKey || null,
      templateKey: nextTemplateKey || null,
      layout_key: nextLayoutKey || null,
      template_key: nextTemplateKey || null,
    };

    window.previewFrame.contentWindow.postMessage(
      {
        type: "builder:template-updated",
        ...detail,
      },
      "*",
    );

    window.previewFrame.contentWindow.postMessage(
      {
        type: "site-template-updated",
        ...detail,
      },
      "*",
    );
  };

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

    return () => {
      window.removeEventListener("resize", handleResize);
    };
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

    function handleTemplateUpdate(e) {
      const detail = e.detail || e.data || {};

      postTemplateUpdateToPreview(
        detail.layoutKey || detail.layout_key,
        detail.templateKey || detail.template_key,
      );
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

    function handleNavUpdate(e) {
      const detail = e.detail || {};
      const navItems = Array.isArray(detail)
        ? detail
        : detail.navItems || detail.items || detail.payload || [];

      if (window.previewFrame?.contentWindow) {
        window.previewFrame.contentWindow.postMessage(
          { type: "builder:nav-updated", navItems },
          "*",
        );

        window.previewFrame.contentWindow.postMessage(
          { type: "site-nav-updated", navItems },
          "*",
        );
      }
    }

    function handleSectionsUpdate(e) {
      const detail = e.detail || {};
      const nextSections = Array.isArray(detail)
        ? detail
        : detail.sections || detail.items || detail.payload || [];

      if (window.previewFrame?.contentWindow) {
        window.previewFrame.contentWindow.postMessage(
          { type: "builder:sections-updated", sections: nextSections },
          "*",
        );

        window.previewFrame.contentWindow.postMessage(
          { type: "site-sections-updated", sections: nextSections },
          "*",
        );
      }
    }

    window.addEventListener("builder:navigate", handleNavigate);
    window.addEventListener("builder:template-updated", handleTemplateUpdate);
    window.addEventListener("site-template-updated", handleTemplateUpdate);
    window.addEventListener("builder:settings-updated", handleSettingsUpdate);
    window.addEventListener("site-settings-updated", handleSettingsUpdate);
    window.addEventListener("builder:nav-updated", handleNavUpdate);
    window.addEventListener("site-nav-updated", handleNavUpdate);
    window.addEventListener("builder:sections-updated", handleSectionsUpdate);
    window.addEventListener("site-sections-updated", handleSectionsUpdate);

    return () => {
      window.removeEventListener("builder:navigate", handleNavigate);
      window.removeEventListener(
        "builder:template-updated",
        handleTemplateUpdate,
      );
      window.removeEventListener("site-template-updated", handleTemplateUpdate);
      window.removeEventListener(
        "builder:settings-updated",
        handleSettingsUpdate,
      );
      window.removeEventListener("site-settings-updated", handleSettingsUpdate);
      window.removeEventListener("builder:nav-updated", handleNavUpdate);
      window.removeEventListener("site-nav-updated", handleNavUpdate);
      window.removeEventListener(
        "builder:sections-updated",
        handleSectionsUpdate,
      );
      window.removeEventListener(
        "site-sections-updated",
        handleSectionsUpdate,
      );
    };
  }, [siteId, layoutKey, templateKey]);

  useEffect(() => {
    postTemplateUpdateToPreview(layoutKey, templateKey);
  }, [layoutKey, templateKey, previewUrl]);

  useEffect(() => {
    function handleMediaEditorState(event) {
      const detail = event?.detail || {};

      if (typeof detail.open !== "boolean") return;

      setMediaEditorState({
        open: detail.open,
        previewUrl,
      });
    }

    function handleMediaEditorMessage(event) {
      const payload = event?.data;

      if (!payload || typeof payload !== "object") return;

      if (payload.type !== "builder:media-editor-state") return;

      setMediaEditorState({
        open: payload.open === true,
        previewUrl,
      });
    }

    window.addEventListener(
      "builder:media-editor-state",
      handleMediaEditorState,
    );
    window.addEventListener("message", handleMediaEditorMessage);

    return () => {
      window.removeEventListener(
        "builder:media-editor-state",
        handleMediaEditorState,
      );
      window.removeEventListener("message", handleMediaEditorMessage);
    };
  }, [previewUrl]);

  useEffect(() => {
    if (!window.previewFrame?.contentWindow) return;

    window.previewFrame.contentWindow.postMessage(
      {
        type: "builder:sections-updated",
        sections: safeSections,
      },
      "*",
    );

    window.previewFrame.contentWindow.postMessage(
      {
        type: "site-sections-updated",
        sections: safeSections,
      },
      "*",
    );
  }, [safeSections]);

  useEffect(() => {
    if (!window.previewFrame?.contentWindow) return;

    const detail = {
      type: "builder:section-editor-state",
      open: sectionEditorOpen === true,
      editorType: "section",
      sectionId: selectedSectionId,
      sectionType: selectedSection?.type || null,
    };

    window.previewFrame.contentWindow.postMessage(detail, "*");
  }, [sectionEditorOpen, selectedSectionId, selectedSection]);

  useEffect(() => {
    if (!page) return;

    if (window.previewFrame?.contentWindow) {
      window.previewFrame.contentWindow.postMessage(
        {
          type: "builder:page-updated",
          page,
        },
        "*",
      );

      window.previewFrame.contentWindow.postMessage(
        {
          type: "site-page-updated",
          page,
        },
        "*",
      );
    }
  }, [page]);

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

        postTemplateUpdateToPreview(layoutKey, templateKey);

        window.previewFrame.contentWindow.postMessage(
          {
            type: "builder:sections-updated",
            sections: safeSections,
          },
          "*",
        );

        window.previewFrame.contentWindow.postMessage(
          {
            type: "site-sections-updated",
            sections: safeSections,
          },
          "*",
        );

        window.previewFrame.contentWindow.postMessage(
          {
            type: "builder:section-editor-state",
            open: sectionEditorOpen === true,
            editorType: "section",
            sectionId: selectedSectionId,
            sectionType: selectedSection?.type || null,
          },
          "*",
        );
      }
    } catch {
      // Ignore cross-origin preview access errors.
    }
  };

  return (
    <div
      className={`builder-canvas ${
        anyEditorOpen ? "builder-canvas-editor-open" : ""
      } ${sectionEditorOpen ? "builder-canvas-section-editor-open" : ""}`}
    >
      <div className="canvas-toolbar">
        <div className="device-switch">
          <button
            type="button"
            className={device === "desktop" ? "active" : ""}
            onClick={() => setDevice("desktop")}
            aria-pressed={device === "desktop"}
            aria-label="Preview desktop screen"
          >
            <DesktopIcon />
            <span>Desktop</span>
          </button>

          <button
            type="button"
            className={device === "tablet" ? "active" : ""}
            onClick={() => setDevice("tablet")}
            aria-pressed={device === "tablet"}
            aria-label="Preview tablet screen"
          >
            <TabletIcon />
            <span>Tablet</span>
          </button>

          <button
            type="button"
            className={device === "mobile" ? "active" : ""}
            onClick={() => setDevice("mobile")}
            aria-pressed={device === "mobile"}
            aria-label="Preview mobile screen"
          >
            <MobileIcon />
            <span>Mobile</span>
          </button>
        </div>

        <div className="canvas-history-actions">
          <button
            type="button"
            className="history-btn"
            onClick={onUndo}
            disabled={!canUndo}
            aria-label="Undo last change"
          >
            <UndoIcon />
            <span>Undo</span>
          </button>

          <button
            type="button"
            className="history-btn"
            onClick={onRedo}
            disabled={!canRedo}
            aria-label="Redo last change"
          >
            <RedoIcon />
            <span>Redo</span>
          </button>
        </div>
      </div>

      <div
        className={`canvas-workspace ${
          mediaEditorOpen ? "media-editor-open" : ""
        } ${sectionEditorOpen ? "section-editor-open" : ""}`}
      >
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

        <aside
          id="builder-media-editor-dock"
          className={`builder-media-editor-dock ${
            mediaEditorOpen ? "open" : ""
          }`}
          aria-hidden={!mediaEditorOpen}
          aria-label="Website editor drawer area"
        />
      </div>
    </div>
  );
}