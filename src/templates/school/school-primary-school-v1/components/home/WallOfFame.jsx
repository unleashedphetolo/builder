import React, { useEffect, useMemo, useState } from "react";
import BuilderSectionTarget from "../../../../../builder/BuilderSectionTarget";
import "../../styles/wall.css";

const HONOREES = [
  {
    id: 1,
    name: "Top Academic Performers",
    year: 2025,
    note: "Learners who achieved distinctions across all subjects",
    cover: "/images/academics/acade13.jpg",
    gallery: [
      "/images/academics/acade10.jpg",
      "/images/academics/acade12.jpg",
    ],
  },
  {
    id: 2,
    name: "Mathematics Excellence Award",
    year: 2025,
    note: "Outstanding results in Mathematics & Physical Sciences",
    cover: "/images/academics/acade14.jpg",
    gallery: [
      "/images/academics/acade5.jpg",
      "/images/academics/acade8.jpg",
    ],
  },
  {
    id: 3,
    name: "Most Improved Academic Performance",
    year: 2025,
    note: "Recognising exceptional academic growth and commitment",
    cover: "/images/academics/acade4.jpg",
    gallery: [
      "/images/academics/acade3.webp",
      "/images/academics/acade1.jpg",
    ],
  },
];

function normaliseHonoree(item = {}, index = 0) {
  return {
    id: item.id || `honouree-${index + 1}`,
    name: item.name || item.title || "",
    year: item.year || "",
    note: item.note || item.description || item.body || "",
    cover: item.cover || item.image_url || "",
    gallery: Array.isArray(item.gallery) ? item.gallery : [],
  };
}

function ChevronIcon({ direction = "next" }) {
  return (
    <svg
      width="26"
      height="26"
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

export default function WallOfFame({
  section = null,
  content = {},
  builderMode = false,
}) {
  const [previewIndex, setPreviewIndex] = useState(null);

  const honorees = useMemo(() => {
    const source =
      Array.isArray(content?.items) && content.items.length > 0
        ? content.items
        : HONOREES;

    return source.map(normaliseHonoree);
  }, [content?.items]);

  const previewImages = useMemo(() => {
    return honorees.flatMap((honoree) => [
      {
        id: `${honoree.id}-cover`,
        src: honoree.cover,
        alt: honoree.name,
      },
      ...honoree.gallery.map((src, index) => ({
        id: `${honoree.id}-gallery-${index + 1}`,
        src,
        alt: honoree.name,
      })),
    ]);
  }, [honorees]);

  const preview =
    previewIndex !== null && previewImages[previewIndex]
      ? previewImages[previewIndex]
      : null;

  const openPreview = (src) => {
    const imageIndex = previewImages.findIndex((item) => item.src === src);
    setPreviewIndex(imageIndex >= 0 ? imageIndex : null);
  };

  const closePreview = () => {
    setPreviewIndex(null);
  };

  const previousImage = () => {
    if (previewImages.length < 2) return;

    setPreviewIndex((current) =>
      current === null
        ? 0
        : (current - 1 + previewImages.length) % previewImages.length,
    );
  };

  const nextImage = () => {
    if (previewImages.length < 2) return;

    setPreviewIndex((current) =>
      current === null ? 0 : (current + 1) % previewImages.length,
    );
  };

  useEffect(() => {
    if (!preview) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        closePreview();
      }

      if (event.key === "ArrowLeft") {
        previousImage();
      }

      if (event.key === "ArrowRight") {
        nextImage();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [preview, previewImages.length]);

  const wallContent = (
    <div className="wall-container">
      <h2 className="wall-title">
        {content?.section_title || "Academic Wall of Fame"}
      </h2>
      <p className="wall-subtitle">
        {content?.subtitle ||
          "Celebrating Outstanding Academic Performance & Excellence"}
      </p>

      <div className="wall-grid">
        {honorees.map((h) => (
          <div className="honour-card" key={h.id}>
            <div className="honour-cover">
              <img
                src={h.cover}
                alt={h.name}
                onClick={() => openPreview(h.cover)}
                onError={(event) => {
                  event.currentTarget.src = "/images/teachers.jpeg";
                }}
              />
              <span className="badge">{h.year}</span>
            </div>

            <div className="honour-body">
              <h4>{h.name}</h4>
              <p>{h.note}</p>

              <div className="honour-gallery">
                {h.gallery.map((img, index) => (
                  <img
                    key={`${h.id}-image-${index}`}
                    src={img}
                    alt="Academic achievement"
                    onClick={() => openPreview(img)}
                    onError={(event) => {
                      event.currentTarget.src = "/images/teachers.jpeg";
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {preview && (
        <div
          className="image-preview"
          role="presentation"
          onClick={closePreview}
        >
          {previewImages.length > 1 && (
            <button
              type="button"
              className="preview-chevron previous"
              onClick={(event) => {
                event.stopPropagation();
                previousImage();
              }}
              aria-label="Previous image"
            >
              <ChevronIcon direction="previous" />
            </button>
          )}

          <img
            src={preview.src}
            alt={preview.alt}
            onClick={(event) => event.stopPropagation()}
            onError={(event) => {
              event.currentTarget.src = "/images/teachers.jpeg";
            }}
          />

          {previewImages.length > 1 && (
            <button
              type="button"
              className="preview-chevron next"
              onClick={(event) => {
                event.stopPropagation();
                nextImage();
              }}
              aria-label="Next image"
            >
              <ChevronIcon direction="next" />
            </button>
          )}

          <span className="close" onClick={closePreview} aria-label="Close preview">
            ✕
          </span>
        </div>
      )}
    </div>
  );

  if (!section) {
    return wallContent;
  }

  return (
    <BuilderSectionTarget
      builderMode={builderMode}
      section={section}
      sectionType={section?.content?._editor_section_type || section?.type || "wall_of_fame"}
      label={content?.section_title || "Academic Wall of Fame"}
      templateCategory="school"
      templateKey="school-primary-school-v1"
    >
      {wallContent}
    </BuilderSectionTarget>
  );
}
