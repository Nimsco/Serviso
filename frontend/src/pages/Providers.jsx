import { useEffect, useState } from "react";
import axios from "axios";
import ProvidersGrid from "../components/Providers/ProvidersGrid";
import ProvidersHeader from "../components/Providers/ProvidersHeader";
import { API_URL } from "../api/config";

const Providers = () => {
  const [providers, setProviders] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function fetchProviders() {
      try {
        const res = await axios.get(`${API_URL}/users/providers?search=${encodeURIComponent(search)}`);
        setProviders(res.data);
      } catch (err) {
        console.error(err);
      }
    }

    const delayDebounceFn = setTimeout(() => {
      fetchProviders();
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [search]);

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] transition-colors duration-200">
      <ProvidersHeader />

      <div className="max-w-7xl mx-auto px-6 md:px-12 py-12">

        {/* SEARCH BAR CONTAINER */}
        <div className="max-w-xl mx-auto mb-10 relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[var(--text-muted)]">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search verified service providers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl text-[var(--text)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/10 shadow-xs transition duration-200"
          />
        </div>

        <ProvidersGrid providers={providers} />
      </div>

    </div>
  );
};

export default Providers;
