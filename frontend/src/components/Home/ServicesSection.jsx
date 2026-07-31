import React from "react";
import { useNavigate } from "react-router-dom";

const services = [
  {
    title: "AC Repair",
    desc: "AC repair, installation, and maintenance services.",
    img: "/acrepair.png",
  },
  {
    title: "Appliance Repair",
    desc: "Repair for refrigerators, washing machines, etc.",
    img: "/appliancerepair.png",
  },
  {
    title: "Car Washing",
    desc: "Doorstep car wash and detailing services.",
    img: "/carwashing.png",
  },
  {
    title: "Carpentry",
    desc: "Furniture, woodwork, and custom carpentry.",
    img: "/carpentry.png",
  },
  {
    title: "Cleaning",
    desc: "Home and office deep cleaning services.",
    img: "/cleaning.png",
  },
  {
    title: "Electrician",
    desc: "Wiring, repairs, and installations.",
    img: "/electrician.png",
  },
];

const ServicesSection = () => {
  const navigate = useNavigate();

  return (
    <section className="px-6 md:px-12 py-20 bg-[var(--bg-card)] transition-colors duration-200">

      <div className="text-center max-w-xl mx-auto">
        <h2 className="text-3xl font-bold tracking-tight text-[var(--text)]">Our Services</h2>
        <div className="w-12 h-1 bg-[var(--primary)] mx-auto mt-3 rounded-full"></div>
        <p className="mt-4 text-[var(--text-secondary)]">
          Professional services for every need across Nepal.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16 max-w-6xl mx-auto">
        {services.map((s) => (
          <div
            key={s.title}
            onClick={() => navigate(`/services/${s.title}`)}
            className="group bg-[var(--bg)] border border-[var(--border)] p-6 rounded-2xl shadow-xs hover:shadow-md hover:border-[var(--primary)] hover:-translate-y-1 transition-all duration-300 flex flex-col items-start cursor-pointer"
          >
            {/* ICON IMAGE */}
            <div className="h-12 w-12 bg-[var(--primary)]/10 rounded-xl mb-5 flex items-center justify-center border border-[var(--primary)]/15 group-hover:bg-[var(--primary)] group-hover:text-white transition duration-200">
              <img
                src={s.img}
                alt={s.title}
                className="h-6 w-6 object-contain group-hover:brightness-0 group-hover:invert transition duration-200"
                onError={(e) => {
                  e.target.src = "https://img.icons8.com/color/96/maintenance.png";
                }}
              />
            </div>

            <h3 className="text-lg font-bold text-[var(--text)] group-hover:text-[var(--primary)] transition-colors duration-200">{s.title}</h3>
            <p className="text-[var(--text-secondary)] mt-2 text-sm leading-relaxed flex-1">{s.desc}</p>

            <p className="mt-5 text-[var(--primary)] text-sm font-semibold flex items-center gap-1">
              Find Professionals
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 group-hover:translate-x-1 transition duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </p>
          </div>
        ))}
      </div>

      <div 
        onClick={() => navigate("/services")}
        className="text-center mt-12 text-[var(--primary)] hover:text-[var(--primary-hover)] font-bold cursor-pointer inline-flex items-center gap-1.5 justify-center w-full hover:underline"
      >
        View All Services
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
        </svg>
      </div>

    </section>
  );
};

export default ServicesSection;