import React, { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { supabase } from "../supabase/client";
import "../styles/builder-media-editor.css";

const IMAGE_LIBRARIES = [
  
  {
    name: "Pexels Images",
    description: "Free website and hero images.",
    searchUrl: (query) =>
      `https://www.pexels.com/search/${encodeURIComponent(
        query || "website",
      )}/`,
  },
  {
    name: "Pixabay Images",
    description: "Free images and illustrations.",
    searchUrl: (query) =>
      `https://pixabay.com/images/search/${encodeURIComponent(
        query || "website",
      )}/`,
  },
  {
    name: "Unsplash",
    description: "High-quality free photographs.",
    searchUrl: (query) =>
      `https://unsplash.com/s/photos/${encodeURIComponent(query || "website")}`,
  },
];

const VIDEO_LIBRARIES = [
  {
    name: "Pexels Videos",
    description: "Free background and hero videos.",
    searchUrl: (query) =>
      `https://www.pexels.com/search/videos/${encodeURIComponent(
        query || "website",
      )}/`,
  },
  {
    name: "Pixabay Videos",
    description: "Free stock video library.",
    searchUrl: (query) =>
      `https://pixabay.com/videos/search/${encodeURIComponent(
        query || "website",
      )}/`,
  },
  {
    name: "Coverr",
    description: "Free website background videos.",
    searchUrl: (query) =>
      `https://coverr.co/s?q=${encodeURIComponent(query || "website")}`,
  },
];

const POSITION_OPTIONS = [
  { value: "center center", label: "Center Center" },
  { value: "top center", label: "Top Center" },
  { value: "bottom center", label: "Bottom Center" },
  { value: "center left", label: "Center Left" },
  { value: "center right", label: "Center Right" },
];

const DEFAULT_SLIDESHOW_SETTINGS = {
  autoplay: true,
  intervalSeconds: 5,
  pauseOnHover: false,
  showArrows: true,
  showDots: true,
  transition: "fade",
};

const MEDIA_EDITOR_ACTIVATE_EVENT = "builder:activate-media-editor";
const EMPTY_MEDIA_SLIDES = Object.freeze([]);
const EMPTY_MEDIA_SETTINGS = Object.freeze({});
const DEFAULT_MEDIA_STORAGE_BUCKET = "site-media";
const DEFAULT_MEDIA_TABLE = "site_media";
const DEFAULT_MAX_IMAGE_UPLOAD_MB = 8;
const DEFAULT_MAX_VIDEO_UPLOAD_MB = 100;

function pickFirstValue(...values) {
  for (const value of values) {
    const clean = String(value || "").trim();

    if (clean) return clean;
  }

  return "";
}

function isVideoUrl(url = "") {
  return /\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(String(url || ""));
}

function inferMediaType(url = "", fallback = "image") {
  if (isVideoUrl(url)) return "video";
  return fallback === "video" ? "video" : "image";
}

function getSiteName(settings = {}) {
  return pickFirstValue(
    settings?.site_name,
    settings?.organization_name,
    settings?.organization?.name,
    settings?.name,
    settings?.company_name,
    settings?.school_name,
    "website",
  );
}

function createSlideId(index = 0) {
  return `slide-${Date.now()}-${index}`;
}

function createEditorInstanceId() {
  return `media-editor-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 10)}`;
}

function normalizeSlides(slides = []) {
  return (Array.isArray(slides) ? slides : []).map((slide, index) => {
    const src = pickFirstValue(slide?.src, slide?.image, slide?.url);

    return {
      id: slide?.id || createSlideId(index),
      type: slide?.type === "video" || isVideoUrl(src) ? "video" : "image",
      src,
      image: pickFirstValue(slide?.image, slide?.src, slide?.url),
      url: pickFirstValue(slide?.url, slide?.src, slide?.image),
      poster: pickFirstValue(slide?.poster, slide?.image, slide?.src),
      alt: slide?.alt || "Slideshow media",
      title: slide?.title || "New Slide",
      subtitle: slide?.subtitle || "Edit this slide description.",
      primaryButtonText:
        slide?.primaryButtonText ||
        slide?.primary_button_text ||
        slide?.primaryText ||
        "",
      primaryButtonHref:
        slide?.primaryButtonHref ||
        slide?.primary_button_href ||
        slide?.primaryHref ||
        "",
      secondaryButtonText:
        slide?.secondaryButtonText ||
        slide?.secondary_button_text ||
        slide?.secondaryText ||
        "",
      secondaryButtonHref:
        slide?.secondaryButtonHref ||
        slide?.secondary_button_href ||
        slide?.secondaryHref ||
        "",
      overlayOpacity:
        typeof slide?.overlayOpacity === "number"
          ? slide.overlayOpacity
          : typeof slide?.overlay_opacity === "number"
            ? slide.overlay_opacity
            : 0.45,
      objectPosition:
        slide?.objectPosition || slide?.object_position || "center center",
      backgroundColor:
        slide?.backgroundColor || slide?.background_color || "#0f172a",
      fixedBackground:
        slide?.fixedBackground === true || slide?.fixed_background === true,
    };
  });
}

function safeFileName(fileName = "asset") {
  const extensionMatch = String(fileName).match(/\.[a-z0-9]+$/i);
  const extension = extensionMatch ? extensionMatch[0].toLowerCase() : "";
  const baseName = String(fileName)
    .replace(/\.[a-z0-9]+$/i, "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 70);

  return `${baseName || "asset"}${extension}`;
}

function formatFileSize(bytes = 0) {
  const safeBytes = Number(bytes) || 0;

  if (safeBytes < 1024) return `${safeBytes} B`;
  if (safeBytes < 1024 * 1024) return `${(safeBytes / 1024).toFixed(1)} KB`;

  return `${(safeBytes / (1024 * 1024)).toFixed(1)} MB`;
}

function getMediaKindFromFile(file) {
  return String(file?.type || "").startsWith("video/") ? "video" : "image";
}

function getUploadFolder(target = "media") {
  if (target === "logo") return "logos";
  if (target === "slide") return "hero-slides";
  if (target === "background") return "backgrounds";
  return "media";
}

function getAssetMediaType(asset = {}) {
  return asset?.kind === "video" || isVideoUrl(asset?.url) ? "video" : "image";
}

function getEditorPortalTarget() {
  if (typeof document === "undefined") return null;

  try {
    if (window.parent && window.parent !== window) {
      const parentDock = window.parent.document.getElementById(
        "builder-media-editor-dock",
      );

      if (parentDock) {
        return parentDock;
      }
    }
  } catch (error) {
    // Fall back to the current document when parent access is unavailable.
  }

  return document.body;
}

function postSettingsPatch(patch) {
  if (!patch || typeof patch !== "object" || Array.isArray(patch)) return;

  window.parent?.postMessage(
    {
      type: "builder:update-settings",
      patch,
    },
    "*",
  );

  window.dispatchEvent(
    new CustomEvent("builder:settings-updated", {
      detail: patch,
    }),
  );

  window.dispatchEvent(
    new CustomEvent("site-settings-updated", {
      detail: patch,
    }),
  );
}

function MediaLibraryPanel({
  mediaType = "image",
  query,
  setQuery,
  assets = [],
  loading = false,
  error = "",
  uploading = false,
  onRefresh,
  onUploadAsset,
  onUseAsset,
}) {
  const libraries = mediaType === "video" ? VIDEO_LIBRARIES : IMAGE_LIBRARIES;

  const filteredAssets = (Array.isArray(assets) ? assets : []).filter(
    (asset) => getAssetMediaType(asset) === mediaType,
  );

  return (
    <div className="bme-library-panel">
      <div className="bme-library-heading">
        <div>
          <h4>Website Media Library</h4>

          <p>
            Upload assets once and reuse them safely across website sections.
          </p>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            flexWrap: "wrap",
          }}
        >
          <button
            type="button"
            className="bme-library-button"
            disabled={uploading}
            onClick={onUploadAsset}
          >
            {uploading ? "Uploading..." : "+ Upload"}
          </button>

          <button
            type="button"
            className="bme-library-button"
            disabled={loading || uploading}
            onClick={onRefresh}
          >
            {loading ? "Loading..." : "Refresh"}
          </button>
        </div>
      </div>

      {error && (
        <p
          role="alert"
          style={{
            margin: "10px 0",
            padding: "10px 12px",
            borderRadius: 8,
            border: "1px solid #fecaca",
            background: "#fef2f2",
            color: "#b91c1c",
            fontSize: 12,
            lineHeight: 1.5,
          }}
        >
          {error}
        </p>
      )}

      {loading ? (
        <p className="bme-helper-text">Loading your media library...</p>
      ) : filteredAssets.length ? (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
            gap: 10,
            marginTop: 12,
          }}
        >
          {filteredAssets.map((asset) => (
            <article
              key={asset.id || asset.url}
              className="bme-library-card"
              style={{ minWidth: 0 }}
            >
              {mediaType === "video" ? (
                <video
                  src={asset.url}
                  muted
                  preload="metadata"
                  style={{
                    width: "100%",
                    height: 84,
                    objectFit: "cover",
                    borderRadius: 7,
                    background: "#0f172a",
                  }}
                />
              ) : (
                <img
                  src={asset.url}
                  alt={asset.alt || asset.name || "Website asset"}
                  style={{
                    width: "100%",
                    height: 84,
                    objectFit: "contain",
                    borderRadius: 7,
                    border: "1px solid #e2e8f0",
                    background: "#f8fafc",
                  }}
                />
              )}

              <strong
                title={asset.name || "Media asset"}
                style={{
                  marginTop: 7,
                  overflow: "hidden",
                  whiteSpace: "nowrap",
                  textOverflow: "ellipsis",
                }}
              >
                {asset.name || "Media asset"}
              </strong>

              <span>
                {getAssetMediaType(asset) === "video" ? "Video" : "Image"}
              </span>

              <button
                type="button"
                className="bme-library-link"
                onClick={() => onUseAsset?.(asset)}
              >
                Use Asset
              </button>
            </article>
          ))}
        </div>
      ) : (
        <p className="bme-helper-text">
          No {mediaType} assets uploaded yet. Use Upload to add your first
          reusable asset.
        </p>
      )}

      <div className="bme-library-heading" style={{ marginTop: 22 }}>
        <div>
          <h4>Free {mediaType === "video" ? "Video" : "Image"} Sources</h4>

          <p>
            Find a suitable free asset, download it, then upload it to your
            website media library before using it.
          </p>
        </div>
      </div>

      <label className="bme-label" htmlFor="bme-library-search">
        Search keyword
      </label>

      <input
        id="bme-library-search"
        className="bme-input"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder={
          mediaType === "video" ? "School campus video" : "Students learning"
        }
      />

      <div className="bme-library-grid">
        {libraries.map((library) => (
          <article key={library.name} className="bme-library-card">
            <strong>{library.name}</strong>
            <span>{library.description}</span>

            <a
              href={library.searchUrl(query)}
              target="_blank"
              rel="noopener noreferrer"
              className="bme-library-link"
            >
              Open Source
            </a>
          </article>
        ))}
      </div>
    </div>
  );
}

