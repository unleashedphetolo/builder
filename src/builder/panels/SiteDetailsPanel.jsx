import { useEffect, useState } from "react";

export default function SiteDetailsPanel({
  siteSettings = {},
  onUpdateSettings,
}) {
  const [localSettings, setLocalSettings] = useState(siteSettings || {});

  useEffect(() => {
    setLocalSettings(siteSettings || {});
  }, [siteSettings]);

  const update = async (key, value) => {
    const nextSettings = {
      ...(localSettings || {}),
      [key]: value,
    };

    setLocalSettings(nextSettings);

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
          value={localSettings.site_name || ""}
          onChange={(e) => update("site_name", e.target.value)}
          placeholder="Enter site name"
        />
      </div>

      <div className="field">
        <label>Tagline / Slogan</label>
        <input
          value={localSettings.tagline || ""}
          onChange={(e) => update("tagline", e.target.value)}
          placeholder="Enter tagline or slogan"
        />
      </div>

      <div className="field">
        <label>Change Logo</label>
        <input
          value={localSettings.logo_url || ""}
          onChange={(e) => update("logo_url", e.target.value)}
          placeholder="https://example.com/logo.png"
        />
      </div>

      <div className="field">
        <label>Official Email</label>
        <input
          type="email"
          value={localSettings.email || ""}
          onChange={(e) => update("email", e.target.value)}
          placeholder="info@example.com"
        />
      </div>

      <div className="field">
        <label>Official Phone</label>
        <input
          value={localSettings.phone || ""}
          onChange={(e) => update("phone", e.target.value)}
          placeholder="+27 ..."
        />
      </div>
    </div>
  );
}
