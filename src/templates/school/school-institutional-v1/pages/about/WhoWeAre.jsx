import React from "react";
import Card from "../../components/common/Card";
import "../../styles/who-we-are.css";
import Breadcrumbs from "../../components/common/Breadcrumbs";

export default function WhoWeAre() {
  return (
    <main className="wwa container">
      <Breadcrumbs />
      {/* Hero */}
      <header className="wwa-hero">
        <div className="wwa-hero-left">
          {/* School image */}
          <img
            src="/images/school/school.jpg"
            alt="M.O.M Sebone Secondary School"
            className="wwa-left-img"
            onError={(e) => (e.currentTarget.src = "/images/teachers.jpeg")}
          />

          <h1 className="wwa-title">Who We Are</h1>

          <p className="wwa-subtitle">
            M.O.M Sebone Secondary School is a learner-centred institution
            committed to academic excellence, discipline, and holistic
            development—supported by educators, parents, and community partners.
          </p>

          <div className="wwa-meta">
            <span className="wwa-pill">Learner Support</span>
            <span className="wwa-pill">Academic Excellence</span>
            <span className="wwa-pill">Discipline & Values</span>
          </div>
        </div>

        <div className="wwa-hero-right" aria-hidden="true">
          <img
            src="/images/school/school.jpg"
            alt="M.O.M Sebone Secondary School"
            className="wwa-hero-img"
            onError={(e) => (e.currentTarget.src = "/images/teachers.jpeg")}
          />
          <div className="wwa-badge">Official School Profile</div>
          <div className="wwa-stat">
            <div className="wwa-stat-num">8–12</div>
            <div className="wwa-stat-label">Grades Offered</div>
          </div>
          <div className="wwa-stat">
            <div className="wwa-stat-num">Community</div>
            <div className="wwa-stat-label">Partnership & Involvement</div>
          </div>
        </div>
      </header>

      {/* Cards */}
      <section className="wwa-grid">
        <Card>
          <h2 className="wwa-card-title">Our Community</h2>
          <p className="wwa-text">
            We are a learner-centred secondary school committed to discipline,
            respect, and academic achievement—supported by teachers, parents,
            and community partners.
          </p>
          <ul className="wwa-list">
            <li>Safe, supportive learning environment</li>
            <li>Strong parent and community participation</li>
            <li>Respect, accountability, and growth</li>
          </ul>
        </Card>

        <Card>
          <h2 className="wwa-card-title">Our Leadership</h2>
          <p className="wwa-text">
            Our leadership promotes quality teaching, structured learner
            support, and transparent collaboration with parents and
            stakeholders.
          </p>
          <ul className="wwa-list">
            <li>Academic planning and performance monitoring</li>
            <li>Clear communication and accountability</li>
            <li>Support for educators and learners</li>
          </ul>
        </Card>

        <Card>
          <h2 className="wwa-card-title">What We Believe</h2>
          <p className="wwa-text">
            Every learner can succeed with the right guidance, consistent
            effort, and a safe environment that builds confidence and character.
          </p>
          <ul className="wwa-list">
            <li>High expectations with learner support</li>
            <li>Values-driven behaviour and discipline</li>
            <li>Opportunities in academics, sport, and culture</li>
          </ul>
        </Card>
      </section>

      {/* Statement */}
      <section className="wwa-footer">
        <div className="wwa-callout">
          <h3 className="wwa-callout-title">Our Commitment</h3>
          <p className="wwa-callout-text">
            We are committed to developing responsible, confident learners who
            are prepared for further education, training, and active
            citizenship.
          </p>
        </div>
      </section>
    </main>
  );
}
