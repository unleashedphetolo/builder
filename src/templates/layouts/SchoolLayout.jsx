import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import Section from "../../components/Section";

export default function SchoolLayout({ sections }) {
  return (
    <div>
      <Navbar />

      {sections.map((s) => (
        <Section key={s.id} section={s} />
      ))}

      <Footer />
    </div>
  );
}



