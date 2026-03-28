import React, { useState } from "react";
import "../styles/builderSidebar.css";
import "../styles/panels.css";

import SiteDetailsPanel from "./panels/SiteDetailsPanel";
import SocialPanel from "./panels/SocialPanel";

export default function BuilderSidebar() {
  const [activeTab, setActiveTab] = useState("site");

  const tabs = [
    { key: "site", label: "Site Details" },
    { key: "social", label: "Social Media" },
  ];

  return (
    <div className="sidebar">
      {/* 🔥 TOP TABS */}
      <div className="sidebar-tabs">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            className={activeTab === tab.key ? "active" : ""}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 🔥 CONTENT */}
      <div className="sidebar-content">
        {activeTab === "site" && <SiteDetailsPanel />}
        {activeTab === "social" && <SocialPanel />}
      </div>
    </div>
  );
}