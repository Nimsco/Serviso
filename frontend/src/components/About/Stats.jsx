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
          className="text-center bg-blue-50 p-6 rounded-xl shadow-sm"
        >
          <h3 className="text-2xl font-bold text-blue-500">
            {item.value}
          </h3>
          <p className="text-gray-600 text-sm mt-2">{item.label}</p>
        </div>
      ))}
    </div>
  );
};

export default Stats;