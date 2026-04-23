export default function ColorsPanel({
  siteSettings = {},
  onChange,
}) {
  const update = (key, value) => {
    onChange?.({ [key]: value });
  };

  return (
    <div className="panel-shell">
      <div className="panel-header">
        <h3>Website Colors</h3>
        <p>Set primary, secondary and background colors.</p>
      </div>

      <div className="field">
        <label>Primary Color</label>
        <input
          type="color"
          value={siteSettings?.primary_color || "#1e40af"}
          onChange={(e) => update("primary_color", e.target.value)}
        />
      </div>

      <div className="field">
        <label>Secondary Color</label>
        <input
          type="color"
          value={siteSettings?.secondary_color || "#0f172a"}
          onChange={(e) => update("secondary_color", e.target.value)}
        />
      </div>

      <div className="field">
        <label>Background Color</label>
        <input
          type="color"
          value={siteSettings?.background_color || "#ffffff"}
          onChange={(e) => update("background_color", e.target.value)}
        />
      </div>
    </div>
  );
}
