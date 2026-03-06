import React from "react";
import "../../styles/life-sports.css";
import Breadcrumbs from "../../components/common/Breadcrumbs";

const SPORTS = [
  {
    title: "Team Sports",
    text: "Structured training sessions, competitive fixtures, and school pride that build discipline, teamwork, and resilience.",
  },
  {
    title: "Athletic Development",
    text: "Programmes designed to improve strength, coordination, endurance, and overall physical performance.",
  },
  {
    title: "Fitness & Wellness",
    text: "Physical education initiatives that promote healthy lifestyles and balanced learner development.",
  },
  {
    title: "Inclusive Participation",
    text: "Opportunities for all learners to participate, develop skills, and proudly represent the school.",
  },
];

export default function LifeSports() {
  return (
    <main className="ls container">
      <Breadcrumbs />
      {/* Hero */}
      <header className="ls-hero">
        <div className="ls-hero-grid">
          {/* Left Text */}
          <div className="ls-hero-copy">
            <h1 className="ls-title">Sports & Recreation</h1>
            <p className="ls-subtitle">
              Our sports programme promotes teamwork, discipline, and
              excellence—developing confident learners through structured
              training and competitive participation.
            </p>
          </div>

          {/* Right Image */}
          <div className="ls-hero-media" aria-hidden="true">
            <img
              src="/images/gallery2.avif"
              alt="Soccer Team 2025"
              className="ls-hero-img"
              onError={(e) =>
                (e.currentTarget.src = "/images/gallery1.jpg")
              }
            />
          </div>
        </div>
      </header>

      {/* Sports Grid */}
      <section className="ls-grid">
        {SPORTS.map((item) => (
          <div key={item.title} className="ls-card">
            <h3 className="ls-card-title">{item.title}</h3>
            <p className="ls-card-text">{item.text}</p>
          </div>
        ))}
      </section>
    </main>
  );
}