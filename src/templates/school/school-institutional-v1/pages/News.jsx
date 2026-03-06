import React from "react";
import LatestNews from "../components/home/LatestNews";
import Breadcrumbs from "../components/common/Breadcrumbs";
// import QuickLinks from "../components/home/QuickLinks";

export default function News() {
  return (
    <div className="container" style={{ paddingTop: 10 }}>
      <Breadcrumbs />
      <h2 className="section-title">Latest News</h2>
      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 20 }}>
        <LatestNews />
        {/* <QuickLinks /> */}
      </div>
    </div>
  );
}
