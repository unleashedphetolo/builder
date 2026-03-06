import React from "react";
import StaffGrid from "../components/staff/StaffGrid";
import SGB from "../components/governance/SGB";
import Breadcrumbs from "../components/common/Breadcrumbs";

export default function Staff() {
  return (
    <main>
      <Breadcrumbs />
      {/* Staff Section */}
      <StaffGrid />

      {/* SGB Section (bottom of same page) */}
      <SGB />
    </main>
  );
}