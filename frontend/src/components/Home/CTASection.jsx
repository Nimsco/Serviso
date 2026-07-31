import React from "react";
import { useNavigate } from "react-router-dom";

const CTASection = () => {
  const navigate = useNavigate();

  return (
    <section className="px-6 md:px-12 py-20 bg-[var(--bg)] flex justify-center transition-colors duration-200">

      <div className="bg-[var(--bg-card)] border border-[var(--border)] p-10 md:p-12 rounded-3xl shadow-sm hover:shadow-md transition max-w-2xl w-full text-center relative overflow-hidden">

        <h3 className="text-3xl font-extrabold text-[var(--primary)]">
          Join Our Platform
        </h3>

        <p className="mt-4 text-[var(--text-secondary)] leading-relaxed max-w-md mx-auto">
          Book trusted professionals for your household chores or apply to offer your services and grow your business today.
        </p>

        <div className="flex justify-center mt-6">
          <ul className="text-[var(--text-secondary)] text-sm space-y-2.5 text-left inline-block">
            <li className="flex items-center gap-2">
              <span className="text-green-500 font-bold">✓</span> Easy & Fast Online Booking
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-500 font-bold">✓</span> Verified, Top-Rated Providers
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-500 font-bold">✓</span> Secure & Transparent Payments
            </li>
          </ul>
        </div>

        <button
          onClick={() => navigate("/register")}
          className="mt-8 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white px-8 py-3.5 rounded-xl font-bold tracking-wide transition duration-200 cursor-pointer shadow-md hover:shadow-lg active:scale-98"
        >
          Get Started Now
        </button>

      </div>

    </section>
  );
};

export default CTASection;
