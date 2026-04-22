import React from "react";

const InfoSection = ({ title, content }) => {
  return (
    <div className="mt-16 max-w-4xl mx-auto text-center">
      <h2 className="text-2xl font-semibold text-blue-500 mb-4">
        {title}
      </h2>

      <p className="text-gray-600 whitespace-pre-line leading-relaxed">
        {content}
      </p>
    </div>
  );
};

export default InfoSection;