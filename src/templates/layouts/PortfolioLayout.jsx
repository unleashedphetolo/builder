import Section from "../../components/Section";

export default function PortfolioLayout({ sections }) {
  return (
    <div>
      {sections.map((s) => (
        <Section key={s.id} section={s} />
      ))}
    </div>
  );
}