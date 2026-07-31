import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import ServiceCard from "./ServiceCard";
import { API_URL } from "../../api/config";
import EmptyState from "../UI/EmptyState";
import PageHeader from "../UI/PageHeader";

const CategoryServices = () => {
  const { category } = useParams();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchServices() {
      try {
        const res = await axios.get(`${API_URL}/services?category=${encodeURIComponent(category)}`);
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
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] transition-colors duration-200">
      <PageHeader
        eyebrow="Filtered services"
        title={`${category} Services`}
        description="Only active services from approved providers are shown here. Pick a provider, choose a slot within 7 days, and confirm with secure checkout."
        image="/cleaning.png"
      />

      <div className="max-w-7xl mx-auto px-6 md:px-12 py-12">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[var(--primary)]"></div>
          </div>
        ) : services.length === 0 ? (
          <EmptyState
            title="No active services found"
            description={`There are no bookable ${category} services right now. Providers may be inactive or still completing setup.`}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <ServiceCard key={service._id} service={service} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryServices;
