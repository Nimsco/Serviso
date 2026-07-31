import React from "react";
import { useNavigate } from "react-router-dom";

const Cancel = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] flex flex-col justify-center items-center px-4 transition-colors duration-200">
      
      <div className="bg-[var(--bg-card)] border border-[var(--border)] p-8 md:p-10 rounded-2xl shadow-lg max-w-sm w-full text-center space-y-6">
        
        {/* CANCEL ICON */}
        <div className="h-16 w-16 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto border border-red-500/25">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-extrabold text-[var(--text)] tracking-tight">
            Payment Cancelled
          </h1>
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
            Your payment checkout session was cancelled. You have not been charged.
          </p>
        </div>

        <button
          onClick={() => navigate("/services")}
          className="w-full bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white py-3 rounded-xl font-bold text-sm tracking-wide transition duration-200 cursor-pointer shadow-md hover:shadow-lg active:scale-98"
        >
          Go Back to Services
        </button>

      </div>

    </div>
  );
};

export default Cancel;
