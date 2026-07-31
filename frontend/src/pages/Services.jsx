import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ServicesHeader from "../components/Services/ServicesHeader";
import { API_URL } from "../api/config";

const fallbackCategories = [
  { name: "AC Repair", image: "/acrepair.png" },
  { name: "Appliance Repair", image: "/appliancerepair.png" },
  { name: "Cleaning", image: "/cleaning.png" },
  { name: "Electrician", image: "/electrician.png" },
  { name: "Car Washing", image: "/carwashing.png" },
  { name: "Carpentry", image: "/carpentry.png" },
];

const Services = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${API_URL}/services/categories`);
        const data = await res.json();
        setCategories(data.length ? data : fallbackCategories);
      } catch (err) {
        console.log(err);
        setCategories(fallbackCategories);
      }
    };

    fetchCategories();
  }, []);

  const handleClick = (category) => {
    navigate(`/services/${category}`);
  };

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] transition-colors duration-200">
      <ServicesHeader />

      <main className="max-w-7xl mx-auto px-6 md:px-12 py-12">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
          <div>
            <p className="text-[var(--primary)] font-bold text-xs uppercase tracking-wider">Browse categories</p>
            <h2 className="text-2xl font-black mt-1 text-[var(--text)] tracking-tight">Choose a Service Category</h2>
          </div>
          <p className="text-sm text-[var(--text-secondary)] max-w-xl">
            Each category opens a filtered list of active services from approved providers.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">

        {categories.map((cat) => (
          <div
            key={cat._id || cat.name}
            onClick={() => handleClick(cat.name)}
            className="group bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-6 text-center cursor-pointer hover:shadow-md hover:border-[var(--primary)] hover:-translate-y-1 transition-all duration-300"
          >
            <div className="w-20 h-20 mx-auto mb-4 bg-[var(--bg-card-hover)] rounded-full flex items-center justify-center border border-[var(--border)]/50 group-hover:bg-[var(--primary)]/10 group-hover:border-[var(--primary)]/20 transition-all duration-300">
              <img
                src={cat.image || "/user.png"}
                alt={cat.name}
                className="w-12 h-12 object-contain group-hover:scale-105 transition-all duration-300"
                onError={(e) => {
                  e.target.src = "https://img.icons8.com/color/96/maintenance.png";
                }}
              />
            </div>

            <p className="font-bold text-[var(--text)] group-hover:text-[var(--primary)] transition-colors duration-200">
              {cat.name}
            </p>
          </div>
        ))}

        </div>
      </main>

    </div>
  );
};

export default Services;
