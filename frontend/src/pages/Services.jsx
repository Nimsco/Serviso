// pages/Services.jsx
import ServicesHeader from "../components/services/ServicesHeader";
import { useNavigate } from "react-router-dom";

const categories = [
  { name: "AC Repair", image: "/acrepair.png" },
  { name: "Appliance Repair", image: "/appliancerepair.png" },
  { name: "Cleaning", image: "/cleaning.png" },
  { name: "Electrician", image: "/electrician.png" },
  { name: "Car Washing", image: "/carwashing.png" },
  { name: "Carpentry", image: "/carpentry.png" },
];

const Services = () => {
  const navigate = useNavigate();

  const handleClick = (category) => {
    navigate(`/services/${category}`);
  };

  return (
    <div className="min-h-screen bg-white px-6 md:px-12 py-8">

      <ServicesHeader />

      <h2 className="text-xl font-semibold mt-6 mb-4">
        Choose a Service
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">

        {categories.map((cat) => (
          <div
            key={cat.name}
            onClick={() => handleClick(cat.name)}
            className="bg-white border rounded-xl p-6 text-center cursor-pointer hover:shadow-md transition"
          >
            <img
              src={cat.image}
              alt={cat.name}
              className="w-16 h-16 mx-auto mb-3"
              onError={(e) => (e.target.src = "/user.png")}
            />

            <p className="font-semibold text-gray-700">
              {cat.name}
            </p>
          </div>
        ))}

      </div>

    </div>
  );
};

export default Services;
