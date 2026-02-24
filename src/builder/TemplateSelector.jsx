import "../styles/templateSelector.css";

export default function TemplateSelector({ onSelect }) {
  return (
    <div className="template-modal">
      <h2>Choose Your Template</h2>

      <div className="template-grid">
        <div onClick={() => onSelect("school")} className="template-card">
          🏫 School Layout
        </div>

        <div onClick={() => onSelect("business")} className="template-card">
          🏢 Business Layout
        </div>

        <div onClick={() => onSelect("portfolio")} className="template-card">
          🎨 Portfolio Layout
        </div>
      </div>
    </div>
  );
}