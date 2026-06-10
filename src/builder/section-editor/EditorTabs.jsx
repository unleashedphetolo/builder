export default function EditorTabs({ tabs = [], activeTab = "content", onChange }) {
  return (
    <nav className="bse-tabs" aria-label="Section editor tabs">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          className={`bse-tab ${activeTab === tab.id ? "is-active" : ""}`}
          onClick={() => onChange?.(tab.id)}
        >
          <span aria-hidden="true">{tab.icon || "◇"}</span>
          {tab.label}
        </button>
      ))}
    </nav>
  );
}
