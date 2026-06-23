import React from "react";
import PageHeader from "../components/common/PageHeader";
import ProfileSection from "../components/sections/ProfileSection";
import ExperienceSection from "../components/sections/ExperienceSection";
import TestimonialsSection from "../components/sections/TestimonialsSection";

export default function About({ data, builderMode }) {
  return (
    <>
      <PageHeader title="About" subtitle="A trusted professional profile with experience, values and proof of delivery." />
      <ProfileSection data={data} builderMode={builderMode} />
      <ExperienceSection data={data} builderMode={builderMode} />
      <TestimonialsSection data={data} />
    </>
  );
}
