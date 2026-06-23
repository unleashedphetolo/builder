import React from "react";
import PageHeader from "../components/common/PageHeader";
import ServicesSection from "../components/sections/ServicesSection";
import SkillsSection from "../components/sections/SkillsSection";
import ContactSection from "../components/sections/ContactSection";

export default function Services({ data, builderMode }) {
  return (
    <>
      <PageHeader title="Services" subtitle="Clear professional services that help clients understand what can be delivered." />
      <ServicesSection data={data} />
      <SkillsSection data={data} builderMode={builderMode} />
      <ContactSection data={data} />
    </>
  );
}
