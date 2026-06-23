import React, { useEffect, useMemo, useRef, useState } from "react";
import BuilderMediaEditor from "../../../../../builder/BuilderMediaEditor";
import BusinessLink from "../common/BusinessLink";
import { normalizeHeroSlides, normalizeSlideshowSettings } from "../../utils/media";

export default function HeroSlider({ settings, navigateTo, builderMode }) {
  const [slideIndex, setSlideIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const videoRef = useRef(null);

  const slides = useMemo(
    () => normalizeHeroSlides(settings.hero_slides || settings.heroSlides || []),
    [settings.heroSlides, settings.hero_slides],
  );

  const slideshowSettings = useMemo(
    () => normalizeSlideshowSettings(settings.hero_slideshow_settings),
    [settings.hero_slideshow_settings],
  );

  const currentSlide = slides[slideIndex] || slides[0];

  useEffect(() => {
    if (!slideshowSettings.autoplay || paused || slides.length <= 1) return undefined;
    const timer = window.setInterval(() => {
      setSlideIndex((value) => (value + 1) % slides.length);
    }, slideshowSettings.intervalSeconds * 1000);
    return () => window.clearInterval(timer);
  }, [slideshowSettings.autoplay, slideshowSettings.intervalSeconds, paused, slides.length]);

  useEffect(() => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = 0;
    videoRef.current.play().catch(() => undefined);
  }, [slideIndex]);

  const next = () => setSlideIndex((value) => (value + 1) % slides.length);
  const prev = () => setSlideIndex((value) => (value - 1 + slides.length) % slides.length);

  const handleHeroSave = async (patch = {}) => {
    window.dispatchEvent(new CustomEvent("builder:template-media-change", { detail: patch }));
    window.dispatchEvent(new CustomEvent("builder:business-hero-change", { detail: patch }));
  };

  if (!currentSlide) {
    return (
      <section className="business-hero">
        <div className="business-container business-hero__inner">
          <h1>No hero slides configured</h1>
        </div>
      </section>
    );
  }

  return (
    <section
      className={`business-hero business-hero--${currentSlide.type}`}
      onMouseEnter={() => slideshowSettings.pauseOnHover && setPaused(true)}
      onMouseLeave={() => slideshowSettings.pauseOnHover && setPaused(false)}
    >
      {builderMode ? (
        <BuilderMediaEditor
          enabled={builderMode}
          type="slideshow"
          label="Edit Business Hero Slideshow"
          slides={slides}
          settings={settings}
          triggerLabel="Edit Hero"
          triggerTitle="Edit business hero slideshow"
          onSave={handleHeroSave}
          saveToBuilder
        />
      ) : null}

      <div className="business-hero__media" aria-hidden="true">
        {currentSlide.type === "video" ? (
          <video
            ref={videoRef}
            src={currentSlide.src}
            poster={currentSlide.poster}
            muted
            playsInline
            preload="metadata"
            onEnded={next}
          />
        ) : (
          <img src={currentSlide.src} alt="" style={{ objectPosition: currentSlide.objectPosition }} />
        )}
      </div>

      <div className="business-hero__overlay" style={{ opacity: currentSlide.overlayOpacity }} />
      <div className="business-hero__glow" />

      <div className="business-container business-hero__inner">
        <div className="business-hero__content">
          <span className="business-eyebrow">{settings.hero_eyebrow || "Enterprise Ready"}</span>
          <h1>{currentSlide.title}</h1>
          <p>{currentSlide.subtitle}</p>
          <div className="business-actions">
            <BusinessLink settings={settings} navigateTo={navigateTo} builderMode={builderMode} href={currentSlide.primaryButtonHref} className="business-btn business-btn--primary">
              {currentSlide.primaryButtonText}
            </BusinessLink>
            <BusinessLink settings={settings} navigateTo={navigateTo} builderMode={builderMode} href={currentSlide.secondaryButtonHref} className="business-btn business-btn--secondary">
              {currentSlide.secondaryButtonText}
            </BusinessLink>
          </div>
        </div>

        <div className="business-hero__panel" aria-hidden="true">
          <div className="business-dashboard-card business-dashboard-card--main">
            <span>Pipeline</span>
            <strong>+48%</strong>
            <small>Qualified growth</small>
          </div>
          <div className="business-dashboard-card"><span>Clients</span><strong>120+</strong></div>
          <div className="business-dashboard-card"><span>Delivery</span><strong>99%</strong></div>
        </div>
      </div>

      {slides.length > 1 && slideshowSettings.showArrows ? (
        <div className="business-hero__arrows">
          <button type="button" onClick={prev} aria-label="Previous slide">‹</button>
          <button type="button" onClick={next} aria-label="Next slide">›</button>
        </div>
      ) : null}

      {slides.length > 1 && slideshowSettings.showDots ? (
        <div className="business-hero__dots">
          {slides.map((slide, index) => (
            <button key={slide.id || index} type="button" className={index === slideIndex ? "is-active" : ""} onClick={() => setSlideIndex(index)} aria-label={`Go to slide ${index + 1}`} />
          ))}
        </div>
      ) : null}
    </section>
  );
}
