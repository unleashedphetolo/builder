import React from "react";
import BuilderSectionTarget from "../../../../../builder/BuilderSectionTarget";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import "../../styles/life-facilities.css";

const ACADEMIC = [
  "Spacious, well-equipped classrooms",
  "Science laboratories (Physical Sciences & Life Sciences)",
  "Computer laboratory with internet access",
  "Library and study resource centre",
  "Mathematics support and enrichment",
];

const SPORTS = [
  "Soccer and athletics field",
  "Netball and basketball courts",
  "Multi-purpose sports ground",
  "Indoor hall for assemblies and events",
];

const SUPPORT = [
  "Administration block",
  "Guidance and counselling support",
  "Staff room and meeting facilities",
  "Secure school premises and controlled access",
];

const FEATURE_CARDS = [
  {
    id: "academic",
    title: "Academic Facilities",
    icon: "🎓",
    items: ACADEMIC,
  },
  {
    id: "sports",
    title: "Sports & Recreation",
    icon: "🏟️",
    items: SPORTS,
  },
  {
    id: "support",
    title: "Learner Support Areas",
    icon: "🛡️",
    items: SUPPORT,
  },
];

const GALLERY_PREVIEW = [
  { title: "Classrooms", img: "/images/facilities/classrooms.jpg" },
  { title: "Science Lab", img: "/images/facilities/science-lab.jpg" },
  { title: "Computer Lab", img: "/images/facilities/computer-lab.jpg" },
  { title: "Sports Grounds", img: "/images/facilities/sports.jpg" },
];

function FeatureCard({ title, icon, items }) {
  return (
    <Card>
      <div className="lf-card-head">
        <span className="lf-icon" aria-hidden="true">
          {icon}
        </span>
        <h3 className="lf-h3">{title}</h3>
      </div>

      <ul className="lf-list">
        {items.map((t, index) => (
          <li key={`${t}-${index}`}>{t}</li>
        ))}
      </ul>
    </Card>
  );
}

export default function LifeFacilities({
  section = null,
  content = {},
  builderMode = false,
}) {
  const navigate = (slug) => {
    window.dispatchEvent(
      new CustomEvent("builder:navigate", { detail: slug }),
    );
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const featureCards =
    Array.isArray(content?.feature_groups) && content.feature_groups.length > 0
      ? content.feature_groups
      : FEATURE_CARDS;

  const galleryPreview =
    Array.isArray(content?.gallery) && content.gallery.length > 0
      ? content.gallery
      : Array.isArray(content?.items) && content.items.length > 0
        ? content.items
        : GALLERY_PREVIEW;

  const fullFacilitiesHref =
    content?.primary_button_href || "/facilities";

  const galleryHref =
    content?.secondary_button_href || "/gallery";

  const pageContent = (
    <main className="lf container">
      {/* Hero */}
      <header className="lf-hero">
        <div className="lf-hero-left">
          <h1 className="lf-title">
            {content?.section_title || "Campus Facilities"}
          </h1>
          <p className="lf-subtitle">
            {content?.subtitle ||
              "Our School provides facilities that support academic excellence, discipline, learner wellbeing, and participation in sport and culture."}
          </p>

          <div className="lf-actions">
            <Button
              onClick={() => navigate(fullFacilitiesHref)}
              variant="primary"
            >
              {content?.primary_button_label || "Full Facilities Page"}
            </Button>

            <Button
              onClick={() => navigate(galleryHref)}
              variant="outline"
            >
              {content?.secondary_button_label || "View Photos"}
            </Button>
          </div>
        </div>

        <div className="lf-hero-right" aria-hidden="true">
          <img
            src={content?.image_url || "/images/school/school.jpg"}
            alt={content?.image_alt || "School Campus"}
            className="lf-hero-img"
            onError={(e) => (e.currentTarget.src = "/images/teachers.jpeg")}
          />
        </div>
      </header>

      {/* Feature grid */}
      <section className="lf-grid">
        {featureCards.map((feature, index) => (
          <FeatureCard
            key={feature.id || feature.title || `facility-feature-${index}`}
            title={feature.title || ""}
            icon={feature.icon || ""}
            items={Array.isArray(feature.items) ? feature.items : []}
          />
        ))}
      </section>

      {/* Photo previews */}
      <section className="lf-photos">
        <div className="lf-photos-head">
          <div>
            <div className="lf-tag">
              {content?.gallery_label || "# Preview"}
            </div>
            <h2 className="lf-h2">
              {content?.gallery_title || "Facilities Photo Preview"}
            </h2>
            <p className="lf-muted">
              {content?.gallery_subtitle ||
                "Replace these images with your real facility photos."}
            </p>
          </div>

          <Button
            onClick={() => navigate(galleryHref)}
            variant="outline"
          >
            {content?.gallery_button_label || "Open Gallery →"}
          </Button>
        </div>

        <div className="lf-photos-grid">
          {galleryPreview.map((x, index) => (
            <div
              key={x.id || x.title || `facility-photo-${index}`}
              className="lf-photo"
            >
              <img
                src={x.image_url || x.img || ""}
                alt={x.title || ""}
                onError={(e) => (e.currentTarget.src = "/images/teachers.jpeg")}
              />
              <div className="lf-photo-overlay">
                <div className="lf-photo-title">{x.title || ""}</div>
              </div>
            </div>
          ))}
        </div>

        <p className="lf-note">
          {content?.gallery_note || (
            <>
              Tip: put images in <code>public/images/facilities/</code> and
              keep the same names.
            </>
          )}
        </p>
      </section>
    </main>
  );

  if (!section && !builderMode) {
    return pageContent;
  }

  return (
    <BuilderSectionTarget
      builderMode={builderMode}
      section={section}
      sectionType="school_activity_facilities"
      label={content?.section_title || "Campus Facilities"}
      templateCategory="school"
      templateKey="school-modern-v1"
    >
      {pageContent}
    </BuilderSectionTarget>
  );
}
