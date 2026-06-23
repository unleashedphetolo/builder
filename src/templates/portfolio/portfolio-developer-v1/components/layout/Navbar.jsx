import React, { useMemo, useState } from "react";
import BuilderMediaEditor from "../../../../../builder/BuilderMediaEditor";
import PortfolioLink from "../common/PortfolioLink";
import { resolveNavItems } from "../../utils/nav";

export default function Navbar({ settings = {}, navItems = [], data, builderMode = false }) {
  const [open, setOpen] = useState(false);
  const visibleNav = useMemo(() => resolveNavItems(navItems), [navItems]);

  const closeMenu = () => setOpen(false);

  return (
    <header className="portfolio-navbar-wrap">
      <div className="portfolio-container portfolio-navbar">
        <PortfolioLink settings={settings} href="/" className="portfolio-brand" onClick={closeMenu}>
          <span className="portfolio-brand__logo-target">
            <img src={data.logoUrl} alt="" />
            {builderMode ? (
              <BuilderMediaEditor
                enabled={builderMode}
                type="logo"
                label="Edit Portfolio Logo"
                value={settings.logo_url || ""}
                settings={settings}
                triggerLabel="Edit Logo"
                triggerTitle="Edit portfolio logo"
                saveToBuilder
              />
            ) : null}
          </span>
          <span className="portfolio-brand__text">
            <strong>{data.siteName}</strong>
            <small>{data.tagline}</small>
          </span>
        </PortfolioLink>

        <button
          type="button"
          className={`portfolio-menu-button ${open ? "is-open" : ""}`}
          aria-label="Toggle navigation menu"
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
        >
          <span />
          <span />
          <span />
        </button>

        <nav className={`portfolio-nav ${open ? "is-open" : ""}`} aria-label="Portfolio navigation">
          {visibleNav.map((item) => (
            <PortfolioLink
              key={`${item.label}-${item.href}`}
              settings={settings}
              href={item.href}
              className="portfolio-nav__link"
              onClick={closeMenu}
            >
              {item.label}
            </PortfolioLink>
          ))}
        </nav>
      </div>
    </header>
  );
}
