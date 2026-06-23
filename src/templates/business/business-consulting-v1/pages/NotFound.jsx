import React from "react";
import PageHeader from "../components/common/PageHeader";

export default function NotFound({ page }) {
  return (
    <>
      <PageHeader page={page || { title: "Business Page" }} />
      <main className="business-page">
        <section className="business-section">
          <div className="business-container">
            <p>Business page content is not configured yet.</p>
          </div>
        </section>
      </main>
    </>
  );
}
