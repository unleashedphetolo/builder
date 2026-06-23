import React, { useMemo, useState } from "react";
import {
  FiBriefcase,
  FiClock,
  FiMail,
  FiMapPin,
  FiMessageSquare,
  FiNavigation,
  FiPhone,
  FiSend,
  FiUser,
} from "react-icons/fi";
import SectionHeader from "../common/SectionHeader";

function clean(value = "") {
  return String(value || "").trim();
}

function firstValue(...values) {
  return values.map(clean).find(Boolean) || "";
}

function resolveOrg(settings = {}) {
  return settings.organization || settings.organisation || {};
}

function resolveAddress(content = {}, settings = {}) {
  const org = resolveOrg(settings);

  const fullAddress = firstValue(
    content.address,
    settings.address,
    settings.business_address,
    org.address,
  );

  if (fullAddress) return fullAddress;

  return [
    content.address_line1 || settings.address_line1 || org.address_line1,
    content.city || settings.city || org.city,
    content.province || settings.province || org.province,
    content.postal_code || settings.postal_code || org.postal_code,
    content.country || settings.country || org.country,
  ]
    .map(clean)
    .filter(Boolean)
    .join(", ");
}

function defaultServiceOptions(content = {}) {
  if (Array.isArray(content.service_options) && content.service_options.length) {
    return content.service_options;
  }

  return [
    "Business Strategy & Advisory",
    "Operations & Process Improvement",
    "Digital Systems & Automation",
    "Corporate Website & Lead Capture",
    "Governance & Compliance Support",
    "General Business Enquiry",
  ];
}

function buildEmailBody({ form, businessName, phone, address, officeHours }) {
  return [
    `Good day ${businessName},`,
    "",
    "I would like to enquire about your services. Please see my details below:",
    "",
    `Name: ${form.name || "Not provided"}`,
    `Email: ${form.email || "Not provided"}`,
    `Phone: ${form.phone || "Not provided"}`,
    `Service Needed: ${form.service || "General Business Enquiry"}`,
    "",
    "Message:",
    form.message || "Please contact me with more information.",
    "",
    "Business details shown on the website:",
    `Phone: ${phone || "Not provided"}`,
    `Address: ${address || "Not provided"}`,
    `Office Hours: ${officeHours || "Not provided"}`,
    "",
    "Thank you.",
  ].join("\n");
}

export default function ContactSection({ content = {}, settings = {} }) {
  const org = resolveOrg(settings);

  const businessName = firstValue(
    content.company_name,
    settings.company_name,
    settings.business_name,
    settings.site_name,
    org.name,
    "Consulting Firm",
  );

  const phone = firstValue(
    content.phone,
    settings.phone,
    org.phone,
    "+27 11 000 0000",
  );

  const email = firstValue(
    content.email,
    settings.email,
    org.email,
    "info@company.co.za",
  );

  const officeHours = firstValue(
    content.office_hours,
    content.officeHours,
    settings.office_hours,
    settings.officeHours,
    "Monday to Friday, 08:00 - 17:00",
  );

  const address = resolveAddress(content, settings);
  const hasAddress = Boolean(address);

  const serviceOptions = useMemo(() => defaultServiceOptions(content), [content]);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    service: serviceOptions[0] || "General Business Enquiry",
    message: "",
  });

  const updateField = (field, value) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const submitToEmail = (event) => {
    event.preventDefault();

    const subject = `${
      content.email_subject_prefix || "New business enquiry"
    } - ${form.service || "General Business Enquiry"}`;
    const body = buildEmailBody({ form, businessName, phone, address, officeHours });
    const mailtoUrl = `mailto:${email}?subject=${encodeURIComponent(
      subject,
    )}&body=${encodeURIComponent(body)}`;

    if (typeof window !== "undefined") {
      window.location.href = mailtoUrl;
    }
  };

  const mapEmbedUrl = hasAddress
    ? `https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed`
    : "";

  return (
    <section className="business-section business-contact-section">
      <div className="business-container business-contact-grid">
        <div className="business-contact-intro">
          <SectionHeader
            eyebrow={content.eyebrow || "Contact"}
            title={
              content.heading ||
              content.section_title ||
              "Speak to a business specialist"
            }
            subtitle={
              content.description ||
              content.body ||
              "Send an enquiry, request a quote or ask for a consultation. The form opens your email app with a ready-made message."
            }
          />
        </div>

        <article className="business-contact-card business-contact-card--details">
          <div className="business-contact-card__header">
            <span className="business-contact-card__icon">
              <FiNavigation />
            </span>
            <div>
              <h3>{businessName}</h3>
              <p>{content.body || "Official business contact information"}</p>
            </div>
          </div>

          <div className="business-contact-details">
            <div className="business-contact-detail">
              <span><FiPhone /></span>
              <div>
                <small>Phone</small>
                <a href={`tel:${phone}`}>{phone}</a>
              </div>
            </div>

            <div className="business-contact-detail">
              <span><FiMail /></span>
              <div>
                <small>Email</small>
                <a href={`mailto:${email}`}>{email}</a>
              </div>
            </div>

            <div className="business-contact-detail">
              <span><FiClock /></span>
              <div>
                <small>Office Hours</small>
                <strong>{officeHours}</strong>
              </div>
            </div>

            <div className="business-contact-detail">
              <span><FiMapPin /></span>
              <div>
                <small>Address</small>
                <strong className={hasAddress ? "" : "is-empty"}>
                  {hasAddress ? address : "No business address saved yet."}
                </strong>
              </div>
            </div>
          </div>
        </article>

        <article className="business-contact-card business-contact-card--form">
          <div className="business-contact-card__header">
            <span className="business-contact-card__icon">
              <FiMessageSquare />
            </span>
            <div>
              <h3>{content.form_title || "Send an Enquiry"}</h3>
              <p>
                {content.form_description ||
                  "The button will open your email app with the enquiry details completed automatically."}
              </p>
            </div>
          </div>

          <form className="business-contact-form" onSubmit={submitToEmail}>
            <label>
              <span><FiUser /> Full Name</span>
              <input
                type="text"
                value={form.name}
                placeholder="Your full name"
                onChange={(event) => updateField("name", event.target.value)}
              />
            </label>

            <label>
              <span><FiMail /> Email Address</span>
              <input
                type="email"
                value={form.email}
                placeholder="yourname@example.com"
                onChange={(event) => updateField("email", event.target.value)}
              />
            </label>

            <label>
              <span><FiPhone /> Phone Number</span>
              <input
                type="tel"
                value={form.phone}
                placeholder="+27 00 000 0000"
                onChange={(event) => updateField("phone", event.target.value)}
              />
            </label>

            <label>
              <span><FiBriefcase /> Service Needed</span>
              <select
                value={form.service}
                onChange={(event) => updateField("service", event.target.value)}
              >
                {serviceOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>

            <label className="business-contact-form__message">
              <span><FiMessageSquare /> Message</span>
              <textarea
                value={form.message}
                rows={5}
                placeholder="Tell us what you need help with..."
                onChange={(event) => updateField("message", event.target.value)}
              />
            </label>

            <button type="submit">
              <FiSend /> Open Email Enquiry
            </button>
          </form>
        </article>

        <article className="business-contact-card business-contact-card--map">
          <div className="business-map-header">
            <div>
              <h3>{content.map_title || "Location Map"}</h3>
              <p>
                {hasAddress
                  ? content.map_available_text || "Find us using the official business address"
                  : content.map_empty_text || "Save a business address to show the map"}
              </p>
            </div>
            <span>
              <FiMapPin /> {content.map_badge_label || "Map"}
            </span>
          </div>

          {hasAddress ? (
            <div className="business-map-frame-wrap">
              <iframe
                title={`${businessName} location map`}
                src={mapEmbedUrl}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
          ) : (
            <div className="business-map-placeholder">
              <span><FiMapPin /></span>
              <strong>No location available</strong>
              <p>Add the business address in Website Details to display the live map here.</p>
            </div>
          )}
        </article>
      </div>
    </section>
  );
}
