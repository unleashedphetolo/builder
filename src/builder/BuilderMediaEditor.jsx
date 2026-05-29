import React, { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import "../styles/builder-media-editor.css";

const IMAGE_LIBRARIES = [
  {
    name: "Unsplash",
    description: "High-quality free photographs.",
    searchUrl: (query) =>
      `https://unsplash.com/s/photos/${encodeURIComponent(
        query || "website",
      )}`,
  },
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

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;

    reader.readAsDataURL(file);
  });
}

function getEditorPortalTarget() {
  if (typeof document === "undefined") return null;

  try {
    if (window.parent && window.parent !== window) {
      const parentDock =
        window.parent.document.getElementById("builder-media-editor-dock");

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

function MediaLibraryPanel({ mediaType = "image", query, setQuery }) {
  const libraries =
    mediaType === "video" ? VIDEO_LIBRARIES : IMAGE_LIBRARIES;

  return (
    <div className="bme-library-panel">
      <div className="bme-library-heading">
        <div>
          <h4>Free {mediaType === "video" ? "Video" : "Image"} Libraries</h4>

          <p>
            Search online, copy a direct media URL, then paste it into the
            media URL field above.
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
          mediaType === "video"
            ? "School campus video"
            : "Students learning"
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
              Open Library
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
  slides = [],
  settings = {},
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
}) {
  const fileInputRef = useRef(null);
  const uploadTargetRef = useRef("slide");
  const dragIndexRef = useRef(null);
  const editorOpenBroadcastRef = useRef(false);

  const isLogoMode = type === "logo";
  const isBackgroundMode = type === "background";
  const isSlideshowMode =
    type === "slideshow" ||
    type === "slides" ||
    (Array.isArray(slides) && slides.length > 0);

  const initialMediaType =
    type === "video" ? "video" : inferMediaType(value, "image");

  const siteName = getSiteName(settings);

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

  const isDockedEditor =
    editorPortalTarget?.id === "builder-media-editor-dock";

  const notifyEditorState = (isOpen) => {
    if (editorOpenBroadcastRef.current === isOpen) return;

    editorOpenBroadcastRef.current = isOpen;

    const detail = {
      open: isOpen,
      editorType: type,
      label,
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

  const openEditor = (event) => {
    event?.preventDefault();
    event?.stopPropagation();

    notifyEditorState(true);
    setPortalTarget(getEditorPortalTarget());
    setOpen(true);
  };

  const closeEditor = () => {
    if (saving) return;

    notifyEditorState(false);
    setOpen(false);
    setPortalTarget(null);
  };

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

  useEffect(() => {
    if (!open) return undefined;

    const normalizedSlides = normalizeSlides(slides);

    setDraftValue(value || "");
    setDraftSlides(normalizedSlides);
    setActiveSlideIndex(0);
    setMediaType(initialMediaType);
    setLibraryOpen(false);
    setSaving(false);

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
  }, [
    open,
    slides,
    value,
    initialMediaType,
    settings,
    slideshowSettingsKey,
    backgroundImageKey,
    backgroundVideoKey,
    backgroundColorKey,
    isSlideshowMode,
    isBackgroundMode,
    isLogoMode,
  ]);

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
      targetDocument === document
        ? [document]
        : [document, targetDocument];

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
          label,
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
  }, [type, label]);

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

    if (!fileInputRef.current) return;

    fileInputRef.current.accept =
      target === "logo"
        ? "image/*"
        : activeSlide?.type === "video" || backgroundDraft.type === "video"
          ? "video/*"
          : "image/*,video/*";

    fileInputRef.current.click();
  };

  const processUploadedFile = async (file, target) => {
    if (typeof onUploadFile === "function") {
      const uploadedUrl = await onUploadFile(file, {
        target,
        type,
        activeSlideIndex,
      });

      if (uploadedUrl) return uploadedUrl;
    }

    return fileToDataUrl(file);
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const target = uploadTargetRef.current;
    const uploadedUrl = await processUploadedFile(file, target);
    const uploadedType = file.type.startsWith("video/") ? "video" : "image";

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
          uploadedType === "image"
            ? uploadedUrl
            : activeSlide.poster || "",
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

    event.target.value = "";
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
    setSaving(true);

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
        aria-label={label}
      >
        <header className="bme-drawer-header">
          <h2>{label}</h2>

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

        {!isSlideshowMode && (
          <nav className="bme-tabs bme-tabs-simple" aria-label="Editor section">
            <button type="button" className="active">
              {isLogoMode
                ? "Logo"
                : isBackgroundMode
                  ? "Background"
                  : "Media"}
            </button>
          </nav>
        )}

        <div className="bme-drawer-scroll">
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
                            onClick={() =>
                              setLibraryOpen((previous) => !previous)
                            }
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
                  <small>Keep the slide background fixed while scrolling.</small>
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

          {isLogoMode && (
            <section className="bme-logo-section">
              <h3>Logo Settings</h3>

              <div className="bme-logo-preview">
                {draftValue ? (
                  <img src={draftValue} alt="Logo preview" />
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
                  onClick={() => selectUploadTarget("logo")}
                >
                  Upload Logo Image
                </button>
              )}

              <p className="bme-helper-text">
                Use a transparent PNG, SVG or WebP logo for the best result.
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
                <MediaLibraryPanel
                  mediaType={backgroundDraft.type}
                  query={libraryQuery}
                  setQuery={setLibraryQuery}
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
                  onClick={() => selectUploadTarget("media")}
                >
                  Replace Media
                </button>
              )}

              {allowOnlineSearch && (
                <MediaLibraryPanel
                  mediaType={mediaType}
                  query={libraryQuery}
                  setQuery={setLibraryQuery}
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
            disabled={saving}
          >
            {saving ? "Saving..." : "Save Changes"}
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
          {triggerLabel}
        </button>
      )}

      {open &&
        editorPortalTarget &&
        createPortal(editorDrawer, editorPortalTarget)}
    </>
  );
}