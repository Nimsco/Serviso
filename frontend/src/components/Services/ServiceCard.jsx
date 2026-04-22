// components/services/ServiceCard.jsx
import { useNavigate } from "react-router-dom";
import categoryImages from "../../utils/categoryImages";

const ServiceCard = ({ service }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  const handleBook = () => {
    navigate(`/book/${service._id}`);

  };

  return (
    <div className="bg-white border border-blue-100 rounded-2xl shadow-sm hover:shadow-md transition duration-300 overflow-hidden">

      {/* Image */}
     <img
  src={categoryImages[service.category] || "/placeholder.jpg"}
  alt={service.category}
  className="h-40 w-full object-cover"
  onError={(e) => (e.target.src = "/placeholder.jpg")}
/>

      {/* Content */}
      <div className="p-4 flex flex-col gap-2">

        <h2 className="text-lg font-semibold text-gray-800">
          {service.title}
        </h2>

        <p className="text-sm text-gray-500 line-clamp-2">
          {service.description}
        </p>

        <div className="flex justify-between items-center mt-2">
          <span className="text-blue-500 font-bold">
            Rs. {service.price}
          </span>
        </div>

        <p className="text-xs text-gray-400">
          By {service.provider?.name || "Unknown"}
        </p>

        {/* Button */}
        {user?.role === "provider" ? (
  <p className="mt-3 text-sm text-gray-400 text-center">
    You are a provider
  </p>
) : (
  <button
    onClick={handleBook}
    className="mt-3 bg-blue-500 hover:bg-blue-600 text-white text-sm py-2 rounded-lg transition"
  >
    Book Now
  </button>
)}

      </div>
    </div>
  );
};

export default ServiceCard;