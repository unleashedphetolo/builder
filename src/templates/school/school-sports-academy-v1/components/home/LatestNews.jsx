import React, { useMemo, useState } from "react";
import "../../styles/news.css";

const NEWS = [
  {
    id: 1,
    title: "We are grateful to our Sponsors and Partners on this journey",
    src: "/images/sponsor.webp",
    date: "Dec 2025",
    category: "School News",
    summary:
      "Read more about our partnerships, collaborations, and school activities.",
  },
  {
    id: 2,
    title: "Motus — Partnership announcement",
    src: "/images/motus.jpg",
    date: "Nov 2025",
    category: "School News",
    summary:
      "Read more about our partnerships, collaborations, and school activities.",
  },
  {
    id: 3,
    title: "Open Access Network DFA collaboration",
    src: "/images/DFA.webp",
    date: "Oct 2025",
    category: "School News",
    summary:
      "Read more about our partnerships, collaborations, and school activities.",
  },
];

function formatPublishedDate(value = "") {
  if (!value) return "";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString(undefined, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function normalizeArticle(article = {}, index = 0) {
  return {
    id: article.id || `news-${index + 1}`,
    title: article.title || "",
    image: article.image_url || article.src || "",
    imageAlt: article.image_alt || article.title || "School news",
    date: article.date || formatPublishedDate(article.publishedAt),
    category: article.category || "School News",
    summary:
      article.summary ||
      article.excerpt ||
      "Read more about our partnerships, collaborations, and school activities.",
    body: article.body || article.content || article.summary || "",
    href: article.href || article.link || "",
    buttonLabel: article.button_label || "Read More",
  };
}

function isExternalLink(href = "") {
  return /^(https?:\/\/|mailto:|tel:)/i.test(String(href));
}

export default function LatestNews({ content = {} }) {
  const [selectedArticle, setSelectedArticle] = useState(null);

  const articles = useMemo(() => {
    const source =
      Array.isArray(content?.items) && content.items.length > 0
        ? content.items
        : NEWS;

    return source.map(normalizeArticle);
  }, [content?.items]);

  const openArticle = (article) => {
    if (article.href) return;

    setSelectedArticle(article);
  };

  const handleInternalLink = (event, href) => {
    if (!href || isExternalLink(href)) return;

    event.preventDefault();
    window.dispatchEvent(
      new CustomEvent("builder:navigate", {
        detail: href,
      }),
    );
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <div className="news-list" aria-label="Latest school news">
        {articles.map((article, index) => (
          <article
            key={article.id}
            className={`news-card ${index === 0 ? "featured" : ""}`}
          >
            <div className="thumb">
              <img
                src={article.image}
                alt={article.imageAlt}
                loading="lazy"
                onError={(event) => {
                  event.currentTarget.src = "/images/gallery1.jpg";
                }}
              />
              <span className="news-image-category">{article.category}</span>
            </div>

            <div className="news-body">
              <div className="meta">
                <span className="category">{article.category}</span>
                <span className="date">{article.date}</span>
              </div>

              <h3 className="news-heading">{article.title}</h3>

              <p className="small">{article.summary}</p>

              {article.href ? (
                <a
                  href={article.href}
                  target={isExternalLink(article.href) ? "_blank" : undefined}
                  rel={isExternalLink(article.href) ? "noopener noreferrer" : undefined}
                  className="read-btn"
                  onClick={(event) => handleInternalLink(event, article.href)}
                >
                  {article.buttonLabel}
                  <span aria-hidden="true">→</span>
                </a>
              ) : (
                <button
                  type="button"
                  className="read-btn"
                  onClick={() => openArticle(article)}
                >
                  {article.buttonLabel}
                  <span aria-hidden="true">→</span>
                </button>
              )}
            </div>
          </article>
        ))}
      </div>

      {selectedArticle && (
        <div
          className="news-dialog-backdrop"
          role="presentation"
          onClick={() => setSelectedArticle(null)}
        >
          <article
            className="news-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="news-dialog-title"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="news-dialog-close"
              aria-label="Close news article"
              onClick={() => setSelectedArticle(null)}
            >
              ×
            </button>

            <div className="news-dialog-media">
              <img
                src={selectedArticle.image}
                alt={selectedArticle.imageAlt}
                onError={(event) => {
                  event.currentTarget.src = "/images/gallery1.jpg";
                }}
              />
            </div>

            <div className="news-dialog-body">
              <div className="meta">
                <span className="category">{selectedArticle.category}</span>
                <span className="date">{selectedArticle.date}</span>
              </div>

              <h2 id="news-dialog-title">{selectedArticle.title}</h2>
              <p>
                {selectedArticle.body ||
                  selectedArticle.summary ||
                  "More information will be published soon."}
              </p>
            </div>
          </article>
        </div>
      )}
    </>
  );
}
