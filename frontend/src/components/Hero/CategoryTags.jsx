import React from "react";
import { useNavigate } from "react-router-dom";

const categories = [
  "Plumbing",
  "Painting",
  "Car Washing",
  "Electrician",
  "Carpentry",
  "Cleaning",
];

const CategoryTags = () => {
  const navigate = useNavigate();

  return (
    <div className="pt-4">
      <p className="text-xs uppercase font-semibold tracking-wider text-[var(--text-secondary)] opacity-70 mb-3">
        Popular Categories
      </p>
      <div className="flex flex-wrap gap-3">
        {categories.map((cat) => (
          <div
            key={cat}
            onClick={() => navigate(`/services/${cat}`)}
            className="px-4 py-2 bg-[var(--bg-card)] text-[var(--text-secondary)] border border-[var(--border)] hover:border-[var(--primary)] hover:bg-[var(--primary)] hover:text-white rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer shadow-xs hover:shadow-sm hover:-translate-y-0.5 active:translate-y-0"
          >
            {cat}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryTags;