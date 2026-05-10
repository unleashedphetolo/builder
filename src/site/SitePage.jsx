import { useEffect, useMemo, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { supabase } from "../supabase/client";

import SchoolLayout from "../layouts/SchoolLayout";
import BusinessLayout from "../layouts/BusinessLayout";
import PortfolioLayout from "../layouts/PortfolioLayout";

function normalizePageSlug(slug = "/") {
  const raw = String(slug || "/").trim();

  const cleanRaw = raw
    .split("?")[0]
    .split("#")[0]
    .replace(/^\/+|\/+$/g, "");

  if (!cleanRaw || cleanRaw.toLowerCase() === "home") return "/";

  return `/${cleanRaw}`;
}

export default function SitePage() {
  const { siteId, "*": wildcardSlug } = useParams();
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

    if (typeof wildcardSlug === "string") {
      return normalizePageSlug(wildcardSlug);
    }

    const path = location.pathname.replace(`/site/${siteId}`, "") || "/";
    return normalizePageSlug(path);
  }, [location.pathname, siteId, wildcardSlug]);

  const isBuilderMode = useMemo(() => {
    const search = new URLSearchParams(location.search);
    return search.get("builder") === "1";
  }, [location.search]);

  const isPublicPreview = useMemo(() => {
    const search = new URLSearchParams(location.search);
    return search.get("preview") === "1";
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
            .neq("is_visible", false)
            .order("location", { ascending: true })
            .order("position", { ascending: true }),
        ]);

        if (siteErr) throw siteErr;
        if (settingsErr) throw settingsErr;
        if (navErr) throw navErr;

        let pageQuery = supabase
          .from("site_pages")
          .select("*")
          .eq("site_id", siteId)
          .eq("slug", pageSlug);

        // builder=1 can open hidden pages for editing.
        // preview=1 must behave like public website preview.
        if (!isBuilderMode) {
          pageQuery = pageQuery
            .neq("is_visible", false)
            .neq("is_published", false);
        }

        let { data: pageData, error: pageErr } = await pageQuery.maybeSingle();

        if (pageErr) throw pageErr;

        // fallback to home if slug page not found
        if (!pageData && pageSlug !== "/") {
          let homeQuery = supabase
            .from("site_pages")
            .select("*")
            .eq("site_id", siteId)
            .eq("slug", "/");

          if (!isBuilderMode) {
            homeQuery = homeQuery
              .neq("is_visible", false)
              .neq("is_published", false);
          }

          const { data: homePage, error: homeErr } =
            await homeQuery.maybeSingle();

          if (homeErr) throw homeErr;
          pageData = homePage;
        }

        if (!pageData) {
          throw new Error("Page not found.");
        }

        let sectionQuery = supabase
          .from("site_sections")
          .select("*")
          .eq("site_id", siteId)
          .eq("page_id", pageData.id)
          .order("position", { ascending: true });

        if (!isBuilderMode) {
          sectionQuery = sectionQuery.neq("visible", false);
        }

        const { data: sectionData, error: sectionErr } = await sectionQuery;

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
  }, [siteId, pageSlug, isBuilderMode, isPublicPreview]);

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

  useEffect(() => {
    const handleSettingsUpdate = (event) => {
      const incoming = event?.detail || {};

      setSettings((prev) => ({
        ...(prev || {}),
        ...(incoming || {}),
      }));
    };

    const handleNavUpdate = (event) => {
      const incoming = event?.detail || [];

      if (Array.isArray(incoming)) {
        setNavItems(incoming.filter((item) => item?.is_visible !== false));
      }
    };

    const handleMessage = (event) => {
      const payload = event?.data;

      if (!payload || typeof payload !== "object") return;

      if (
        payload.type === "builder:settings-updated" ||
        payload.type === "site-settings-updated"
      ) {
        setSettings((prev) => ({
          ...(prev || {}),
          ...(payload.settings || payload.payload || {}),
        }));
      }

      if (
        payload.type === "builder:nav-updated" ||
        payload.type === "site-nav-updated"
      ) {
        const incoming =
          payload.navItems || payload.items || payload.payload || [];

        if (Array.isArray(incoming)) {
          setNavItems(incoming.filter((item) => item?.is_visible !== false));
        }
      }
    };

    window.addEventListener("builder:settings-updated", handleSettingsUpdate);
    window.addEventListener("site-settings-updated", handleSettingsUpdate);
    window.addEventListener("builder:nav-updated", handleNavUpdate);
    window.addEventListener("site-nav-updated", handleNavUpdate);
    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener(
        "builder:settings-updated",
        handleSettingsUpdate,
      );
      window.removeEventListener(
        "site-settings-updated",
        handleSettingsUpdate,
      );
      window.removeEventListener("builder:nav-updated", handleNavUpdate);
      window.removeEventListener("site-nav-updated", handleNavUpdate);
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  useEffect(() => {
    const siteName = settings?.site_name || "Website Preview";
    const siteLogo = settings?.logo_url || "/favicon.ico";

    document.title = siteName;

    // Remove existing builder/app favicons first
    document
      .querySelectorAll(
        'link[rel="icon"], link[rel="shortcut icon"], link[rel="apple-touch-icon"]',
      )
      .forEach((icon) => icon.remove());

    const logoWithRefresh = siteLogo.includes("?")
      ? `${siteLogo}&v=${Date.now()}`
      : `${siteLogo}?v=${Date.now()}`;

    const icon = document.createElement("link");
    icon.rel = "icon";
    icon.href = logoWithRefresh;
    document.head.appendChild(icon);

    const shortcutIcon = document.createElement("link");
    shortcutIcon.rel = "shortcut icon";
    shortcutIcon.href = logoWithRefresh;
    document.head.appendChild(shortcutIcon);

    const appleIcon = document.createElement("link");
    appleIcon.rel = "apple-touch-icon";
    appleIcon.href = logoWithRefresh;
    document.head.appendChild(appleIcon);
  }, [settings?.site_name, settings?.logo_url]);

  if (loading) {
    return <div style={{ padding: 32 }}>Loading…</div>;
  }

  if (error) {
    return <div style={{ padding: 32, color: "crimson" }}>{error}</div>;
  }

  const layoutKey = site?.layout_key;

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
    builderMode: isBuilderMode,
    previewMode: isPublicPreview,
  };

  if (layoutKey === "school") {
    return <SchoolLayout {...sharedProps} />;
  }

  if (layoutKey === "business") {
    return <BusinessLayout {...sharedProps} />;
  }

  if (layoutKey === "portfolio") {
    return <PortfolioLayout {...sharedProps} />;
  }

  return (
    <div style={{ padding: 32, color: "crimson" }}>
      Website layout not found. Please select a template.
    </div>
  );
}