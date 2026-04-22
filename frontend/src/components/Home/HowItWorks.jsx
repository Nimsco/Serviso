import React from "react";

const steps = [
  { num: "1", title: "Search", desc: "Browse and find the right service." },
  { num: "2", title: "Book", desc: "Choose time and book easily." },
  { num: "3", title: "Done", desc: "Professional completes your job." },
];

const HowItWorks = () => {
  return (
    <div className="px-6 md:px-12 py-16 bg-blue-50">

      <div className="text-center">
        <h2 className="text-3xl font-bold text-blue-500">How It Works</h2>
        <p className="mt-4 text-gray-600">
          Book a service in 3 simple steps
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 mt-12 max-w-5xl mx-auto">
        {steps.map((step) => (
          <div key={step.num} className="text-center">
            <div className="h-12 w-12 mx-auto bg-blue-500 text-white flex items-center justify-center rounded-full font-bold">
              {step.num}
            </div>

            <h3 className="mt-4 text-xl font-semibold">{step.title}</h3>
            <p className="text-gray-600 mt-2 text-sm">{step.desc}</p>
          </div>
        ))}
      </div>

    </div>
  );
};

export default HowItWorks;