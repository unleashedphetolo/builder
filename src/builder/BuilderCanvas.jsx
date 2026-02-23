import SchoolLayout from "../templates/layouts/SchoolLayout";
import BusinessLayout from "../templates/layouts/BusinessLayout";
import PortfolioLayout from "../templates/layouts/PortfolioLayout";
import "../styles/builderCanvas.css";


export default function BuilderCanvas({ selectedSection }) {
  const layout = "school"; // 🔥 later from DB

  const renderLayout = (children) => {
    switch (layout) {
      case "business":
        return <BusinessLayout>{children}</BusinessLayout>;
      case "portfolio":
        return <PortfolioLayout>{children}</PortfolioLayout>;
      default:
        return <SchoolLayout>{children}</SchoolLayout>;
    }
  };

  return (
    <div className="builder-canvas">
      <div className="canvas-inner">

        {renderLayout(
          <div className="placeholder-content">
            <h2>Live Website Preview</h2>
            <p>Selected: {selectedSection || "None"}</p>
          </div>
        )}

      </div>
    </div>
  );
}