import { useState, useEffect } from "react";
import BuilderNavbar from "./BuilderNavbar";
import BuilderSidebar from "./BuilderSidebar";
import BuilderCanvas from "./BuilderCanvas";
import BuilderRightPanel from "./BuilderRightPanel";
import TemplateSelector from "./TemplateSelector";
import { supabase } from "../supabase/Client";
import "../styles/builder.css";

export default function Builder() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedSection, setSelectedSection] = useState(null);

  const [layout, setLayout] = useState(null);
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);

  useEffect(() => {
    async function loadTemplate() {
      const { data, error } = await supabase
        .from("site_settings")
        .select("template")
        .single();

      if (error || !data?.template) {
        setShowTemplateSelector(true);
      } else {
        setLayout(data.template);
      }
    }

    loadTemplate();
  }, []);

  const handleTemplateSelect = async (template) => {
    await supabase.from("site_settings").update({ template });
    setLayout(template);
    setShowTemplateSelector(false);
  };
//   const [siteSettings, setSiteSettings] = useState({
//   schoolName: "Greenfield Academy",
//   slogan: "Inspiring Excellence. Empowering Futures.",
//   logoUrl: null
// });

// const updateSiteSetting = (key, value) => {
//   setSiteSettings((prev) => ({
//     ...prev,
//     [key]: value
//   }));
// };

  return (
    <div className="builder-container">
      {/* 🔥 Template Selector Modal */}
      {showTemplateSelector && (
        <TemplateSelector onSelect={handleTemplateSelect} />
      )}

      {/* <BuilderNavbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} /> */}
      <BuilderNavbar
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        onPreview={() => window.open("/site", "_blank")}
        onPublish={() => console.log("Publishing...")}
        onChangeTemplate={() => setShowTemplateSelector(true)}
        saveStatus="All changes saved"
      />

      <div className="builder-body">
        {sidebarOpen && (
          <BuilderSidebar setSelectedSection={setSelectedSection} />
        )}

        {/* 🔥 Pass layout */}
        <BuilderCanvas selectedSection={selectedSection} layout={layout} />

        <BuilderRightPanel selectedSection={selectedSection} />
      </div>
    </div>
  );
}
