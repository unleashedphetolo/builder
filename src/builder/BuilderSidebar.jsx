import { useState } from "react";
import "../styles/builderSidebar.css";

const SECTION_LIBRARY = [
  { id: "hero", label: "Hero Section" },
  { id: "about", label: "About Section" },
  { id: "gallery", label: "Gallery Section" },
  { id: "contact", label: "Contact Section" },
  { id: "cta", label: "Call To Action" },
];

export default function BuilderSidebar({
  pages,
  currentPage,
  setCurrentPage,
  addSection
}) {
  const [activeTab, setActiveTab] = useState("sections");

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
      </div>

      {/* Pages Panel */}
      {activeTab === "pages" && (
        <div className="sidebar-content">
          <h4>Website Pages</h4>

          {pages.map((page) => (
            <div
              key={page}
              className={`page-item ${currentPage === page ? "active" : ""}`}
              onClick={() => setCurrentPage(page)}
            >
              {page}
            </div>
          ))}

          <button className="add-page-btn">
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
              onDragStart={(e) =>
                e.dataTransfer.setData("sectionType", section.id)
              }
              onClick={() => addSection(section.id)}
            >
              {section.label}
            </div>
          ))}
        </div>
      )}

    </aside>
  );
}