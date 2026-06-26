import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import "../../styles/builder-social-links-panel.css";

import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import {
  FaBehance,
  FaDiscord,
  FaDribbble,
  FaEnvelope,
  FaFacebookF,
  FaGithub,
  FaGlobe,
  FaInstagram,
  FaLinkedinIn,
  FaMediumM,
  FaPhoneAlt,
  FaPinterestP,
  FaRedditAlien,
  FaSnapchatGhost,
  FaSpotify,
  FaTelegramPlane,
  FaTiktok,
  FaTwitch,
  FaWhatsapp,
  FaYoutube,
} from "react-icons/fa";
import { FaThreads, FaXTwitter } from "react-icons/fa6";

const DEFAULT_PLATFORMS = [
  "facebook",
  "instagram",
  "x",
  "youtube",
  "tiktok",
  "linkedin",
  "whatsapp",
  "threads",
  "telegram",
  "snapchat",
  "pinterest",
  "discord",
  "github",
  "behance",
  "dribbble",
  "medium",
  "reddit",
  "twitch",
  "spotify",
  "website",
  "email",
  "phone",
];

// SocialPanel default: every platform is ON.
// Individual templates or saved settings can still disable platforms with enabled: false.
const DEFAULT_ENABLED_PLATFORMS = [...DEFAULT_PLATFORMS];

const PLATFORM_DEFAULTS = {
  facebook: {
    enabled: false,
    url: "",
    colorMode: "original",
    label: "Facebook",
    placeholder: "https://www.facebook.com",
  },
  instagram: {
    enabled: false,
    url: "",
    colorMode: "original",
    label: "Instagram",
    placeholder: "https://www.instagram.com",
  },
  x: {
    enabled: false,
    url: "",
    colorMode: "original",
    label: "X",
    placeholder: "https://www.x.com",
  },
  youtube: {
    enabled: false,
    url: "",
    colorMode: "original",
    label: "YouTube",
    placeholder: "https://www.youtube.com",
  },
  tiktok: {
    enabled: false,
    url: "",
    colorMode: "original",
    label: "TikTok",
    placeholder: "https://www.tiktok.com",
  },
  linkedin: {
    enabled: false,
    url: "",
    colorMode: "original",
    label: "LinkedIn",
    placeholder: "https://www.linkedin.com",
  },
  whatsapp: {
    enabled: false,
    url: "",
    colorMode: "original",
    label: "WhatsApp",
    placeholder: "https://wa.me/27110000000",
  },
  threads: {
    enabled: false,
    url: "",
    colorMode: "original",
    label: "Threads",
    placeholder: "https://www.threads.net",
  },
  telegram: {
    enabled: false,
    url: "",
    colorMode: "original",
    label: "Telegram",
    placeholder: "https://t.me/yourusername",
  },
  snapchat: {
    enabled: false,
    url: "",
    colorMode: "original",
    label: "Snapchat",
    placeholder: "https://www.snapchat.com",
  },
  pinterest: {
    enabled: false,
    url: "",
    colorMode: "original",
    label: "Pinterest",
    placeholder: "https://www.pinterest.com",
  },
  discord: {
    enabled: false,
    url: "",
    colorMode: "original",
    label: "Discord",
    placeholder: "https://discord.gg/yourinvite",
  },
  github: {
    enabled: false,
    url: "",
    colorMode: "original",
    label: "GitHub",
    placeholder: "https://github.com",
  },
  behance: {
    enabled: false,
    url: "",
    colorMode: "original",
    label: "Behance",
    placeholder: "https://www.behance.net",
  },
  dribbble: {
    enabled: false,
    url: "",
    colorMode: "original",
    label: "Dribbble",
    placeholder: "https://dribbble.com",
  },
  medium: {
    enabled: false,
    url: "",
    colorMode: "original",
    label: "Medium",
    placeholder: "https://medium.com",
  },
  reddit: {
    enabled: false,
    url: "",
    colorMode: "original",
    label: "Reddit",
    placeholder: "https://www.reddit.com",
  },
  twitch: {
    enabled: false,
    url: "",
    colorMode: "original",
    label: "Twitch",
    placeholder: "https://www.twitch.tv",
  },
  spotify: {
    enabled: false,
    url: "",
    colorMode: "original",
    label: "Spotify",
    placeholder: "https://open.spotify.com",
  },
  website: {
    enabled: false,
    url: "",
    colorMode: "original",
    label: "Website",
    placeholder: "https://www.example.com",
  },
  email: {
    enabled: false,
    url: "",
    colorMode: "original",
    label: "Email",
    placeholder: "mailto:info@example.com",
  },
  phone: {
    enabled: false,
    url: "",
    colorMode: "original",
    label: "Phone",
    placeholder: "tel:+27110000000",
  },
};

