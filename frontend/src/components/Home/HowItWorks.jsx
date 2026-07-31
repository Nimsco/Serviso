import React from "react";

const steps = [
  { num: "1", title: "Search", desc: "Browse and find the right service." },
  { num: "2", title: "Book", desc: "Choose time and book easily." },
  { num: "3", title: "Done", desc: "Professional completes your job." },
];

const HowItWorks = () => {
  return (
    <section className="px-6 md:px-12 py-20 bg-[var(--bg)] transition-colors duration-200">
      
      <div className="text-center max-w-xl mx-auto">
        <h2 className="text-3xl font-bold tracking-tight text-[var(--text)]">How It Works</h2>
        <div className="w-12 h-1 bg-[var(--primary)] mx-auto mt-3 rounded-full"></div>
        <p className="mt-4 text-[var(--text-secondary)]">
          Book a verified local service in 3 simple steps
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 mt-16 max-w-5xl mx-auto">
        {steps.map((step) => (
          <div 
            key={step.num} 
            className="bg-[var(--bg-card)] border border-[var(--border)] p-8 rounded-2xl text-center shadow-xs hover:shadow-md hover:-translate-y-1 transition-all duration-300"
          >
            <div className="h-14 w-14 mx-auto bg-[var(--primary)] text-white flex items-center justify-center rounded-2xl font-bold text-lg shadow-sm">
              {step.num}
            </div>

            <h3 className="mt-6 text-xl font-bold text-[var(--text)]">{step.title}</h3>
            <p className="text-[var(--text-secondary)] mt-3 text-sm leading-relaxed">{step.desc}</p>
          </div>
        ))}
      </div>

    </section>
  );
};

export default HowItWorks;