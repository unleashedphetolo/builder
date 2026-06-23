const DEFAULT_SLIDESHOW_SETTINGS = {
  autoplay: true,
  intervalSeconds: 5,
  pauseOnHover: true,
  showArrows: true,
  showDots: true,
  transition: "fade",
};

export function getMedia(settings, key, fallback = "") {
  return settings?.media?.[key] || fallback || "";
}

export function normalizeSlideshowSettings(settings = {}) {
  const rawSeconds = Number(settings?.intervalSeconds);
  const intervalSeconds = Number.isFinite(rawSeconds)
    ? Math.min(30, Math.max(2, rawSeconds))
    : DEFAULT_SLIDESHOW_SETTINGS.intervalSeconds;

  return {
    ...DEFAULT_SLIDESHOW_SETTINGS,
    ...(settings || {}),
    intervalSeconds,
    autoplay: settings?.autoplay !== false,
    pauseOnHover: settings?.pauseOnHover !== false,
    showArrows: settings?.showArrows !== false,
    showDots: settings?.showDots !== false,
    transition: settings?.transition || DEFAULT_SLIDESHOW_SETTINGS.transition,
  };
}

export function normalizeHeroSlides(heroSlides = []) {
  if (!Array.isArray(heroSlides) || !heroSlides.length) return [];

  return heroSlides
    .filter((slide) => slide && (slide.src || slide.image || slide.url || slide.poster))
    .map((slide, index) => {
      const src = slide.src || slide.image || slide.url || "";
      return {
        id: slide.id || `business-slide-${index + 1}`,
        type: slide.type === "video" ? "video" : "image",
        src,
        image: slide.image || src,
        url: slide.url || src,
        poster: slide.poster || slide.image || src,
        alt: slide.alt || "Business hero media",
        title: slide.title || "Enterprise business website",
        subtitle: slide.subtitle || "Present your business with a professional responsive digital presence.",
        primaryButtonText: slide.primaryButtonText || slide.primary_button_text || "Request Consultation",
        primaryButtonHref: slide.primaryButtonHref || slide.primary_button_href || "/contact",
        secondaryButtonText: slide.secondaryButtonText || slide.secondary_button_text || "View Services",
        secondaryButtonHref: slide.secondaryButtonHref || slide.secondary_button_href || "/services",
        overlayOpacity: typeof slide.overlayOpacity === "number" ? slide.overlayOpacity : 0.55,
        objectPosition: slide.objectPosition || "center center",
      };
    });
}
