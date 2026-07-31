import React from "react";
import { useNavigate } from "react-router-dom";
import Button from "../Button";

const HeroContent = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight tracking-tight">
        Find Skilled <br />
        <span className="text-[var(--primary)]">
          Professionals
        </span> Near You
      </h1>

      <p className="text-base sm:text-lg text-[var(--hero-text-muted)] max-w-lg leading-relaxed">
        Serviso connects you with verified plumbers, carpenters,
        painters, electricians and more across Nepal.
      </p>

      <div className="flex flex-wrap gap-4 pt-2">
        <Button 
          text="Explore Services" 
          type="primary" 
          onClick={() => navigate("/services")}
        />
        <Button 
          text="Join as Professional" 
          type="secondary" 
          onClick={() => navigate("/provider-register")}
        />
      </div>
    </div>
  );
};

export default HeroContent;