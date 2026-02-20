import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import HeroSlider from "../../components/HeroSlider";
import Section from "../../components/Section";
import { SCHOOL_THEMES } from "../themes";

export default function SchoolLayout({ theme, sections }) {
  const t = SCHOOL_THEMES[theme];

  return (
    <div style={{ background: t.bg, fontFamily: t.font }}>
      <Navbar />

      <HeroSlider />

      {sections.map((s) => (
        <Section key={s.id} section={s} />
      ))}

      <Footer />
    </div>
  );
}
