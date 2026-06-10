import ContentField from "../../shared/fields/ContentField";

export default function CompanyProfileEditor({ draftContent = {}, updateContent }) {
  return (
    <>
      <ContentField label="Company Name" value={draftContent.company_name || draftContent.section_title || ""} onChange={(v) => updateContent("company_name", v)} />
      <ContentField label="Headline" value={draftContent.heading || ""} onChange={(v) => updateContent("heading", v)} />
      <ContentField label="Company Description" type="textarea" rows={5} value={draftContent.description || draftContent.body || ""} onChange={(v) => updateContent("description", v)} />
      <div className="bse-two-column">
        <ContentField label="Founded" value={draftContent.founded || ""} onChange={(v) => updateContent("founded", v)} />
        <ContentField label="Industry" value={draftContent.industry || ""} onChange={(v) => updateContent("industry", v)} />
      </div>
      <ContentField label="Company Logo URL" value={draftContent.logo_url || ""} onChange={(v) => updateContent("logo_url", v)} />
    </>
  );
}
