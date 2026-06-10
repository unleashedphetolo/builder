import ContentField from "../../shared/fields/ContentField";
import ItemCollection from "../../shared/fields/ItemCollection";

const createId = () => `event-${Date.now()}-${Math.round(Math.random() * 100000)}`;

export default function SchoolCalendarEditor({ draftContent = {}, updateContent }) {
  return (
    <>
      <ContentField label="Section Title" value={draftContent.section_title || ""} onChange={(v) => updateContent("section_title", v)} />
      <ContentField label="Subtitle" type="textarea" rows={3} value={draftContent.subtitle || ""} onChange={(v) => updateContent("subtitle", v)} />
      <div className="bse-two-column">
        <ContentField label="View All Label" value={draftContent.view_all_label || ""} onChange={(v) => updateContent("view_all_label", v)} />
        <ContentField label="View All Link" value={draftContent.view_all_href || ""} onChange={(v) => updateContent("view_all_href", v)} />
        <ContentField label="Download Label" value={draftContent.download_label || ""} onChange={(v) => updateContent("download_label", v)} />
        <ContentField label="Calendar PDF URL" value={draftContent.pdf_url || ""} onChange={(v) => updateContent("pdf_url", v)} />
      </div>
      <ItemCollection
        title="Calendar Events"
        items={draftContent.items || []}
        addLabel="Add Event"
        emptyText="No events configured."
        createItem={() => ({ id: createId(), title: "New Event", start: "", end: "", location: "", category: "School Event" })}
        fields={[
          { key: "title", label: "Event Title" },
          { key: "start", label: "Start Date & Time", type: "datetime-local" },
          { key: "end", label: "End Date & Time", type: "datetime-local" },
          { key: "location", label: "Location" },
          { key: "category", label: "Category" },
        ]}
        onChange={(items) => updateContent("items", items)}
      />
    </>
  );
}
