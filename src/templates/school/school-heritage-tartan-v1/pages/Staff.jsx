import React from "react";
import BuilderSectionTarget from "../../../../builder/BuilderSectionTarget";
import StaffGrid from "../components/staff/StaffGrid";
import SGB from "../components/governance/SGB";

function findSectionByKeys(sections = [], keys = []) {
  const acceptedKeys = new Set(keys.filter(Boolean));

  return (
    (Array.isArray(sections) ? sections : []).find((section) =>
      acceptedKeys.has(
        section?.section_key ||
          section?.key ||
          section?.content?.section_key ||
          section?.content?._section_key,
      ),
    ) || null
  );
}

function findSectionByTypes(sections = [], types = []) {
  const acceptedTypes = new Set(
    types.map((type) =>
      String(type || "")
        .trim()
        .toLowerCase()
        .replace(/[\s-]+/g, "_"),
    ),
  );

  return (
    (Array.isArray(sections) ? sections : []).find((section) =>
      acceptedTypes.has(
        String(section?.type || section?.section_type || section?.content?._editor_section_type || section?.content?.section_type || "")
          .trim()
          .toLowerCase()
          .replace(/[\s-]+/g, "_"),
      ),
    ) || null
  );
}

function sectionContent(section) {
  return section?.content && typeof section.content === "object"
    ? section.content
    : {};
}

function canRenderSection(section, builderMode) {
  if (!section) return true;

  return builderMode || section.visible !== false;
}

function EditableSection({
  section,
  sectionType,
  label,
  builderMode,
  children,
}) {
  if (!section && !builderMode) {
    return children;
  }

  return (
    <BuilderSectionTarget
      builderMode={builderMode}
      section={section}
      sectionType={sectionType}
      label={label}
      templateCategory="school"
      templateKey="school-heritage-tartan-v1"
    >
      {children}
    </BuilderSectionTarget>
  );
}

export default function Staff({
  settings = {},
  sections = [],
  builderMode = false,
}) {
  const staffSection =
    findSectionByKeys(sections, ["staff-team"]) ||
    findSectionByTypes(sections, ["school_staff", "staff", "staff_team", "team"]);

  /*
    The SGB block remains at the bottom of the Staff page as before.
    When an embedded SGB section record is available for this page, it is
    editable independently without changing the existing page structure.
  */
  const sgbSection =
    findSectionByKeys(sections, ["staff-sgb-team", "sgb-team"]) ||
    findSectionByTypes(sections, ["school_sgb", "sgb", "governance", "school_governance"]);

  const staffContent = sectionContent(staffSection);
  const sgbContent = sectionContent(sgbSection);

  return (
    <main>
      {/* Staff Section */}
      {canRenderSection(staffSection, builderMode) && (
        <EditableSection
          section={staffSection}
          sectionType="school_staff"
          label={staffContent?.section_title || staffContent?.title || "Staff Members"}
          builderMode={builderMode}
        >
          <StaffGrid
            settings={settings}
            content={staffContent}
          />
        </EditableSection>
      )}

      {/* SGB Section (bottom of same page) */}
      {canRenderSection(sgbSection, builderMode) && (
        <EditableSection
          section={sgbSection}
          sectionType="school_sgb"
          label={sgbContent?.section_title || sgbContent?.title || "School Governing Body"}
          builderMode={builderMode}
        >
          <SGB
            settings={settings}
            content={sgbContent}
          />
        </EditableSection>
      )}
    </main>
  );
}
