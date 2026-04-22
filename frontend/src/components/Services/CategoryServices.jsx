import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import ServiceCard from "../Services/ServiceCard";

const CategoryServices = () => {
  const { category } = useParams();

  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchServices() {
      try {
        const res = await axios.get(
          `/api/services?category=${category}`
        );

        setServices(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchServices();
  }, [category]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">

      <h1 className="text-2xl font-bold mb-6">
        {category} Services
      </h1>

      {loading ? (
        <p>Loading...</p>
      ) : services.length === 0 ? (
        <p>No services found</p>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          {services.map((service) => (
            <ServiceCard key={service._id} service={service} />
          ))}
        </div>
      )}

    </div>
  );
};

export default CategoryServices;
