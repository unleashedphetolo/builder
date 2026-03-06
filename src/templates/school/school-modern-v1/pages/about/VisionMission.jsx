import React from "react";
import AboutSection from "../../components/home/AboutSection";
import Breadcrumbs from "../../components/common/Breadcrumbs";

export default function VisionMission() {
  return (
    <section className="container" style={{ paddingTop: 10, paddingBottom: 40 }}>
      <Breadcrumbs />
      <h2 className="section-title">Vision & Mission</h2>
      <AboutSection />
    </section>
  );
}
