export default function TemplatePanel({
  layoutKey = "school",
  templates = [],
  templateKey,
  selectedTemplateKey,
  onChangeTemplate,
  onSelectTemplate,
}) {
  const activeTemplateKey = selectedTemplateKey || templateKey;

  const getLivePreviewUrl = (template) => {
    const safeLayoutKey = template.layout_key || layoutKey || "school";
    const safeTemplateKey = template.template_key;

    if (!safeTemplateKey) return "";

    return `#/template-preview/${safeLayoutKey}/${safeTemplateKey}?mini=1`;
  };

  const handleSelectTemplate = (template) => {
    if (onSelectTemplate) {
      onSelectTemplate(template);
    } else if (onChangeTemplate) {
      onChangeTemplate(template.template_key);
    }

    if (window.innerWidth <= 1024) {
      window.dispatchEvent(new CustomEvent("builder:close-sidebar"));
    }
  };

  return (
    <div className="panel-shell">
      <div className="panel-header">
        <h3>Website Template</h3>
        <p>Show templates for the selected category only.</p>
      </div>

      <div className="chip-row">
        <span className="status-chip">Category: {layoutKey}</span>
      </div>

      <div className="template-list">
        {templates.length === 0 && (
          <div className="empty-state">
            <p>No templates available in this category.</p>
          </div>
        )}

        {templates.map((template) => {
          const active = activeTemplateKey === template.template_key;
          const previewUrl = getLivePreviewUrl(template);

          return (
            <button
              key={template.template_key}
              type="button"
              className={`template-option template-option-with-preview ${
                active ? "active" : ""
              }`}
              onClick={() => handleSelectTemplate(template)}
            >
              <div className="template-preview-box">
                {previewUrl ? (
                  <iframe
                    src={previewUrl}
                    title={`${template.name} live preview`}
                    className="template-preview-frame"
                    loading="lazy"
                  />
                ) : (
                  <div className="template-preview-fallback">
                    <span>{template.name?.slice(0, 1) || "T"}</span>
                    <small>Live Preview</small>
                  </div>
                )}
              </div>

              <div className="template-option-content">
                <strong>{template.name}</strong>
                <p>{template.description}</p>
              </div>

              <span className="template-use-pill">
                {active ? "Selected" : "Use"}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
