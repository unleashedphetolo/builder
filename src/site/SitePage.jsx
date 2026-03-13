import { useEffect, useMemo, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { supabase } from "../supabase/client";

import SchoolLayout from "../layouts/SchoolLayout";
import BusinessLayout from "../layouts/BusinessLayout";
import PortfolioLayout from "../layouts/PortfolioLayout";

export default function SitePage() {
  const { siteId } = useParams();
  const location = useLocation();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [site, setSite] = useState(null);
  const [settings, setSettings] = useState(null);
  const [navItems, setNavItems] = useState([]);
  const [page, setPage] = useState(null);
  const [sections, setSections] = useState([]);

  const pageSlug = useMemo(() => {
    if (!siteId) return "/";
    const path = location.pathname.replace(`/site/${siteId}`, "") || "/";
    return path === "" ? "/" : path;
  }, [location.pathname, siteId]);

  const isBuilderPreview = useMemo(() => {
    const search = new URLSearchParams(location.search);
    return search.get("builder") === "1" || search.get("preview") === "1";
  }, [location.search]);

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

        const [
          { data: siteData, error: siteErr },
          { data: settingsData, error: settingsErr },
          { data: navData, error: navErr },
        ] = await Promise.all([
          supabase.from("sites").select("*").eq("id", siteId).single(),

          supabase
            .from("site_settings")
            .select("*")
            .eq("site_id", siteId)
            .maybeSingle(),

          supabase
            .from("site_nav_items")
            .select("*")
            .eq("site_id", siteId)
            .order("position", { ascending: true }),
        ]);

        if (siteErr) throw siteErr;
        if (settingsErr) throw settingsErr;
        if (navErr) throw navErr;

        let { data: pageData, error: pageErr } = await supabase
          .from("site_pages")
          .select("*")
          .eq("site_id", siteId)
          .eq("slug", pageSlug)
          .maybeSingle();

        if (pageErr) throw pageErr;

        // fallback to home if slug page not found
        if (!pageData && pageSlug !== "/") {
          const { data: homePage, error: homeErr } = await supabase
            .from("site_pages")
            .select("*")
            .eq("site_id", siteId)
            .eq("slug", "/")
            .maybeSingle();

          if (homeErr) throw homeErr;
          pageData = homePage;
        }

        if (!pageData) {
          throw new Error("Page not found.");
        }

        const { data: sectionData, error: sectionErr } = await supabase
          .from("site_sections")
          .select("*")
          .eq("site_id", siteId)
          .eq("page_id", pageData.id)
          .order("position", { ascending: true });

        if (sectionErr) throw sectionErr;

        if (!mounted) return;

        setSite(siteData || null);
        setSettings(settingsData || null);
        setNavItems(navData || []);
        setPage(pageData || null);
        setSections(sectionData || []);
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

  useEffect(() => {
    if (!settings) return;

    const root = document.documentElement;
    root.style.setProperty("--primary", settings.primary_color || "#2563eb");
    root.style.setProperty(
      "--secondary",
      settings.secondary_color || "#111827",
    );
    root.style.setProperty("--accent", settings.accent_color || "#f59e0b");
    root.style.setProperty(
      "--font",
      settings.font_family || "Inter, sans-serif",
    );
  }, [settings]);

  if (loading) {
    return <div style={{ padding: 32 }}>Loading…</div>;
  }

  if (error) {
    return <div style={{ padding: 32, color: "crimson" }}>{error}</div>;
  }

  const layoutKey = site?.layout_key || "school";

  const sharedProps = {
    site,
    settings: {
      ...(settings || {}),
      site_id: siteId,
      template_key: site?.template_key || settings?.template_key || null,
    },
    navItems: navItems || [],
    page,
    sections: sections || [],
    builderMode: isBuilderPreview,
  };

  if (layoutKey === "business") {
    return <BusinessLayout {...sharedProps} />;
  }

  if (layoutKey === "portfolio") {
    return <PortfolioLayout {...sharedProps} />;
  }

  return <SchoolLayout {...sharedProps} />;
}
