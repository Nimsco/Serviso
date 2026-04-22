import React from "react";
import HeroContent from "./HeroContent";
import HeroStats from "./HeroStats";
import CategoryTags from "./CategoryTags";

const Hero = () => {
  return (
    <section className="w-full min-h-screen bg-linear-to-r from-blue-900 via-gray-900 to-black text-white px-10 py-16 flex items-center">
      
      <div className="max-w-7xl mx-auto w-full grid md:grid-cols-2 gap-10 items-center">
        
        {/* Left */}
        <div>
          <HeroContent />
          <CategoryTags />
        </div>

        {/* Right */}
        <HeroStats />

      </div>
    </section>
  );
};

export default Hero;