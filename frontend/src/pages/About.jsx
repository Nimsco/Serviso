import React from "react";
import Stats from "../components/About/Stats";
import InfoSection from "../components/About/InfoSection";

const About = () => {
  return (
    <div className="bg-gray-900 text-gray-800 px-6 md:px-12 py-16">

      {/* Header */}
      <div className="text-center max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-blue-500">About Serviso</h1>
        <p className="mt-4 text-gray-600">
          Serviso is Nepal's leading home services marketplace, connecting skilled 
          professionals with customers who need quality work done.
        </p>
      </div>

      {/* Stats */}
      <Stats />

      {/* Story */}
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

      {/* Why Choose */}
      <div className="mt-16 max-w-5xl mx-auto">
        <h2 className="text-2xl font-semibold text-blue-500 mb-6 text-center">
          Why Choose Serviso?
        </h2>

        <div className="grid md:grid-cols-2 gap-6">
          {[
            "Verified professionals",
            "Transparent pricing",
            "Easy booking system",
            "Quality guarantee",
            "24/7 support",
            "Secure payments",
          ].map((item) => (
            <div
              key={item}
              className="bg-blue-50 p-4 rounded-lg shadow-sm hover:shadow-md transition"
            >
              {item}
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default About;