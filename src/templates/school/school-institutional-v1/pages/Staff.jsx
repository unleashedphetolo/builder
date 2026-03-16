import React from "react";
import StaffGrid from "../components/staff/StaffGrid";
import SGB from "../components/governance/SGB";

export default function Staff() {
  return (
    <main>
      {/* Staff Section */}
      <StaffGrid />

      {/* SGB Section (bottom of same page) */}
      <SGB />
    </main>
  );
}