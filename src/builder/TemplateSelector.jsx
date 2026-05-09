import { useEffect, useMemo, useState } from "react";
import "../styles/templateSelector.css";

/**
 * TemplateSelector (Marketplace)
 * - Shows saved category/template from database when provided by Builder.jsx
 * - Search works inside the active category first
 * - If no category result, it shows close matches from all templates
 * - Exit button is optional via onClose
 */
export default function TemplateSelector({
  templates = [],
  onSelect,
  onClose,
  defaultLayout,
  selectedLayoutKey,
  selectedTemplateKey,
  error,
}) {
  const availableLayouts = useMemo(() => {
    const layouts = Array.from(
      new Set((templates || []).map((t) => t.layout_key).filter(Boolean)),
    );

    return layouts.length ? layouts : ["school", "business", "portfolio"];
  }, [templates]);

  const getInitialLayout = () => {
    const savedLayout = selectedLayoutKey || defaultLayout;

    if (savedLayout && availableLayouts.includes(savedLayout)) {
      return savedLayout;
    }

    return availableLayouts[0] || "";
  };

  const [tab, setTab] = useState(getInitialLayout);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const savedLayout = selectedLayoutKey || defaultLayout;

    if (savedLayout && availableLayouts.includes(savedLayout)) {
      setTab(savedLayout);
    }
  }, [selectedLayoutKey, defaultLayout, availableLayouts]);

  const cleanSearch = search.trim().toLowerCase();

  const categoryLabels = {
    school: "School",
    business: "Business",
    portfolio: "Portfolio",
  };

  const getCategoryLabel = (layoutKey) => {
    return (
      categoryLabels[layoutKey] ||
      String(layoutKey || "")
        .replace(/[-_]/g, " ")
        .replace(/\b\w/g, (char) => char.toUpperCase())
    );
  };

  const getLivePreviewUrl = (template) => {
    if (!template?.layout_key || !template?.template_key) return "";

    return `#/template-preview/${template.layout_key}/${template.template_key}?mini=1`;
  };

  const getTemplateScore = (template, query) => {
    if (!query) return 1;

    const name = String(template?.name || "").toLowerCase();
    const description = String(template?.description || "").toLowerCase();
    const layout = String(template?.layout_key || "").toLowerCase();
    const templateKey = String(template?.template_key || "").toLowerCase();
    const tags = Array.isArray(template?.tags)
      ? template.tags.join(" ").toLowerCase()
      : "";

    const haystack = [name, description, layout, templateKey, tags]
      .filter(Boolean)
      .join(" ");

    const words = query.split(/\s+/).filter(Boolean);

    let score = 0;

    if (name === query) score += 120;
    if (templateKey === query) score += 110;
    if (layout === query) score += 90;
    if (tags.split(/\s+/).includes(query)) score += 80;
    if (name.startsWith(query)) score += 70;
    if (name.includes(query)) score += 60;
    if (templateKey.includes(query)) score += 50;
    if (tags.includes(query)) score += 40;
    if (description.includes(query)) score += 30;
    if (haystack.includes(query)) score += 20;

    const matchedWords = words.filter((word) => haystack.includes(word));
    score += matchedWords.length * 10;

    return score;
  };

  const categoryList = useMemo(() => {
    return (templates || []).filter((t) => t.layout_key === tab);
  }, [templates, tab]);

  const categoryResults = useMemo(() => {
    if (!cleanSearch) return categoryList;

    return categoryList
      .map((template) => ({
        template,
        score: getTemplateScore(template, cleanSearch),
      }))
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .map((item) => item.template);
  }, [categoryList, cleanSearch]);

  const closeMatches = useMemo(() => {
    if (!cleanSearch) return [];

    return (templates || [])
      .map((template) => ({
        template,
        score: getTemplateScore(template, cleanSearch),
      }))
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .map((item) => item.template);
  }, [templates, cleanSearch]);

  const list = useMemo(() => {
    if (!cleanSearch) return categoryList;

    if (categoryResults.length) return categoryResults;

    return closeMatches;
  }, [cleanSearch, categoryList, categoryResults, closeMatches]);

  const isShowingCloseMatches =
    cleanSearch && categoryResults.length === 0 && closeMatches.length > 0;

  const handleUseTemplate = (template) => {
    onSelect?.({
      layout_key: template.layout_key,
      template_key: template.template_key,
    });
  };

  const handleClearSearch = () => {
    setSearch("");
  };

  const handleChangeCategory = (nextTab) => {
    setTab(nextTab);
    setSearch("");
  };

  return (
    <div className="template-modal">
      <div className="template-modal-inner">
        {onClose && (
          <button
            type="button"
            className="template-modal-exit"
            onClick={onClose}
            aria-label="Exit template selector"
            title="Exit"
          >
            ×
          </button>
        )}

        <div className="template-header">
          <div className="template-header-main">
            <span className="template-header-kicker">Template Marketplace</span>

            <h2>Choose a Website Template</h2>

            <p>
              Select a professional template. Your saved website information,
              pages, text, colours and media remain connected to the same site.
            </p>
          </div>

          {selectedTemplateKey && (
            <div className="template-current-selection">
              <span style={{ color: "black" }}>Current template</span>
              <strong>{selectedTemplateKey}</strong>
            </div>
          )}

          {error && <div className="template-error">{error}</div>}
        </div>

        {/* Enterprise Search */}
        <div className="template-search-area">
          <label className="template-search-box" aria-label="Search templates">
            <span className="template-search-icon">⌕</span>

            <input
              type="text"
              value={search}
              placeholder="Search templates by name, type, feature or tag..."
              onChange={(e) => setSearch(e.target.value)}
            />

            {search && (
              <button
                type="button"
                className="template-search-clear"
                onClick={handleClearSearch}
                aria-label="Clear search"
                title="Clear search"
              >
                ×
              </button>
            )}
          </label>
        </div>

        {/* Category Tabs */}
        <div className="template-tabs">
          {availableLayouts.map((layout) => (
            <button
              key={layout}
              className={tab === layout ? "active" : ""}
              onClick={() => handleChangeCategory(layout)}
              type="button"
            >
              {getCategoryLabel(layout)}
            </button>
          ))}
        </div>

        <div className="template-results-summary">
          {!cleanSearch ? (
            <span>
              Showing <strong>{categoryList.length}</strong>{" "}
              {getCategoryLabel(tab)} template
              {categoryList.length === 1 ? "" : "s"}.
            </span>
          ) : isShowingCloseMatches ? (
            <span>
              No direct result in <strong>{getCategoryLabel(tab)}</strong>.
              Showing <strong>{closeMatches.length}</strong> closest match
              {closeMatches.length === 1 ? "" : "es"} from all templates.
            </span>
          ) : (
            <span>
              Search results for <strong>“{search}”</strong>:{" "}
              <strong>{list.length}</strong> result
              {list.length === 1 ? "" : "s"}.
            </span>
          )}
        </div>

        {/* Template Grid */}
        <div className="template-grid">
          {list.length === 0 && (
            <div className="template-empty">
              <p>
                No templates found for <strong>“{search || tab}”</strong>.
              </p>

              {search && (
                <button
                  type="button"
                  className="template-empty-clear"
                  onClick={handleClearSearch}
                >
                  Clear search
                </button>
              )}
            </div>
          )}

          {list.map((t) => {
            const livePreviewUrl = getLivePreviewUrl(t);
            const isCurrent = selectedTemplateKey === t.template_key;

            return (
              <div
                key={t.template_key}
                className={`template-card ${isCurrent ? "current" : ""}`}
              >
                <div
                  className="template-preview"
                  role="button"
                  tabIndex={0}
                  title={`Use ${t.name}`}
                  onClick={() => handleUseTemplate(t)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      handleUseTemplate(t);
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
                    <span className={`badge ${isCurrent ? "current" : ""}`}>
                      {isCurrent ? "CURRENT" : "READY"}
                    </span>
                  </div>

                  <p>{t.description || "Professional website template."}</p>

                  <div className="template-tags">
                    <span className="tag">
                      {getCategoryLabel(t.layout_key)}
                    </span>

                    {(t.tags || []).slice(0, 4).map((tag) => (
                      <span key={tag} className="tag">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="template-actions">
                  <button
                    className={`btn primary ${isCurrent ? "current" : ""}`}
                    onClick={() => handleUseTemplate(t)}
                    type="button"
                  >
                    {isCurrent ? "Current Template" : "Use this template"}
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