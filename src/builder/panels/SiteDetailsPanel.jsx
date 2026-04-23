export default function SiteDetailsPanel({
  siteSettings = {},
  onUpdateSettings,
}) {
  const update = async (key, value) => {
    const patch = {
      [key]: value,
    };

    if (onUpdateSettings) {
      await onUpdateSettings(patch);
    }
  };

  return (
    <div className="section-block">
      <h4>Site Details</h4>

      <div className="field">
        <label>Site Name</label>
        <input
          value={siteSettings.site_name || ""}
          onChange={(e) => update("site_name", e.target.value)}
          placeholder="Enter site name"
        />
      </div>

      <div className="field">
        <label>Tagline / Slogan</label>
        <input
          value={siteSettings.tagline || ""}
          onChange={(e) => update("tagline", e.target.value)}
          placeholder="Enter tagline or slogan"
        />
      </div>

      <div className="field">
        <label>Change Logo</label>
        <input
          value={siteSettings.logo_url || ""}
          onChange={(e) => update("logo_url", e.target.value)}
          placeholder="https://example.com/logo.png"
        />
      </div>

      <div className="field">
        <label>Official Email</label>
        <input
          type="email"
          value={siteSettings.email || ""}
          onChange={(e) => update("email", e.target.value)}
          placeholder="info@example.com"
        />
      </div>

      <div className="field">
        <label>Official Phone</label>
        <input
          value={siteSettings.phone || ""}
          onChange={(e) => update("phone", e.target.value)}
          placeholder="+27 ..."
        />
      </div>
    </div>
  );
}