const PLATFORM_ICONS = {
  facebook: { icon: FaFacebookF, color: "#1877F2" },
  instagram: { icon: FaInstagram, color: "#E4405F" },
  x: { icon: FaXTwitter, color: "#000000" },
  youtube: { icon: FaYoutube, color: "#FF0000" },
  tiktok: { icon: FaTiktok, color: "#000000" },
  linkedin: { icon: FaLinkedinIn, color: "#0A66C2" },
  whatsapp: { icon: FaWhatsapp, color: "#25D366" },
  threads: { icon: FaThreads, color: "#000000" },
  telegram: { icon: FaTelegramPlane, color: "#26A5E4" },
  snapchat: { icon: FaSnapchatGhost, color: "#FFFC00" },
  pinterest: { icon: FaPinterestP, color: "#E60023" },
  discord: { icon: FaDiscord, color: "#5865F2" },
  github: { icon: FaGithub, color: "#181717" },
  behance: { icon: FaBehance, color: "#1769FF" },
  dribbble: { icon: FaDribbble, color: "#EA4C89" },
  medium: { icon: FaMediumM, color: "#000000" },
  reddit: { icon: FaRedditAlien, color: "#FF4500" },
  twitch: { icon: FaTwitch, color: "#9146FF" },
  spotify: { icon: FaSpotify, color: "#1DB954" },
  website: { icon: FaGlobe, color: "#2563EB" },
  email: { icon: FaEnvelope, color: "#EA4335" },
  phone: { icon: FaPhoneAlt, color: "#16A34A" },
};

