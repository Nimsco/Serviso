import React from "react";
import Hero from "../components/Hero/Hero";
import ServicesSection from "../components/Home/ServicesSection";
import HowItWorks from "../components/Home/HowItWorks";
import CTASection from "../components/Home/CTASection";

const Home = () => {
  return (
    <div>
      <Hero />
      <ServicesSection />
      <HowItWorks />
      <CTASection />
    </div>
  );
};

export default Home;