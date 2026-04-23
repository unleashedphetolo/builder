export default function TemplatePanel({
  layoutKey = "school",
  templates = [],
  selectedTemplateKey,
  onSelectTemplate,
}) {
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
          const active = selectedTemplateKey === template.template_key;

          return (
            <button
              key={template.template_key}
              type="button"
              className={`template-option ${active ? "active" : ""}`}
              onClick={() => onSelectTemplate?.(template)}
            >
              <div>
                <strong>{template.name}</strong>
                <p>{template.description}</p>
              </div>
              <span>{active ? "Selected" : "Use"}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
