import React from "react";
import EventsList from "../components/home/EventsList";

export default function Events() {
  return (
    <div className="container" style={{ paddingTop: 28 }}>
      <h2 className="section-title">School Calendar & Events</h2>
      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 20 }}>
        <EventsList />
      </div>
    </div>
  );
}
