import React from "react";

const InfoSection = ({ title, content }) => {
  return (
    <div className="mt-16 max-w-4xl mx-auto text-center bg-[var(--bg-card)] border border-[var(--border)] p-8 rounded-2xl shadow-xs transition-colors duration-200">
      <h2 className="text-2xl font-bold text-[var(--primary)] mb-5">
        {title}
      </h2>

      <p className="text-[var(--text-secondary)] whitespace-pre-line leading-relaxed text-sm md:text-base max-w-3xl mx-auto">
        {content}
      </p>
    </div>
  );
};

export default InfoSection;