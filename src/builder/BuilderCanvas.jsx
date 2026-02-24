import { useEffect, useState } from "react";
import { supabase } from "../supabase/Client";
import {
  DndContext,
  closestCenter
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import SchoolLayout from "../templates/layouts/SchoolLayout";
import BusinessLayout from "../templates/layouts/BusinessLayout";
import PortfolioLayout from "../templates/layouts/PortfolioLayout";

import "../styles/builderCanvas.css";

export default function BuilderCanvas({ layout }) {
  const [sections, setSections] = useState([]);
  const [device, setDevice] = useState("desktop");

  // 🔥 Load sections
  useEffect(() => {
    async function loadSections() {
      const { data } = await supabase
        .from("sections")
        .select("*")
        .order("position", { ascending: true });

      setSections(data || []);
    }

    loadSections();
  }, []);

  // 🔥 Save content inline
  const saveContent = async (id, newContent) => {
    await supabase
      .from("sections")
      .update({ content: newContent })
      .eq("id", id);
  };

  // 🔥 Drag handler
  const handleDragEnd = async (event) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const oldIndex = sections.findIndex(s => s.id === active.id);
    const newIndex = sections.findIndex(s => s.id === over.id);

    const updated = [...sections];
    const [moved] = updated.splice(oldIndex, 1);
    updated.splice(newIndex, 0, moved);

    setSections(updated);

    // update DB positions
    await Promise.all(
      updated.map((section, index) =>
        supabase
          .from("sections")
          .update({ position: index })
          .eq("id", section.id)
      )
    );
  };

  const renderLayout = (children) => {
    switch (layout) {
      case "business":
        return <BusinessLayout>{children}</BusinessLayout>;
      case "portfolio":
        return <PortfolioLayout>{children}</PortfolioLayout>;
      default:
        return <SchoolLayout>{children}</SchoolLayout>;
    }
  };

  return (
    <div className="builder-canvas">

      {/* 🔥 Device Switch */}
      <div className="device-switch">
        <button onClick={() => setDevice("desktop")}>Desktop</button>
        <button onClick={() => setDevice("tablet")}>Tablet</button>
        <button onClick={() => setDevice("mobile")}>Mobile</button>
      </div>

      <div className={`canvas-inner ${device}`}>

        {renderLayout(
          <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext
              items={sections.map(s => s.id)}
              strategy={verticalListSortingStrategy}
            >
              {sections.map(section => (
                <SortableSection
                  key={section.id}
                  section={section}
                  saveContent={saveContent}
                />
              ))}
            </SortableContext>
          </DndContext>
        )}

      </div>
    </div>
  );
}

function SortableSection({ section, saveContent }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: section.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="editable-section"
      {...attributes}
      {...listeners}
    >
      <div className="hover-overlay">Drag</div>

      <h2
        contentEditable
        suppressContentEditableWarning
        onBlur={(e) =>
          saveContent(section.id, {
            ...section.content,
            title: e.target.innerText
          })
        }
      >
        {section.content?.title}
      </h2>

      <p
        contentEditable
        suppressContentEditableWarning
        onBlur={(e) =>
          saveContent(section.id, {
            ...section.content,
            subtitle: e.target.innerText
          })
        }
      >
        {section.content?.subtitle}
      </p>
    </div>
  );
}