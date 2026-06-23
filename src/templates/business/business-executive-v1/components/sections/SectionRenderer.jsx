import React from "react";
import EditableBusinessSection from "../common/EditableBusinessSection";
import CompanyProfileSection from "./CompanyProfileSection";
import ServicesSection from "./ServicesSection";
import StatsSection from "./StatsSection";
import ClientsSection from "./ClientsSection";
import TeamSection from "./TeamSection";
import PortfolioSection from "./PortfolioSection";
import LatestNewsSection from "./LatestNewsSection";
import ContactSection from "./ContactSection";
import CTASection from "./CTASection";
import { normalizeType, sectionContent } from "../../utils/sections";

export default function SectionRenderer({ section, settings, navigateTo, builderMode, templateKey }) {
  if (!section || section.visible === false) return null;

  const type = normalizeType(section.type);
  const content = sectionContent(section);

  let rendered = null;

  switch (type) {
    case "business_company_profile":
      rendered = <CompanyProfileSection content={content} settings={settings} />;
      break;
    case "business_services":
      rendered = <ServicesSection content={content} settings={settings} navigateTo={navigateTo} builderMode={builderMode} pricing={String(section.section_key || "").includes("pricing")} />;
      break;
    case "stats":
      rendered = <StatsSection content={content} />;
      break;
    case "business_clients":
      rendered = <ClientsSection content={content} />;
      break;
    case "business_team":
      rendered = <TeamSection content={content} settings={settings} />;
      break;
    case "gallery":
      rendered = <PortfolioSection content={content} settings={settings} navigateTo={navigateTo} builderMode={builderMode} />;
      break;
    case "latest_news":
      rendered = <LatestNewsSection content={content} />;
      break;
    case "business_contact":
      rendered = <ContactSection content={content} settings={settings} />;
      break;
    case "cta":
      rendered = <CTASection content={content} settings={settings} navigateTo={navigateTo} builderMode={builderMode} />;
      break;
    default:
      rendered = null;
  }

  if (!rendered) return null;

  return (
    <EditableBusinessSection
      section={section}
      sectionType={type}
      label={content.section_title || content.heading || section.section_key}
      builderMode={builderMode}
      templateKey={templateKey}
    >
      {rendered}
    </EditableBusinessSection>
  );
}
