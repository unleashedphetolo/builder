import { useMemo, useState } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import "../styles/builderCanvas.css";
import SchoolLayout from "../layouts/SchoolLayout";
import BusinessLayout from "../layouts/BusinessLayout";
import PortfolioLayout from "../layouts/PortfolioLayout";

import { persistSectionOrder } from "./siteService";

export default function BuilderCanvas({
  siteId,
  layoutKey,
  page,
  sections,
  setSections,
  selectedSection,
  onSelectSection,
  onUpdateInline,
  siteSettings,
  navItems,
}) {
  const [device, setDevice] = useState("desktop");

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const ids = useMemo(() => sections.map((s) => s.id), [sections]);

  const renderLayout = (children) => {
    switch (layoutKey) {
      case "business":
        return <BusinessLayout settings={siteSettings} navItems={navItems}>{children}</BusinessLayout>;
      case "portfolio":
        return <PortfolioLayout settings={siteSettings} navItems={navItems}>{children}</PortfolioLayout>;
      default:
        return <SchoolLayout settings={siteSettings} navItems={navItems}>{children}</SchoolLayout>;
    }
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = sections.findIndex((s) => s.id === active.id);
    const newIndex = sections.findIndex((s) => s.id === over.id);
    const updated = arrayMove(sections, oldIndex, newIndex).map((s, idx) => ({
      ...s,
      position: idx,
    }));

    setSections(updated);
    await persistSectionOrder(updated);
  };

  return (
    <div className="builder-canvas">
      <div className="device-switch">
        <button onClick={() => setDevice("desktop")}>Desktop</button>
        <button onClick={() => setDevice("tablet")}>Tablet</button>
        <button onClick={() => setDevice("mobile")}>Mobile</button>
      </div>

      <div className={`canvas-inner ${device}`}>
        {renderLayout(
          <div style={{ width: "100%" }}>
            <div style={{ padding: "10px 12px", opacity: 0.8 }}>
              <strong>{page?.title || "Page"}</strong>
            </div>

            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext items={ids} strategy={verticalListSortingStrategy}>
                {sections.map((section) => (
                  <SortableSection
                    key={section.id}
                    section={section}
                    active={selectedSection?.id === section.id}
                    onSelect={() => onSelectSection(section)}
                    onUpdateInline={onUpdateInline}
                  />
                ))}
              </SortableContext>
            </DndContext>
          </div>
        )}
      </div>
    </div>
  );
}

function SortableSection({ section, active, onSelect, onUpdateInline }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: section.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    outline: active ? "2px solid rgba(59,130,246,0.9)" : "none",
  };

  const title = section.content?.title ?? "Section title";
  const subtitle = section.content?.subtitle ?? "Section subtitle";

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="editable-section"
      onClick={onSelect}
    >
      <div className="hover-overlay" {...attributes} {...listeners}>
        Drag
      </div>

      <h2
        contentEditable
        suppressContentEditableWarning
        onBlur={(e) => onUpdateInline("content.title", e.target.innerText)}
      >
        {title}
      </h2>

      <p
        contentEditable
        suppressContentEditableWarning
        onBlur={(e) => onUpdateInline("content.subtitle", e.target.innerText)}
      >
        {subtitle}
      </p>
    </div>
  );
}
