import React from "react";

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
  return (
    <div className="px-6 md:px-12 py-16 bg-white">

      <div className="text-center max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold text-blue-500">Our Services</h2>
        <p className="mt-4 text-gray-600">
          Professional services for every need across Nepal.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 mt-12 max-w-6xl mx-auto">
        {services.map((s) => (
          <div
            key={s.title}
            className="bg-blue-50 p-6 rounded-xl shadow-sm hover:shadow-md transition flex flex-col items-start"
          >
            {/* ICON IMAGE */}
            <div className="h-12 w-12 bg-blue-100 rounded-lg mb-4 flex items-center justify-center">
              <img
                src={s.img}
                alt={s.title}
                className="h-6 w-6 object-contain"
              />
            </div>

            <h3 className="text-lg font-semibold">{s.title}</h3>
            <p className="text-gray-600 mt-2 text-sm">{s.desc}</p>

            <p className="mt-4 text-blue-500 text-sm font-medium cursor-pointer">
              Find Professionals →
            </p>
          </div>
        ))}
      </div>

      <div className="text-center mt-10 text-blue-500 font-semibold cursor-pointer">
        View All Services →
      </div>

    </div>
  );
};

export default ServicesSection;