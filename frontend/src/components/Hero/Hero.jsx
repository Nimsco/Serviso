import React from "react";
import { useNavigate } from "react-router-dom";
import BrandMark from "../UI/BrandMark";
import CategoryTags from "./CategoryTags";

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-[88vh] overflow-hidden bg-[var(--bg)] text-[var(--text)]">
      <img
        src="/hero-bg.jpg"
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-[var(--bg)]/82"></div>

      <div className="relative max-w-7xl mx-auto px-6 md:px-12 py-16 md:py-20 min-h-[88vh] flex flex-col justify-center">
        <div className="max-w-3xl">
          <BrandMark className="mb-8" />
          <p className="text-[var(--primary)] font-bold text-xs uppercase tracking-wider mb-4">
            Nepal's verified home service marketplace
          </p>
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-black leading-tight tracking-tight">
            Book trusted professionals without the guesswork.
          </h1>
          <p className="text-base sm:text-lg text-[var(--text-secondary)] max-w-2xl leading-relaxed mt-6">
            Compare verified providers, choose a clear time slot, pay securely, and track every booking from request to completion.
          </p>

          <div className="flex flex-wrap gap-3 pt-8">
            <button
              type="button"
              onClick={() => navigate("/services")}
              className="bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white px-6 py-3 rounded-xl font-bold tracking-wide shadow-md cursor-pointer"
            >
              Explore Services
            </button>
            <button
              type="button"
              onClick={() => navigate("/provider-register")}
              className="bg-[var(--bg-card)] text-[var(--primary)] border border-[var(--primary-border)] hover:bg-[var(--primary-light)] px-6 py-3 rounded-xl font-bold tracking-wide shadow-xs cursor-pointer"
            >
              Join as Professional
            </button>
          </div>

          <CategoryTags />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-12 max-w-5xl">
          {[
            ["Verified", "Provider documents reviewed before approval"],
            ["7 days", "Short booking window keeps schedules realistic"],
            ["Secure", "Stripe checkout and paid booking confirmation"],
            ["Local", "Built for everyday home service needs in Nepal"],
          ].map(([value, label]) => (
            <div key={value} className="bg-[var(--bg-card)]/90 border border-[var(--border)] rounded-xl p-4 shadow-xs">
              <p className="text-xl font-black text-[var(--primary)]">{value}</p>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed mt-1">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;
