import { useMemo, useState } from "react";
import "../styles/builderSidebar.css";

const SECTION_LIBRARY = [
  { id: "hero", label: "Hero Section" },
  { id: "quick-links", label: "Quick Links" },
  { id: "announcements", label: "Announcements" },
  { id: "featured", label: "Featured Cards" },
  { id: "about", label: "About Section" },
  { id: "gallery", label: "Gallery Section" },
  { id: "contact", label: "Contact Section" },
  { id: "cta", label: "Call To Action" },
  { id: "services", label: "Services Section" },
  { id: "pricing", label: "Pricing Section" },
  { id: "projects", label: "Projects Grid" },
  { id: "resume", label: "Resume Section" },
];

const SOCIALS = ["facebook", "x", "instagram", "youtube", "tiktok", "linkedin", "whatsapp"];

export default function BuilderSidebar({
  pages,
  currentPage,
  setCurrentPage,
  addSection,
  siteSettings,
  onUpdateSettings,
}) {
  const [activeTab, setActiveTab] = useState("sections");

  const socialLinks = useMemo(() => siteSettings?.social_links || {}, [siteSettings]);
  const socialDisplay = useMemo(() => siteSettings?.social_display || {}, [siteSettings]);

  return (
    <aside className="builder-sidebar">
      {/* Tabs */}
      <div className="sidebar-tabs">
        <button
          className={activeTab === "pages" ? "active" : ""}
          onClick={() => setActiveTab("pages")}
        >
          Pages
        </button>

        <button
          className={activeTab === "sections" ? "active" : ""}
          onClick={() => setActiveTab("sections")}
        >
          Sections
        </button>

        <button
          className={activeTab === "brand" ? "active" : ""}
          onClick={() => setActiveTab("brand")}
        >
          Brand
        </button>
      </div>

      {/* Pages Panel */}
      {activeTab === "pages" && (
        <div className="sidebar-content">
          <h4>Website Pages</h4>

          {pages.map((page) => (
            <div
              key={page.id}
              className={`page-item ${currentPage === page.id ? "active" : ""}`}
              onClick={() => setCurrentPage(page.id)}
            >
              {page.title}
            </div>
          ))}

          <button className="add-page-btn" disabled title="Coming soon">
            + Add Page
          </button>
        </div>
      )}

      {/* Sections Panel */}
      {activeTab === "sections" && (
        <div className="sidebar-content">
          <h4>Section Library</h4>

          {SECTION_LIBRARY.map((section) => (
            <div
              key={section.id}
              className="section-item"
              draggable
              onDragStart={(e) => e.dataTransfer.setData("sectionType", section.id)}
              onClick={() => addSection(section.id)}
              title="Click to add"
            >
              {section.label}
            </div>
          ))}
        </div>
      )}

      {/* Brand/Topbar/Footer Panel */}
      {activeTab === "brand" && (
        <div className="sidebar-content">
          <h4>Brand & Header</h4>

          <label style={labelStyle}>Site name</label>
          <input
            value={siteSettings?.site_name || ""}
            placeholder="Your School"
            onChange={(e) => onUpdateSettings?.({ site_name: e.target.value })}
            style={inputStyle}
          />

          <label style={labelStyle}>Tagline</label>
          <input
            value={siteSettings?.tagline || ""}
            placeholder="Excellence in Learning"
            onChange={(e) => onUpdateSettings?.({ tagline: e.target.value })}
            style={inputStyle}
          />

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <div>
              <label style={labelStyle}>Primary</label>
              <input
                value={siteSettings?.primary_color || ""}
                placeholder="#1e40af"
                onChange={(e) => onUpdateSettings?.({ primary_color: e.target.value })}
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Secondary</label>
              <input
                value={siteSettings?.secondary_color || ""}
                placeholder="#0f172a"
                onChange={(e) => onUpdateSettings?.({ secondary_color: e.target.value })}
                style={inputStyle}
              />
            </div>
          </div>

          <h4 style={{ marginTop: 18 }}>Topbar contact</h4>
          <input
            value={siteSettings?.email || ""}
            placeholder="info@yourschool.co.za"
            onChange={(e) => onUpdateSettings?.({ email: e.target.value })}
            style={inputStyle}
          />
          <input
            value={siteSettings?.phone || ""}
            placeholder="+27 00 000 0000"
            onChange={(e) => onUpdateSettings?.({ phone: e.target.value })}
            style={inputStyle}
          />
          <input
            value={siteSettings?.address_line1 || ""}
            placeholder="Address line"
            onChange={(e) => onUpdateSettings?.({ address_line1: e.target.value })}
            style={inputStyle}
          />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <input
              value={siteSettings?.city || ""}
              placeholder="City"
              onChange={(e) => onUpdateSettings?.({ city: e.target.value })}
              style={inputStyle}
            />
            <input
              value={siteSettings?.province || ""}
              placeholder="Province"
              onChange={(e) => onUpdateSettings?.({ province: e.target.value })}
              style={inputStyle}
            />
          </div>

          <h4 style={{ marginTop: 18 }}>Social (visible by default)</h4>
          {SOCIALS.map((key) => (
            <div key={key} style={{ marginBottom: 10 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 6,
                }}
              >
                <span style={{ fontSize: 12, opacity: 0.9, textTransform: "capitalize" }}>
                  {key}
                </span>

                <label style={{ display: "flex", gap: 8, alignItems: "center", fontSize: 12, opacity: 0.9 }}>
                  <input
                    type="checkbox"
                    checked={socialDisplay?.[key] ?? true}
                    onChange={(e) =>
                      onUpdateSettings?.({
                        social_display: { ...socialDisplay, [key]: e.target.checked },
                      })
                    }
                  />
                  Show
                </label>
              </div>

              <input
                value={socialLinks?.[key] || ""}
                placeholder={`https://${key}.com/...`}
                onChange={(e) =>
                  onUpdateSettings?.({
                    social_links: { ...socialLinks, [key]: e.target.value },
                  })
                }
                style={inputStyle}
              />
            </div>
          ))}

          <h4 style={{ marginTop: 18 }}>Footer</h4>
          <textarea
            value={siteSettings?.footer_text || ""}
            placeholder="© Your School. All rights reserved."
            onChange={(e) => onUpdateSettings?.({ footer_text: e.target.value })}
            style={{ ...inputStyle, minHeight: 72, resize: "vertical" }}
          />
        </div>
      )}
    </aside>
  );
}

const inputStyle = {
  width: "100%",
  padding: "10px 12px",
  borderRadius: 10,
  border: "1px solid rgba(148,163,184,0.35)",
  background: "rgba(15,23,42,0.35)",
  color: "#e5e7eb",
  outline: "none",
  marginBottom: 10,
};

const labelStyle = { display: "block", fontSize: 12, opacity: 0.8, marginBottom: 6 };
