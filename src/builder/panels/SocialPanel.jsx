import React from "react";
import "../../styles/panels.css";

import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const DEFAULT_PLATFORMS = [
  "facebook",
  "instagram",
  "x",
  "youtube",
  "tiktok",
  "linkedin",
  "whatsapp",
];

const PLATFORM_DEFAULTS = {
  facebook: {
    enabled: true,
    url: "",
    colorMode: "original",
    label: "Facebook",
    placeholder: "https://www.facebook.com",
  },
  instagram: {
    enabled: true,
    url: "",
    colorMode: "original",
    label: "Instagram",
    placeholder: "https://www.instagram.com",
  },
  x: {
    enabled: true,
    url: "",
    colorMode: "original",
    label: "X",
    placeholder: "https://www.x.com",
  },
  youtube: {
    enabled: true,
    url: "",
    colorMode: "original",
    label: "YouTube",
    placeholder: "https://www.youtube.com",
  },
  tiktok: {
    enabled: true,
    url: "",
    colorMode: "original",
    label: "TikTok",
    placeholder: "https://www.tiktok.com",
  },
  linkedin: {
    enabled: true,
    url: "",
    colorMode: "original",
    label: "LinkedIn",
    placeholder: "https://www.linkedin.com",
  },
  whatsapp: {
    enabled: true,
    url: "",
    colorMode: "original",
    label: "WhatsApp",
    placeholder: "https://www.whatsapp.com/",
  },
};

function SortableItem({ id, children }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.92 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`social-sortable-wrapper ${isDragging ? "is-dragging" : ""}`}
      {...attributes}
      {...listeners}
    >
      {children}
    </div>
  );
}

export default function SocialPanel({
  siteSettings = {},
  onUpdateSocialMedia,
  onUpdateSettings,
}) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
  );

  const socialSource = siteSettings.social_media || siteSettings.social || {};

  const social = {
    topbar: socialSource.topbar ?? true,
    footer: socialSource.footer ?? true,
    order: Array.isArray(socialSource.order)
      ? socialSource.order
      : DEFAULT_PLATFORMS,
    ...socialSource,
  };

  const order = Array.isArray(social.order) ? social.order : DEFAULT_PLATFORMS;

  const persistSocial = async (nextSocial) => {
    const normalized = {
      ...nextSocial,
      order: Array.isArray(nextSocial.order)
        ? nextSocial.order
        : DEFAULT_PLATFORMS,
    };

    if (onUpdateSocialMedia) {
      await onUpdateSocialMedia(normalized);
      return;
    }

    if (onUpdateSettings) {
      await onUpdateSettings({
        social_media: normalized,
      });
    }
  };

  const updateGlobal = async (key, value) => {
    await persistSocial({
      ...social,
      [key]: value,
    });
  };

  const updatePlatform = async (platform, field, value) => {
    await persistSocial({
      ...social,
      [platform]: {
        ...(PLATFORM_DEFAULTS[platform] || {}),
        ...(social[platform] || {}),
        [field]: value,
      },
    });
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const oldIndex = order.indexOf(active.id);
    const newIndex = order.indexOf(over.id);

    if (oldIndex === -1 || newIndex === -1) return;

    const newOrder = arrayMove(order, oldIndex, newIndex);

    await persistSocial({
      ...social,
      order: newOrder,
    });
  };

  return (
    <div className="section-block">
      <h4>Social Media</h4>

      <div className="field">
        <p className="helper-text">
          Manage where social links appear, switch each platform on or off, and
          drag cards to reorder them naturally.
        </p>
      </div>

      <div className="social-item social-global-row">
        <div className="social-global-copy">
          <strong>Show in Topbar</strong>
          <span>Display social icons in the website topbar</span>
        </div>

        <label className="switch">
          <input
            type="checkbox"
            checked={!!social.topbar}
            onChange={(e) => updateGlobal("topbar", e.target.checked)}
          />
          <span className="slider" style={{ "--brand": "#2563eb" }} />
        </label>
      </div>

      <div className="social-item social-global-row">
        <div className="social-global-copy">
          <strong>Show in Footer</strong>
          <span>Display social icons in the footer section</span>
        </div>

        <label className="switch">
          <input
            type="checkbox"
            checked={social.footer ?? true}
            onChange={(e) => updateGlobal("footer", e.target.checked)}
          />
          <span className="slider" style={{ "--brand": "#2563eb" }} />
        </label>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={order} strategy={verticalListSortingStrategy}>
          <div className="social-platform-list">
            {order.map((platform) => {
              const defaults = PLATFORM_DEFAULTS[platform] || {
                enabled: true,
                url: "",
                colorMode: "original",
                label: platform,
                placeholder: `https://${platform}.com`,
              };

              const data = {
                ...defaults,
                ...(social[platform] || {}),
              };

              return (
                <SortableItem key={platform} id={platform}>
                  <div className="social-item drag-item enterprise-social-card">
                    <div className="social-header">
                      <div className="social-title-block">
                        <strong>{data.label}</strong>
                        <span className="muted-text">
                          Drag this card to reorder
                        </span>
                      </div>

                      <label className="switch" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={!!data.enabled}
                          onChange={(e) =>
                            updatePlatform(platform, "enabled", e.target.checked)
                          }
                        />
                        <span
                          className="slider"
                          style={{
                            "--brand": "#22c55e",
                          }}
                        />
                      </label>
                    </div>

                    <div className="field">
                      <label>{data.label} Link</label>
                      <input
                        type="text"
                        placeholder={data.placeholder}
                        value={data.url || ""}
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) =>
                          updatePlatform(platform, "url", e.target.value)
                        }
                      />
                    </div>

                    <div className="field">
                      <label>Icon Style</label>
                      <select
                        value={data.colorMode || "original"}
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) =>
                          updatePlatform(platform, "colorMode", e.target.value)
                        }
                      >
                        <option value="original">Original</option>
                        <option value="mono">Black and White</option>
                      </select>
                    </div>
                  </div>
                </SortableItem>
              );
            })}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}