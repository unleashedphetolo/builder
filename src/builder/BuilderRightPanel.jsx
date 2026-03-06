import "../styles/builderRightPanel.css";

export default function BuilderRightPanel({
  selectedSection,
  updateSection,
  deleteSection,
}) {
  if (!selectedSection) {
    return (
      <div className="builder-rightpanel">
        <h3>Properties</h3>
        <p className="muted">Select a section to edit its content and styling.</p>
      </div>
    );
  }

  const title = selectedSection.content?.title || "";
  const subtitle = selectedSection.content?.subtitle || "";

  return (
    <div className="builder-rightpanel">
      <h3>Properties</h3>
      <div className="panel-group">
        <label>Section Type</label>
        <div className="pill">{selectedSection.type}</div>
      </div>

      <div className="panel-group">
        <label>Title</label>
        <input
          value={title}
          onChange={(e) => updateSection("content.title", e.target.value)}
          placeholder="Title"
        />
      </div>

      <div className="panel-group">
        <label>Subtitle</label>
        <textarea
          value={subtitle}
          onChange={(e) => updateSection("content.subtitle", e.target.value)}
          placeholder="Subtitle"
          rows={4}
        />
      </div>

      <div className="panel-group danger">
        <button className="danger-btn" onClick={() => deleteSection(selectedSection.id)}>
          Delete section
        </button>
        <p className="muted">If you hide the button in UI, RLS still protects other orgs.</p>
      </div>
    </div>
  );
}
