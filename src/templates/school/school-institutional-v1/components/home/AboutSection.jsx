import React from "react";
import "../../styles/about.css";

export default function AboutSection() {
  return (
    <section className="about container">
      <div className="about-horizontal">
        <div className="about-card">
          <span className="about-label">Vision</span>
          <h3>Our Vision</h3>
          <p>
            To be a dynamic centre of excellence where all stakeholders work collaboratively
            to achieve educational goals, developing learners holistically into responsible,
            disciplined citizens who make a meaningful contribution to society.
          </p>
        </div>

        <div className="about-card">
          <span className="about-label">Mission</span>
          <h3>Our Mission</h3>
          <p>
            To achieve our vision through efficient management, democratic governance,
            quality leadership, committed stakeholder participation, and a nurturing
            environment that promotes personal growth and academic excellence.
          </p>
        </div>

        <div className="about-card">
          <span className="about-label">Values</span>
          <h3>Our Motto & Core Values</h3>
          <ul className="values-list">
            <li>Accountability</li>
            <li>Punctuality</li>
            <li>Respect</li>
            <li>Reliability</li>
            <li>Co-operation</li>
            <li>Hard Work</li>
            <li>Commitment</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
