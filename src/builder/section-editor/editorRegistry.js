import schoolEditorRegistry from "./categories/school/schoolEditorRegistry";
import businessEditorRegistry from "./categories/business/businessEditorRegistry";
import portfolioEditorRegistry from "./categories/portfolio/portfolioEditorRegistry";
import agricultureEditorRegistry from "./categories/agriculture/agricultureEditorRegistry";
import technologyEditorRegistry from "./categories/technology/technologyEditorRegistry";
import constructionEditorRegistry from "./categories/construction/constructionEditorRegistry";

import GalleryEditor from "./shared/editors/GalleryEditor";
import PartnersEditor from "./shared/editors/PartnersEditor";
import NewsEditor from "./shared/editors/NewsEditor";
import ContactEditor from "./shared/editors/ContactEditor";
import StatsEditor from "./shared/editors/StatsEditor";
import CtaEditor from "./shared/editors/CtaEditor";

function normalizeKey(value = "") {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[\s-]+/g, "_");
}

export const sharedEditorRegistry = {
  gallery: GalleryEditor,
  gallery_preview: GalleryEditor,
  partners: PartnersEditor,
  sponsors: PartnersEditor,
  latest_news: NewsEditor,
  news: NewsEditor,
  contact: ContactEditor,
  stats: StatsEditor,
  statistics: StatsEditor,
  cta: CtaEditor,
  call_to_action: CtaEditor,
};

export const categoryEditorRegistry = {
  school: schoolEditorRegistry,
  business: businessEditorRegistry,
  portfolio: portfolioEditorRegistry,
  agriculture: agricultureEditorRegistry,
  technology: technologyEditorRegistry,
  construction: constructionEditorRegistry,
};

export function getEditorComponent({ templateCategory = "", sectionType = "" } = {}) {
  const categoryKey = normalizeKey(templateCategory);
  const sectionKey = normalizeKey(sectionType);

  return (
    categoryEditorRegistry[categoryKey]?.[sectionKey] ||
    sharedEditorRegistry[sectionKey] ||
    null
  );
}

export default {
  shared: sharedEditorRegistry,
  categories: categoryEditorRegistry,
  getEditorComponent,
};
