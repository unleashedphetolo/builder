import { useState } from "react";
import BuilderNavbar from "./BuilderNavbar";
import BuilderSidebar from "./BuilderSidebar";
import BuilderCanvas from "./BuilderCanvas";
import BuilderRightPanel from "./BuilderRightPanel";
import "../styles/builder.css";

export default function Builder() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedSection, setSelectedSection] = useState(null);

  return (
    <div className="builder-container">

      <BuilderNavbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

      <div className="builder-body">

        {sidebarOpen && (
          <BuilderSidebar setSelectedSection={setSelectedSection} />
        )}

        <BuilderCanvas selectedSection={selectedSection} />

        <BuilderRightPanel selectedSection={selectedSection} />

      </div>
    </div>
  );
}