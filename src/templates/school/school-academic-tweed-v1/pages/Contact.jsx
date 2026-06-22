import React from "react";
import BuilderSectionTarget from "../../../../builder/BuilderSectionTarget";
import {
  FiPhone,
  FiMail,
  FiMapPin,
  FiNavigation,
} from "react-icons/fi";
import Card from "../components/common/Card";

function hasOrganisationData(value = {}) {
  return Boolean(
    value?.id ||
      value?.name ||
      value?.email ||
      value?.phone ||
      value?.address_line1 ||
      value?.city ||
      value?.province ||
      value?.postal_code ||
      value?.country,
  );
}

export default function Contact({ settings = {}, organization = null, section = null, content = {}, builderMode = false }) {
  const org = hasOrganisationData(organization)
    ? organization
    : hasOrganisationData(settings?.organization)
      ? settings.organization
      : hasOrganisationData(settings?.organisation)
        ? settings.organisation
        : {};

  const organisationName =
    settings?.site_name ||
    settings?.organization_name ||
    org?.name ||
    "School";

  const contactHeading =
    content?.heading || organisationName;

  const contactBody =
    content?.body || "Official contact information";

  const phone =
    content?.phone || settings?.phone || org?.phone || "0XX XXX XXXX";

  const email =
    content?.email || settings?.email || org?.email || "info@new-school.co.za";

  const addressParts = [
    content?.address_line1 || org?.address_line1 || "",
    content?.city || org?.city || "",
    content?.province || org?.province || "",
    content?.postal_code || org?.postal_code || "",
    content?.country || org?.country || "",
  ].filter(Boolean);

  const address = addressParts.join(", ");
  const hasAddress = addressParts.length > 0;

  const mapEmbedUrl = hasAddress
    ? `https://www.google.com/maps?q=${encodeURIComponent(
        address,
      )}&output=embed`
    : "";

  const pageContent = (
    <section
      className="container"
      style={{ paddingTop: 10, paddingBottom: 40 }}
    >
      <h2 className="section-title">{content?.section_title || content?.title || "Contact Us"}</h2>

      <p style={{ opacity: 0.85, maxWidth: 900, marginBottom: 18 }}>
        {content?.subtitle ||
          "For admissions, school information, events and learner support — reach out to the school using the official contact details below."}
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: 16,
          alignItems: "stretch",
        }}
      >
        <Card>
          <div style={detailsHeaderStyle}>
            <div style={detailsIconStyle}>
              <FiNavigation />
            </div>

            <div>
              <h3 style={{ margin: 0 }}>{contactHeading}</h3>
              <p style={subtitleStyle}>{contactBody}</p>
            </div>
          </div>

          <div style={detailsGridStyle}>
            <div style={detailItemStyle}>
              <span style={detailIconStyle}>
                <FiPhone />
              </span>

              <div>
                <span style={labelStyle}>Phone</span>
                <a href={`tel:${phone}`} style={linkStyle}>
                  {phone}
                </a>
              </div>
            </div>

            <div style={detailItemStyle}>
              <span style={detailIconStyle}>
                <FiMail />
              </span>

              <div>
                <span style={labelStyle}>Email</span>
                <a href={`mailto:${email}`} style={linkStyle}>
                  {email}
                </a>
              </div>
            </div>

            <div style={detailItemStyle}>
              <span style={detailIconStyle}>
                <FiMapPin />
              </span>

              <div>
                <span style={labelStyle}>Address</span>
                <strong
                  style={{
                    ...addressStyle,
                    color: hasAddress ? "#0f172a" : "#94a3b8",
                    fontStyle: hasAddress ? "normal" : "italic",
                  }}
                >
                  {hasAddress
                    ? address
                    : "No organisation address saved yet."}
                </strong>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div style={mapHeaderStyle}>
            <div>
              <h3 style={{ margin: 0 }}>{content?.map_title || "Location Map"}</h3>
              <p style={subtitleStyle}>
                {hasAddress
                  ? content?.map_available_text || "Find us using the official address"
                  : content?.map_empty_text || "Save an organisation address to show the map"}
              </p>
            </div>

            <span style={mapBadgeStyle}>
              <FiMapPin /> {content?.map_badge_label || "Map"}
            </span>
          </div>

          {hasAddress ? (
            <div style={mapFrameWrapStyle}>
              <iframe
                title={`${organisationName} location map`}
                src={mapEmbedUrl}
                style={mapFrameStyle}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
          ) : (
            <div style={mapPlaceholderStyle}>
              <span style={mapPlaceholderIconStyle}>
                <FiMapPin />
              </span>
              <strong>No location available</strong>
              <p>
                Add the organisation address in Website Details to display the
                live map here.
              </p>
            </div>
          )}
        </Card>
      </div>
    </section>
  );

  if (!section && !builderMode) {
    return pageContent;
  }

  return (
    <BuilderSectionTarget
      builderMode={builderMode}
      section={section}
      sectionType="school_contact"
      label={content?.section_title || content?.title || "Contact Us"}
      templateCategory="school"
      templateKey="school-academic-tweed-v1"
    >
      {pageContent}
    </BuilderSectionTarget>
  );
}

