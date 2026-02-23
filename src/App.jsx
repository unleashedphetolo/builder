import { BrowserRouter, Routes, Route } from "react-router-dom";

import Builder from "./builder/Builder";

import SchoolLayout from "./templates/layouts/SchoolLayout";
import BusinessLayout from "./templates/layouts/BusinessLayout";
import PortfolioLayout from "./templates/layouts/PortfolioLayout";

// Temporary pages
const Home = () => <div style={{ padding: 40 }}>Home Page</div>;
const WhoWeAre = () => <div style={{ padding: 40 }}>Who We Are</div>;

export default function App() {
  const layout = "school"; // 🔥 later from Supabase

  const getLayout = (children) => {
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
    <BrowserRouter>
     <Routes>

  {/* 🔥 Builder becomes default */}
  <Route path="/" element={<Builder />} />

  {/* Public site */}
  <Route
    path="/site/*"
    element={getLayout(
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about/who-we-are" element={<WhoWeAre />} />
      </Routes>
    )}
  />

</Routes>
    </BrowserRouter>
  );
}