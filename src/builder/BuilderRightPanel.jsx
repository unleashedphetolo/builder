import "../styles/builderRightPanel.css";

export default function BuilderRightPanel({
  selectedSection,
  updateSection,
  deleteSection,
}) {
  if (!selectedSection) {
    return (
      <aside className="builder-right">
        <p>Select a section to edit</p>
      </aside>
    );
  }

  return (
    <aside className="builder-right">
      <h4>Section Properties</h4>

      <label>Section ID</label>
      <input value={selectedSection.id} readOnly />
      <label>Upload Logo</label>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files[0];
          if (!file) return;

          const reader = new FileReader();
          reader.onloadend = () => {
            updateSection("logoUrl", reader.result);
          };
          reader.readAsDataURL(file);
        }}
      />
      <label>Title</label>
      <input
        value={selectedSection.content?.title || ""}
        onChange={(e) => updateSection("title", e.target.value)}
      />

      <label>Description</label>
      <textarea
        value={selectedSection.content?.text || ""}
        onChange={(e) => updateSection("text", e.target.value)}
      />

      <label>Background Color</label>
      <input
        type="color"
        value={selectedSection.styles?.background || "#ffffff"}
        onChange={(e) => updateSection("background", e.target.value)}
      />

      <label>Padding</label>
      <input
        type="range"
        min="0"
        max="100"
        value={selectedSection.styles?.padding || 40}
        onChange={(e) => updateSection("padding", e.target.value)}
      />

      <button
        className="delete-btn"
        onClick={() => deleteSection(selectedSection.id)}
      >
        Delete Section
      </button>
    </aside>
  );
}
