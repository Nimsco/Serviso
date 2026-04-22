import React from "react";

const HeroStats = () => {
  return (
    <div className="bg-gray-900 p-6 rounded-2xl shadow-lg">

      {/* Available badge */}
      <div className="flex justify-end mb-4">
        <span className="bg-green-500 text-xs px-3 py-1 rounded-full">
          Available Now
        </span>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-800 p-6 rounded-xl text-center">
          {/* IMAGE PLACEHOLDER */}
          <div className="h-12 w-12 mx-auto mb-3 bg-blue-500 rounded-lg"></div>
          <h3 className="text-xl font-bold">500+</h3>
          <p className="text-gray-400 text-sm">Professionals</p>
        </div>

        <div className="bg-gray-800 p-6 rounded-xl text-center">
          <div className="h-12 w-12 mx-auto mb-3 bg-green-500 rounded-lg"></div>
          <h3 className="text-xl font-bold">25,000+</h3>
          <p className="text-gray-400 text-sm">Jobs Done</p>
        </div>
      </div>

      {/* Bottom section */}
      <div className="mt-6 bg-gray-800 p-4 rounded-xl text-sm">
        Join Serviso today and become a verified professional
      </div>

    </div>
  );
};

export default HeroStats;