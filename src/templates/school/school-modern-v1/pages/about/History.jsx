import React from "react";
import Card from "../../components/common/Card";
import "../../styles/history.css";
import Breadcrumbs from "../../components/common/Breadcrumbs";

const HIGHLIGHTS = [
  {
    title: "Academic Focus",
    text: "Strong teaching culture, discipline, and learner support across all grades.",
  },
  {
    title: "Learner Development",
    text: "Sports, culture, and leadership programmes that build confidence and character.",
  },
  {
    title: "Community Partnership",
    text: "Working closely with parents, local stakeholders, and the School Governing Body.",
  },
  {
    title: "Future-Ready",
    text: "Continuous improvement through innovation, technology, and learner-centred growth.",
  },
];

const TIMELINE = [
  {
    year: "1990",
    title: "School Established",
    text: "Founded to serve the growing demand for quality secondary education.",
  },
  {
    year: "2002",
    title: "Facilities Expanded",
    text: "Additional classrooms and improved learning infrastructure introduced.",
  },
  {
    year: "2012",
    title: "Learner Support Strengthened",
    text: "Guidance, academic support, and school systems improved.",
  },
  {
    year: "2020",
    title: "Modernisation",
    text: "Improved school operations and stronger academic focus for consistency.",
  },
  {
    year: "Today",
    title: "Building Excellence",
    text: "A renewed commitment to results, discipline, and learner development.",
  },
];

const PRINCIPALS = [
  {
    name: "P. Mathibe",
    years: "2021 – Present",
    image: "/images/principals/mathibe.jpg",
  },
  {
    name: "M. Dlamini",
    years: "2010 – 2020",
    image: "/images/principals/dlamini.jpg",
  },
  {
    name: "T. Nkosi",
    years: "1996 – 2009",
    image: "/images/principals/nkosi.jpg",
  },
];

const GALLERY = [
  { src: "/images/school/history-1.jpg", alt: "School campus view" },
  { src: "/images/school/history-2.jpg", alt: "Learners in activity" },
  { src: "/images/school/history-3.jpg", alt: "School event moment" },
];

export default function History() {
  return (
    <main className="history-page container">
      <Breadcrumbs />
      {/* HERO */}
      <header className="history-hero">
        <div className="history-hero-left">
          <h2 className="section-title">Our History</h2>
          <p className="history-subtitle">
            M.O.M Sebone Secondary School is built on a foundation of
            discipline, respect, and academic progress — strengthened by
            community partnership and a commitment to preparing learners for the
            future.
          </p>

          <div className="history-badges" aria-label="School values badges">
            <span className="history-badge">Discipline</span>
            <span className="history-badge">Academic Excellence</span>
            <span className="history-badge">Leadership</span>
            <span className="history-badge">Community</span>
          </div>
        </div>

        <div className="history-hero-right">
          <div className="history-hero-card">
            <div className="history-hero-label">Institutional Profile</div>

            <div className="history-stats">
              <div className="history-stat">
                <div className="history-stat-num">1990</div>
                <div className="history-stat-lbl">Established</div>
              </div>

              <div className="history-stat">
                <div className="history-stat-num">8–12</div>
                <div className="history-stat-lbl">Grades</div>
              </div>

              <div className="history-stat">
                <div className="history-stat-num">Sebone</div>
                <div className="history-stat-lbl">Community</div>
              </div>
            </div>

            <div className="history-hero-note">
              Update numbers and details anytime to match your official records.
            </div>
          </div>
        </div>
      </header>

      {/* HIGHLIGHTS */}
      <section className="history-section">
        <div className="history-section-head">
          <h3 className="history-h3">Key Highlights</h3>
          <p className="history-muted">
            The pillars that shaped the school’s identity and growth.
          </p>
        </div>

        <div className="history-grid">
          {HIGHLIGHTS.map((h) => (
            <div key={h.title} className="history-mini-card">
              <div className="history-mini-title">{h.title}</div>
              <div className="history-mini-text">{h.text}</div>
            </div>
          ))}
        </div>
      </section>

      {/* TIMELINE */}
      <section className="history-section">
        <div className="history-section-head">
          <h3 className="history-h3">Milestones Timeline</h3>
          <p className="history-muted">
            A structured view of progress and growth over time.
          </p>
        </div>

        <Card>
          <div className="history-timeline">
            {TIMELINE.map((t, idx) => (
              <div key={t.year + t.title} className="history-item">
                <div className="history-dot" aria-hidden="true" />
                <div className="history-year">{t.year}</div>
                <div className="history-content">
                  <div className="history-title">{t.title}</div>
                  <div className="history-text">{t.text}</div>
                </div>
                {idx !== TIMELINE.length - 1 && (
                  <div className="history-line" aria-hidden="true" />
                )}
              </div>
            ))}
          </div>
        </Card>
      </section>

      {/* LEADERSHIP */}
      <section className="history-section">
        <div className="history-section-head">
          <h3 className="history-h3">Leadership Over Time</h3>
          <p className="history-muted">
            Add official leadership history as your records are confirmed.
          </p>
        </div>

        <div className="history-leadership">
          {PRINCIPALS.map((p) => (
            <div key={p.name} className="history-leader">
              <div className="history-leader-image">
                <img
                  src={p.image}
                  alt={p.name}
                  onError={(e) => {
                    e.currentTarget.src = "/images/teachers.jpeg";
                  }}
                />
              </div>

              <div className="history-leader-name">{p.name}</div>

              <div className="history-leader-years">Principal ({p.years})</div>
            </div>
          ))}
        </div>
      </section>

      {/* GALLERY */}
      <section className="history-section">
        <div className="history-section-head">
          <h3 className="history-h3">Gallery</h3>
          <p className="history-muted">
            Optional: add images to highlight school growth and achievements.
          </p>
        </div>

        <div className="history-gallery">
          {GALLERY.map((img) => (
            <div key={img.src} className="history-photo">
              <img
                src={img.src}
                alt={img.alt}
                onError={(e) => {
                  e.currentTarget.src = "/images/teachers.jpeg";
                }}
              />
            </div>
          ))}
        </div>

        <div className="history-footnote">
          Tip: Put images in <code>public/images/school/</code> and keep
          filenames simple.
        </div>
      </section>
    </main>
  );
}
