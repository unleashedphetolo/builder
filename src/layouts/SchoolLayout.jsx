import React, { useMemo } from "react";

/**
 * SchoolLayout
 * ----------------------------------------------------
 * Chooses the correct school template shell based on:
 *   settings.template_key
 *
 * Supported:
 * - school-institutional-v1
 * - school-modern-v1
 *
 * Falls back safely to institutional.
 *
 * Expected props:
 * - settings
 * - navItems
 * - children
 */

// ===== Institutional Template Imports =====
import InstitutionalTopbar from "../templates/school/school-institutional-v1/components/layout/Topbar";
import InstitutionalNavbar from "../templates/school/school-institutional-v1/components/layout/Navbar";
import InstitutionalFooter from "../templates/school/school-institutional-v1/components/layout/Footer";

// ===== Modern Template Imports =====
import ModernTopbar from "../templates/school/school-modern-v1/components/layout/Topbar";
import ModernNavbar from "../templates/school/school-modern-v1/components/layout/Navbar";
import ModernFooter from "../templates/school/school-modern-v1/components/layout/Footer";

// ===== Fallbacks =====
const DEFAULT_LOGO =
  "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=300&q=60";

const DEFAULT_SOCIAL_LINKS = {
  facebook: "https://facebook.com",
  x: "https://x.com",
  instagram: "https://instagram.com",
  youtube: "https://youtube.com",
  tiktok: "https://tiktok.com",
  linkedin: "https://linkedin.com",
  whatsapp: "https://wa.me/",
};

const DEFAULT_SOCIAL_DISPLAY = {
  facebook: true,
  x: true,
  instagram: true,
  youtube: true,
  tiktok: true,
  linkedin: true,
  whatsapp: true,
  topbar: true,
  footer: true,
};

const DEFAULT_SETTINGS = {
  template_key: "school-institutional-v1",
  site_name: "Your School Name",
  tagline: "Excellence in Learning",
  motto: "Discipline • Respect • Success",
  logo_url: DEFAULT_LOGO,
  email: "info@yourschool.co.za",
  phone: "+27 00 000 0000",
  address_line1: "Your school address",
  city: "Johannesburg",
  province: "Gauteng",
  postal_code: "0000",
  country: "South Africa",
  primary_color: "#1e40af",
  secondary_color: "#0f172a",
  accent_color: "#f59e0b",
  font_family: "Inter, sans-serif",
  social_links: DEFAULT_SOCIAL_LINKS,
  social_display: DEFAULT_SOCIAL_DISPLAY,
  footer_text: "© Your School. All rights reserved.",
  footer_links: [],
  topbar_links: [],
};

function normalizeSettings(settings = {}) {
  return {
    ...DEFAULT_SETTINGS,
    ...settings,
    social_links: {
      ...DEFAULT_SOCIAL_LINKS,
      ...(settings?.social_links || {}),
    },
    social_display: {
      ...DEFAULT_SOCIAL_DISPLAY,
      ...(settings?.social_display || {}),
    },
    logo_url: settings?.logo_url || DEFAULT_LOGO,
  };
}

function normalizeNavItems(navItems = []) {
  if (!Array.isArray(navItems)) return [];

  return navItems
    .filter((item) => item && item.is_visible !== false)
    .sort((a, b) => (a.position ?? 0) - (b.position ?? 0));
}

function getTemplateShell(templateKey) {
  switch (templateKey) {
    case "school-modern-v1":
      return {
        Topbar: ModernTopbar,
        Navbar: ModernNavbar,
        Footer: ModernFooter,
      };

    case "school-institutional-v1":
    default:
      return {
        Topbar: InstitutionalTopbar,
        Navbar: InstitutionalNavbar,
        Footer: InstitutionalFooter,
      };
  }
}

export default function SchoolLayout({ settings, navItems, children }) {
  const safeSettings = useMemo(() => normalizeSettings(settings), [settings]);
  const safeNavItems = useMemo(() => normalizeNavItems(navItems), [navItems]);

  const templateKey = safeSettings?.template_key || "school-institutional-v1";
  const { Topbar, Navbar, Footer } = useMemo(
    () => getTemplateShell(templateKey),
    [templateKey]
  );

  const showTopbar = safeSettings?.social_display?.topbar !== false;
  const showFooter = safeSettings?.social_display?.footer !== false;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f8fafc",
        color: "#0f172a",
        fontFamily: safeSettings.font_family || "Inter, sans-serif",
      }}
    >
      {showTopbar && (
        <Topbar
          settings={safeSettings}
          socialLinks={safeSettings.social_links}
          socialDisplay={safeSettings.social_display}
          topbarLinks={safeSettings.topbar_links || []}
        />
      )}

      <Navbar
        settings={safeSettings}
        navItems={safeNavItems}
      />

      <main
        style={{
          width: "100%",
          maxWidth: 1440,
          margin: "0 auto",
        }}
      >
        {children}
      </main>

      {showFooter && (
        <Footer
          settings={safeSettings}
          socialLinks={safeSettings.social_links}
          socialDisplay={safeSettings.social_display}
          footerLinks={safeSettings.footer_links || []}
        />
      )}
    </div>
  );
}