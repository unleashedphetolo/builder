import ContentField from "../../shared/fields/ContentField";
import ItemCollection from "../../shared/fields/ItemCollection";

const createId = () => `resource-${Date.now()}-${Math.round(Math.random() * 100000)}`;

export default function DigitalLibraryEditor({ draftContent = {}, updateContent }) {
  return (
    <>
      <ContentField label="Section Title" value={draftContent.section_title || ""} onChange={(v) => updateContent("section_title", v)} />
      <ContentField label="Subtitle" type="textarea" rows={2} value={draftContent.subtitle || ""} onChange={(v) => updateContent("subtitle", v)} />
      <div className="bse-two-column">
        <ContentField label="Search Placeholder" value={draftContent.search_placeholder || ""} onChange={(v) => updateContent("search_placeholder", v)} />
        <ContentField label="Portal Title" value={draftContent.portal_title || ""} onChange={(v) => updateContent("portal_title", v)} />
      </div>
      <ContentField label="Portal Description" type="textarea" rows={3} value={draftContent.portal_body || ""} onChange={(v) => updateContent("portal_body", v)} />
      <ItemCollection
        title="Library Resources"
        items={draftContent.items || draftContent.resources || []}
        addLabel="Add Resource"
        emptyText="No library resources configured."
        createItem={() => ({ id: createId(), title: "New Resource", grade: 12, subject: "Mathematics", type: "Exam", year: new Date().getFullYear(), province: "National", pdf: "" })}
        fields={[
          { key: "title", label: "Title" },
          { key: "grade", label: "Grade" },
          { key: "subject", label: "Subject" },
          { key: "type", label: "Type" },
          { key: "year", label: "Year" },
          { key: "province", label: "Province" },
          { key: "pdf", label: "PDF / Document URL" },
        ]}
        onChange={(items) => updateContent("items", items)}
      />
    </>
  );
}
