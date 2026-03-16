import React from "react";
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
        {items.map((t) => (
          <li key={t}>{t}</li>
        ))}
      </ul>
    </Card>
  );
}

export default function LifeFacilities() {

  const navigate = (slug) => {
    window.dispatchEvent(
      new CustomEvent("builder:navigate", { detail: slug })
    );
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <main className="lf container">

      {/* Hero */}
      <header className="lf-hero">
        <div className="lf-hero-left">
          <h1 className="lf-title">Campus Facilities</h1>
          <p className="lf-subtitle">
            M.O.M Sebone Secondary School provides facilities that support academic excellence,
            discipline, learner wellbeing, and participation in sport and culture.
          </p>

          <div className="lf-actions">

            <Button
              onClick={() => navigate("/facilities")}
              variant="primary"
            >
              Full Facilities Page
            </Button>

            <Button
              onClick={() => navigate("/gallery")}
              variant="outline"
            >
              View Photos
            </Button>

          </div>
        </div>

        <div className="lf-hero-right" aria-hidden="true">
          <img
            src="/images/school/school.jpg"
            alt="School Campus"
            className="lf-hero-img"
            onError={(e) => (e.currentTarget.src = "/images/teachers.jpeg")}
          />
        </div>
      </header>

      {/* Feature grid */}
      <section className="lf-grid">
        <FeatureCard title="Academic Facilities" icon="🎓" items={ACADEMIC} />
        <FeatureCard title="Sports & Recreation" icon="🏟️" items={SPORTS} />
        <FeatureCard title="Learner Support Areas" icon="🛡️" items={SUPPORT} />
      </section>

      {/* Photo previews */}
      <section className="lf-photos">
        <div className="lf-photos-head">
          <div>
            <div className="lf-tag"># Preview</div>
            <h2 className="lf-h2">Facilities Photo Preview</h2>
            <p className="lf-muted">Replace these images with your real facility photos.</p>
          </div>

          <Button
            onClick={() => navigate("/gallery")}
            variant="outline"
          >
            Open Gallery →
          </Button>
        </div>

        <div className="lf-photos-grid">
          {GALLERY_PREVIEW.map((x) => (
            <div key={x.title} className="lf-photo">
              <img
                src={x.img}
                alt={x.title}
                onError={(e) => (e.currentTarget.src = "/images/teachers.jpeg")}
              />
              <div className="lf-photo-overlay">
                <div className="lf-photo-title">{x.title}</div>
              </div>
            </div>
          ))}
        </div>

        <p className="lf-note">
          Tip: put images in <code>public/images/facilities/</code> and keep the same names.
        </p>
      </section>
    </main>
  );
}