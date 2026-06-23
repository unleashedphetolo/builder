import React from "react";
import HeroSlider from "../components/home/HeroSlider";
import ProfileSection from "../components/sections/ProfileSection";
import SkillsSection from "../components/sections/SkillsSection";
import ProjectsSection from "../components/sections/ProjectsSection";
import ServicesSection from "../components/sections/ServicesSection";
import ExperienceSection from "../components/sections/ExperienceSection";
import TestimonialsSection from "../components/sections/TestimonialsSection";
import ContactSection from "../components/sections/ContactSection";

export default function Home({ settings, data, builderMode }) {
  return (
    <>
      <HeroSlider settings={settings} data={data} builderMode={builderMode} />
      <ProfileSection data={data} builderMode={builderMode} />
      <SkillsSection data={data} builderMode={builderMode} />
      <ProjectsSection data={data} builderMode={builderMode} />
      <ServicesSection data={data} />
      <ExperienceSection data={data} builderMode={builderMode} />
      <TestimonialsSection data={data} />
      <ContactSection data={data} />
    </>
  );
}
