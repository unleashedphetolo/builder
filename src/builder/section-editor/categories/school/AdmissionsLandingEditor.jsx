import ContentField from "../../shared/fields/ContentField";
import ItemCollection from "../../shared/fields/ItemCollection";

const createId = () => `stat-${Date.now()}-${Math.round(Math.random() * 100000)}`;

export default function AdmissionsLandingEditor({ draftContent = {}, updateContent }) {
  return (
    <>
      <ContentField label="Section Title" value={draftContent.section_title || ""} onChange={(v) => updateContent("section_title", v)} />
      <ContentField label="Subtitle" type="textarea" rows={3} value={draftContent.subtitle || ""} onChange={(v) => updateContent("subtitle", v)} />
      <ContentField label="Heading" value={draftContent.heading || ""} onChange={(v) => updateContent("heading", v)} />
      <ContentField label="Description" type="textarea" rows={4} value={draftContent.description || draftContent.body || ""} onChange={(v) => updateContent("description", v)} />
      <div className="bse-two-column">
        <ContentField label="Primary Button Label" value={draftContent.primary_button_label || ""} onChange={(v) => updateContent("primary_button_label", v)} />
        <ContentField label="Primary Button Link" value={draftContent.primary_button_href || ""} onChange={(v) => updateContent("primary_button_href", v)} />
        <ContentField label="Secondary Button Label" value={draftContent.secondary_button_label || ""} onChange={(v) => updateContent("secondary_button_label", v)} />
        <ContentField label="Secondary Button Link" value={draftContent.secondary_button_href || ""} onChange={(v) => updateContent("secondary_button_href", v)} />
      </div>
      <ContentField label="Hero Image URL" value={draftContent.hero_image || ""} onChange={(v) => updateContent("hero_image", v)} />
      <ItemCollection
        title="Admission Statistics"
        items={draftContent.stats || []}
        addLabel="Add Statistic"
        emptyText="No statistics configured."
        createItem={() => ({ id: createId(), value: "0", label: "New Statistic" })}
        fields={[
          { key: "value", label: "Value" },
          { key: "label", label: "Label" },
        ]}
        onChange={(items) => updateContent("stats", items)}
      />
    </>
  );
}
