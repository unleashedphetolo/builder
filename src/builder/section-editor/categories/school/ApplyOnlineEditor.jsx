import ContentField from "../../shared/fields/ContentField";
import TextListField from "../../shared/fields/TextListField";

export default function ApplyOnlineEditor({ draftContent = {}, updateContent }) {
  return (
    <>
      <ContentField label="Form Heading" value={draftContent.form_title || draftContent.section_title || ""} onChange={(v) => updateContent("form_title", v)} />
      <ContentField label="Form Introduction" type="textarea" rows={3} value={draftContent.form_subtitle || ""} onChange={(v) => updateContent("form_subtitle", v)} />
      <ContentField label="Required Fields Text" value={draftContent.required_fields_label || ""} onChange={(v) => updateContent("required_fields_label", v)} />
      <div className="bse-two-column">
        <ContentField label="Manual Form Label" value={draftContent.manual_form_label || ""} onChange={(v) => updateContent("manual_form_label", v)} />
        <ContentField label="Manual Form PDF / Link" value={draftContent.manual_form_url || ""} onChange={(v) => updateContent("manual_form_url", v)} />
        <ContentField label="Help Label" value={draftContent.help_label || ""} onChange={(v) => updateContent("help_label", v)} />
        <ContentField label="Help Link" value={draftContent.help_href || ""} onChange={(v) => updateContent("help_href", v)} />
        <ContentField label="Progress Heading" value={draftContent.progress_title || ""} onChange={(v) => updateContent("progress_title", v)} />
        <ContentField label="Upload Tip Heading" value={draftContent.uploads_tip_title || ""} onChange={(v) => updateContent("uploads_tip_title", v)} />
      </div>
      <TextListField label="Application Step Labels" items={draftContent.step_labels || []} onChange={(v) => updateContent("step_labels", v)} />
      <ContentField label="Learner Details Heading" value={draftContent.learner_heading || ""} onChange={(v) => updateContent("learner_heading", v)} />
      <ContentField label="Learner Details Description" type="textarea" rows={2} value={draftContent.learner_description || ""} onChange={(v) => updateContent("learner_description", v)} />
      <TextListField label="Learner Field Labels" items={draftContent.learner_field_labels || []} onChange={(v) => updateContent("learner_field_labels", v)} />
      <ContentField label="Parent / Guardian Heading" value={draftContent.guardian_heading || ""} onChange={(v) => updateContent("guardian_heading", v)} />
      <ContentField label="Parent / Guardian Description" type="textarea" rows={2} value={draftContent.guardian_description || ""} onChange={(v) => updateContent("guardian_description", v)} />
      <TextListField label="Guardian Field Labels" items={draftContent.guardian_field_labels || []} onChange={(v) => updateContent("guardian_field_labels", v)} />
      <ContentField label="School Information Heading" value={draftContent.school_heading || ""} onChange={(v) => updateContent("school_heading", v)} />
      <ContentField label="School Information Description" type="textarea" rows={2} value={draftContent.school_description || ""} onChange={(v) => updateContent("school_description", v)} />
      <TextListField label="School / Emergency Field Labels" items={draftContent.school_field_labels || []} onChange={(v) => updateContent("school_field_labels", v)} />
      <ContentField label="Uploads Heading" value={draftContent.uploads_heading || ""} onChange={(v) => updateContent("uploads_heading", v)} />
      <ContentField label="Uploads Description" type="textarea" rows={2} value={draftContent.uploads_description || ""} onChange={(v) => updateContent("uploads_description", v)} />
      <TextListField label="Upload Document Labels" items={draftContent.upload_labels || []} onChange={(v) => updateContent("upload_labels", v)} />
      <TextListField label="Upload Document Hints" items={draftContent.upload_hints || []} onChange={(v) => updateContent("upload_hints", v)} />
      <ContentField label="Review Heading" value={draftContent.review_heading || ""} onChange={(v) => updateContent("review_heading", v)} />
      <ContentField label="Review Description" type="textarea" rows={2} value={draftContent.review_description || ""} onChange={(v) => updateContent("review_description", v)} />
      <TextListField label="Review Section Labels" items={draftContent.review_labels || []} onChange={(v) => updateContent("review_labels", v)} />
      <ContentField label="Consent Truth Declaration" type="textarea" rows={3} value={draftContent.consent_truth_text || ""} onChange={(v) => updateContent("consent_truth_text", v)} />
      <ContentField label="Consent Policy Declaration" type="textarea" rows={3} value={draftContent.consent_policy_text || ""} onChange={(v) => updateContent("consent_policy_text", v)} />
      <div className="bse-two-column">
        <ContentField label="Back Button" value={draftContent.back_button_label || ""} onChange={(v) => updateContent("back_button_label", v)} />
        <ContentField label="Continue Button" value={draftContent.continue_button_label || ""} onChange={(v) => updateContent("continue_button_label", v)} />
        <ContentField label="Submit Button" value={draftContent.submit_button_label || ""} onChange={(v) => updateContent("submit_button_label", v)} />
        <ContentField label="Submitting Label" value={draftContent.submitting_label || ""} onChange={(v) => updateContent("submitting_label", v)} />
        <ContentField label="Choose File Label" value={draftContent.choose_file_label || ""} onChange={(v) => updateContent("choose_file_label", v)} />
        <ContentField label="No File Selected Label" value={draftContent.no_file_label || ""} onChange={(v) => updateContent("no_file_label", v)} />
      </div>
      <ContentField label="Upload Tip Content" type="textarea" rows={3} value={draftContent.uploads_tip_text || ""} onChange={(v) => updateContent("uploads_tip_text", v)} />
      <ContentField label="Submission Note" type="textarea" rows={3} value={draftContent.submit_note || ""} onChange={(v) => updateContent("submit_note", v)} />
      <ContentField label="Help Text" type="textarea" rows={3} value={draftContent.help_text || ""} onChange={(v) => updateContent("help_text", v)} />
      <ContentField label="Validation Alert" type="textarea" rows={2} value={draftContent.validation_message || ""} onChange={(v) => updateContent("validation_message", v)} />
      <ContentField label="Success Alert" type="textarea" rows={2} value={draftContent.success_message || ""} onChange={(v) => updateContent("success_message", v)} />
    </>
  );
}
