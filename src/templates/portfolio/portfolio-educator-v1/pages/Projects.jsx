import React from "react";
import PageHeader from "../components/common/PageHeader";
import ProjectsSection from "../components/sections/ProjectsSection";
import TestimonialsSection from "../components/sections/TestimonialsSection";
import ContactSection from "../components/sections/ContactSection";

export default function Projects({ data, builderMode }) {
  return (
    <>
      <PageHeader title="Projects" subtitle="A focused collection of selected work, case studies and client-ready outcomes." />
      <ProjectsSection data={data} builderMode={builderMode} />
      <TestimonialsSection data={data} />
      <ContactSection data={data} />
    </>
  );
}
