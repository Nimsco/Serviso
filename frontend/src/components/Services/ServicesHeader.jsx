import React from "react";
import PageHeader from "../UI/PageHeader";

const ServicesHeader = () => (
  <PageHeader
    eyebrow="Service catalog"
    title="Choose the right service for your home or workplace."
    description="Browse trusted categories, compare available professionals, and book only within a clear 7-day schedule so requests stay realistic."
    image="/electrician.jpg"
    stats={[
      { value: "Verified", label: "Provider checks" },
      { value: "Paid", label: "Confirmed bookings" },
      { value: "Live", label: "Active providers only" },
      { value: "Local", label: "Nepal service network" },
    ]}
  />
);

export default ServicesHeader;
