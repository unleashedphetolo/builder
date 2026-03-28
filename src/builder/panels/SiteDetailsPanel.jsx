import { useBuilderStore } from "../../store/useBuilderStore";

export default function SiteDetailsPanel() {
  const { siteSettings, setSiteSettings } = useBuilderStore();

  const update = (key, value) => {
    setSiteSettings({
      ...siteSettings,
      [key]: value,
    });
  };

  return (
    <div className="section-block">
      <h4>Site Details</h4>

      <div className="field">
        <label>Site Name</label>
        <input
          value={siteSettings.site_name || ""}
          onChange={(e) => update("site_name", e.target.value)}
        />
      </div>

      <div className="field">
        <label>Tagline</label>
        <input
          value={siteSettings.tagline || ""}
          onChange={(e) => update("tagline", e.target.value)}
        />
      </div>

      <div className="field">
        <label>Email</label>
        <input
          value={siteSettings.email || ""}
          onChange={(e) => update("email", e.target.value)}
        />
      </div>

      <div className="field">
        <label>Phone</label>
        <input
          value={siteSettings.phone || ""}
          onChange={(e) => update("phone", e.target.value)}
        />
      </div>
    </div>
  );
}