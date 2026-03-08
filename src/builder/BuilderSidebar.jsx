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
  { id: "news", label: "News Section" },
  { id: "notices", label: "Notices Section" },
  { id: "events", label: "Events Section" },
  { id: "calendar", label: "Calendar Section" },
];

const SOCIALS = ["facebook", "x", "instagram", "youtube", "tiktok", "linkedin", "whatsapp"];

export default function BuilderSidebar({
  pages,
  currentPage,
  currentPageData,
  setCurrentPage,
  addSection,
  siteSettings,
  onUpdateSettings,
  selectedItem,
  selectedSection,
  onSelectItem,
  onUpdateSection,
  onDeleteSection,
  onUpdatePage,
  onUpdatePageContent,
}) {
  const [activeTab, setActiveTab] = useState("pages");

  const socialLinks = useMemo(() => siteSettings?.social_links || {}, [siteSettings]);
  const socialDisplay = useMemo(() => siteSettings?.social_display || {}, [siteSettings]);
  const pageContent = useMemo(() => currentPageData?.content || {}, [currentPageData]);

  const sectionTitle = selectedSection?.content?.title || "";
  const sectionSubtitle = selectedSection?.content?.subtitle || "";

  const isSectionSelected = selectedItem?.kind === "section";

  return (
    <aside className="builder-sidebar">
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

      {activeTab === "pages" && (
        <div className="sidebar-content">
          <h4>Website Pages</h4>

          {pages.map((page) => (
            <div
              key={page.id}
              className={`page-item ${currentPage === page.id ? "active" : ""}`}
              onClick={() => {
                setCurrentPage(page.id);
                onSelectItem({ kind: "page", id: page.id });
              }}
            >
              {page.title}
            </div>
          ))}

          <button className="add-page-btn" disabled title="Coming soon">
            + Add Page
          </button>

          <div className="sidebar-divider" />

          <h4>Page Properties</h4>

          {!currentPageData ? (
            <p className="muted">Select a page to edit it.</p>
          ) : (
            <div className="panel-card">
              <div className="panel-group">
                <label>Page Title</label>
                <input
                  value={currentPageData.title || ""}
                  onChange={(e) => onUpdatePage({ title: e.target.value })}
                  placeholder="Page title"
                />
              </div>

              <div className="panel-group">
                <label>Slug</label>
                <input
                  value={currentPageData.slug || ""}
                  onChange={(e) => onUpdatePage({ slug: e.target.value })}
                  placeholder="/page-slug"
                />
              </div>

              <div className="panel-group">
                <label style={checkboxRow}>
                  <input
                    type="checkbox"
                    checked={currentPageData.is_visible ?? true}
                    onChange={(e) => onUpdatePage({ is_visible: e.target.checked })}
                  />
                  Show page
                </label>
              </div>

              <div className="panel-group">
                <label style={checkboxRow}>
                  <input
                    type="checkbox"
                    checked={currentPageData.is_published ?? true}
                    onChange={(e) => onUpdatePage({ is_published: e.target.checked })}
                  />
                  Published
                </label>
              </div>

              <div className="sidebar-divider" />

              <h4>Page Content</h4>

              <div className="panel-group">
                <label>Hero Title</label>
                <input
                  value={pageContent.heroTitle || ""}
                  onChange={(e) => onUpdatePageContent("heroTitle", e.target.value)}
                  placeholder="Hero title"
                />
              </div>

              <div className="panel-group">
                <label>Hero Subtitle</label>
                <textarea
                  rows={4}
                  value={pageContent.heroSubtitle || ""}
                  onChange={(e) => onUpdatePageContent("heroSubtitle", e.target.value)}
                  placeholder="Hero subtitle"
                />
              </div>

              <div className="panel-group">
                <label>Intro Text</label>
                <textarea
                  rows={5}
                  value={pageContent.introText || ""}
                  onChange={(e) => onUpdatePageContent("introText", e.target.value)}
                  placeholder="Intro text"
                />
              </div>

              <div className="panel-group">
                <label>Banner Image URL</label>
                <input
                  value={pageContent.bannerImage || ""}
                  onChange={(e) => onUpdatePageContent("bannerImage", e.target.value)}
                  placeholder="https://..."
                />
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === "sections" && (
        <div className="sidebar-content">
          <h4>Section Library</h4>

          {SECTION_LIBRARY.map((section) => (
            <div
              key={section.id}
              className="section-item"
              onClick={() => addSection(section.id)}
              title="Click to add"
            >
              {section.label}
            </div>
          ))}

          <div className="sidebar-divider" />

          <h4>Section Properties</h4>

          {!isSectionSelected || !selectedSection ? (
            <p className="muted">Click a visible block in the preview to edit it.</p>
          ) : (
            <div className="panel-card">
              <div className="panel-group">
                <label>Section Type</label>
                <div className="pill">{selectedSection.type}</div>
              </div>

              <div className="panel-group">
                <label>Title</label>
                <input
                  value={sectionTitle}
                  onChange={(e) => onUpdateSection("content.title", e.target.value)}
                  placeholder="Title"
                />
              </div>

              <div className="panel-group">
                <label>Subtitle</label>
                <textarea
                  value={sectionSubtitle}
                  onChange={(e) => onUpdateSection("content.subtitle", e.target.value)}
                  placeholder="Subtitle"
                  rows={4}
                />
              </div>

              <div className="panel-group danger">
                <button
                  className="danger-btn"
                  onClick={() => onDeleteSection(selectedSection.id)}
                >
                  Delete section
                </button>
              </div>
            </div>
          )}
        </div>
      )}

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

          <h4 style={{ marginTop: 18 }}>Social</h4>

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

                <label style={{ display: "flex", gap: 8, alignItems: "center", fontSize: 12 }}>
                  <input
                    type="checkbox"
                    checked={socialDisplay?.[key] ?? true}
                    onChange={(e) =>
                      onUpdateSettings?.({
                        social_display: {
                          ...socialDisplay,
                          [key]: e.target.checked,
                        },
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
                    social_links: {
                      ...socialLinks,
                      [key]: e.target.value,
                    },
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

const labelStyle = {
  display: "block",
  fontSize: 12,
  opacity: 0.8,
  marginBottom: 6,
};

const checkboxRow = {
  display: "flex",
  alignItems: "center",
  gap: 8,
  fontSize: 14,
};