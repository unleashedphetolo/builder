import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../supabase/client";

import SchoolLayout from "../templates/layouts/SchoolLayout";
import BusinessLayout from "../templates/layouts/BusinessLayout";
import PortfolioLayout from "../templates/layouts/PortfolioLayout";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=1600&q=60";

export default function SitePage() {
  const { siteId, slug } = useParams();
  const pageSlug = slug || "/";

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [site, setSite] = useState(null);
  const [settings, setSettings] = useState(null);
  const [navItems, setNavItems] = useState([]);
  const [page, setPage] = useState(null);
  const [sections, setSections] = useState([]);

  useEffect(() => {
    if (!siteId) {
      setError("Missing site.");
      setLoading(false);
      return;
    }

    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        setError("");

        const { data: s, error: sErr } = await supabase
          .from("sites")
          .select("*")
          .eq("id", siteId)
          .single();
        if (sErr) throw sErr;

        const { data: st, error: stErr } = await supabase
          .from("site_settings")
          .select("*")
          .eq("site_id", siteId)
          .maybeSingle();
        if (stErr) throw stErr;

        const { data: nav, error: navErr } = await supabase
          .from("site_nav_items")
          .select("*")
          .eq("site_id", siteId)
          .order("position", { ascending: true });
        if (navErr) throw navErr;

        const { data: p, error: pErr } = await supabase
          .from("site_pages")
          .select("*")
          .eq("site_id", siteId)
          .eq("slug", pageSlug)
          .maybeSingle();
        if (pErr) throw pErr;

        if (!p) throw new Error("Page not found.");

        const { data: secs, error: secErr } = await supabase
          .from("site_sections")
          .select("*")
          .eq("site_id", siteId)
          .eq("page_id", p.id)
          .order("position", { ascending: true });
        if (secErr) throw secErr;

        if (!mounted) return;

        setSite(s);
        setSettings(st);
        setNavItems(nav || []);
        setPage(p);
        setSections(secs || []);
        setLoading(false);
      } catch (e) {
        if (!mounted) return;
        setError(e?.message || String(e));
        setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [siteId, pageSlug]);

  // Apply theme vars
  useEffect(() => {
    if (!settings) return;
    const root = document.documentElement;
    root.style.setProperty("--primary", settings.primary_color || "#2563eb");
    root.style.setProperty("--secondary", settings.secondary_color || "#111827");
    root.style.setProperty("--accent", settings.accent_color || "#f59e0b");
    root.style.setProperty("--font", settings.font_family || "Inter");
  }, [settings]);

  const rendered = useMemo(() => {
    return (sections || []).map((s) => <SectionRenderer key={s.id} section={s} />);
  }, [sections]);

  if (loading) return <div style={{ padding: 32 }}>Loading…</div>;
  if (error) return <div style={{ padding: 32, color: "crimson" }}>{error}</div>;

  const layoutKey = site?.layout_key || "school";

  const Shell =
    layoutKey === "business" ? BusinessLayout : layoutKey === "portfolio" ? PortfolioLayout : SchoolLayout;

  return (
    <Shell settings={{ ...(settings || {}), site_id: siteId }} navItems={navItems}>
      {rendered}
    </Shell>
  );
}

function SectionRenderer({ section }) {
  const c = section.content || {};
  const type = section.type;

  switch (type) {
    case "hero":
      return (
        <section style={heroWrap}>
          <div style={heroCard}>
            <div>
              <p style={badge}>{c.badge || "WELCOME"}</p>
              <h2 style={heroTitle}>{c.title || "A modern school website, ready to edit"}</h2>
              <p style={heroSubtitle}>
                {c.subtitle ||
                  "Update your colors, logo, pages, announcements, gallery and contact details from the builder."}
              </p>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 14 }}>
                <a href={c.primaryHref || "#"} style={primaryBtn} onClick={(e)=> (c.primaryHref?null:e.preventDefault())}>
                  {c.primaryText || "Apply Now"}
                </a>
                <a href={c.secondaryHref || "#"} style={secondaryBtn} onClick={(e)=> (c.secondaryHref?null:e.preventDefault())}>
                  {c.secondaryText || "Learn More"}
                </a>
              </div>
            </div>
            <div style={heroImageWrap}>
              <img
                src={c.image || FALLBACK_IMAGE}
                alt="hero"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                onError={(e) => (e.currentTarget.src = FALLBACK_IMAGE)}
              />
            </div>
          </div>
        </section>
      );

    case "announcements":
      return (
        <section style={sectionWrap}>
          <h3 style={h3}>{c.title || "Announcements"}</h3>
          <div style={grid3}>
            {(c.items || defaultAnnouncements()).map((it, idx) => (
              <div key={idx} style={card}>
                <p style={cardTitle}>{it.title || "Update"}</p>
                <p style={muted}>{it.body || "Add your announcement text."}</p>
              </div>
            ))}
          </div>
        </section>
      );

    case "quick-links":
      return (
        <section style={sectionWrap}>
          <h3 style={h3}>{c.title || "Quick Links"}</h3>
          <div style={grid4}>
            {(c.items || defaultQuickLinks()).map((it, idx) => (
              <a key={idx} href={it.href || "#"} style={quickCard} onClick={(e)=>!it.href&&e.preventDefault()}>
                <p style={cardTitle}>{it.label}</p>
                <p style={muted}>{it.desc}</p>
              </a>
            ))}
          </div>
        </section>
      );

    case "featured":
      return (
        <section style={sectionWrap}>
          <h3 style={h3}>{c.title || "Featured"}</h3>
          <div style={grid3}>
            {(c.items || defaultFeatured()).map((it, idx) => (
              <div key={idx} style={card}>
                <img
                  src={it.image || FALLBACK_IMAGE}
                  alt=""
                  style={{ width: "100%", height: 160, objectFit: "cover", borderRadius: 14 }}
                  onError={(e) => (e.currentTarget.src = FALLBACK_IMAGE)}
                />
                <p style={{ ...cardTitle, marginTop: 12 }}>{it.title}</p>
                <p style={muted}>{it.desc}</p>
              </div>
            ))}
          </div>
        </section>
      );

    case "about":
      return (
        <section style={sectionWrap}>
          <h3 style={h3}>{c.title || "About Our School"}</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: 16, alignItems: "stretch" }}>
            <div style={card}>
              <p style={muted}>
                {c.body ||
                  "This section is editable. Add your school history, vision, mission, and what makes your institution special."}
              </p>
            </div>
            <div style={card}>
              <p style={cardTitle}>{c.sideTitle || "Our Values"}</p>
              <ul style={{ margin: 0, paddingLeft: 18, color: "#334155" }}>
                {(c.values || ["Respect", "Discipline", "Excellence", "Community"]).map((v, i) => (
                  <li key={i} style={{ marginBottom: 6 }}>{v}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      );

    case "gallery":
      return (
        <section style={sectionWrap}>
          <h3 style={h3}>{c.title || "Gallery"}</h3>
          <div style={grid4}>
            {(c.images || [FALLBACK_IMAGE, FALLBACK_IMAGE, FALLBACK_IMAGE, FALLBACK_IMAGE]).map((src, idx) => (
              <div key={idx} style={{ ...card, padding: 0, overflow: "hidden" }}>
                <img
                  src={src}
                  alt=""
                  style={{ width: "100%", height: 160, objectFit: "cover" }}
                  onError={(e) => (e.currentTarget.src = FALLBACK_IMAGE)}
                />
              </div>
            ))}
          </div>
        </section>
      );

    case "contact":
      return (
        <section style={sectionWrap}>
          <h3 style={h3}>{c.title || "Contact"}</h3>
          <div style={{ ...card, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div>
              <p style={muted}>{c.body || "Update your contact details in the Brand tab."}</p>
              <div style={{ marginTop: 12, color: "#0f172a" }}>
                <p style={{ margin: "0 0 6px" }}><strong>Email:</strong> {c.email || "info@yourschool.co.za"}</p>
                <p style={{ margin: "0 0 6px" }}><strong>Phone:</strong> {c.phone || "+27 00 000 0000"}</p>
                <p style={{ margin: 0 }}><strong>Address:</strong> {c.address || "Your address"}</p>
              </div>
            </div>
            <form onSubmit={(e)=>e.preventDefault()}>
              <input placeholder="Full name" style={input} />
              <input placeholder="Email" style={input} />
              <textarea placeholder="Message" style={{ ...input, minHeight: 96, resize: "vertical" }} />
              <button style={primaryBtn} type="submit">Send</button>
            </form>
          </div>
        </section>
      );

    default:
      return (
        <section style={sectionWrap}>
          <h3 style={h3}>{c.title || type}</h3>
          <p style={muted}>{c.subtitle || ""}</p>
        </section>
      );
  }
}

function defaultAnnouncements() {
  return [
    { title: "Term dates updated", body: "Update this announcement in the builder." },
    { title: "Admissions open", body: "Enable/disable sections and update content per school." },
    { title: "Sports day", body: "Add events, notices, and news as needed." },
  ];
}

function defaultQuickLinks() {
  return [
    { label: "Admissions", desc: "Requirements, fees and forms", href: "/admissions" },
    { label: "News", desc: "Latest updates & notices", href: "/news" },
    { label: "Gallery", desc: "School life & events", href: "/gallery" },
    { label: "Contact", desc: "Get in touch", href: "/contact" },
  ];
}

function defaultFeatured() {
  return [
    { title: "Academic Excellence", desc: "Highlight your results and programs.", image: FALLBACK_IMAGE },
    { title: "Sports & Culture", desc: "Showcase teams, clubs and activities.", image: FALLBACK_IMAGE },
    { title: "Safe Campus", desc: "Communicate policies and learner support.", image: FALLBACK_IMAGE },
  ];
}

const sectionWrap = { padding: 18, background: "transparent" };
const heroWrap = { padding: 18 };
const heroCard = {
  display: "grid",
  gridTemplateColumns: "1fr 0.9fr",
  gap: 16,
  background: "white",
  border: "1px solid #e5e7eb",
  borderRadius: 18,
  padding: 18,
  boxShadow: "0 10px 30px rgba(2,6,23,0.06)",
};
const heroImageWrap = { width: "100%", height: 320, borderRadius: 18, overflow: "hidden" };
const badge = {
  display: "inline-flex",
  padding: "6px 10px",
  borderRadius: 999,
  background: "rgba(37,99,235,0.10)",
  color: "var(--primary)",
  fontWeight: 700,
  fontSize: 12,
  margin: 0,
};
const heroTitle = { margin: "10px 0 0", fontSize: 28, color: "#0f172a" };
const heroSubtitle = { margin: "10px 0 0", color: "#475569", lineHeight: 1.6 };

const h3 = { margin: "0 0 12px", color: "#0f172a" };
const grid3 = { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 };
const grid4 = { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 };
const card = {
  background: "white",
  border: "1px solid #e5e7eb",
  borderRadius: 18,
  padding: 16,
  boxShadow: "0 10px 26px rgba(2,6,23,0.05)",
};
const quickCard = {
  ...card,
  textDecoration: "none",
  color: "inherit",
  display: "block",
};
const cardTitle = { margin: 0, fontWeight: 800, color: "#0f172a" };
const muted = { margin: "8px 0 0", color: "#475569", lineHeight: 1.55 };

const primaryBtn = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "10px 14px",
  borderRadius: 12,
  background: "var(--primary)",
  color: "white",
  textDecoration: "none",
  fontWeight: 700,
  border: "none",
  cursor: "pointer",
};
const secondaryBtn = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "10px 14px",
  borderRadius: 12,
  background: "rgba(15,23,42,0.06)",
  color: "#0f172a",
  textDecoration: "none",
  fontWeight: 700,
  border: "1px solid rgba(15,23,42,0.10)",
};

const input = {
  width: "100%",
  padding: "10px 12px",
  borderRadius: 12,
  border: "1px solid #e5e7eb",
  outline: "none",
  marginBottom: 10,
};

// Responsive
if (typeof window !== "undefined") {
  const mq = window.matchMedia("(max-width: 900px)");
  // This only affects style objects if re-render happens; layout CSS covers most.
  if (mq.matches) {
    heroCard.gridTemplateColumns = "1fr";
    grid3.gridTemplateColumns = "1fr";
    grid4.gridTemplateColumns = "1fr";
    heroImageWrap.height = 240;
  }
}
