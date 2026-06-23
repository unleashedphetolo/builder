import React from "react";
import PortfolioLink from "../common/PortfolioLink";
import SocialLinks from "../common/SocialLinks";
import { defaultNavItems } from "../../utils/nav";

export default function Footer({ settings = {}, data }) {
  const year = new Date().getFullYear();

  return (
    <footer className="portfolio-footer">
      <div className="portfolio-container portfolio-footer__grid">
        <div>
          <h3>{data.siteName}</h3>
          <p>{data.tagline}</p>
          <SocialLinks data={data} location="footer" />
        </div>
        <div>
          <h4>Pages</h4>
          <div className="portfolio-footer__links">
            {defaultNavItems.map((item) => (
              <PortfolioLink key={item.href} settings={settings} href={item.href}>
                {item.label}
              </PortfolioLink>
            ))}
          </div>
        </div>
        <div>
          <h4>Contact</h4>
          <p>{data.email}</p>
          <p>{data.phone}</p>
          <p>{data.location}</p>
        </div>
      </div>
      <div className="portfolio-footer__bottom">
        <span>© {year} {data.siteName}. All rights reserved.</span>
        <span className="portfolio-powered-by">
          <span>Powered by</span>
          <img src="/logo.gif" alt="Ulterspace logo" />
          <strong>Ulterspace</strong>
        </span>
      </div>
    </footer>
  );
}
