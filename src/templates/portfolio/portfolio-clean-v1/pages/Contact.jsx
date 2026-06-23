import React from "react";
import PageHeader from "../components/common/PageHeader";
import ContactSection from "../components/sections/ContactSection";

export default function Contact({ data }) {
  return (
    <>
      <PageHeader title="Contact" subtitle="Send an enquiry and the email app will open with the message prepared." />
      <ContactSection data={data} />
    </>
  );
}
