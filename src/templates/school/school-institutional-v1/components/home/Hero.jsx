import React, { useEffect, useMemo, useRef, useState } from "react";
import "../../styles/hero.css";

function normalizeHeroSlides(heroSlides = []) {
  const fallback = [
    {
      id: "default-1",
      type: "image",
      src: "/images/hero1.jpg",
      alt: "School hero",
      title: "Welcome to Our School",
      subtitle: "Building bright futures through excellence in education.",
    },
  ];

  if (!Array.isArray(heroSlides) || heroSlides.length === 0) {
    return fallback;
  }

  return heroSlides.map((slide, index) => ({
    id: slide?.id || `slide-${index + 1}`,
    type: slide?.type || "image",
    src: slide?.src || slide?.image || "/images/hero1.jpg",
    poster: slide?.poster || "",
    alt: slide?.alt || "School hero",
    title: slide?.title || "",
    subtitle: slide?.subtitle || "",
  }));
}

function buildSiteHref(siteId, path = "") {
  const clean = path ? `/${String(path).replace(/^\/+/, "")}` : "";
  return `/#/site/${siteId || ""}${clean}`;
}

export default function Hero({ settings = {} }) {
  const slides = useMemo(
    () => normalizeHeroSlides(settings?.hero_slides),
    [settings?.hero_slides]
  );

  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const autoplayRef = useRef(null);

  const siteId = settings?.site_id || "";

  useEffect(() => {
    if (!slides.length) return;
    if (index >= slides.length) setIndex(0);
  }, [slides, index]);

  useEffect(() => {
    if (!slides.length) return;

    if (isPaused || isVideoPlaying) {
      clearInterval(autoplayRef.current);
      return;
    }

    autoplayRef.current = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(autoplayRef.current);
  }, [isPaused, isVideoPlaying, slides]);

  const goToSlide = (i) => {
    setIndex(i);
    setIsVideoPlaying(false);
  };

  const nextSlide = () => {
    setIndex((prev) => (prev + 1) % slides.length);
    setIsVideoPlaying(false);
  };

  const prevSlide = () => {
    setIndex((prev) => (prev - 1 + slides.length) % slides.length);
    setIsVideoPlaying(false);
  };

  if (!slides.length) return null;

  const active = slides[index];

  return (
    <section
      className="hero"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="hero-slider">
        {active?.type === "video" ? (
          <video
            className="hero-media"
            src={active.src}
            poster={active.poster || undefined}
            controls
            onPlay={() => setIsVideoPlaying(true)}
            onPause={() => setIsVideoPlaying(false)}
          />
        ) : (
          <img
            className="hero-media"
            src={active?.src}
            alt={active?.alt || "School hero"}
            loading="eager"
          />
        )}

        <div className="hero-overlay">
          <div className="hero-content">
            <h1>{active?.title || ""}</h1>
            <p>{active?.subtitle || ""}</p>

            <div className="hero-actions">
              <a className="hero-btn primary" href={buildSiteHref(siteId, "/admissions")}>
                Admissions
              </a>
              <a className="hero-btn secondary" href={buildSiteHref(siteId, "/contact")}>
                Contact
              </a>
            </div>
          </div>
        </div>

        <button
          className="hero-nav prev"
          onClick={prevSlide}
          aria-label="Previous slide"
          type="button"
        >
          ‹
        </button>

        <button
          className="hero-nav next"
          onClick={nextSlide}
          aria-label="Next slide"
          type="button"
        >
          ›
        </button>

        <div className="hero-dots">
          {slides.map((s, i) => (
            <button
              key={s.id || i}
              className={`hero-dot ${i === index ? "active" : ""}`}
              onClick={() => goToSlide(i)}
              aria-label={`Go to slide ${i + 1}`}
              type="button"
            />
          ))}
        </div>
      </div>
    </section>
  );
}