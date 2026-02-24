import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "./supabase/Client";

import Builder from "./builder/Builder";

import SchoolLayout from "./templates/layouts/SchoolLayout";
import BusinessLayout from "./templates/layouts/BusinessLayout";
import PortfolioLayout from "./templates/layouts/PortfolioLayout";

// Temporary pages
const Home = () => <div style={{ padding: 40 }}>Home Page</div>;
const WhoWeAre = () => <div style={{ padding: 40 }}>Who We Are</div>;

export default function App() {
  const [layout, setLayout] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTemplate() {
      const { data, error } = await supabase
        .from("site_settings")
        .select("template")
        .single();

      if (!error && data?.template) {
        setLayout(data.template);
      }

      setLoading(false);
    }

    loadTemplate();
  }, []);

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

  if (loading) return null; // or loader spinner

  return (
    <BrowserRouter>
      <Routes>

        {/* 🔥 Builder */}
        <Route path="/" element={<Builder />} />

        {/* 🔥 Public Website */}
        <Route
          path="/site"
          element={renderLayout(<Home />)}
        />

        <Route
          path="/site/about/who-we-are"
          element={renderLayout(<WhoWeAre />)}
        />

      </Routes>
    </BrowserRouter>
  );
}