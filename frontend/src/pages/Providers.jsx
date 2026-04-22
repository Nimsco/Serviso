import { useEffect, useState } from "react";
import axios from "axios";
import ProvidersGrid from "../components/providers/ProvidersGrid";

const Providers = () => {
  const [providers, setProviders] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function fetchProviders() {
      try {
        const res = await axios.get("/api/users/providers");
        setProviders(res.data);
      } catch (err) {
        console.error(err);
      }
    }

    fetchProviders();
  }, []);

  const filteredProviders = providers.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen px-6 py-8">

      <h1 className="text-2xl font-bold mb-4">Service Providers</h1>

      {/* SEARCH */}
      <input
        type="text"
        placeholder="Search providers..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full p-2 border rounded mb-6"
      />

      <ProvidersGrid providers={filteredProviders} />

    </div>
  );
};

export default Providers;
