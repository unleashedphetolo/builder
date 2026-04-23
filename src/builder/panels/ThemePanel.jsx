const THEME_OPTIONS = [
  { key: "mars", label: "Mars" },
  { key: "venus", label: "Venus" },
  { key: "jupiter", label: "Jupiter" },
  { key: "saturn", label: "Saturn" },
  { key: "moon", label: "Moon" },
  { key: "orbit", label: "Orbit" },
];

export default function ThemePanel({
  themeName = "mars",
  themeMode = "light",
  onChange,
}) {
  return (
    <div className="panel-shell">
      <div className="panel-header">
        <h3>Website Themes</h3>
        <p>Switch theme styling and light or dark mode.</p>
      </div>

      <div className="theme-grid">
        {THEME_OPTIONS.map((theme) => (
          <button
            key={theme.key}
            type="button"
            className={`theme-card ${themeName === theme.key ? "active" : ""}`}
            onClick={() => onChange?.({ theme_name: theme.key })}
          >
            {theme.label}
          </button>
        ))}
      </div>

      <div className="field">
        <label>Theme Mode</label>
        <select
          value={themeMode}
          onChange={(e) => onChange?.({ theme_mode: e.target.value })}
        >
          <option value="light">Light Theme</option>
          <option value="dark">Dark Theme</option>
        </select>
      </div>
    </div>
  );
}
