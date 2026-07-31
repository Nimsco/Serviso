import React from "react";
import Stats from "../components/About/Stats";
import InfoSection from "../components/About/InfoSection";
import PageHeader from "../components/UI/PageHeader";
import TrustStrip from "../components/UI/TrustStrip";

const About = () => {
  return (
    <div className="bg-[var(--bg)] text-[var(--text)] transition-colors duration-200">
      <PageHeader
        eyebrow="About Serviso"
        title="A more accountable way to book local services."
        description="Serviso connects customers with approved providers, clear scheduling, secure checkout, and service records that both sides can trust."
        image="/carpentry.png"
        stats={[
          { value: "2023", label: "Started in Kathmandu" },
          { value: "Docs", label: "Provider verification" },
          { value: "Paid", label: "Confirmed bookings" },
          { value: "Rated", label: "Completed job reviews" },
        ]}
      />

      <TrustStrip />

      <main className="px-6 md:px-12 py-16">

      {/* Stats */}
      <Stats />

      {/* Story */}
      <div className="space-y-6">
        <InfoSection
          title="Our Story: Serving Nepal"
          content={`Serviso was born from a simple observation: finding reliable home service professionals in Nepal was often a challenge. 

We started in Kathmandu in 2023 with a small team of professionals. Today, we serve multiple cities with hundreds of verified providers.

Our platform ensures trust, transparency, and quality service for every user.`}
        />

        {/* Mission / Vision / Values */}
        <InfoSection
          title="What Drives Us"
          content={`Our Mission: Connect households with reliable professionals.

Our Vision: Become Nepal's most trusted service platform.

Our Values: Quality, transparency, and customer satisfaction.`}
        />
      </div>

      {/* Why Choose */}
      <div className="mt-20 max-w-5xl mx-auto">
        <h2 className="text-2xl font-bold text-[var(--primary)] mb-8 text-center">
          Why Choose Serviso?
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {[
            { title: "Verified Professionals", desc: "Background check & document verification" },
            { title: "Transparent Pricing", desc: "No hidden charges, pay hourly or fixed" },
            { title: "Easy Booking System", desc: "Schedule date/time slot in clicks" },
            { title: "Quality Guarantee", desc: "We ensure you get the service you paid for" },
            { title: "24/7 Support", desc: "Always here to help you resolve issues" },
            { title: "Secure Payments", desc: "Payments processed via Stripe secure gateway" },
          ].map((item) => (
            <div
              key={item.title}
              className="bg-[var(--bg-card)] border border-[var(--border)] p-6 rounded-2xl shadow-xs hover:shadow-md hover:border-[var(--primary)] hover:-translate-y-0.5 transition-all duration-200"
            >
              <h3 className="font-bold text-[var(--text)] text-base">{item.title}</h3>
              <p className="text-xs text-[var(--text-secondary)] mt-2 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      </main>
    </div>
  );
};

export default About;
