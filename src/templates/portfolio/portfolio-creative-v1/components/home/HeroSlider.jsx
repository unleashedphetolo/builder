import React, { useEffect, useMemo, useRef, useState } from "react";
import BuilderMediaEditor from "../../../../../builder/BuilderMediaEditor";
import PortfolioLink from "../common/PortfolioLink";

function normalizeSlides(slides = []) {
  return (Array.isArray(slides) ? slides : [])
    .filter((slide) => slide?.src)
    .map((slide) => ({ type: slide.type || "image", ...slide }));
}

export default function HeroSlider({ settings = {}, data, builderMode = false }) {
  const slides = useMemo(() => normalizeSlides(data.heroSlides), [data.heroSlides]);
  const [index, setIndex] = useState(0);
  const videoRef = useRef(null);
  const current = slides[index] || slides[0];

  useEffect(() => {
    if (slides.length <= 1) return undefined;
    const timer = window.setInterval(() => {
      setIndex((currentIndex) => (currentIndex + 1) % slides.length);
    }, 5200);
    return () => window.clearInterval(timer);
  }, [slides.length]);

  useEffect(() => {
    if (current?.type === "video" && videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
    }
  }, [current]);

  return (
    <section className="portfolio-hero">
      {builderMode ? (
        <BuilderMediaEditor
          enabled={builderMode}
          type="slideshow"
          label="Edit Portfolio Hero Slideshow"
          slides={slides}
          settings={settings}
          triggerLabel="Edit Hero"
          triggerTitle="Edit portfolio hero slideshow"
          saveToBuilder
        />
      ) : null}

      <div className="portfolio-hero__media" aria-hidden="true">
        {current?.type === "video" ? (
          <video ref={videoRef} src={current.src} poster={current.poster} muted playsInline loop />
        ) : (
          <img src={current?.src || data.assets.heroImage} alt="" />
        )}
      </div>

      <div className="portfolio-container portfolio-hero__inner">
        <div className="portfolio-hero__content">
          <span className="portfolio-eyebrow">Available for selected projects</span>
          <h1>{data.siteName}</h1>
          <p className="portfolio-hero__role">{data.tagline}</p>
          <p>
            A professional portfolio built to present services, experience, projects and contact details clearly to clients, recruiters and partners.
          </p>
          <div className="portfolio-actions">
            <PortfolioLink settings={settings} href="/projects" className="portfolio-btn portfolio-btn--primary">
              View Projects
            </PortfolioLink>
            <PortfolioLink settings={settings} href="/contact" className="portfolio-btn portfolio-btn--secondary">
              Contact Me
            </PortfolioLink>
          </div>
        </div>
        <div className="portfolio-hero__card">
          <img src={data.sections.profile.content.image_url || data.assets.profileImage} alt="" />
          <strong>{data.sections.profile.content.professional_title}</strong>
          <span>{data.location}</span>
        </div>
      </div>
    </section>
  );
}
