import React from "react";

const Stats = () => {
  const data = [
    { value: "10,000+", label: "Happy Customers" },
    { value: "500+", label: "Verified Professionals" },
    { value: "25,000+", label: "Services Completed" },
    { value: "50+", label: "Cities in Nepal" },
  ];

  return (
    <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
      {data.map((item) => (
        <div
          key={item.label}
          className="text-center bg-[var(--bg-card)] border border-[var(--border)] p-6 rounded-2xl shadow-xs hover:shadow-sm transition-all duration-200"
        >
          <h3 className="text-2xl md:text-3xl font-extrabold text-[var(--primary)]">
            {item.value}
          </h3>
          <p className="text-[var(--text-secondary)] text-sm mt-2 font-medium">{item.label}</p>
        </div>
      ))}
    </div>
  );
};

export default Stats;