import React from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUser } from "../../store/authSlice";
import categoryImages from "../../utils/categoryImages";

const ServiceCard = ({ service }) => {
  const user = useSelector(selectUser);
  const navigate = useNavigate();
  const image = service.image || service.provider?.profilePic || categoryImages[service.category] || "/provider-2.jpg";

  const handleBook = () => {
    navigate(`/book/${service._id}`);
  };

  return (
    <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl shadow-xs hover:shadow-md hover:border-[var(--primary)]/30 hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col h-full">
      <div className="relative">
        <img
          src={image}
          alt={service.title}
          className="h-44 w-full object-cover"
          onError={(e) => (e.target.src = "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=80")}
        />
        <div className="absolute top-3 left-3">
          <span className="text-xs font-bold uppercase tracking-wider bg-[var(--bg-card)]/90 backdrop-blur-md text-[var(--primary)] px-2.5 py-1 rounded-full border border-[var(--border)]">
            {service.category}
          </span>
        </div>
      </div>

      <div className="p-5 flex flex-col flex-1 gap-3">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-lg font-bold text-[var(--text)] leading-snug line-clamp-1">
            {service.provider?.name || service.title}
          </h3>
          <span className="flex items-center gap-1 text-yellow-500 text-sm font-bold whitespace-nowrap bg-yellow-500/10 px-2 py-0.5 rounded-lg border border-yellow-500/15">
            ★ {service.rating || 0}
          </span>
        </div>

        <p className="text-sm text-[var(--text-secondary)] line-clamp-2 leading-relaxed flex-1">
          {service.description}
        </p>

        <p className="text-xs text-[var(--text-muted)] flex items-center gap-1">
          📍 {service.provider?.address || "Not specified"}
        </p>

        <div className="pt-3 border-t border-[var(--border)] flex justify-between items-center mt-auto">
          <div>
            <span className="text-xs text-[var(--text-muted)] block">Hourly Rate</span>
            <span className="text-lg font-extrabold text-[var(--primary)]">
              Rs. {service.price}
            </span>
          </div>
          <span className="text-xs text-[var(--text-muted)]">
            {service.totalReviews || 0} reviews
          </span>
        </div>

        {user?.role === "provider" ? (
          <p className="mt-3 text-xs text-[var(--text-muted)] text-center bg-[var(--bg-card-hover)] py-2.5 rounded-xl border border-[var(--border)] font-medium">
            Provider accounts cannot book
          </p>
        ) : (
          <button
            onClick={handleBook}
            className="mt-3 w-full bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white text-sm py-2.5 rounded-xl font-bold transition duration-200 cursor-pointer shadow-xs active:scale-98"
          >
            Book Now
          </button>
        )}
      </div>
    </div>
  );
};

export default ServiceCard;
