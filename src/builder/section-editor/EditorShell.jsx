import EditorTabs from "./EditorTabs";

export default function EditorShell({
  enabled = true,
  title = "Edit Section",
  subtitle = "Current Page",
  tabs = [],
  activeTab = "content",
  onTabChange,
  onClose,
  onSave,
  saving = false,
  dirty = false,
  notice = "",
  error = "",
  children,
}) {
  if (!enabled) return null;

  return (
    <aside className="bse-root" aria-label={title}>
      <header className="bse-header">
        <div>
          <p className="bse-eyebrow">Section Editor</p>
          <h2>{title}</h2>
          <small>{subtitle}</small>
        </div>

        <button
          type="button"
          className="bse-icon-button"
          aria-label="Close editor"
          onClick={onClose}
        >
          ×
        </button>
      </header>

      <EditorTabs tabs={tabs} activeTab={activeTab} onChange={onTabChange} />

      <div className="bse-scroll">
        {notice && <p className="bse-notice">{notice}</p>}
        {error && <p className="bse-error">{error}</p>}
        {children}
      </div>

      <footer className="bse-footer">
        <button type="button" className="bse-secondary-button" onClick={onClose}>
          Cancel
        </button>
        <button
          type="button"
          className="bse-primary-button"
          disabled={saving || !dirty}
          onClick={onSave}
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </footer>
    </aside>
  );
}
