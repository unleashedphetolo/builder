import ContentField from "../../shared/fields/ContentField";
import TextListField from "../../shared/fields/TextListField";

export default function EntryRequirementsEditor({ draftContent = {}, updateContent }) {
  return (
    <>
      <ContentField label="Section Title" value={draftContent.section_title || ""} onChange={(v) => updateContent("section_title", v)} />
      <ContentField label="Introduction" type="textarea" rows={4} value={draftContent.introduction || ""} onChange={(v) => updateContent("introduction", v)} />
      <ContentField label="Documents Heading" value={draftContent.documents_title || ""} onChange={(v) => updateContent("documents_title", v)} />
      <ContentField label="Documents Description" type="textarea" rows={2} value={draftContent.documents_description || ""} onChange={(v) => updateContent("documents_description", v)} />
      <TextListField label="Required Documents" items={draftContent.required_documents || []} onChange={(v) => updateContent("required_documents", v)} />
      <ContentField label="Grade Admissions Heading" value={draftContent.grades_title || ""} onChange={(v) => updateContent("grades_title", v)} />
      <ContentField label="Grade Admissions Description" type="textarea" rows={3} value={draftContent.grades_description || ""} onChange={(v) => updateContent("grades_description", v)} />
      <ContentField label="Application Process Heading" value={draftContent.process_title || ""} onChange={(v) => updateContent("process_title", v)} />
      <TextListField label="Application Process" items={draftContent.application_process || []} onChange={(v) => updateContent("application_process", v)} />
      <ContentField label="Important Notes Heading" value={draftContent.notes_title || ""} onChange={(v) => updateContent("notes_title", v)} />
      <TextListField label="Important Notes" items={draftContent.important_notes || []} onChange={(v) => updateContent("important_notes", v)} />
      <div className="bse-two-column">
        <ContentField label="Apply Online Button" value={draftContent.apply_button_label || ""} onChange={(v) => updateContent("apply_button_label", v)} />
        <ContentField label="Manual Application PDF Button" value={draftContent.download_button_label || ""} onChange={(v) => updateContent("download_button_label", v)} />
        <ContentField label="View Form Button" value={draftContent.view_button_label || ""} onChange={(v) => updateContent("view_button_label", v)} />
        <ContentField label="Application Form PDF / Link" value={draftContent.form_url || draftContent.pdf_url || ""} onChange={(v) => updateContent("form_url", v)} />
      </div>
      <ContentField label="Footer Note" type="textarea" rows={2} value={draftContent.footer_note || ""} onChange={(v) => updateContent("footer_note", v)} />
    </>
  );
}
