import React, { useEffect, useMemo, useRef, useState } from "react";
import BuilderMediaEditor from "../../../../../builder/BuilderMediaEditor";
import "../../styles/hero.css";
import { templateConfig } from "../../template.config";

const DEFAULT_SLIDESHOW_SETTINGS = {
  autoplay: true,
  intervalSeconds: 5,
  pauseOnHover: false,
  showArrows: true,
  showDots: true,
  transition: "fade",
};

function buildSiteHref(siteId, path = "") {
  const clean = path ? `/${String(path).replace(/^\/+/, "")}` : "";
  return `/#/site/${siteId || ""}${clean}`;
}

function isExternalHref(href = "") {
  return /^https?:\/\//i.test(String(href || ""));
}

function normalizeHref(href = "/") {
  if (!href) return "/";

  if (isExternalHref(href)) {
    return String(href);
  }

  const clean = String(href)
    .replace(/^#/, "")
    .split("?")[0]
    .split("#")[0]
    .replace(/^\/+|\/+$/g, "");

  const withoutSitePrefix = clean.replace(/^site\/[^/]+\/?/, "");

  if (!withoutSitePrefix || withoutSitePrefix.toLowerCase() === "home") {
    return "/";
  }

  return `/${withoutSitePrefix.replace(/^\/+|\/+$/g, "")}`;
}

function resolveSiteHref(siteId, href = "/") {
  if (isExternalHref(href)) {
    return href;
  }

  return buildSiteHref(siteId, normalizeHref(href));
}

function isVisibleByNav(navItems = [], paths = [], fallbackVisible = true) {
  const cleanPaths = paths.map((path) => normalizeHref(path));

  const matches = (Array.isArray(navItems) ? navItems : []).filter((item) => {
    if (!item?.href) return false;

    const itemHref = normalizeHref(item.href);

    return cleanPaths.includes(itemHref);
  });

  if (!matches.length) return fallbackVisible;

  if (matches.some((item) => item.is_visible === false)) {
    return false;
  }

  return matches.some((item) => item.is_visible !== false);
}

function normalizeSlideshowSettings(settings = {}) {
  const rawSeconds = Number(settings?.intervalSeconds);
  const intervalSeconds = Number.isFinite(rawSeconds)
    ? Math.min(30, Math.max(2, rawSeconds))
    : DEFAULT_SLIDESHOW_SETTINGS.intervalSeconds;

  return {
    ...DEFAULT_SLIDESHOW_SETTINGS,
    ...(settings || {}),
    intervalSeconds,
    autoplay: settings?.autoplay !== false,
    pauseOnHover: settings?.pauseOnHover === true,
    showArrows: settings?.showArrows !== false,
    showDots: settings?.showDots !== false,
    transition: settings?.transition || DEFAULT_SLIDESHOW_SETTINGS.transition,
  };
}

function normalizeHeroSlides(heroSlides = []) {
  if (!Array.isArray(heroSlides) || heroSlides.length === 0) {
    return [];
  }

  return heroSlides
    .filter((slide) => slide && (slide.src || slide.image || slide.url))
    .map((slide, index) => ({
      id: slide?.id || index + 1,
      type: slide?.type === "video" ? "video" : "image",
      src: slide?.src || slide?.image || slide?.url || "",
      image: slide?.image || slide?.src || slide?.url || "",
      url: slide?.url || slide?.src || slide?.image || "",
      poster: slide?.poster || slide?.image || slide?.src || "",
      alt: slide?.alt || "School hero",
      title: slide?.title || "Welcome to Our School",
      subtitle:
        slide?.subtitle ||
        "Building bright futures through excellence in education.",

      primaryButtonText:
        slide?.primaryButtonText ||
        slide?.primary_button_text ||
        slide?.primaryText ||
        "Admissions",
      primaryButtonHref:
        slide?.primaryButtonHref ||
        slide?.primary_button_href ||
        slide?.primaryHref ||
        "/admissions",

      secondaryButtonText:
        slide?.secondaryButtonText ||
        slide?.secondary_button_text ||
        slide?.secondaryText ||
        "Learn more",
      secondaryButtonHref:
        slide?.secondaryButtonHref ||
        slide?.secondary_button_href ||
        slide?.secondaryHref ||
        "/about/who-we-are",

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
    }));
}

export default function Hero({
  settings = {},
  navItems = [],
  builderMode = false,
}) {
  const templateSlides = templateConfig?.defaults?.hero_slides || [];
  const dbSlides = settings?.hero_slides || [];
  const useCustomSlides = settings?.hero_slides_overridden === true;

  const savedSlides = useMemo(() => {
    const sourceSlides = useCustomSlides ? dbSlides : templateSlides;
    return normalizeHeroSlides(sourceSlides);
  }, [useCustomSlides, dbSlides, templateSlides]);

  const savedSlideshowSettings = useMemo(() => {
    return normalizeSlideshowSettings(settings?.hero_slideshow_settings || {});
  }, [settings?.hero_slideshow_settings]);

  const [liveSlides, setLiveSlides] = useState(savedSlides);
  const [liveSlideshowSettings, setLiveSlideshowSettings] = useState(
    savedSlideshowSettings,
  );
  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const autoplayRef = useRef(null);
  const videoRef = useRef(null);

  const siteId = settings?.site_id || "";
  const currentSlide = liveSlides[index] || null;

  useEffect(() => {
    setLiveSlides(savedSlides);
    setIndex(0);
  }, [savedSlides]);

  useEffect(() => {
    setLiveSlideshowSettings(savedSlideshowSettings);
  }, [savedSlideshowSettings]);

  useEffect(() => {
    if (index >= liveSlides.length && liveSlides.length > 0) {
      setIndex(0);
    }
  }, [index, liveSlides.length]);

  const stopAutoplay = () => {
    if (autoplayRef.current) {
      clearInterval(autoplayRef.current);
      autoplayRef.current = null;
    }
  };

  const next = () => {
    if (liveSlides.length <= 1) return;

    setIndex((previous) => (previous + 1) % liveSlides.length);
  };

  const prev = () => {
    if (liveSlides.length <= 1) return;

    setIndex(
      (previous) =>
        (previous - 1 + liveSlides.length) % liveSlides.length,
    );
  };

  const goTo = (slideIndex) => {
    if (slideIndex < 0 || slideIndex >= liveSlides.length) return;

    setIndex(slideIndex);
  };

  const navigateTo = (href = "/") => {
    if (isExternalHref(href)) {
      window.open(href, "_blank", "noopener,noreferrer");
      return;
    }

    const slug = normalizeHref(href);

    window.dispatchEvent(
      new CustomEvent("builder:navigate", {
        detail: slug,
      }),
    );

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleHeroSave = (patch = {}) => {
    if (Array.isArray(patch?.hero_slides)) {
      setLiveSlides(normalizeHeroSlides(patch.hero_slides));
      setIndex(0);
    }

    if (patch?.hero_slideshow_settings) {
      setLiveSlideshowSettings(
        normalizeSlideshowSettings(patch.hero_slideshow_settings),
      );
    }
  };

  useEffect(() => {
    stopAutoplay();

    if (
      !liveSlideshowSettings.autoplay ||
      isPaused ||
      liveSlides.length <= 1 ||
      !currentSlide
    ) {
      return undefined;
    }

    if (currentSlide.type === "image") {
      autoplayRef.current = setInterval(() => {
        setIndex((previous) => (previous + 1) % liveSlides.length);
      }, liveSlideshowSettings.intervalSeconds * 1000);
    }

    return () => stopAutoplay();
  }, [
    currentSlide,
    isPaused,
    liveSlides.length,
    liveSlideshowSettings.autoplay,
    liveSlideshowSettings.intervalSeconds,
  ]);

  useEffect(() => {
    if (!currentSlide || currentSlide.type !== "video" || !videoRef.current) {
      return;
    }

    const video = videoRef.current;

    video.currentTime = 0;

    if (liveSlideshowSettings.autoplay && !isPaused) {
      const playPromise = video.play();

      if (playPromise && typeof playPromise.catch === "function") {
        playPromise.catch(() => {});
      }
    } else {
      video.pause();
    }
  }, [
    currentSlide,
    isPaused,
    liveSlideshowSettings.autoplay,
    liveSlides.length,
  ]);

  useEffect(() => {
    if (!liveSlides.length) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === "ArrowLeft") {
        prev();
      }

      if (event.key === "ArrowRight") {
        next();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [liveSlides.length]);

  const handleMouseEnter = () => {
    if (!liveSlideshowSettings.pauseOnHover) return;

    setIsPaused(true);
    stopAutoplay();

    if (videoRef.current) {
      videoRef.current.pause();
    }
  };

  const handleMouseLeave = () => {
    if (!liveSlideshowSettings.pauseOnHover) return;

    setIsPaused(false);

    if (
      currentSlide?.type === "video" &&
      liveSlideshowSettings.autoplay &&
      videoRef.current
    ) {
      videoRef.current.play().catch(() => {});
    }
  };

  if (!liveSlides.length) {
    return (
      <section className="hero hero-carousel">
        {builderMode && (
          <BuilderMediaEditor
            enabled={builderMode}
            type="slideshow"
            label="Edit Hero Slideshow"
            slides={liveSlides}
            settings={settings}
            triggerLabel="Edit"
            triggerTitle="Edit hero slideshow"
            onSave={handleHeroSave}
          />
        )}

        <div className="slide active">
          <div className="slide-caption container">
            <h2>No hero slides configured</h2>

            <p className="subtitle">
              Add hero slides in template.config.js or site settings.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      className={`hero hero-carousel hero-transition-${liveSlideshowSettings.transition}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      aria-roledescription="carousel"
      aria-label="School highlights"
    >
      {builderMode && (
        <BuilderMediaEditor
          enabled={builderMode}
          type="slideshow"
          label="Edit Hero Slideshow"
          slides={liveSlides}
          settings={{
            ...settings,
            hero_slideshow_settings: liveSlideshowSettings,
          }}
          triggerLabel="Edit"
          triggerTitle="Edit hero slideshow"
          onSave={handleHeroSave}
        />
      )}

      <div className="slides">
        {liveSlides.map((slide, slideIndex) => {
          const active = slideIndex === index;

          const primaryButtonVisible =
            Boolean(slide.primaryButtonText) &&
            isVisibleByNav(
              navItems,
              [slide.primaryButtonHref || "/admissions"],
              true,
            );

          const secondaryButtonVisible =
            Boolean(slide.secondaryButtonText) &&
            isVisibleByNav(
              navItems,
              [slide.secondaryButtonHref || "/about/who-we-are"],
              true,
            );

          const showCtaRow =
            primaryButtonVisible || secondaryButtonVisible;

          return (
            <div
              key={slide.id}
              className={`slide ${active ? "active" : ""}`}
              aria-hidden={!active}
              style={{
                backgroundColor: slide.backgroundColor || "#0f172a",
              }}
            >
              {slide.type === "image" ? (
                <div
                  className="slide-media"
                  style={{
                    backgroundImage: `url(${slide.src || slide.image || ""})`,
                    backgroundPosition:
                      slide.objectPosition || "center center",
                    backgroundAttachment: slide.fixedBackground
                      ? "fixed"
                      : "scroll",
                  }}
                >
                  <img
                    src={slide.src || slide.image || ""}
                    alt={slide.alt}
                    loading="lazy"
                    className="visually-hidden"
                    aria-hidden="true"
                    onError={(event) => {
                      event.currentTarget.style.display = "none";
                    }}
                  />
                </div>
              ) : (
                <div
                  className="slide-media video-wrap"
                  style={{
                    backgroundColor: slide.backgroundColor || "#0f172a",
                  }}
                >
                  <video
                    ref={active ? videoRef : null}
                    className="hero-video"
                    src={slide.src || slide.url || ""}
                    poster={slide.poster || ""}
                    muted
                    playsInline
                    autoPlay={liveSlideshowSettings.autoplay && active}
                    controls={!liveSlideshowSettings.autoplay && active}
                    preload="auto"
                    onEnded={() => {
                      if (liveSlideshowSettings.autoplay) {
                        next();
                      }
                    }}
                    aria-label={slide.alt}
                    style={{
                      objectPosition:
                        slide.objectPosition || "center center",
                    }}
                  />
                </div>
              )}

              <div
                className="slide-overlay"
                aria-hidden="true"
                style={{
                  opacity:
                    typeof slide.overlayOpacity === "number"
                      ? slide.overlayOpacity
                      : 0.45,
                }}
              />

              <div className="slide-caption container">
                <h2 style={{ color: "#fff" }}>{slide.title}</h2>
                <p className="subtitle">{slide.subtitle}</p>

                {showCtaRow && (
                  <div className="cta-row">
                    {primaryButtonVisible && (
                      <a
                        href={resolveSiteHref(
                          siteId,
                          slide.primaryButtonHref || "/admissions",
                        )}
                        target={
                          isExternalHref(slide.primaryButtonHref)
                            ? "_blank"
                            : undefined
                        }
                        rel={
                          isExternalHref(slide.primaryButtonHref)
                            ? "noopener noreferrer"
                            : undefined
                        }
                        className="btns primary"
                        onClick={(event) => {
                          if (isExternalHref(slide.primaryButtonHref)) {
                            return;
                          }

                          event.preventDefault();

                          navigateTo(
                            slide.primaryButtonHref || "/admissions",
                          );
                        }}
                      >
                        {slide.primaryButtonText}
                      </a>
                    )}

                    {secondaryButtonVisible && (
                      <a
                        href={resolveSiteHref(
                          siteId,
                          slide.secondaryButtonHref ||
                            "/about/who-we-are",
                        )}
                        target={
                          isExternalHref(slide.secondaryButtonHref)
                            ? "_blank"
                            : undefined
                        }
                        rel={
                          isExternalHref(slide.secondaryButtonHref)
                            ? "noopener noreferrer"
                            : undefined
                        }
                        className="btns ghost"
                        onClick={(event) => {
                          if (isExternalHref(slide.secondaryButtonHref)) {
                            return;
                          }

                          event.preventDefault();

                          navigateTo(
                            slide.secondaryButtonHref ||
                              "/about/who-we-are",
                          );
                        }}
                      >
                        {slide.secondaryButtonText}
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {liveSlideshowSettings.showArrows && liveSlides.length > 1 && (
        <>
          <button
            className="carousel-btn prev"
            onClick={prev}
            aria-label="Previous slide"
            title="Previous"
            type="button"
          >
            ‹
          </button>

          <button
            className="carousel-btn next"
            onClick={next}
            aria-label="Next slide"
            title="Next"
            type="button"
          >
            ›
          </button>
        </>
      )}

      {liveSlideshowSettings.showDots && liveSlides.length > 1 && (
        <div
          className="indicators"
          role="tablist"
          aria-label="Slide indicators"
        >
          {liveSlides.map((_, slideIndex) => (
            <button
              key={slideIndex}
              className={`indicator ${slideIndex === index ? "active" : ""}`}
              onClick={() => goTo(slideIndex)}
              aria-label={`Go to slide ${slideIndex + 1}`}
              role="tab"
              aria-selected={slideIndex === index}
              tabIndex={0}
              type="button"
            />
          ))}
        </div>
      )}
    </section>
  );
}