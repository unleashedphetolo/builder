import React from "react";
import BuilderSectionTarget from "../../../../../builder/BuilderSectionTarget";

export default function EditableBusinessSection({
  section,
  sectionType,
  label,
  builderMode,
  templateKey,
  children,
}) {
  if (!section) return children;

  return (
    <BuilderSectionTarget
      builderMode={builderMode}
      section={section}
      sectionType={sectionType || section.type}
      label={label}
      templateCategory="business"
      templateKey={templateKey}
    >
      {children}
    </BuilderSectionTarget>
  );
}
