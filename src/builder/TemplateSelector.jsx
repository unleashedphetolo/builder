import { useMemo, useState } from "react";
import "../styles/templateSelector.css";

/**
 * TemplateSelector (Marketplace)
 * - category tabs: school | business | portfolio
 * - choose template -> onSelect({layout_key, template_key})
 */
export default function TemplateSelector({ templates, onSelect, defaultLayout, error }) {
  const [tab, setTab] = useState(defaultLayout || "school");

  const list = useMemo(
    () => (templates || []).filter((t) => t.layout_key === tab),
    [templates, tab]
  );

  return (
    <div className="template-modal">
      <div className="template-modal-inner">
        <div className="template-header">
          <h2>Choose a Website Category</h2>
          <p>Pick a ready-to-use template. You can edit text, images, colors and pages after.</p>
          {error ? (
            <div style={{ marginTop: 10, padding: 10, borderRadius: 10, background: "rgba(220,38,38,0.12)", color: "#fecaca", border: "1px solid rgba(220,38,38,0.35)" }}>
              {error}
            </div>
          ) : null}
        </div>

        <div className="template-tabs">
          <button className={tab === "school" ? "active" : ""} onClick={() => setTab("school")}>School</button>
          <button className={tab === "business" ? "active" : ""} onClick={() => setTab("business")}>Business</button>
          <button className={tab === "portfolio" ? "active" : ""} onClick={() => setTab("portfolio")}>Portfolio</button>
        </div>

        <div className="template-grid">
          {list.map((t) => (
            <div key={t.template_key} className="template-card">
              <div className="template-preview">
                <img src={t.preview_image} alt={t.name} onError={(e) => (e.currentTarget.src = "/fallback-template.png")} />
              </div>

              <div className="template-meta">
                <div className="template-title-row">
                  <h3>{t.name}</h3>
                  <span className="badge">READY</span>
                </div>
                <p>{t.description}</p>
                <div className="template-tags">
                  {(t.tags || []).slice(0, 4).map((tag) => (
                    <span key={tag} className="tag">{tag}</span>
                  ))}
                </div>
              </div>

              <div className="template-actions">
                <button
                  className="btn primary"
                  onClick={() => onSelect({ layout_key: t.layout_key, template_key: t.template_key })}
                >
                  Use this template
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
