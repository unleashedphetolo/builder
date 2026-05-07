import { useMemo, useState } from "react";
import "../styles/templateSelector.css";

/**
 * TemplateSelector (Marketplace)
 * - category tabs: school | business | portfolio
 * - choose template -> onSelect({layout_key, template_key})
 */
export default function TemplateSelector({
  templates = [],
  onSelect,
  defaultLayout,
  error,
}) {
  const [tab, setTab] = useState(defaultLayout || "school");

  const list = useMemo(() => {
    return (templates || []).filter((t) => t.layout_key === tab);
  }, [templates, tab]);

  const getLivePreviewUrl = (template) => {
    if (!template?.layout_key || !template?.template_key) return "";

    return `#/template-preview/${template.layout_key}/${template.template_key}?mini=1`;
  };

  return (
    <div className="template-modal">
      <div className="template-modal-inner">
        <div className="template-header">
          <h2>Choose a Website Category</h2>
          <p>
            Pick a ready-to-use template. You can edit text, images, colors and
            pages after.
          </p>

          {error && <div className="template-error">{error}</div>}
        </div>

        {/* Category Tabs */}
        <div className="template-tabs">
          <button
            className={tab === "school" ? "active" : ""}
            onClick={() => setTab("school")}
          >
            School
          </button>

          <button
            className={tab === "business" ? "active" : ""}
            onClick={() => setTab("business")}
          >
            Business
          </button>

          <button
            className={tab === "portfolio" ? "active" : ""}
            onClick={() => setTab("portfolio")}
          >
            Portfolio
          </button>
        </div>

        {/* Template Grid */}
        <div className="template-grid">
          {list.length === 0 && (
            <div className="template-empty">
              <p>No templates available in this category yet.</p>
            </div>
          )}

          {list.map((t) => {
            const livePreviewUrl = getLivePreviewUrl(t);

            return (
              <div key={t.template_key} className="template-card">
                <div
                  className="template-preview"
                  role="button"
                  tabIndex={0}
                  title={`Use ${t.name}`}
                  onClick={() =>
                    onSelect({
                      layout_key: t.layout_key,
                      template_key: t.template_key,
                    })
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();

                      onSelect({
                        layout_key: t.layout_key,
                        template_key: t.template_key,
                      });
                    }
                  }}
                >
                  {livePreviewUrl ? (
                    <iframe
                      src={livePreviewUrl}
                      title={`${t.name} live preview`}
                      className="template-live-preview-frame"
                      loading="lazy"
                    />
                  ) : (
                    <div className="template-live-preview-fallback">
                      <strong>{t.name?.slice(0, 1) || "T"}</strong>
                      <span>Live Preview</span>
                    </div>
                  )}
                </div>

                <div className="template-meta">
                  <div className="template-title-row">
                    <h3>{t.name}</h3>
                    <span className="badge">READY</span>
                  </div>

                  <p>{t.description || "Professional website template."}</p>

                  <div className="template-tags">
                    {(t.tags || []).slice(0, 4).map((tag) => (
                      <span key={tag} className="tag">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="template-actions">
                  <button
                    className="btn primary"
                    onClick={() =>
                      onSelect({
                        layout_key: t.layout_key,
                        template_key: t.template_key,
                      })
                    }
                  >
                    Use this template
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
