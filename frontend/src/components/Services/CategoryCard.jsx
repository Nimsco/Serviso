import React from "react";
import { useNavigate } from "react-router-dom";

const CategoryCard = ({ category }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/services/${category.name}`);
  };

  return (
    <div
      onClick={handleClick}
      className="group bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-6 text-center cursor-pointer hover:shadow-md hover:border-[var(--primary)] hover:-translate-y-1 transition-all duration-300"
    >
      <div className="w-16 h-16 mx-auto mb-4 bg-[var(--bg-card-hover)] rounded-full flex items-center justify-center border border-[var(--border)]/50 group-hover:bg-[var(--primary)]/10 transition duration-300">
        <img
          src={category.image}
          alt={category.name}
          className="w-10 h-10 object-contain group-hover:scale-105 transition duration-300"
          onError={(e) => {
            e.target.src = "https://img.icons8.com/color/96/maintenance.png";
          }}
        />
      </div>

      <p className="font-bold text-[var(--text)] group-hover:text-[var(--primary)] transition-colors duration-250">
        {category.name}
      </p>
    </div>
  );
};

export default CategoryCard;
