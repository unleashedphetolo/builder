import React, { useState } from "react";
import Card from "../components/common/Card";
import Button from "../components/common/Button";

export default function Contact({ settings = {} }) {
  const [status, setStatus] = useState("");

  const phone = settings?.phone || "0XX XXX XXXX";
  const email = settings?.email || "info@sebone-school.co.za";
  const address = [
    settings?.address_line1 || "Your school address",
    settings?.city || "",
    settings?.province || "Province",
  ]
    .filter(Boolean)
    .join(", ");

  const mapUrl = settings?.map_url || "https://www.google.com/maps";

  const onSubmit = (e) => {
    e.preventDefault();
    setStatus(
      "Thanks! Your message is ready. Connect this form to email or a backend when you're ready."
    );
    e.currentTarget.reset();
  };

  return (
    <section className="container" style={{ paddingTop: 10, paddingBottom: 40 }}>

      <h2 className="section-title">Contact Us</h2>
      <p style={{ opacity: 0.85, maxWidth: 900, marginBottom: 18 }}>
        For admissions, school information, events and learner support — reach out and we’ll
        respond as soon as possible.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: 16,
        }}
      >
        <Card>
          <h3 style={{ marginBottom: 10 }}>Send a Message</h3>

          <form onSubmit={onSubmit} style={{ display: "grid", gap: 10 }}>
            <input required name="name" placeholder="Full name" style={inputStyle} />
            <input
              required
              type="email"
              name="email"
              placeholder="Email address"
              style={inputStyle}
            />
            <input name="phone" placeholder="Phone number (optional)" style={inputStyle} />
            <textarea
              required
              name="message"
              placeholder="Your message"
              rows={5}
              style={inputStyle}
            />

            <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
              <Button variant="primary">Send</Button>
              {status ? <span style={{ opacity: 0.85 }}>{status}</span> : null}
            </div>
          </form>
        </Card>

        <Card>
          <h3 style={{ marginBottom: 10 }}>School Details</h3>
          <p style={{ opacity: 0.85 }}>
            Add your official contact details here (phone, email, address, office hours).
          </p>

          <div style={{ marginTop: 12, opacity: 0.9 }}>
            <p>
              <strong>Phone:</strong> {phone}
            </p>
            <p>
              <strong>Email:</strong> {email}
            </p>
            <p>
              <strong>Address:</strong> {address}
            </p>
          </div>

          <div style={{ marginTop: 14 }}>
            <Button href={mapUrl} variant="outline">
              Open map
            </Button>
          </div>
        </Card>
      </div>
    </section>
  );
}

const inputStyle = {
  width: "100%",
  padding: ".75rem .9rem",
  borderRadius: 10,
  border: "1px solid #e5e7eb",
  outline: "none",
  fontSize: "1rem",
};