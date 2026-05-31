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

function getOrganizationPatch(incoming = {}) {
  const patch = {};
  const allowedKeys = [
    "id",
    "name",
    "email",
    "phone",
    "address_line1",
    "city",
    "province",
    "postal_code",
    "country",
  ];

  allowedKeys.forEach((key) => {
    if (Object.prototype.hasOwnProperty.call(incoming, key)) {
      patch[key] = incoming[key];
    }
  });

  return patch;
}

export default function SitePage() {
  const { siteId, "*": wildcardSlug } = useParams();
  const location = useLocation();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [site, setSite] = useState(null);
  const [settings, setSettings] = useState(null);
  const [organization, setOrganization] = useState(null);
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
            .order("location", { ascending: true })
            .order("position", { ascending: true }),
        ]);

        if (siteErr) throw siteErr;
        if (settingsErr) throw settingsErr;
        if (navErr) throw navErr;

        let organizationData = null;

        if (siteData?.organization_id) {
          const { data: orgData, error: orgErr } = await supabase
            .from("organizations")
            .select(
              "id,name,email,phone,address_line1,city,province,postal_code,country",
            )
            .eq("id", siteData.organization_id)
            .maybeSingle();

          if (orgErr) {
            console.error("SitePage organization load error:", orgErr);
          } else {
            organizationData = orgData || null;
          }
        }

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

        const mergedSettings = {
          ...(settingsData || {}),
          organization: organizationData,
          organization_id:
            organizationData?.id || siteData?.organization_id || null,
          organization_name:
            settingsData?.organization_name || organizationData?.name || "",
          site_name:
            settingsData?.site_name ||
            organizationData?.name ||
            "Website Preview",
          email: settingsData?.email || organizationData?.email || "",
          phone: settingsData?.phone || organizationData?.phone || "",
        };

        setSite(siteData || null);
        setSettings(mergedSettings);
        setOrganization(organizationData || null);
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
    /*
      One stable live-update path for Website Details, Logo, Hero Slideshow,
      theme and any future settings fields.

      BuilderMediaEditor can emit both builder:settings-updated and
      site-settings-updated for the same saved patch. Returning the previous
      state when the applied values are already identical prevents duplicate
      rerenders and protects the preview from update loops.
    */
    const applyIncomingSettings = (incoming = {}) => {
      if (!incoming || typeof incoming !== "object" || Array.isArray(incoming)) {
        return;
      }

      const organizationPatch = getOrganizationPatch(incoming);
      const organizationKeys = Object.keys(organizationPatch);
      const hasOrganizationPatch = organizationKeys.length > 0;

      if (hasOrganizationPatch) {
        setOrganization((prev) => {
          const current = prev || {};
          const hasChanges = organizationKeys.some(
            (key) => !Object.is(current[key], organizationPatch[key]),
          );

          if (!hasChanges) return prev;

          return {
            ...current,
            ...organizationPatch,
          };
        });
      }

      setSettings((prev) => {
        const current = prev || {};
        const currentOrganization = current.organization || null;

        const organizationHasChanges =
          hasOrganizationPatch &&
          organizationKeys.some(
            (key) =>
              !Object.is(currentOrganization?.[key], organizationPatch[key]),
          );

        const nextOrganization = hasOrganizationPatch
          ? organizationHasChanges
            ? {
                ...(currentOrganization || {}),
                ...organizationPatch,
              }
            : currentOrganization
          : currentOrganization;

        const next = {
          ...current,
          ...incoming,
          organization: nextOrganization,
          organization_id:
            nextOrganization?.id ||
            incoming?.organization_id ||
            current?.organization_id ||
            null,
          organization_name:
            incoming?.organization_name ||
            current?.organization_name ||
            nextOrganization?.name ||
            "",
          site_name:
            incoming?.site_name ||
            current?.site_name ||
            nextOrganization?.name ||
            "Website Preview",
          email:
            incoming?.email ||
            current?.email ||
            nextOrganization?.email ||
            "",
          phone:
            incoming?.phone ||
            current?.phone ||
            nextOrganization?.phone ||
            "",
        };

        const fieldsToCompare = new Set([
          ...Object.keys(incoming),
          "organization",
          "organization_id",
          "organization_name",
          "site_name",
          "email",
          "phone",
        ]);

        const hasSettingsChanges = Array.from(fieldsToCompare).some(
          (key) => !Object.is(current[key], next[key]),
        );

        return hasSettingsChanges ? next : prev;
      });
    };

    const applyIncomingNavItems = (incoming = []) => {
      if (!Array.isArray(incoming)) return;

      setNavItems((prev) => {
        if (prev === incoming) return prev;

        if (
          Array.isArray(prev) &&
          prev.length === incoming.length &&
          prev.every((item, index) => item === incoming[index])
        ) {
          return prev;
        }

        return incoming;
      });
    };

    const handleSettingsUpdate = (event) => {
      applyIncomingSettings(event?.detail || {});
    };

    const handleNavUpdate = (event) => {
      applyIncomingNavItems(event?.detail || []);
    };

    const handleMessage = (event) => {
      const payload = event?.data;

      if (!payload || typeof payload !== "object") return;

      if (
        payload.type === "builder:settings-updated" ||
        payload.type === "site-settings-updated"
      ) {
        applyIncomingSettings(payload.settings || payload.payload || {});
      }

      if (
        payload.type === "builder:nav-updated" ||
        payload.type === "site-nav-updated"
      ) {
        applyIncomingNavItems(
          payload.navItems || payload.items || payload.payload || [],
        );
      }

      if (
        payload.type === "builder:page-updated" ||
        payload.type === "site-page-updated"
      ) {
        const incomingPage = payload.page || payload.payload || null;

        if (incomingPage?.id) {
          setPage((prev) => {
            if (!prev || prev.id !== incomingPage.id) return prev;

            const hasPageChanges = Object.keys(incomingPage).some(
              (key) => !Object.is(prev[key], incomingPage[key]),
            );

            if (!hasPageChanges) return prev;

            return {
              ...prev,
              ...incomingPage,
            };
          });
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
    const siteName =
      settings?.site_name ||
      settings?.organization?.name ||
      organization?.name ||
      "Website Preview";

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
  }, [
    settings?.site_name,
    settings?.logo_url,
    settings?.organization,
    organization,
  ]);

  if (loading) {
    return <div style={{ padding: 32 }}>Loading…</div>;
  }

  if (error) {
    return <div style={{ padding: 32, color: "crimson" }}>{error}</div>;
  }

  const layoutKey = site?.layout_key;

  const sharedOrganization = organization || settings?.organization || null;

  const sharedProps = {
    site,
    settings: {
      ...(settings || {}),
      site_id: siteId,
      template_key: site?.template_key || settings?.template_key || null,
      organization: sharedOrganization,
      organization_id:
        sharedOrganization?.id ||
        settings?.organization_id ||
        site?.organization_id ||
        null,
      organization_name:
        settings?.organization_name || sharedOrganization?.name || "",
      site_name:
        settings?.site_name ||
        sharedOrganization?.name ||
        "Website Preview",
      email: settings?.email || sharedOrganization?.email || "",
      phone: settings?.phone || sharedOrganization?.phone || "",
    },
    organization: sharedOrganization,
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