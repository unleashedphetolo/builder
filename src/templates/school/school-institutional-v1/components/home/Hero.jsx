import React, { useEffect, useMemo, useRef, useState } from "react";
import "../../styles/hero.css";
import { templateConfig } from "../../template.config";

function buildSiteHref(siteId, path = "") {
  const clean = path ? `/${String(path).replace(/^\/+/, "")}` : "";
  return `/#/site/${siteId || ""}${clean}`;
}

function normalizeHeroSlides(heroSlides = []) {
  if (!Array.isArray(heroSlides) || heroSlides.length === 0) {
    return [];
  }

  return heroSlides
    .filter((slide) => slide && (slide.src || slide.image))
    .map((slide, index) => ({
      id: slide?.id || index + 1,
      type: slide?.type === "video" ? "video" : "image",
      src: slide?.src || slide?.image || "",
      poster: slide?.poster || slide?.image || slide?.src || "",
      alt: slide?.alt || "School hero",
      title: slide?.title || "Welcome to Our School",
      subtitle:
        slide?.subtitle ||
        "Building bright futures through excellence in education.",
    }));
}

export default function Hero({ settings = {} }) {
  const templateSlides = templateConfig?.defaults?.hero_slides || [];
  const dbSlides = settings?.hero_slides || [];
  const useCustomSlides = settings?.hero_slides_overridden === true;

  const slides = useMemo(() => {
    const sourceSlides = useCustomSlides ? dbSlides : templateSlides;
    return normalizeHeroSlides(sourceSlides);
  }, [useCustomSlides, dbSlides, templateSlides]);

  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const autoplayRef = useRef(null);
  const videoRef = useRef(null);

  const siteId = settings?.site_id || "";

  const navigateTo = (href) => {
    const slug = href.replace(`/#/site/${siteId}`, "") || "/";
    window.dispatchEvent(new CustomEvent("builder:navigate", { detail: slug }));
  };

  const stopAutoplay = () => {
    if (autoplayRef.current) {
      clearInterval(autoplayRef.current);
      autoplayRef.current = null;
    }
  };

  const next = () => {
    setIndex((prev) => (prev + 1) % slides.length);
  };

  const prev = () => {
    setIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goTo = (i) => {
    setIndex(i);
  };

  useEffect(() => {
    if (!slides.length) return;

    const current = slides[index];
    stopAutoplay();

    if (isPaused) return;

    if (current?.type === "image") {
      autoplayRef.current = setInterval(() => {
        setIndex((prev) => (prev + 1) % slides.length);
      }, 5000);
    }

    return () => stopAutoplay();
  }, [index, slides, isPaused]);

  useEffect(() => {
    if (!slides.length) return;

    const current = slides[index];

    if (current?.type === "video" && videoRef.current) {
      const video = videoRef.current;
      video.currentTime = 0;

      const playPromise = video.play();
      if (playPromise && typeof playPromise.catch === "function") {
        playPromise.catch(() => {
          setTimeout(() => {
            setIndex((prev) => (prev + 1) % slides.length);
          }, 800);
        });
      }
    } else if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  }, [index, slides]);

  useEffect(() => {
    if (!slides.length) return;

    const onKey = (e) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [slides.length]);

  const handleMouseEnter = () => {
    setIsPaused(true);
    stopAutoplay();
    if (videoRef.current) {
      videoRef.current.pause();
    }
  };

  const handleMouseLeave = () => {
    setIsPaused(false);
    const current = slides[index];
    if (current?.type === "video" && videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  };

  if (!slides.length) {
    return (
      <section className="hero hero-carousel">
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
      className="hero hero-carousel"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      aria-roledescription="carousel"
      aria-label="School highlights"
    >
      <div className="slides">
        {slides.map((s, i) => {
          const active = i === index;

          return (
            <div
              key={s.id}
              className={`slide ${active ? "active" : ""}`}
              aria-hidden={!active}
            >
              {s.type === "image" ? (
                <div
                  className="slide-media"
                  style={{
                    backgroundImage: `url(${s.src || ""})`,
                  }}
                >
                  <img
                    src={s.src || ""}
                    alt={s.alt}
                    loading="lazy"
                    className="visually-hidden"
                    aria-hidden="true"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                </div>
              ) : (
                <div className="slide-media video-wrap">
                  <video
                    ref={active ? videoRef : null}
                    className="hero-video"
                    src={s.src}
                    poster={s.poster || ""}
                    muted
                    playsInline
                    autoPlay
                    preload="auto"
                    onEnded={() => {
                      setIndex((prev) => (prev + 1) % slides.length);
                    }}
                    onError={() => {
                      setTimeout(() => {
                        setIndex((prev) => (prev + 1) % slides.length);
                      }, 400);
                    }}
                    aria-label={s.alt}
                  />
                </div>
              )}

              <div className="slide-caption container">
                <h2>{s.title}</h2>
                <p className="subtitle">{s.subtitle}</p>

                <div className="cta-row">
                  <a
                    href={buildSiteHref(siteId, "/admissions")}
                    className="btns primary"
                    onClick={(e) => {
                      e.preventDefault();
                      navigateTo(buildSiteHref(siteId, "/admissions"));
                    }}
                  >
                    Admissions
                  </a>

                  <a
                    href={buildSiteHref(siteId, "/about/who-we-are")}
                    className="btns ghost"
                    onClick={(e) => {
                      e.preventDefault();
                      navigateTo(buildSiteHref(siteId, "/about/who-we-are"));
                    }}
                  >
                    Learn more
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>

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

      <div className="indicators" role="tablist" aria-label="Slide indicators">
        {slides.map((_, i) => (
          <button
            key={i}
            className={`indicator ${i === index ? "active" : ""}`}
            onClick={() => goTo(i)}
            aria-label={`Go to slide ${i + 1}`}
            role="tab"
            aria-selected={i === index}
            tabIndex={0}
            type="button"
          />
        ))}
      </div>
    </section>
  );
}
