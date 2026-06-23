import React, { useMemo } from "react";
import BusinessLink from "../common/BusinessLink";
import SocialLinks from "../common/SocialLinks";
import { normalizeNavItemsFromPages } from "../../utils/nav";
import logo from "../../../../../assets/logo.gif";

function currentYear() {
  return new Date().getFullYear();
}

function footerCompanyName(settings = {}) {
  return (
    settings.footer_company_name ||
    settings.company_name ||
    settings.business_name ||
    settings.site_name ||
    "Finance Capital"
  );
}

function resolveFooterText(settings = {}) {
  const year = currentYear();
  const name = footerCompanyName(settings);
  const customText = settings.footer_text || settings.copyright_text || "";

  if (customText && customText.includes("{year}")) {
    return customText
      .replaceAll("{year}", String(year))
      .replaceAll("{name}", name);
  }

  if (
    customText &&
    customText !== "© Finance Capital. All rights reserved."
  ) {
    return customText;
  }

  return `© ${year} ${name}. All rights reserved.`;
}

export default function Footer({
  settings,
  navItems = [],
  pages = [],
  navigateTo,
  builderMode,
}) {
  const footerLinks = useMemo(
    () => normalizeNavItemsFromPages({ navItems, pages, location: "footer" }),
    [navItems, pages],
  );

  const links = footerLinks.length
    ? footerLinks
    : [
        { label: "Services", href: "/services" },
        { label: "Portfolio", href: "/portfolio" },
        { label: "Contact", href: "/contact" },
      ];

  const name = footerCompanyName(settings);

  return (
    <footer className="business-footer">
      <div className="business-container business-footer__inner">
        <div className="business-footer__brand">
          <h3>{name}</h3>
          <p>
            {settings.tagline || "Corporate growth, governance and delivery"}
          </p>
          <SocialLinks settings={settings} location="footer" />
        </div>

        <div className="business-footer__links">
          <h4>Quick Links</h4>
          {links.map((item) => (
            <BusinessLink
              key={`${item.label}-${item.href || item.slug}`}
              settings={settings}
              navigateTo={navigateTo}
              builderMode={builderMode}
              href={item.href || item.slug || "/"}
            >
              {item.label}
            </BusinessLink>
          ))}
        </div>

        <div className="business-footer__contact">
          <h4>Contact</h4>
          <p>{settings.email || "info@company.co.za"}</p>
          <p>{settings.phone || "+27 11 000 0000"}</p>
          <p>
            {settings.address_line1 ||
              settings.city ||
              "Johannesburg, South Africa"}
          </p>
        </div>
      </div>

      <div className="business-footer__bottom">
        <div className="business-container business-footer__bottom-inner">
          <span>{resolveFooterText(settings)}</span>

          <div className="powered-by">
            <span>Powered by</span>

            <a
              href="https://ulterspace.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="ulterspace-link"
            >
              <img src={logo} alt="Ulterspace Logo" className="ulterspace-logo" />
              <span>Ulterspace</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
