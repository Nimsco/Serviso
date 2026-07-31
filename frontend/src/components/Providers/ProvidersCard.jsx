import React from "react";
import { useNavigate } from "react-router-dom";

const ProviderCard = ({ provider }) => {
  const navigate = useNavigate();
  const category = provider.service?.category || provider.providerDetails?.categories?.[0];
  const price = provider.service?.price;

  const handleBook = (e) => {
    e.stopPropagation();

    if (provider.service?._id) {
      navigate(`/book/${provider.service._id}`);
      return;
    }

    navigate(`/provider/${provider._id}`);
  };

  return (
    <div
      className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl shadow-xs hover:shadow-md hover:border-[var(--primary)]/30 hover:-translate-y-1 transition-all duration-300 p-6 cursor-pointer group flex flex-col h-full justify-between"
      onClick={() => navigate(`/provider/${provider._id}`)}
    >
      <div>
        {/* Profile Image */}
        <div className="flex justify-center">
          <img
            src={provider.profilePic || "/user.png"}
            alt={provider.name}
            className="h-20 w-20 rounded-full object-cover border-4 border-[var(--primary-light)] group-hover:scale-105 transition duration-300 shadow-sm"
            onError={(e) => {
              e.target.src = "https://img.icons8.com/color/96/user-male-circle--v1.png";
            }}
          />
        </div>

        {/* Info */}
        <div className="text-center mt-5">
          <h2 className="text-lg font-bold text-[var(--text)] line-clamp-1 leading-snug">
            {provider.name}
          </h2>

          <p className="text-xs text-[var(--text-muted)] font-medium mt-0.5">
            @{provider.username}
          </p>

          {category && (
            <span className="inline-block mt-3 text-xs font-bold uppercase tracking-wider text-[var(--primary)] bg-[var(--primary-light)] px-3 py-1 rounded-full border border-[var(--primary-border)]/50">
              {category}
            </span>
          )}

          {/* Provider Details */}
          {provider.providerDetails && (
            <div className="mt-5 text-sm text-[var(--text-secondary)] space-y-1 bg-[var(--bg-card-hover)]/30 p-3 rounded-xl border border-[var(--border)]/30">
              <p className="flex justify-between px-1">
                <span className="font-semibold text-xs text-[var(--text-muted)] uppercase tracking-wider">Experience</span>
                <span className="font-bold text-[var(--text)] text-xs">{provider.providerDetails.experience} yrs</span>
              </p>
              {price && (
                <>
                  <div className="border-t border-[var(--border)]/50 my-1.5"></div>
                  <p className="flex justify-between px-1">
                    <span className="font-semibold text-xs text-[var(--text-muted)] uppercase tracking-wider">Rate</span>
                    <span className="font-bold text-[var(--primary)] text-xs">Rs. {price}</span>
                  </p>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Button */}
      <div className="grid grid-cols-2 gap-2 mt-6">
        <button
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/provider/${provider._id}`);
          }}
          className="w-full border border-[var(--primary)] text-[var(--primary)] hover:bg-[var(--primary-light)] py-2.5 rounded-xl text-xs font-bold tracking-wide transition duration-200 cursor-pointer shadow-xs"
        >
          View Profile
        </button>

        <button
          onClick={handleBook}
          disabled={!provider.service?._id}
          className={`w-full py-2.5 rounded-xl text-xs font-bold tracking-wide transition duration-200 shadow-xs cursor-pointer ${
            provider.service?._id
              ? "bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white"
              : "bg-[var(--bg-card-hover)] text-[var(--text-muted)] border border-[var(--border)] cursor-not-allowed"
          }`}
        >
          Book Now
        </button>
      </div>
    </div>
  );
};

export default ProviderCard;
