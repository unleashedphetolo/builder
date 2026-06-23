import React from "react";
import PageHeader from "../components/common/PageHeader";
import PortfolioLink from "../components/common/PortfolioLink";

export default function NotFound({ settings }) {
  return (
    <>
      <PageHeader title="Page not found" subtitle="The requested portfolio page could not be found." />
      <section className="portfolio-section">
        <div className="portfolio-container">
          <PortfolioLink settings={settings} href="/" className="portfolio-btn portfolio-btn--primary">Back Home</PortfolioLink>
        </div>
      </section>
    </>
  );
}
