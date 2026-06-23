import React from "react";
import BuilderSectionTarget from "../../../../../builder/BuilderSectionTarget";

export default function EditablePortfolioSection({
  children,
  section,
  sectionType,
  label,
  builderMode = false,
  className = "",
  as = "section",
}) {
  return (
    <BuilderSectionTarget
      as={as}
      builderMode={builderMode}
      enabled={builderMode}
      section={section}
      sectionType={sectionType}
      label={label}
      templateCategory="portfolio"
      className={className}
      editButtonLabel="Edit"
    >
      {children}
    </BuilderSectionTarget>
  );
}
