import React from "react";
import BuilderSectionTarget from "../../../../builder/BuilderSectionTarget";
import AboutSection from "../components/home/AboutSection";
import Card from "../components/common/Card";
import Button from "../components/common/Button";

const DEFAULT_LINK_CARDS = [
  {
    id: "who-we-are",
    title: "Who We Are",
    body:
      "Our identity, community, leadership and what makes Sebone a trusted school.",
    href: "/about/who-we-are",
  },
  {
    id: "vision-mission",
    title: "Vision & Mission",
    body: "The purpose that guides how we teach, lead and grow learners.",
    href: "/about/vision-mission",
  },
  {
    id: "history",
    title: "Our History",
    body: "The journey of our school and how we built a culture of excellence.",
    href: "/about/history",
  },
];

function buildSiteHref(siteId, path = "") {
  const clean = path ? `/${String(path).replace(/^\/+/, "")}` : "";
  return `/#/site/${siteId || ""}${clean}`;
}

function findSectionByKey(sections = [], sectionKey = "") {
  return (
    (Array.isArray(sections) ? sections : []).find(
      (section) =>
        section?.section_key === sectionKey ||
        section?.key === sectionKey ||
        section?.content?.section_key === sectionKey ||
        section?.content?._section_key === sectionKey,
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
      templateKey="school-modern-v1"
    >
      {children}
    </BuilderSectionTarget>
  );
}

export default function AboutLanding({
  settings = {},
  sections = [],
  builderMode = false,
}) {
  const siteId = settings?.site_id || "";

  const overviewSection =
    findSectionByKey(sections, "about-introduction") || null;

  const valuesSection =
    findSectionByKey(sections, "about-values") || null;

  const overviewContent = sectionContent(overviewSection);
  const valuesContent = sectionContent(valuesSection);

  const linkCards =
    Array.isArray(overviewContent?.link_cards) &&
    overviewContent.link_cards.length > 0
      ? overviewContent.link_cards
      : DEFAULT_LINK_CARDS;

  return (
    <div className="container" style={{ paddingTop: 28, paddingBottom: 40 }}>
      {canRenderSection(valuesSection, builderMode) && (
        <EditableSection
          section={valuesSection}
          sectionType="school_about_values"
          label={valuesContent?.section_title || valuesContent?.title || "Vision, Mission & Values"}
          builderMode={builderMode}
        >
          <h2 className="section-title">
            {valuesContent?.page_title ||
              "About M.O.M Sebone Secondary School"}
          </h2>

          <AboutSection settings={settings} content={valuesContent} />
        </EditableSection>
      )}

      {canRenderSection(overviewSection, builderMode) && (
        <EditableSection
          section={overviewSection}
          sectionType="school_about_landing"
          label={overviewContent?.section_title || overviewContent?.title || "About Page Links"}
          builderMode={builderMode}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: 16,
            }}
          >
            {linkCards.map((card, index) => (
              <Card key={card.id || `${card.title || "about-link"}-${index}`}>
                <h3 style={{ marginBottom: 8 }}>
                  {card.title || ""}
                </h3>
                <p style={{ opacity: 0.85, marginBottom: 12 }}>
                  {card.body || ""}
                </p>
                <Button
                  to={buildSiteHref(siteId, card.href || "/")}
                  variant="outline"
                >
                  {card.button_label || "Read more"}
                </Button>
              </Card>
            ))}
          </div>

          <div style={{ marginTop: 20 }}>
            <p style={{ opacity: 0.85 }}>
              {overviewContent?.footer_prefix ||
                "Looking for staff and governance? Visit"}{" "}
              <a href={buildSiteHref(siteId, "/staff")}>
                {overviewContent?.staff_label || "Staff"}
              </a>{" "}
              {overviewContent?.footer_joiner || "and"}{" "}
              <a href={buildSiteHref(siteId, "/sgb")}>
                {overviewContent?.sgb_label || "SGB"}
              </a>
              .
            </p>
          </div>
        </EditableSection>
      )}
    </div>
  );
}
