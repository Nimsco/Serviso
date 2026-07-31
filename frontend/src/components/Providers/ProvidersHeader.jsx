import React from "react";
import PageHeader from "../UI/PageHeader";

const ProvidersHeader = () => (
  <PageHeader
    eyebrow="Verified professionals"
    title="Find providers who are active, reviewed, and ready for real jobs."
    description="Serviso only shows approved, unblocked, active services, so customers do not waste time booking unavailable providers."
    image="/provider-2.jpg"
    stats={[
      { value: "Profiles", label: "With provider details" },
      { value: "Status", label: "Active booking control" },
      { value: "Reviews", label: "After completed jobs" },
      { value: "Contact", label: "Shared after booking" },
    ]}
  />
);

export default ProvidersHeader;
