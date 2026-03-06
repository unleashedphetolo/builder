import React, { useEffect, useMemo, useRef, useState } from "react";
import "../../styles/hero.css";
import { Link } from "react-router-dom";
import { useTenant } from "../../../../../site/TenantContext";
import { mergeHeroSlides } from "../../../../../site/contentDefaults";

export default function Hero() {
  const { settings } = useTenant();

  const slides = useMemo(() => mergeHeroSlides(settings?.hero_slides), [settings?.hero_slides]);

  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const autoplayRef = useRef(null);

  // Reset index if slides change
  useEffect(() => {
    if (!slides?.length) return;
    if (index >= slides.length) setIndex(0);
  }, [slides, index]);

  useEffect(() => {
    if (!slides?.length) return;

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

  if (!slides?.length) return null;

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
              <Link className="hero-btn primary" to="/admissions">
                Admissions
              </Link>
              <Link className="hero-btn secondary" to="/contact">
                Contact
              </Link>
            </div>
          </div>
        </div>

        <button className="hero-nav prev" onClick={prevSlide} aria-label="Previous slide">
          ‹
        </button>
        <button className="hero-nav next" onClick={nextSlide} aria-label="Next slide">
          ›
        </button>

        <div className="hero-dots">
          {slides.map((s, i) => (
            <button
              key={s.id || i}
              className={`hero-dot ${i === index ? "active" : ""}`}
              onClick={() => goToSlide(i)}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
