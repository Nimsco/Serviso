// components/services/ServicesGrid.jsx
import ServiceCard from "./ServiceCard";

const ServicesGrid = ({ services }) => {
  if (services.length === 0) {
    return (
      <p className="text-center text-gray-500">
        No services available right now.
      </p>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {services.map(service => (
        <ServiceCard key={service._id} service={service} />
      ))}
    </div>
  );
};

export default ServicesGrid;