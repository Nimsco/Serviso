import React from "react";

const HeroStats = () => {
  return (
    <div className="w-full max-w-md bg-[var(--bg-card)]/80 backdrop-blur-md p-6 rounded-2xl border border-[var(--border)] shadow-xl transition-all duration-200">

      {/* Available badge */}
      <div className="flex justify-end mb-5">
        <span className="flex items-center gap-1.5 bg-green-500/10 text-green-600 dark:text-green-400 text-xs px-3 py-1 rounded-full font-semibold border border-green-500/20">
          <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
          Available Now
        </span>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-[var(--bg-card-hover)]/50 p-5 rounded-xl text-center border border-[var(--border)]/50 hover:scale-102 transition duration-200">
          {/* USER ICON */}
          <div className="h-10 w-10 mx-auto mb-3 bg-[var(--primary)]/10 text-[var(--primary)] rounded-lg flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-[var(--text)]">500+</h3>
          <p className="text-[var(--text-secondary)] text-xs mt-1">Professionals</p>
        </div>

        <div className="bg-[var(--bg-card-hover)]/50 p-5 rounded-xl text-center border border-[var(--border)]/50 hover:scale-102 transition duration-200">
          {/* CHECK ICON */}
          <div className="h-10 w-10 mx-auto mb-3 bg-green-500/10 text-green-600 rounded-lg flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M6.267 3.455a.75.75 0 0 0-.708.522L3.547 10.24a.75.75 0 0 0 .292.837l3.682 2.454a.75.75 0 0 0 .832-.007l3.478-2.317a.75.75 0 0 0 .285-.862L10.393 3.98a.75.75 0 0 0-.726-.525H6.267zM2.083 9.47l.006-.017a2.25 2.25 0 0 1 2.124-1.567h4.174c.947 0 1.77.583 2.086 1.455l.004.012a2.75 2.75 0 0 1-1.042 3.076l-3.478 2.317a2.25 2.25 0 0 1-2.496.02L2.083 9.47z" clipRule="evenodd"/>
              <path d="M10 3a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0z" />
              <path fillRule="evenodd" d="M10.75 4.75a.75.75 0 0 0 0 1.5h2.5a.75.75 0 0 0 0-1.5h-2.5z" />
              <path fillRule="evenodd" d="M10.75 8.75a.75.75 0 0 0 0 1.5h2.5a.75.75 0 0 0 0-1.5h-2.5z" clipRule="evenodd" />
              <path fillRule="evenodd" d="M10.25 12.5a.75.75 0 0 1 .75-.75h1.5a.75.75 0 0 1 0 1.5H11a.75.75 0 0 1-.75-.75z" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-[var(--text)]">25k+</h3>
          <p className="text-[var(--text-secondary)] text-xs mt-1">Jobs Completed</p>
        </div>
      </div>

      {/* Bottom section */}
      <div className="mt-5 bg-[var(--primary)]/5 text-[var(--primary)] border border-[var(--primary)]/10 p-4 rounded-xl text-center text-sm font-medium">
        ✨ Join Serviso today to work as verified professional!
      </div>

    </div>
  );
};

export default HeroStats;