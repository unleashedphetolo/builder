import React from "react";
import LatestNews from "../components/home/LatestNews";

export default function News() {
  return (
    <div className="container" style={{ paddingTop: 10 }}>
      <h2 className="section-title">Latest News</h2>
      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 20 }}>
        <LatestNews />
      </div>
    </div>
  );
}
