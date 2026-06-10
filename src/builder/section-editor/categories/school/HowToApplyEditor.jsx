import ContentField from "../../shared/fields/ContentField";
import TextListField from "../../shared/fields/TextListField";

export default function HowToApplyEditor({ draftContent = {}, updateContent }) {
  return (
    <>
      <ContentField label="Section Title" value={draftContent.section_title || ""} onChange={(v) => updateContent("section_title", v)} />
      <ContentField label="Subtitle / Introduction" type="textarea" rows={4} value={draftContent.subtitle || ""} onChange={(v) => updateContent("subtitle", v)} />
      <div className="bse-two-column">
        <ContentField label="Primary Badge" value={draftContent.primary_badge || ""} onChange={(v) => updateContent("primary_badge", v)} />
        <ContentField label="Secondary Badge" value={draftContent.secondary_badge || ""} onChange={(v) => updateContent("secondary_badge", v)} />
        <ContentField label="Apply Button" value={draftContent.apply_button_label || ""} onChange={(v) => updateContent("apply_button_label", v)} />
        <ContentField label="Download Button" value={draftContent.hero_download_label || ""} onChange={(v) => updateContent("hero_download_label", v)} />
        <ContentField label="Help Button" value={draftContent.help_button_label || ""} onChange={(v) => updateContent("help_button_label", v)} />
        <ContentField label="Manual Form PDF / Link" value={draftContent.form_url || draftContent.pdf_url || ""} onChange={(v) => updateContent("form_url", v)} />
      </div>
      <ContentField label="Online Application Heading" value={draftContent.online_title || ""} onChange={(v) => updateContent("online_title", v)} />
      <ContentField label="Online Application Description" type="textarea" rows={3} value={draftContent.online_description || ""} onChange={(v) => updateContent("online_description", v)} />
      <TextListField label="Online Application Steps" items={draftContent.online_steps || []} onChange={(v) => updateContent("online_steps", v)} />
      <div className="bse-two-column">
        <ContentField label="Start Online Application Button" value={draftContent.online_start_label || ""} onChange={(v) => updateContent("online_start_label", v)} />
        <ContentField label="View Requirements Button" value={draftContent.requirements_button_label || ""} onChange={(v) => updateContent("requirements_button_label", v)} />
      </div>
      <ContentField label="Manual Application Heading" value={draftContent.manual_title || ""} onChange={(v) => updateContent("manual_title", v)} />
      <ContentField label="Manual Application Description" type="textarea" rows={3} value={draftContent.manual_description || ""} onChange={(v) => updateContent("manual_description", v)} />
      <TextListField label="Manual Application Steps" items={draftContent.manual_steps || []} onChange={(v) => updateContent("manual_steps", v)} />
      <div className="bse-two-column">
        <ContentField label="Download Manual Form Button" value={draftContent.manual_download_label || ""} onChange={(v) => updateContent("manual_download_label", v)} />
        <ContentField label="Contact the School Button" value={draftContent.contact_button_label || ""} onChange={(v) => updateContent("contact_button_label", v)} />
      </div>
      <ContentField label="Documents Heading" value={draftContent.documents_title || ""} onChange={(v) => updateContent("documents_title", v)} />
      <ContentField label="Documents Description" type="textarea" rows={3} value={draftContent.documents_description || ""} onChange={(v) => updateContent("documents_description", v)} />
      <TextListField label="Required Documents" items={draftContent.required_documents || []} onChange={(v) => updateContent("required_documents", v)} />
      <ContentField label="Footer Note" type="textarea" rows={2} value={draftContent.footer_note || ""} onChange={(v) => updateContent("footer_note", v)} />
    </>
  );
}
