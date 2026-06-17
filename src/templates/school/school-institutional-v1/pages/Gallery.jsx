import React from "react";
import BuilderSectionTarget from "../../../../builder/BuilderSectionTarget";
import PhotoGallery from "../components/gallery/PhotoGallery";
import WallOfFame from "../components/home/WallOfFame";

function findSection(sections = [], sectionKey = "") {
  if (!Array.isArray(sections)) return null;

  return sections.find((item) => item?.section_key === sectionKey ||
        item?.key === sectionKey ||
        item?.content?.section_key === sectionKey ||
        item?.content?._section_key === sectionKey,
    ) || null;
}

export default function Gallery({
  settings = {},
  section = null,
  content = {},
  sections = [],
  builderMode = false,
}) {
  const gallerySection = findSection(sections, "gallery-main") || section;

  const galleryContent =
    gallerySection?.content && typeof gallerySection.content === "object"
      ? gallerySection.content
      : content || {};

  const wallOfFameSection = findSection(sections, "gallery-wall-of-fame");

  const wallOfFameContent =
    wallOfFameSection?.content && typeof wallOfFameSection.content === "object"
      ? wallOfFameSection.content
      : {};

  const photoGalleryContent = (
    <>
      <h2 className="section-title">
        {galleryContent?.section_title || "Photo Gallery"}
      </h2>

      <PhotoGallery
        settings={settings}
        content={galleryContent}
      />
    </>
  );

  return (
    <div className="container" style={{ paddingTop: 10 }}>
      {gallerySection ? (
        <BuilderSectionTarget
          builderMode={builderMode}
          section={gallerySection}
          sectionType="school_gallery"
          label={galleryContent?.section_title || "Photo Gallery"}
          templateCategory="school"
          templateKey="school-institutional-v1"
        >
          {photoGalleryContent}
        </BuilderSectionTarget>
      ) : (
        photoGalleryContent
      )}

      <div style={{ marginTop: 30 }}>
        <WallOfFame
          settings={settings}
          section={wallOfFameSection}
          content={wallOfFameContent}
          builderMode={builderMode}
        />
      </div>
    </div>
  );
}
