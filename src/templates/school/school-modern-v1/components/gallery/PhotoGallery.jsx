import React, { useEffect, useMemo, useRef, useState } from "react";
import "../../styles/photo-gallery.css";

const DEFAULT_ITEMS = [
  {
    id: 1,
    title: "ACADEMICS",
    img: "/images/gallery1.jpg",
    link: "/activities/academics",
  },
  {
    id: 3,
    title: "SPORTS",
    img: "/images/gallery2.avif",
    link: "/activities/sports",
  },
  {
    id: 2,
    title: "CULTURE",
    img: "/images/gallery4.jpg",
    link: "/activities/culture",
  },
  {
    id: 4,
    title: "STAFF",
    img: "/images/teachers.jpeg",
    link: "/staff",
  },
];

function normaliseGalleryItem(item = {}, index = 0) {
  return {
    id: item.id || `gallery-item-${index + 1}`,
    title: item.title || "",
    image: item.image_url || item.img || "",
    alt: item.image_alt || item.title || "School gallery photo",
    caption: item.caption || item.description || "",
    link: item.link || item.href || "",
  };
}

function isExternalLink(link = "") {
  return /^(https?:\/\/|mailto:|tel:)/i.test(String(link));
}

function ChevronIcon({ direction = "next" }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      {direction === "previous" ? (
        <path
          d="M14.5 5L7.5 12L14.5 19"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ) : (
        <path
          d="M9.5 5L16.5 12L9.5 19"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
    </svg>
  );
}

export default function PhotoGallery({ content = {} }) {
  const [activeIndex, setActiveIndex] = useState(null);
  const closeButtonRef = useRef(null);

  const navigate = (slug) => {
    window.dispatchEvent(
      new CustomEvent("builder:navigate", { detail: slug }),
    );
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const items = useMemo(() => {
    const source =
      Array.isArray(content?.items) && content.items.length > 0
        ? content.items
        : DEFAULT_ITEMS;

    return source.map(normaliseGalleryItem);
  }, [content?.items]);

  const activeItem =
    activeIndex !== null && items[activeIndex] ? items[activeIndex] : null;

  const closeLightbox = () => setActiveIndex(null);

  const showPrevious = () => {
    if (items.length < 2) return;

    setActiveIndex((current) =>
      current === null ? 0 : (current - 1 + items.length) % items.length,
    );
  };

  const showNext = () => {
    if (items.length < 2) return;

    setActiveIndex((current) =>
      current === null ? 0 : (current + 1) % items.length,
    );
  };

  const openLinkedPage = (link) => {
    if (!link || isExternalLink(link)) return;

    closeLightbox();
    navigate(link);
  };

  useEffect(() => {
    if (!activeItem) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        closeLightbox();
      }

      if (event.key === "ArrowLeft") {
        showPrevious();
      }

      if (event.key === "ArrowRight") {
        showNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [activeItem, items.length]);

  useEffect(() => {
    if (activeIndex !== null && !items[activeIndex]) {
      setActiveIndex(null);
    }
  }, [activeIndex, items]);

  return (
    <>
      <section
        className="photo-gallery"
        aria-label={content?.section_title || "Photo Gallery"}
      >
        <div className="photo-grid">
          {items.map((item, index) => (
            <article key={item.id} className="photo-tile">
              <button
                type="button"
                className="photo-tile-preview"
                onClick={() => setActiveIndex(index)}
                aria-label={`View ${item.title || "photo"}`}
              >
                <img
                  className="photo-tile-image"
                  src={item.image}
                  alt={item.alt}
                  loading="lazy"
                  onError={(event) => {
                    event.currentTarget.src = "/images/teachers.jpeg";
                  }}
                />

                <span className="photo-tile-gradient" />

                <span className="photo-tile-content">
                  <span className="photo-tile-count">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="photo-tile-title">{item.title}</span>
                  <span className="photo-tile-view">
                    View Photo <ChevronIcon />
                  </span>
                </span>
              </button>
            </article>
          ))}
        </div>
      </section>

      {activeItem && (
        <div
          className="photo-lightbox"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeLightbox();
            }
          }}
        >
          <section
            className="photo-lightbox-card"
            role="dialog"
            aria-modal="true"
            aria-labelledby="photo-lightbox-title"
          >
            <header className="photo-lightbox-header">
              <div>
                <span className="photo-lightbox-label">
                  Photo {activeIndex + 1} of {items.length}
                </span>
                <h3 id="photo-lightbox-title">{activeItem.title}</h3>
              </div>

              <button
                ref={closeButtonRef}
                type="button"
                className="photo-lightbox-close"
                onClick={closeLightbox}
                aria-label="Close photo viewer"
              >
                ×
              </button>
            </header>

            <div className="photo-lightbox-media">
              {items.length > 1 && (
                <button
                  type="button"
                  className="photo-lightbox-chevron previous"
                  onClick={showPrevious}
                  aria-label="Previous photo"
                >
                  <ChevronIcon direction="previous" />
                </button>
              )}

              <img
                src={activeItem.image}
                alt={activeItem.alt}
                onError={(event) => {
                  event.currentTarget.src = "/images/teachers.jpeg";
                }}
              />

              {items.length > 1 && (
                <button
                  type="button"
                  className="photo-lightbox-chevron next"
                  onClick={showNext}
                  aria-label="Next photo"
                >
                  <ChevronIcon direction="next" />
                </button>
              )}
            </div>

            <footer className="photo-lightbox-footer">
              <div className="photo-lightbox-description">
                <strong>{activeItem.title}</strong>
                {activeItem.caption && <p>{activeItem.caption}</p>}
              </div>

              {activeItem.link &&
                (isExternalLink(activeItem.link) ? (
                  <a
                    className="photo-lightbox-action"
                    href={activeItem.link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Open Link <ChevronIcon />
                  </a>
                ) : (
                  <button
                    type="button"
                    className="photo-lightbox-action"
                    onClick={() => openLinkedPage(activeItem.link)}
                  >
                    Explore Section <ChevronIcon />
                  </button>
                ))}
            </footer>
          </section>
        </div>
      )}
    </>
  );
}
