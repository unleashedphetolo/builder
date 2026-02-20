import { TEMPLATE_REGISTRY } from "../templates/registry";
import SchoolLayout from "../templates/layouts/SchoolLayout";

export default function SiteRenderer({ siteData }) {
  const template = TEMPLATE_REGISTRY[siteData.template];

  return (
    <SchoolLayout
      theme={template.theme}
      sections={siteData.sections}
    />
  );
}
