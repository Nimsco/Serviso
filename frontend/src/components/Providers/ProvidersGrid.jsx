import React from "react";
import ProviderCard from "./ProvidersCard";

const ProvidersGrid = ({ providers }) => {
  if (!providers || providers.length === 0) {
    return (
      <p className="text-center text-[var(--text-secondary)] py-12">
        No providers available at the moment.
      </p>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {providers.map((provider) => (
        <ProviderCard key={provider._id} provider={provider} />
      ))}
    </div>
  );
};

export default ProvidersGrid;