import React from "react";
import "../../styles/about.css";

const DEFAULT_CARDS = [
  {
    id: "vision",
    eyebrow: "Vision",
    title: "Our Vision",
    body:
      "To be a dynamic centre of excellence where all stakeholders work collaboratively to achieve educational goals, developing learners holistically into responsible, disciplined citizens who make a meaningful contribution to society.",
  },
  {
    id: "mission",
    eyebrow: "Mission",
    title: "Our Mission",
    body:
      "To achieve our vision through efficient management, democratic governance, quality leadership, committed stakeholder participation, and a nurturing environment that promotes personal growth and academic excellence.",
  },
  {
    id: "values",
    eyebrow: "Values",
    title: "Our Motto & Core Values",
    values: [
      "Accountability",
      "Punctuality",
      "Respect",
      "Reliability",
      "Co-operation",
      "Hard Work",
      "Commitment",
    ],
  },
];

export default function AboutSection({ content = {} }) {
  const cards =
    Array.isArray(content?.cards) && content.cards.length > 0
      ? content.cards
      : DEFAULT_CARDS;

  return (
    <section className="about container">
      <div className="about-horizontal">
        {cards.map((card, index) => (
          <div
            key={card.id || `${card.title || "about-card"}-${index}`}
            className="about-card"
          >
            <span className="about-label">{card.eyebrow || ""}</span>
            <h3>{card.title || ""}</h3>

            {Array.isArray(card.values) && card.values.length > 0 ? (
              <ul className="values-list">
                {card.values.map((value, valueIndex) => (
                  <li key={`${value}-${valueIndex}`}>{value}</li>
                ))}
              </ul>
            ) : (
              <p>{card.body || ""}</p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