function EmptyMediaPreview({ text = "No media selected" }) {
  return (
    <div className="bme-empty-media">
      <span className="bme-empty-icon">▧</span>
      <strong>{text}</strong>
      <p>Upload a file or enter a direct media URL.</p>
    </div>
  );
}

function SlideThumbnail({ slide }) {
  const mediaUrl = pickFirstValue(slide?.src, slide?.image, slide?.url);

  if (!mediaUrl) {
    return <div className="bme-slide-thumb-empty">No media</div>;
  }

  if (slide?.type === "video") {
    return (
      <div className="bme-slide-thumb-video">
        <video src={mediaUrl} muted preload="metadata" />
        <span>▶</span>
      </div>
    );
  }

  return <img src={mediaUrl} alt="" className="bme-slide-thumb-image" />;
}

export default function BuilderMediaEditor({
  enabled = false,
  type = "slideshow",
  label = "Edit Hero Slideshow",
  value = "",
  // slides = [],
  // settings = {},
  slides = EMPTY_MEDIA_SLIDES,
  settings = EMPTY_MEDIA_SETTINGS,
  triggerLabel = "Edit",
  triggerClassName = "",
  triggerTitle = "Edit section",
  children = null,
  onSave,
  onUploadFile,

  settingKey = "media_url",
  mediaTypeKey = "media_type",
  logoKey = "logo_url",
  slidesKey = "hero_slides",
  slidesOverrideKey = "hero_slides_overridden",
  slideshowSettingsKey = "hero_slideshow_settings",
  backgroundKey = "background",
  backgroundImageKey = "background_image",
  backgroundVideoKey = "background_video",
  backgroundColorKey = "background_color",

  saveToBuilder = true,
  allowUpload = true,
  allowOnlineSearch = true,

  mediaTable = DEFAULT_MEDIA_TABLE,
  storageBucket = DEFAULT_MEDIA_STORAGE_BUCKET,
  maxImageUploadMb = DEFAULT_MAX_IMAGE_UPLOAD_MB,
  maxVideoUploadMb = DEFAULT_MAX_VIDEO_UPLOAD_MB,
}) {
  const fileInputRef = useRef(null);
  const uploadTargetRef = useRef("slide");
  const dragIndexRef = useRef(null);
  const editorOpenBroadcastRef = useRef(false);
  const editorInstanceIdRef = useRef(null);

  if (!editorInstanceIdRef.current) {
    editorInstanceIdRef.current = createEditorInstanceId();
  }

  const isLogoMode = type === "logo";
  const isBackgroundMode = type === "background";
  const editorLabel = isLogoMode ? "Edit Logo" : label;
  const editorTriggerLabel =
    isLogoMode && triggerLabel === "Edit" ? "Edit Logo" : triggerLabel;
  const isSlideshowMode =
    type === "slideshow" ||
    type === "slides" ||
    (Array.isArray(slides) && slides.length > 0);

  const initialMediaType =
    type === "video" ? "video" : inferMediaType(value, "image");

  const siteName = getSiteName(settings);
  const siteId = settings?.site_id || settings?.siteId || "";

  const [open, setOpen] = useState(false);
  const [portalTarget, setPortalTarget] = useState(null);
  const [activeTab, setActiveTab] = useState(
    isSlideshowMode
      ? "slides"
      : isBackgroundMode
        ? "background"
        : isLogoMode
          ? "logo"
          : "media",
  );

  const [mediaType, setMediaType] = useState(initialMediaType);
  const [draftValue, setDraftValue] = useState(value || "");
  const [draftSlides, setDraftSlides] = useState(() => normalizeSlides(slides));
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [libraryOpen, setLibraryOpen] = useState(false);
  const [libraryQuery, setLibraryQuery] = useState(
    `${siteName.toLowerCase()} education`,
  );
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [editorError, setEditorError] = useState("");
  const [editorNotice, setEditorNotice] = useState("");
  const [mediaLibraryItems, setMediaLibraryItems] = useState([]);
  const [mediaLibraryLoading, setMediaLibraryLoading] = useState(false);
  const [mediaLibraryError, setMediaLibraryError] = useState("");

  const [slideshowSettings, setSlideshowSettings] = useState({
    ...DEFAULT_SLIDESHOW_SETTINGS,
    ...(settings?.[slideshowSettingsKey] || {}),
  });

  const [backgroundDraft, setBackgroundDraft] = useState({
    type: inferMediaType(
      settings?.[backgroundVideoKey] || settings?.[backgroundImageKey] || value,
      "image",
    ),
    image: pickFirstValue(settings?.[backgroundImageKey], value),
    video: settings?.[backgroundVideoKey] || "",
    color: settings?.[backgroundColorKey] || "#0f172a",
    overlayOpacity: settings?.background?.overlayOpacity ?? 0.45,
    objectPosition: settings?.background?.objectPosition || "center center",
    fixedBackground: settings?.background?.fixedBackground === true,
  });

  const activeSlide = draftSlides[activeSlideIndex] || null;

  const activeSlideMediaUrl = useMemo(() => {
    return pickFirstValue(
      activeSlide?.src,
      activeSlide?.image,
      activeSlide?.url,
    );
  }, [activeSlide]);

  const editorPortalTarget =
    portalTarget || (open ? getEditorPortalTarget() : null);

  const isDockedEditor = editorPortalTarget?.id === "builder-media-editor-dock";

  const notifyEditorState = (isOpen) => {
    if (editorOpenBroadcastRef.current === isOpen) return;

    editorOpenBroadcastRef.current = isOpen;

    const detail = {
      open: isOpen,
      editorType: type,
      label: editorLabel,
    };

    window.dispatchEvent(
      new CustomEvent("builder:media-editor-state", {
        detail,
      }),
    );

    if (isOpen) {
      window.dispatchEvent(
        new CustomEvent("builder:close-sidebar", {
          detail: {
            source: "media-editor",
            editorType: type,
          },
        }),
      );
    }

    if (window.parent && window.parent !== window) {
      window.parent.postMessage(
        {
          type: "builder:media-editor-state",
          ...detail,
        },
        "*",
      );

      if (isOpen) {
        window.parent.postMessage(
          {
            type: "builder:close-sidebar",
            source: "media-editor",
            editorType: type,
          },
          "*",
        );
      }
    }
  };

  const activateOnlyThisEditor = () => {
    const detail = {
      type: MEDIA_EDITOR_ACTIVATE_EVENT,
      instanceId: editorInstanceIdRef.current,
      editorType: type,
      label: editorLabel,
    };

    /*
      All BuilderMediaEditor instances rendered in this website preview hear
      this request and close themselves before the selected editor opens.
    */
    window.dispatchEvent(
      new CustomEvent(MEDIA_EDITOR_ACTIVATE_EVENT, {
        detail,
      }),
    );

    /*
      Keep switching reliable if an editable component is rendered in the
      parent builder document rather than inside the preview iframe.
    */
    if (window.parent && window.parent !== window) {
      window.parent.postMessage(detail, "*");
    }

    /*
      Keep switching reliable if this component is ever mounted in the outer
      builder while template editors are inside the live preview frame.
    */
    if (window.previewFrame?.contentWindow) {
      window.previewFrame.contentWindow.postMessage(detail, "*");
    }
  };

  const openEditor = (event) => {
    event?.preventDefault();
    event?.stopPropagation();

    activateOnlyThisEditor();
    notifyEditorState(true);
    setPortalTarget(getEditorPortalTarget());
    setOpen(true);
  };

  const closeEditor = () => {
    if (saving || uploading) return;

    notifyEditorState(false);
    setOpen(false);
    setPortalTarget(null);
  };

  /*
    Exclusive editor switching:
    opening Hero, Logo, Background or any other BuilderMediaEditor closes any
    different editor already open in the same workspace.
  */
  useEffect(() => {
    if (!enabled) return undefined;

    const closeWhenAnotherEditorOpens = (detail = {}) => {
      if (detail.instanceId === editorInstanceIdRef.current) return;
      if (!open) return;

      closeEditor();
    };

    const handleActivateEditor = (event) => {
      closeWhenAnotherEditorOpens(event?.detail || {});
    };

    const handleActivateEditorMessage = (event) => {
      const payload = event?.data;

      if (!payload || typeof payload !== "object") return;
      if (payload.type !== MEDIA_EDITOR_ACTIVATE_EVENT) return;

      closeWhenAnotherEditorOpens(payload);
    };

    window.addEventListener(MEDIA_EDITOR_ACTIVATE_EVENT, handleActivateEditor);
    window.addEventListener("message", handleActivateEditorMessage);

    return () => {
      window.removeEventListener(
        MEDIA_EDITOR_ACTIVATE_EVENT,
        handleActivateEditor,
      );
      window.removeEventListener("message", handleActivateEditorMessage);
    };
  }, [enabled, open, saving]);

  useEffect(() => {
    if (!open) return undefined;

    const handleCloseMediaEditor = () => {
      closeEditor();
    };

    const handleCloseMediaEditorMessage = (event) => {
      const payload = event?.data;

      if (!payload || typeof payload !== "object") return;
      if (payload.type !== "builder:close-media-editor") return;

      closeEditor();
    };

    window.addEventListener(
      "builder:close-media-editor",
      handleCloseMediaEditor,
    );
    window.addEventListener("message", handleCloseMediaEditorMessage);

    return () => {
      window.removeEventListener(
        "builder:close-media-editor",
        handleCloseMediaEditor,
      );
      window.removeEventListener("message", handleCloseMediaEditorMessage);
    };
  }, [open, saving]);

  /*
    Initialise draft values only when this drawer opens.

    Important:
    Do not reset the editor again while it is already open when the template
    sends a freshly-created slides/settings array or object. Resetting state
    from those changing references causes an update loop and also overwrites
    work entered in the Slides, Settings, General or Logo tabs.
  */
  useEffect(() => {
    if (!open) return undefined;

    const normalizedSlides = normalizeSlides(slides);

    setDraftValue(value || "");
    setDraftSlides(normalizedSlides);
    setActiveSlideIndex(0);
    setMediaType(initialMediaType);
    setLibraryOpen(false);
    setSaving(false);
    setUploading(false);
    setEditorError("");
    setEditorNotice("");
    setMediaLibraryItems([]);
    setMediaLibraryLoading(false);
    setMediaLibraryError("");

    setSlideshowSettings({
      ...DEFAULT_SLIDESHOW_SETTINGS,
      ...(settings?.[slideshowSettingsKey] || {}),
    });

    setBackgroundDraft({
      type: inferMediaType(
        settings?.[backgroundVideoKey] ||
          settings?.[backgroundImageKey] ||
          value,
        "image",
      ),
      image: pickFirstValue(settings?.[backgroundImageKey], value),
      video: settings?.[backgroundVideoKey] || "",
      color: settings?.[backgroundColorKey] || "#0f172a",
      overlayOpacity: settings?.background?.overlayOpacity ?? 0.45,
      objectPosition: settings?.background?.objectPosition || "center center",
      fixedBackground: settings?.background?.fixedBackground === true,
    });

    setActiveTab(
      isSlideshowMode
        ? "slides"
        : isBackgroundMode
          ? "background"
          : isLogoMode
            ? "logo"
            : "media",
    );

    return undefined;

    // Copy the current incoming values when opening only. While the drawer is
    // open, the draft is controlled by this editor until Save or Cancel.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    if (!open) {
      setPortalTarget(null);
      return undefined;
    }

    const syncPortalTarget = () => {
      setPortalTarget(getEditorPortalTarget());
    };

    syncPortalTarget();

    const animationFrameId = window.requestAnimationFrame(syncPortalTarget);
    const timeoutId = window.setTimeout(syncPortalTarget, 80);

    return () => {
      window.cancelAnimationFrame(animationFrameId);
      window.clearTimeout(timeoutId);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;

    const targetDocument = editorPortalTarget?.ownerDocument || document;
    const keydownDocuments =
      targetDocument === document ? [document] : [document, targetDocument];

    const previousBodyOverflow = document.body.style.overflow;
    const previousTargetBodyOverflow =
      targetDocument?.body?.style?.overflow || "";

    if (!isDockedEditor) {
      document.body.style.overflow = "hidden";

      if (targetDocument !== document && targetDocument?.body) {
        targetDocument.body.style.overflow = "hidden";
      }
    }

    const handleEscape = (event) => {
      if (event.key === "Escape" && !saving) {
        notifyEditorState(false);
        setOpen(false);
        setPortalTarget(null);
      }
    };

    keydownDocuments.forEach((keydownDocument) => {
      keydownDocument.addEventListener("keydown", handleEscape);
    });

    return () => {
      if (!isDockedEditor) {
        document.body.style.overflow = previousBodyOverflow;

        if (targetDocument !== document && targetDocument?.body) {
          targetDocument.body.style.overflow = previousTargetBodyOverflow;
        }
      }

      keydownDocuments.forEach((keydownDocument) => {
        keydownDocument.removeEventListener("keydown", handleEscape);
      });
    };
  }, [open, saving, editorPortalTarget, isDockedEditor]);

  useEffect(() => {
    return () => {
      if (editorOpenBroadcastRef.current) {
        const detail = {
          open: false,
          editorType: type,
          label: editorLabel,
        };

        window.dispatchEvent(
          new CustomEvent("builder:media-editor-state", {
            detail,
          }),
        );

        if (window.parent && window.parent !== window) {
          window.parent.postMessage(
            {
              type: "builder:media-editor-state",
              ...detail,
            },
            "*",
          );
        }

        editorOpenBroadcastRef.current = false;
      }
    };
  }, [type, editorLabel]);

  const loadMediaLibrary = async () => {
    if (!siteId) {
      setMediaLibraryItems([]);
      setMediaLibraryError(
        "Select and save a website template before adding media assets.",
      );
      return;
    }

    setMediaLibraryLoading(true);
    setMediaLibraryError("");

    const { data, error } = await supabase
      .from(mediaTable)
      .select(
        "id, site_id, bucket, path, url, name, alt, kind, meta, created_at",
      )
      .eq("site_id", siteId)
      .order("created_at", { ascending: false })
      .limit(60);

    if (error) {
      console.error("Media library load failed:", error);
      setMediaLibraryItems([]);
      setMediaLibraryError(
        "Your media library could not be loaded. Check site_media access policies.",
      );
      setMediaLibraryLoading(false);
      return;
    }

    setMediaLibraryItems(Array.isArray(data) ? data : []);
    setMediaLibraryLoading(false);
  };

  const toggleMediaLibrary = () => {
    const shouldOpen = !libraryOpen;

    setLibraryOpen(shouldOpen);

    if (shouldOpen) {
      loadMediaLibrary();
    }
  };

  const selectMediaAsset = (asset) => {
    const assetUrl = pickFirstValue(asset?.url);
    const assetType = getAssetMediaType(asset);

    if (!assetUrl) return;

    if (isLogoMode) {
      if (assetType === "video") {
        setEditorError("A logo must be an image file.");
        return;
      }

      setDraftValue(assetUrl);
    } else if (isSlideshowMode && activeSlide) {
      updateSlide(activeSlideIndex, {
        type: assetType,
        src: assetUrl,
        image: assetType === "image" ? assetUrl : activeSlide.image,
        url: assetUrl,
        poster: assetType === "image" ? assetUrl : activeSlide.poster || "",
      });
    } else if (isBackgroundMode) {
      setBackgroundDraft((previous) => ({
        ...previous,
        type: assetType,
        image: assetType === "image" ? assetUrl : previous.image,
        video: assetType === "video" ? assetUrl : previous.video,
      }));
    } else {
      setMediaType(assetType);
      setDraftValue(assetUrl);
    }

    setEditorError("");
    setEditorNotice("Asset selected. Select Save Changes to publish it.");
  };

  const currentUploadTarget = isLogoMode
    ? "logo"
    : isSlideshowMode
      ? "slide"
      : isBackgroundMode
        ? "background"
        : "media";

  const updateSlide = (slideIndex, patch) => {
    setDraftSlides((previousSlides) =>
      previousSlides.map((slide, index) =>
        index === slideIndex ? { ...slide, ...patch } : slide,
      ),
    );
  };

  const addSlide = () => {
    const nextSlide = {
      id: createSlideId(draftSlides.length),
      type: "image",
      src: "",
      image: "",
      url: "",
      poster: "",
      alt: "New slideshow image",
      title: "New Slide",
      subtitle: "Edit this slide description.",
      primaryButtonText: "",
      primaryButtonHref: "",
      secondaryButtonText: "",
      secondaryButtonHref: "",
      overlayOpacity: 0.45,
      objectPosition: "center center",
      backgroundColor: "#0f172a",
      fixedBackground: false,
    };

    setDraftSlides((previousSlides) => {
      const nextSlides = [...previousSlides, nextSlide];
      setActiveSlideIndex(nextSlides.length - 1);
      return nextSlides;
    });
  };

  const deleteSlide = (slideIndex) => {
    setDraftSlides((previousSlides) => {
      const nextSlides = previousSlides.filter(
        (_, index) => index !== slideIndex,
      );

      setActiveSlideIndex((previousIndex) =>
        Math.max(0, Math.min(previousIndex, nextSlides.length - 1)),
      );

      return nextSlides;
    });
  };

  const moveSlide = (fromIndex, toIndex) => {
    if (
      fromIndex === toIndex ||
      fromIndex < 0 ||
      toIndex < 0 ||
      fromIndex >= draftSlides.length ||
      toIndex >= draftSlides.length
    ) {
      return;
    }

    setDraftSlides((previousSlides) => {
      const nextSlides = [...previousSlides];
      const [movedSlide] = nextSlides.splice(fromIndex, 1);

      nextSlides.splice(toIndex, 0, movedSlide);

      return nextSlides;
    });

    setActiveSlideIndex(toIndex);
  };

  const selectUploadTarget = (target) => {
    uploadTargetRef.current = target;

    if (!fileInputRef.current || uploading || saving) return;

    const targetUsesVideo =
      target === "slide"
        ? activeSlide?.type === "video"
        : target === "background"
          ? backgroundDraft.type === "video"
          : false;

    fileInputRef.current.accept =
      target === "logo"
        ? "image/png,image/jpeg,image/webp"
        : targetUsesVideo
          ? "video/mp4,video/webm,video/ogg"
          : "image/png,image/jpeg,image/webp,image/gif,video/mp4,video/webm,video/ogg";

    fileInputRef.current.click();
  };

  const recordMediaAsset = async ({ file, target, uploadedUrl, path }) => {
    if (!siteId || !uploadedUrl) return;

    const mediaTypeForRecord = getMediaKindFromFile(file);

    const { error } = await supabase.from(mediaTable).insert({
      site_id: siteId,
      bucket: storageBucket,
      path,
      url: uploadedUrl,
      name: file.name,
      alt: "",
      kind: mediaTypeForRecord,
      meta: {
        editor_type: type,
        target,
        mime_type: file.type || null,
        size_bytes: file.size || 0,
      },
    });

    if (error) {
      console.warn("Media uploaded but library record failed:", error);
      setEditorNotice(
        "File uploaded and selected. It could not be added to your reusable media library.",
      );
    }
  };

  const processUploadedFile = async (file, target) => {
    const uploadedType = getMediaKindFromFile(file);
    const isLogoUpload = target === "logo";

    if (isLogoUpload && uploadedType !== "image") {
      throw new Error("Logo upload only supports image files.");
    }

    const allowedLogoTypes = ["image/png", "image/jpeg", "image/webp"];
    const allowedImageTypes = [
      "image/png",
      "image/jpeg",
      "image/webp",
      "image/gif",
    ];
    const allowedVideoTypes = ["video/mp4", "video/webm", "video/ogg"];

    if (isLogoUpload && !allowedLogoTypes.includes(file.type)) {
      throw new Error("Logo files must be PNG, JPG or WebP.");
    }

    if (
      uploadedType === "image" &&
      !isLogoUpload &&
      !allowedImageTypes.includes(file.type)
    ) {
      throw new Error("Image files must be PNG, JPG, WebP or GIF.");
    }

    if (uploadedType === "video" && !allowedVideoTypes.includes(file.type)) {
      throw new Error("Video files must be MP4, WebM or OGG.");
    }

    const maxSizeMb =
      uploadedType === "video" ? maxVideoUploadMb : maxImageUploadMb;
    const maxSizeBytes = maxSizeMb * 1024 * 1024;

    if (file.size > maxSizeBytes) {
      throw new Error(
        `${uploadedType === "video" ? "Video" : "Image"} files must be ${maxSizeMb} MB or smaller. Selected file is ${formatFileSize(file.size)}.`,
      );
    }

    if (typeof onUploadFile === "function") {
      const uploadedUrl = await onUploadFile(file, {
        target,
        type,
        activeSlideIndex,
        siteId,
        storageBucket,
      });

      if (uploadedUrl) {
        return {
          url: uploadedUrl,
          uploadedType,
        };
      }
    }

    if (!siteId) {
      throw new Error(
        "Select a saved website template before uploading media.",
      );
    }

    const path = `${siteId}/${getUploadFolder(target)}/${Date.now()}-${safeFileName(
      file.name,
    )}`;

    const { error: uploadError } = await supabase.storage
      .from(storageBucket)
      .upload(path, file, {
        cacheControl: "3600",
        contentType: file.type || undefined,
        upsert: false,
      });

    if (uploadError) {
      throw new Error(
        `Upload failed. Confirm that the "${storageBucket}" storage bucket and upload policies are configured. ${uploadError.message}`,
      );
    }

    const { data: publicUrlData } = supabase.storage
      .from(storageBucket)
      .getPublicUrl(path);

    const uploadedUrl = publicUrlData?.publicUrl || "";

    if (!uploadedUrl) {
      throw new Error(
        "Upload succeeded but a public media URL could not be created.",
      );
    }

    await recordMediaAsset({
      file,
      target,
      uploadedUrl,
      path,
    });

    return {
      url: uploadedUrl,
      uploadedType,
    };
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const target = uploadTargetRef.current;

    setUploading(true);
    setEditorError("");
    setEditorNotice("");

    try {
      const { url: uploadedUrl, uploadedType } = await processUploadedFile(
        file,
        target,
      );

      if (target === "logo") {
        setDraftValue(uploadedUrl);
      }

      if (target === "slide" && activeSlide) {
        updateSlide(activeSlideIndex, {
          type: uploadedType,
          src: uploadedUrl,
          image: uploadedType === "image" ? uploadedUrl : activeSlide.image,
          url: uploadedUrl,
          poster:
            uploadedType === "image" ? uploadedUrl : activeSlide.poster || "",
        });
      }

      if (target === "background") {
        setBackgroundDraft((previous) => ({
          ...previous,
          type: uploadedType,
          image: uploadedType === "image" ? uploadedUrl : previous.image,
          video: uploadedType === "video" ? uploadedUrl : previous.video,
        }));
      }

      if (target === "media") {
        setMediaType(uploadedType);
        setDraftValue(uploadedUrl);
      }

      setEditorNotice(
        "Upload successful. Select Save Changes to publish this media.",
      );

      if (libraryOpen) {
        await loadMediaLibrary();
      }
    } catch (error) {
      console.error("Media upload failed:", error);
      setEditorError(
        error?.message || "Media upload failed. Please try again.",
      );
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  };

  const buildSavedSlides = () => {
    return draftSlides.map((slide, index) => ({
      ...slide,
      id: slide.id || createSlideId(index),
      type: slide.type === "video" ? "video" : "image",
      src: pickFirstValue(slide.src, slide.image, slide.url),
      image: pickFirstValue(slide.image, slide.src, slide.url),
      url: pickFirstValue(slide.url, slide.src, slide.image),
      poster: pickFirstValue(slide.poster, slide.image, slide.src),
    }));
  };

  const handleSave = async () => {
    if (uploading) return;

    setSaving(true);
    setEditorError("");

    let patch = {};

    if (isLogoMode) {
      patch = {
        [logoKey]: draftValue,
      };
    } else if (isSlideshowMode) {
      patch = {
        [slidesKey]: buildSavedSlides(),
        [slidesOverrideKey]: true,
        [slideshowSettingsKey]: slideshowSettings,
      };
    } else if (isBackgroundMode) {
      patch = {
        [backgroundKey]: backgroundDraft,
        [backgroundImageKey]: backgroundDraft.image,
        [backgroundVideoKey]: backgroundDraft.video,
        [backgroundColorKey]: backgroundDraft.color,
      };
    } else {
      patch = {
        [settingKey]: draftValue,
        [mediaTypeKey]: mediaType,
      };
    }

    try {
      await onSave?.(patch);

      if (saveToBuilder) {
        postSettingsPatch(patch);
      }

      notifyEditorState(false);
      setOpen(false);
      setPortalTarget(null);
    } catch (error) {
      console.error("Media settings save failed:", error);
      setEditorError(
        error?.message || "Changes could not be saved. Please try again.",
      );
    } finally {
      setSaving(false);
    }
  };

  const renderSlidePreview = () => {
    if (!activeSlideMediaUrl) {
      return <EmptyMediaPreview text="Select slide media" />;
    }

    if (activeSlide?.type === "video") {
      return (
        <video
          src={activeSlideMediaUrl}
          poster={activeSlide?.poster || ""}
          controls
          muted
          className="bme-selected-preview-media"
        />
      );
    }

    return (
      <img
        src={activeSlideMediaUrl}
        alt={activeSlide?.alt || "Selected slide"}
        className="bme-selected-preview-media"
      />
    );
  };

  const editorDrawer = open ? (
    <div
      className={`bme-root bme-layer ${isDockedEditor ? "bme-docked" : ""}`}
      role="presentation"
    >
      {!isDockedEditor && (
        <button
          type="button"
          className="bme-backdrop"
          onClick={closeEditor}
          aria-label="Close editor"
        />
      )}

      <aside
        className="bme-drawer"
        role="dialog"
        aria-modal={!isDockedEditor}
        aria-label={editorLabel}
      >
        <header className="bme-drawer-header">
          <h2>{editorLabel}</h2>

          <button
            type="button"
            className="bme-close-button"
            onClick={closeEditor}
            aria-label="Close editor"
          >
            ×
          </button>
        </header>

        {isSlideshowMode && (
          <nav className="bme-tabs" aria-label="Editor sections">
            <button
              type="button"
              className={activeTab === "slides" ? "active" : ""}
              onClick={() => setActiveTab("slides")}
            >
              <span>▣</span>
              Slides
            </button>

            <button
              type="button"
              className={activeTab === "settings" ? "active" : ""}
              onClick={() => setActiveTab("settings")}
            >
              <span>⚙</span>
              Settings
            </button>

            <button
              type="button"
              className={activeTab === "general" ? "active" : ""}
              onClick={() => setActiveTab("general")}
            >
              <span>◈</span>
              General
            </button>
          </nav>
        )}

        {isLogoMode && (
          <nav
            className="bme-tabs"
            style={{ gridTemplateColumns: "repeat(2, minmax(0, 1fr))" }}
            aria-label="Logo editor sections"
          >
            <button
              type="button"
              className={activeTab === "logo" ? "active" : ""}
              onClick={() => setActiveTab("logo")}
            >
              Logo
            </button>

            <button
              type="button"
              className={activeTab === "logo-settings" ? "active" : ""}
              onClick={() => setActiveTab("logo-settings")}
            >
              Settings
            </button>
          </nav>
        )}

        {!isSlideshowMode && !isLogoMode && (
          <nav className="bme-tabs bme-tabs-simple" aria-label="Editor section">
            <button type="button" className="active">
              {isBackgroundMode ? "Background" : "Media"}
            </button>
          </nav>
        )}

        <div className="bme-drawer-scroll">
          {editorError && (
            <div
              role="alert"
              style={{
                margin: "14px 18px 0",
                padding: "11px 12px",
                borderRadius: 9,
                border: "1px solid #fecaca",
                background: "#fef2f2",
                color: "#b91c1c",
                fontSize: 12,
                fontWeight: 600,
                lineHeight: 1.5,
              }}
            >
              {editorError}
            </div>
          )}

          {editorNotice && !editorError && (
            <div
              role="status"
              style={{
                margin: "14px 18px 0",
                padding: "11px 12px",
                borderRadius: 9,
                border: "1px solid #bbf7d0",
                background: "#f0fdf4",
                color: "#166534",
                fontSize: 12,
                fontWeight: 600,
                lineHeight: 1.5,
              }}
            >
              {editorNotice}
            </div>
          )}

          {isSlideshowMode && activeTab === "slides" && (
            <>
              <section className="bme-slides-section">
                <div className="bme-section-title-row">
                  <h3>Slides ({draftSlides.length})</h3>

                  <button
                    type="button"
                    className="bme-add-button"
                    onClick={addSlide}
                  >
                    + Add New Slide
                  </button>
                </div>

                <div className="bme-slide-list">
                  {draftSlides.map((slide, slideIndex) => (
                    <article
                      key={slide.id}
                      className={`bme-slide-row ${
                        slideIndex === activeSlideIndex ? "active" : ""
                      }`}
                      draggable
                      onDragStart={() => {
                        dragIndexRef.current = slideIndex;
                      }}
                      onDragOver={(event) => event.preventDefault()}
                      onDrop={(event) => {
                        event.preventDefault();

                        if (dragIndexRef.current !== null) {
                          moveSlide(dragIndexRef.current, slideIndex);
                          dragIndexRef.current = null;
                        }
                      }}
                      onClick={() => setActiveSlideIndex(slideIndex)}
                    >
                      <span className="bme-drag-handle" title="Drag to reorder">
                        ⋮⋮
                      </span>

                      <SlideThumbnail slide={slide} />

                      <span className="bme-slide-number">{slideIndex + 1}</span>

                      <div className="bme-slide-summary">
                        <strong>{slide.title || "Untitled Slide"}</strong>

                        <small>
                          {slide.type === "video" ? "Video" : "Image"}
                        </small>
                      </div>

                      <div className="bme-slide-actions">
                        <button
                          type="button"
                          aria-label="Move slide up"
                          disabled={slideIndex === 0}
                          onClick={(event) => {
                            event.stopPropagation();
                            moveSlide(slideIndex, slideIndex - 1);
                          }}
                        >
                          ↑
                        </button>

                        <button
                          type="button"
                          aria-label="Move slide down"
                          disabled={slideIndex === draftSlides.length - 1}
                          onClick={(event) => {
                            event.stopPropagation();
                            moveSlide(slideIndex, slideIndex + 1);
                          }}
                        >
                          ↓
                        </button>

                        <button
                          type="button"
                          className="danger"
                          aria-label="Delete slide"
                          onClick={(event) => {
                            event.stopPropagation();
                            deleteSlide(slideIndex);
                          }}
                        >
                          {/* ♡ */}
                          🗑️
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              </section>

              {activeSlide && (
                <section className="bme-edit-section">
                  <h3>Select Slide to Edit</h3>

                  <div className="bme-selected-media-grid">
                    <div className="bme-selected-preview">
                      {renderSlidePreview()}
                    </div>

                    <div className="bme-selected-media-fields">
                      <label className="bme-label">Media Type</label>

                      <select
                        className="bme-select"
                        value={activeSlide.type}
                        onChange={(event) =>
                          updateSlide(activeSlideIndex, {
                            type: event.target.value,
                          })
                        }
                      >
                        <option value="image">Image</option>
                        <option value="video">Video</option>
                      </select>

                      <label className="bme-label">
                        {activeSlide.type === "video" ? "Video" : "Image"} URL
                      </label>

                      <input
                        className="bme-input"
                        value={activeSlideMediaUrl}
                        onChange={(event) =>
                          updateSlide(activeSlideIndex, {
                            src: event.target.value,
                            image:
                              activeSlide.type === "image"
                                ? event.target.value
                                : activeSlide.image,
                            url: event.target.value,
                            poster:
                              activeSlide.type === "image"
                                ? event.target.value
                                : activeSlide.poster,
                          })
                        }
                        placeholder="Paste direct media URL"
                      />

                      <div className="bme-media-buttons">
                        {allowUpload && (
                          <button
                            type="button"
                            className="bme-change-button"
                            disabled={uploading || saving}
                            onClick={() => selectUploadTarget("slide")}
                          >
                            Change{" "}
                            {activeSlide.type === "video" ? "Video" : "Image"}
                          </button>
                        )}

                        {allowOnlineSearch && (
                          <button
                            type="button"
                            className="bme-library-button"
                            onClick={toggleMediaLibrary}
                          >
                            Free Library
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {libraryOpen && (
                    <MediaLibraryPanel
                      mediaType={activeSlide.type}
                      query={libraryQuery}
                      setQuery={setLibraryQuery}
                      assets={mediaLibraryItems}
                      loading={mediaLibraryLoading}
                      error={mediaLibraryError}
                      uploading={uploading}
                      onRefresh={loadMediaLibrary}
                      onUploadAsset={() =>
                        selectUploadTarget(currentUploadTarget)
                      }
                      onUseAsset={selectMediaAsset}
                    />
                  )}

                  <div className="bme-form-fields">
                    <label className="bme-label">Title</label>

                    <input
                      className="bme-input"
                      value={activeSlide.title}
                      onChange={(event) =>
                        updateSlide(activeSlideIndex, {
                          title: event.target.value,
                        })
                      }
                      placeholder="Slide heading"
                    />

                    <label className="bme-label">Subtitle</label>

                    <textarea
                      className="bme-textarea"
                      value={activeSlide.subtitle}
                      onChange={(event) =>
                        updateSlide(activeSlideIndex, {
                          subtitle: event.target.value,
                        })
                      }
                      placeholder="Slide supporting text"
                      rows={3}
                    />

                    <div className="bme-two-column">
                      <div>
                        <label className="bme-label">Primary Button</label>

                        <input
                          className="bme-input"
                          value={activeSlide.primaryButtonText}
                          onChange={(event) =>
                            updateSlide(activeSlideIndex, {
                              primaryButtonText: event.target.value,
                            })
                          }
                          placeholder="Admissions Open"
                        />
                      </div>

                      <div>
                        <label className="bme-label">Primary Link</label>

                        <input
                          className="bme-input"
                          value={activeSlide.primaryButtonHref}
                          onChange={(event) =>
                            updateSlide(activeSlideIndex, {
                              primaryButtonHref: event.target.value,
                            })
                          }
                          placeholder="/admissions"
                        />
                      </div>
                    </div>

                    <div className="bme-two-column">
                      <div>
                        <label className="bme-label">
                          Secondary Button Optional
                        </label>

                        <input
                          className="bme-input"
                          value={activeSlide.secondaryButtonText}
                          onChange={(event) =>
                            updateSlide(activeSlideIndex, {
                              secondaryButtonText: event.target.value,
                            })
                          }
                          placeholder="Learn More"
                        />
                      </div>

                      <div>
                        <label className="bme-label">Secondary Link</label>

                        <input
                          className="bme-input"
                          value={activeSlide.secondaryButtonHref}
                          onChange={(event) =>
                            updateSlide(activeSlideIndex, {
                              secondaryButtonHref: event.target.value,
                            })
                          }
                          placeholder="/about"
                        />
                      </div>
                    </div>

                    <label className="bme-label bme-slider-label">
                      Overlay
                      <span>
                        {Math.round((activeSlide.overlayOpacity || 0) * 100)}%
                      </span>
                    </label>

                    <input
                      className="bme-range"
                      type="range"
                      min="0"
                      max="0.85"
                      step="0.01"
                      value={activeSlide.overlayOpacity}
                      onChange={(event) =>
                        updateSlide(activeSlideIndex, {
                          overlayOpacity: Number(event.target.value),
                        })
                      }
                    />

                    <label className="bme-label">Background Position</label>

                    <select
                      className="bme-select"
                      value={activeSlide.objectPosition}
                      onChange={(event) =>
                        updateSlide(activeSlideIndex, {
                          objectPosition: event.target.value,
                        })
                      }
                    >
                      {POSITION_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </section>
              )}
            </>
          )}

          {isSlideshowMode && activeTab === "settings" && (
            <section className="bme-settings-section">
              <h3>Slideshow Settings</h3>

              <label className="bme-toggle-row">
                <span>
                  <strong>Autoplay</strong>
                  <small>Automatically change slides on the website.</small>
                </span>

                <input
                  type="checkbox"
                  checked={slideshowSettings.autoplay === true}
                  onChange={(event) =>
                    setSlideshowSettings((previous) => ({
                      ...previous,
                      autoplay: event.target.checked,
                    }))
                  }
                />
              </label>

              <label className="bme-label">Slide Duration Seconds</label>

              <input
                className="bme-input"
                type="number"
                min="2"
                max="30"
                value={slideshowSettings.intervalSeconds}
                onChange={(event) =>
                  setSlideshowSettings((previous) => ({
                    ...previous,
                    intervalSeconds: Number(event.target.value),
                  }))
                }
              />

              <label className="bme-toggle-row">
                <span>
                  <strong>Pause on Hover</strong>
                  <small>Stop autoplay while a visitor hovers.</small>
                </span>

                <input
                  type="checkbox"
                  checked={slideshowSettings.pauseOnHover === true}
                  onChange={(event) =>
                    setSlideshowSettings((previous) => ({
                      ...previous,
                      pauseOnHover: event.target.checked,
                    }))
                  }
                />
              </label>

              <label className="bme-toggle-row">
                <span>
                  <strong>Show Navigation Arrows</strong>
                  <small>Display previous and next controls.</small>
                </span>

                <input
                  type="checkbox"
                  checked={slideshowSettings.showArrows === true}
                  onChange={(event) =>
                    setSlideshowSettings((previous) => ({
                      ...previous,
                      showArrows: event.target.checked,
                    }))
                  }
                />
              </label>

              <label className="bme-toggle-row">
                <span>
                  <strong>Show Slide Indicators</strong>
                  <small>Display the slide dots below the content.</small>
                </span>

                <input
                  type="checkbox"
                  checked={slideshowSettings.showDots === true}
                  onChange={(event) =>
                    setSlideshowSettings((previous) => ({
                      ...previous,
                      showDots: event.target.checked,
                    }))
                  }
                />
              </label>

              <label className="bme-label">Transition</label>

              <select
                className="bme-select"
                value={slideshowSettings.transition}
                onChange={(event) =>
                  setSlideshowSettings((previous) => ({
                    ...previous,
                    transition: event.target.value,
                  }))
                }
              >
                <option value="fade">Fade</option>
                <option value="slide">Slide</option>
                <option value="none">None</option>
              </select>
            </section>
          )}

          {isSlideshowMode && activeTab === "general" && activeSlide && (
            <section className="bme-settings-section">
              <h3>General Slide Properties</h3>

              <label className="bme-label">Alternative Text</label>

              <input
                className="bme-input"
                value={activeSlide.alt}
                onChange={(event) =>
                  updateSlide(activeSlideIndex, {
                    alt: event.target.value,
                  })
                }
                placeholder="Describe this image for accessibility"
              />

              <label className="bme-label">Background Colour</label>

              <input
                className="bme-color-input"
                type="color"
                value={activeSlide.backgroundColor}
                onChange={(event) =>
                  updateSlide(activeSlideIndex, {
                    backgroundColor: event.target.value,
                  })
                }
              />

              <label className="bme-toggle-row">
                <span>
                  <strong>Fixed Background</strong>
                  <small>
                    Keep the slide background fixed while scrolling.
                  </small>
                </span>

                <input
                  type="checkbox"
                  checked={activeSlide.fixedBackground === true}
                  onChange={(event) =>
                    updateSlide(activeSlideIndex, {
                      fixedBackground: event.target.checked,
                    })
                  }
                />
              </label>
            </section>
          )}

          {isLogoMode && activeTab === "logo" && (
            <section className="bme-logo-section">
              <h3>Current Logo Preview</h3>

              <div className="bme-logo-preview">
                {draftValue ? (
                  <img src={draftValue} alt={`${siteName} logo preview`} />
                ) : (
                  <EmptyMediaPreview text="No logo selected" />
                )}
              </div>

              <label className="bme-label">Logo Image URL</label>

              <input
                className="bme-input"
                value={draftValue}
                onChange={(event) => setDraftValue(event.target.value)}
                placeholder="Paste logo image URL"
              />

              {allowUpload && (
                <button
                  type="button"
                  className="bme-change-button"
                  style={{ width: "100%", marginTop: 14 }}
                  disabled={uploading || saving}
                  onClick={() => selectUploadTarget("logo")}
                >
                  {uploading ? "Uploading..." : "⇧  Upload New Logo"}
                </button>
              )}

              {allowOnlineSearch && (
                <button
                  type="button"
                  className="bme-library-button"
                  style={{ width: "100%", marginTop: 10 }}
                  onClick={toggleMediaLibrary}
                >
                  ▧&nbsp;&nbsp;Choose from Free Library
                </button>
              )}

              {allowOnlineSearch && libraryOpen && (
                <MediaLibraryPanel
                  mediaType="image"
                  query={libraryQuery}
                  setQuery={setLibraryQuery}
                  assets={mediaLibraryItems}
                  loading={mediaLibraryLoading}
                  error={mediaLibraryError}
                  uploading={uploading}
                  onRefresh={loadMediaLibrary}
                  onUploadAsset={() => selectUploadTarget("logo")}
                  onUseAsset={selectMediaAsset}
                />
              )}

              <p className="bme-helper-text">
                Recommended: PNG or WebP with transparent background for best
                results.
              </p>
            </section>
          )}

          {isLogoMode && activeTab === "logo-settings" && (
            <section className="bme-settings-section">
              <h3>Logo Settings</h3>

              <div className="bme-logo-preview">
                {draftValue ? (
                  <img src={draftValue} alt={`${siteName} logo preview`} />
                ) : (
                  <EmptyMediaPreview text="Template default logo will be used" />
                )}
              </div>

              <div className="bme-toggle-row">
                <span>
                  <strong>Shared Website Logo</strong>
                  <small>
                    The selected logo is saved once and used by supported
                    header, mobile navigation and footer brand areas.
                  </small>
                </span>
              </div>

              <label className="bme-label">Selected Logo URL</label>

              <input
                className="bme-input"
                value={draftValue}
                onChange={(event) => setDraftValue(event.target.value)}
                placeholder="Paste logo image URL"
              />

              <div className="bme-media-buttons" style={{ marginTop: 12 }}>
                {allowUpload && (
                  <button
                    type="button"
                    className="bme-change-button"
                    disabled={uploading || saving}
                    onClick={() => selectUploadTarget("logo")}
                  >
                    {uploading ? "Uploading..." : "Upload Replacement"}
                  </button>
                )}

                {allowOnlineSearch && (
                  <button
                    type="button"
                    className="bme-library-button"
                    disabled={uploading || saving}
                    onClick={toggleMediaLibrary}
                  >
                    ▧ Choose from Free Library
                  </button>
                )}
              </div>

              <div className="bme-media-buttons" style={{ marginTop: 10 }}>
                <button
                  type="button"
                  className="bme-library-button"
                  disabled={uploading || saving}
                  onClick={() => {
                    setDraftValue(value || "");
                    setEditorError("");
                    setEditorNotice(
                      "Saved logo restored in the editor. Select Save Changes to apply it.",
                    );
                  }}
                >
                  Restore Saved Logo
                </button>

                <button
                  type="button"
                  className="bme-library-button"
                  disabled={uploading || saving}
                  onClick={() => {
                    setDraftValue("");
                    setEditorError("");
                    setEditorNotice(
                      "The saved custom logo will be removed. Select Save Changes to use the template default logo.",
                    );
                  }}
                >
                  Use Template Default
                </button>
              </div>

              {allowOnlineSearch && libraryOpen && (
                <MediaLibraryPanel
                  mediaType="image"
                  query={libraryQuery}
                  setQuery={setLibraryQuery}
                  assets={mediaLibraryItems}
                  loading={mediaLibraryLoading}
                  error={mediaLibraryError}
                  uploading={uploading}
                  onRefresh={loadMediaLibrary}
                  onUploadAsset={() => selectUploadTarget("logo")}
                  onUseAsset={selectMediaAsset}
                />
              )}

              <p className="bme-helper-text">
                Recommended: PNG or WebP with transparent background for the
                cleanest result across templates.
              </p>
            </section>
          )}

          {isBackgroundMode && (
            <section className="bme-settings-section">
              <h3>Section Background</h3>

              <div className="bme-segment-control">
                <button
                  type="button"
                  className={backgroundDraft.type === "image" ? "active" : ""}
                  onClick={() =>
                    setBackgroundDraft((previous) => ({
                      ...previous,
                      type: "image",
                    }))
                  }
                >
                  Image
                </button>

                <button
                  type="button"
                  className={backgroundDraft.type === "video" ? "active" : ""}
                  onClick={() =>
                    setBackgroundDraft((previous) => ({
                      ...previous,
                      type: "video",
                    }))
                  }
                >
                  Video
                </button>
              </div>

              <label className="bme-label">
                Background{" "}
                {backgroundDraft.type === "video" ? "Video" : "Image"} URL
              </label>

              <input
                className="bme-input"
                value={
                  backgroundDraft.type === "video"
                    ? backgroundDraft.video
                    : backgroundDraft.image
                }
                onChange={(event) =>
                  setBackgroundDraft((previous) => ({
                    ...previous,
                    [previous.type === "video" ? "video" : "image"]:
                      event.target.value,
                  }))
                }
                placeholder="Paste direct background media URL"
              />

              {allowUpload && (
                <button
                  type="button"
                  className="bme-change-button"
                  disabled={uploading || saving}
                  onClick={() => selectUploadTarget("background")}
                >
                  Replace Background
                </button>
              )}

              <label className="bme-label bme-slider-label">
                Overlay Opacity
                <span>
                  {Math.round((backgroundDraft.overlayOpacity || 0) * 100)}%
                </span>
              </label>

              <input
                className="bme-range"
                type="range"
                min="0"
                max="0.85"
                step="0.01"
                value={backgroundDraft.overlayOpacity}
                onChange={(event) =>
                  setBackgroundDraft((previous) => ({
                    ...previous,
                    overlayOpacity: Number(event.target.value),
                  }))
                }
              />

              <label className="bme-label">Background Colour</label>

              <input
                className="bme-color-input"
                type="color"
                value={backgroundDraft.color}
                onChange={(event) =>
                  setBackgroundDraft((previous) => ({
                    ...previous,
                    color: event.target.value,
                  }))
                }
              />

              <label className="bme-label">Background Position</label>

              <select
                className="bme-select"
                value={backgroundDraft.objectPosition}
                onChange={(event) =>
                  setBackgroundDraft((previous) => ({
                    ...previous,
                    objectPosition: event.target.value,
                  }))
                }
              >
                {POSITION_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>

              <label className="bme-toggle-row">
                <span>
                  <strong>Fixed Background</strong>
                  <small>Keep the background fixed while scrolling.</small>
                </span>

                <input
                  type="checkbox"
                  checked={backgroundDraft.fixedBackground === true}
                  onChange={(event) =>
                    setBackgroundDraft((previous) => ({
                      ...previous,
                      fixedBackground: event.target.checked,
                    }))
                  }
                />
              </label>

              {allowOnlineSearch && (
                <button
                  type="button"
                  className="bme-library-button"
                  style={{ width: "100%", marginTop: 12 }}
                  disabled={uploading || saving}
                  onClick={toggleMediaLibrary}
                >
                  ▧&nbsp;&nbsp;Choose from Free Library
                </button>
              )}

              {allowOnlineSearch && libraryOpen && (
                <MediaLibraryPanel
                  mediaType={backgroundDraft.type}
                  query={libraryQuery}
                  setQuery={setLibraryQuery}
                  assets={mediaLibraryItems}
                  loading={mediaLibraryLoading}
                  error={mediaLibraryError}
                  uploading={uploading}
                  onRefresh={loadMediaLibrary}
                  onUploadAsset={() => selectUploadTarget("background")}
                  onUseAsset={selectMediaAsset}
                />
              )}
            </section>
          )}

          {!isSlideshowMode && !isLogoMode && !isBackgroundMode && (
            <section className="bme-settings-section">
              <h3>Media Settings</h3>

              <div className="bme-segment-control">
                <button
                  type="button"
                  className={mediaType === "image" ? "active" : ""}
                  onClick={() => setMediaType("image")}
                >
                  Image
                </button>

                <button
                  type="button"
                  className={mediaType === "video" ? "active" : ""}
                  onClick={() => setMediaType("video")}
                >
                  Video
                </button>
              </div>

              <label className="bme-label">Media URL</label>

              <input
                className="bme-input"
                value={draftValue}
                onChange={(event) => setDraftValue(event.target.value)}
                placeholder="Paste direct media URL"
              />

              {allowUpload && (
                <button
                  type="button"
                  className="bme-change-button"
                  disabled={uploading || saving}
                  onClick={() => selectUploadTarget("media")}
                >
                  Replace Media
                </button>
              )}

              {allowOnlineSearch && (
                <button
                  type="button"
                  className="bme-library-button"
                  style={{ width: "100%", marginTop: 12 }}
                  disabled={uploading || saving}
                  onClick={toggleMediaLibrary}
                >
                  ▧&nbsp;&nbsp;Choose from Free Library
                </button>
              )}

              {allowOnlineSearch && libraryOpen && (
                <MediaLibraryPanel
                  mediaType={mediaType}
                  query={libraryQuery}
                  setQuery={setLibraryQuery}
                  assets={mediaLibraryItems}
                  loading={mediaLibraryLoading}
                  error={mediaLibraryError}
                  uploading={uploading}
                  onRefresh={loadMediaLibrary}
                  onUploadAsset={() => selectUploadTarget("media")}
                  onUseAsset={selectMediaAsset}
                />
              )}
            </section>
          )}
        </div>

        <footer className="bme-drawer-footer">
          <button
            type="button"
            className="bme-cancel-button"
            onClick={closeEditor}
          >
            Cancel
          </button>

          <button
            type="button"
            className="bme-save-button"
            onClick={handleSave}
            disabled={saving || uploading}
          >
            {uploading ? "Uploading..." : saving ? "Saving..." : "Save Changes"}
          </button>
        </footer>

        <input
          ref={fileInputRef}
          type="file"
          hidden
          onChange={handleFileUpload}
        />
      </aside>
    </div>
  ) : null;

  return (
    <>
      {children}

      {enabled && (
        <button
          type="button"
          className={`bme-open-button ${triggerClassName}`}
          onClick={openEditor}
          title={triggerTitle}
        >
          <span aria-hidden="true">✎</span>
          {editorTriggerLabel}
        </button>
      )}

      {open &&
        editorPortalTarget &&
        createPortal(editorDrawer, editorPortalTarget)}
    </>
  );
}
