import React from "react";
import Button from "../Button";

const HeroContent = () => {
  return (
    <div>
      <h1 className="text-5xl md:text-6xl font-bold leading-tight">
        Find Skilled <br />
        <span className="text-blue-400">Professionals</span> Near You
      </h1>

      <p className="mt-6 text-gray-300 max-w-lg">
        Serviso connects you with verified plumbers, carpenters,
        painters, electricians and more across Nepal.
      </p>

      <div className="mt-8 flex gap-4">
        <Button text="Explore Services" type="primary" />
        <Button text="Join as Professional" type="secondary" />
      </div>
    </div>
  );
};

export default HeroContent;