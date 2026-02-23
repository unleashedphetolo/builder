import "../styles/builderRightPanel.css";


export default function BuilderRightPanel({ selectedSection }) {
  return (
    <aside className="builder-right">

      <h4>Properties</h4>

      {selectedSection ? (
        <>
          <label>Section Name</label>
          <input value={selectedSection} readOnly />

          <label>Background</label>
          <input type="color" />

          <label>Text</label>
          <textarea placeholder="Edit content..." />
        </>
      ) : (
        <p>Select a section to edit</p>
      )}

    </aside>
  );
}