function isObject(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function clone(value) {
  try {
    return JSON.parse(JSON.stringify(value));
  } catch (error) {
    return value;
  }
}

function serialize(value) {
  try {
    return JSON.stringify(value);
  } catch (error) {
    return "";
  }
}


function uniqueOrder(value) {
  const savedOrder = Array.isArray(value)
    ? value.filter(
        (platform, index, list) =>
          typeof platform === "string" &&
          platform.trim() &&
          list.indexOf(platform) === index,
      )
    : [];

  const missingDefaults = DEFAULT_PLATFORMS.filter(
    (platform) => !savedOrder.includes(platform),
  );

  return [...savedOrder, ...missingDefaults];
}

function createSocialState(siteSettings = {}) {
  const socialLinks = isObject(siteSettings?.social_links)
    ? clone(siteSettings.social_links)
    : {};
  const socialDisplay = isObject(siteSettings?.social_display)
    ? siteSettings.social_display
    : {};

  return {
    topbar: socialDisplay.topbar ?? true,
    footer: socialDisplay.footer ?? true,
    order: uniqueOrder(socialDisplay.order),
    ...socialLinks,
  };
}

function normalizeSocial(nextSocial = {}) {
  return {
    ...nextSocial,
    topbar: nextSocial?.topbar ?? true,
    footer: nextSocial?.footer ?? true,
    order: uniqueOrder(nextSocial?.order),
  };
}

function platformDetails(social, platform) {
  return {
    ...(PLATFORM_DEFAULTS[platform] || {
      enabled: true,
      url: "",
      colorMode: "original",
      label: platform,
      placeholder: `https://${platform}.com`,
    }),
    ...(social?.[platform] || {}),
  };
}

function PlatformIcon({ platform }) {
  const item = PLATFORM_ICONS[platform];

  if (!item?.icon) {
    return (
      <span className="bsl-platform-icon" aria-hidden="true">
        ↗
      </span>
    );
  }

  const Icon = item.icon;

  return (
    <span
      className="bsl-platform-icon"
      style={{ "--bsl-platform-colour": item.color }}
      aria-hidden="true"
    >
      <Icon size={16} />
    </span>
  );
}

function ToggleSwitch({ checked, onChange, label, disabled = false }) {
  return (
    <label
      className={`bsl-switch ${checked ? "is-on" : "is-off"}`}
      aria-label={label}
    >
      <input
        type="checkbox"
        checked={Boolean(checked)}
        onChange={(event) => onChange(event.target.checked)}
        disabled={disabled}
      />
      <span className="bsl-switch-text">{checked ? "ON" : "OFF"}</span>
      <span className="bsl-switch-knob" aria-hidden="true" />
    </label>
  );
}

function SortablePlatformCard({ id, disabled = false, children }) {
  const {
    attributes,
    listeners,
    setActivatorNodeRef,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id, disabled });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bsl-sortable-wrapper ${isDragging ? "is-dragging" : ""}`}
    >
      {children({
        dragHandleProps: {
          ...attributes,
          ...listeners,
          ref: setActivatorNodeRef,
        },
        isDragging,
      })}
    </div>
  );
}

export default function SocialPanel({
  siteSettings = {},
  onUpdateSocialMedia,
  onUpdateSettings,
}) {
  const settingsSignature = serialize({
    social_links: siteSettings?.social_links || {},
    social_display: siteSettings?.social_display || {},
  });

  const initialSocial = useMemo(
    () => createSocialState(siteSettings),
    // The signature controls refreshes from saved settings.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [settingsSignature],
  );

  const [social, setSocial] = useState(initialSocial);
  const [saveState, setSaveState] = useState("saved");
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const socialRef = useRef(initialSocial);
  const lastSavedRef = useRef(initialSocial);
  const saveQueueRef = useRef(Promise.resolve());
  const pendingSaveCountRef = useRef(0);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  useEffect(() => {
    const nextSocial = createSocialState(siteSettings);

    setSocial(nextSocial);
    socialRef.current = nextSocial;
    lastSavedRef.current = nextSocial;
    setSaveState("saved");
    setError("");
    // The signature updates only when saved social settings change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settingsSignature]);

  const applyLocalState = useCallback((nextSocial) => {
    const normalized = normalizeSocial(nextSocial);
    socialRef.current = normalized;
    setSocial(normalized);
    return normalized;
  }, []);

  const callSaveHandler = useCallback(
    async (normalized) => {
      if (typeof onUpdateSocialMedia === "function") {
        return onUpdateSocialMedia(normalized);
      }

      if (typeof onUpdateSettings === "function") {
        const { topbar, footer, order, ...platforms } = normalized;

        return onUpdateSettings({
          social_links: platforms,
          social_display: {
            topbar: topbar ?? true,
            footer: footer ?? true,
            order: uniqueOrder(order),
          },
        });
      }

      throw new Error("No social-media save handler is connected.");
    },
    [onUpdateSettings, onUpdateSocialMedia],
  );

  const persistSocial = useCallback(
    async (nextSocial) => {
      const normalized = normalizeSocial(nextSocial);

      if (serialize(normalized) === serialize(lastSavedRef.current)) {
        return true;
      }

      pendingSaveCountRef.current += 1;
      setSaveState("saving");
      setError("");

      const queuedSave = saveQueueRef.current
        .catch(() => undefined)
        .then(async () => {
          const result = await Promise.resolve(callSaveHandler(normalized));

          if (result === false) {
            throw new Error("Social-media settings were not saved.");
          }

          lastSavedRef.current = normalized;
          return true;
        });

      saveQueueRef.current = queuedSave;

      let failed = false;

      try {
        await queuedSave;
        return true;
      } catch (saveError) {
        failed = true;
        console.error("SocialPanel save error:", saveError);
        setSaveState("error");
        setError("Social media settings could not be saved. Please try again.");
        return false;
      } finally {
        pendingSaveCountRef.current -= 1;

        if (pendingSaveCountRef.current === 0 && !failed) {
          setSaveState("saved");
        }
      }
    },
    [callSaveHandler],
  );

  const updateGlobal = async (key, value) => {
    const nextSocial = applyLocalState({
      ...socialRef.current,
      [key]: value,
    });

    await persistSocial(nextSocial);
  };

  const updatePlatformLocal = (platform, field, value) => {
    return applyLocalState({
      ...socialRef.current,
      [platform]: {
        ...platformDetails(socialRef.current, platform),
        [field]: value,
      },
    });
  };

  const updatePlatformAndSave = async (platform, field, value) => {
    const nextSocial = updatePlatformLocal(platform, field, value);
    await persistSocial(nextSocial);
  };

  const saveCurrentChanges = async () => {
    await persistSocial(socialRef.current);
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const currentOrder = uniqueOrder(socialRef.current.order);
    const oldIndex = currentOrder.indexOf(active.id);
    const newIndex = currentOrder.indexOf(over.id);

    if (oldIndex === -1 || newIndex === -1) return;

    const nextOrder = arrayMove(currentOrder, oldIndex, newIndex);
    const nextSocial = applyLocalState({
      ...socialRef.current,
      order: nextOrder,
    });

    await persistSocial(nextSocial);
  };

  const order = uniqueOrder(social.order);
  const normalizedSearch = searchTerm.trim().toLowerCase();
  const filteredOrder = normalizedSearch
    ? order.filter((platform) => {
        const data = platformDetails(social, platform);
        return (
          platform.toLowerCase().includes(normalizedSearch) ||
          data.label.toLowerCase().includes(normalizedSearch)
        );
      })
    : order;
  const saving = saveState === "saving";

  return (
    <section className="bsl-root" aria-label="Social Media settings">
      <div className="bsl-title-bar">
        <h4>Social Media</h4>
      </div>

      <p className="bsl-helper-text">
        Manage where social links appear, switch each platform on or off, and
        drag cards to reorder them naturally.
      </p>

      <span className="bsl-screen-reader-status" aria-live="polite">
        {saveState === "saving"
          ? "Saving social media settings."
          : saveState === "saved"
            ? "Social media settings saved."
            : "Social media settings could not be saved."}
      </span>

      {error && (
        <div className="bsl-error" role="alert">
          <span>{error}</span>
          <button type="button" onClick={saveCurrentChanges}>
            Retry
          </button>
        </div>
      )}

      <div className="bsl-global-row">
        <div className="bsl-global-copy">
          <strong>Show in Topbar</strong>
          <span>Display social icons in the website topbar</span>
        </div>

        <ToggleSwitch
          checked={Boolean(social.topbar)}
          disabled={saving}
          label="Show social icons in the website topbar"
          onChange={(checked) => updateGlobal("topbar", checked)}
        />
      </div>

      <div className="bsl-global-row">
        <div className="bsl-global-copy">
          <strong>Show in Footer</strong>
          <span>Display social icons in the footer section</span>
        </div>

        <ToggleSwitch
          checked={social.footer ?? true}
          disabled={saving}
          label="Show social icons in the website footer"
          onChange={(checked) => updateGlobal("footer", checked)}
        />
      </div>

      <label className="bsl-search-field">
        <span>Search platform</span>
        <div className="bsl-search-control">
          <input
            type="search"
            placeholder="Search social media platform..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />

          {searchTerm && (
            <button
              type="button"
              className="bsl-search-clear"
              aria-label="Clear search"
              title="Clear search"
              onClick={() => setSearchTerm("")}
            >
              ×
            </button>
          )}
        </div>
      </label>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={filteredOrder} strategy={verticalListSortingStrategy}>
          <div className="bsl-platform-list">
            {filteredOrder.map((platform) => {
              const data = platformDetails(social, platform);

              return (
                <SortablePlatformCard key={platform} id={platform} disabled={saving}>
                  {({ dragHandleProps, isDragging }) => (
                    <article
                      className={`bsl-platform-card ${
                        isDragging ? "is-dragging" : ""
                      }`}
                    >
                      <header className="bsl-platform-header">
                        <PlatformIcon platform={platform} />

                        <div className="bsl-platform-copy">
                          <strong>{data.label}</strong>
                          <span>Drag this card to reorder</span>
                        </div>

                        <button
                          type="button"
                          className="bsl-drag-handle"
                          {...dragHandleProps}
                          aria-label={`Reorder ${data.label}`}
                          title={`Drag to reorder ${data.label}`}
                        >
                          ⠿
                        </button>

                        <ToggleSwitch
                          checked={Boolean(data.enabled)}
                          disabled={saving}
                          label={`Show ${data.label} link`}
                          onChange={(checked) =>
                            updatePlatformAndSave(platform, "enabled", checked)
                          }
                        />
                      </header>

                      <label className="bsl-field">
                        <span>{data.label} Link</span>
                        <input
                          type="url"
                          inputMode="url"
                          placeholder={data.placeholder}
                          value={data.url || ""}
                          onChange={(event) =>
                            updatePlatformLocal(platform, "url", event.target.value)
                          }
                          onBlur={saveCurrentChanges}
                          onKeyDown={(event) => {
                            if (event.key === "Enter") {
                              event.currentTarget.blur();
                            }
                          }}
                        />
                      </label>

                      <label className="bsl-field">
                        <span>Icon Style</span>
                        <select
                          value={data.colorMode || "original"}
                          onChange={(event) =>
                            updatePlatformAndSave(
                              platform,
                              "colorMode",
                              event.target.value,
                            )
                          }
                        >
                          <option value="original">Original</option>
                          <option value="mono">Black and White</option>
                        </select>
                      </label>
                    </article>
                  )}
                </SortablePlatformCard>
              );
            })}
            {filteredOrder.length === 0 && (
              <div className="bsl-empty-search">
                No social media platform found.
              </div>
            )}
          </div>
        </SortableContext>
      </DndContext>
    </section>
  );
}