const detailsHeaderStyle = {
  display: "flex",
  alignItems: "center",
  gap: 12,
  marginBottom: 16,
};

const detailsIconStyle = {
  width: 44,
  height: 44,
  borderRadius: 14,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  background: "linear-gradient(135deg, #eff6ff, #dbeafe)",
  color: "#1d4ed8",
  fontSize: 21,
  border: "1px solid #bfdbfe",
};

const subtitleStyle = {
  margin: "4px 0 0",
  opacity: 0.72,
  fontSize: 13,
};

const detailsGridStyle = {
  display: "grid",
  gap: 12,
  marginTop: 12,
};

const detailItemStyle = {
  display: "grid",
  gridTemplateColumns: "38px 1fr",
  gap: 12,
  alignItems: "flex-start",
  padding: 12,
  borderRadius: 14,
  background: "#f8fafc",
  border: "1px solid #e5e7eb",
};

const detailIconStyle = {
  width: 38,
  height: 38,
  borderRadius: 12,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  background: "#ffffff",
  color: "#1d4ed8",
  border: "1px solid #dbeafe",
  fontSize: 18,
};

const labelStyle = {
  display: "block",
  fontSize: 12,
  fontWeight: 800,
  color: "#64748b",
  marginBottom: 3,
};

const linkStyle = {
  color: "#0f172a",
  textDecoration: "none",
  fontWeight: 850,
  wordBreak: "break-word",
};

const addressStyle = {
  display: "block",
  fontWeight: 850,
  lineHeight: 1.45,
};

const mapHeaderStyle = {
  display: "flex",
  alignItems: "flex-start",
  justifyContent: "space-between",
  gap: 12,
  marginBottom: 14,
};

const mapBadgeStyle = {
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
  padding: "7px 10px",
  borderRadius: 999,
  background: "#eff6ff",
  color: "#1d4ed8",
  border: "1px solid #bfdbfe",
  fontSize: 12,
  fontWeight: 900,
  whiteSpace: "nowrap",
};

const mapFrameWrapStyle = {
  width: "100%",
  height: 340,
  overflow: "hidden",
  borderRadius: 18,
  border: "1px solid #dbeafe",
  background: "#f8fafc",
  boxShadow: "0 14px 34px rgba(15, 23, 42, 0.12)",
};

const mapFrameStyle = {
  width: "100%",
  height: "100%",
  border: 0,
  display: "block",
};

const mapPlaceholderStyle = {
  width: "100%",
  minHeight: 340,
  borderRadius: 18,
  border: "1px dashed #bfdbfe",
  background: "linear-gradient(135deg, #f8fafc, #eff6ff)",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  textAlign: "center",
  padding: 24,
  color: "#475569",
};

const mapPlaceholderIconStyle = {
  width: 48,
  height: 48,
  borderRadius: 16,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  background: "#ffffff",
  color: "#1d4ed8",
  border: "1px solid #dbeafe",
  fontSize: 22,
  marginBottom: 12,
};