import React from "react";
import CalendarWidget from "../../components/common/CalendarWidget";
import Card from "../../components/common/Card";
import Breadcrumbs from "../../components/common/Breadcrumbs";

export default function SchoolCalendar() {
  return (
    <section className="container" style={{ paddingTop: 28, paddingBottom: 40 }}>
      <Breadcrumbs />
      <h2 className="section-title">School Calendar</h2>
      <Card>
        <p style={{ opacity: 0.9, marginBottom: 12 }}>
          This is your calendar placeholder. Replace the items inside CalendarWidget or connect it to real events later.
        </p>
        <CalendarWidget />
      </Card>
    </section>
  );
}
