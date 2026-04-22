
import ProviderCard from "./ProvidersCard";

const ProvidersGrid = ({ providers }) => {
  if (!providers || providers.length === 0) {
    return (
      <p className="text-center text-gray-500">
        No providers available
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