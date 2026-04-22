import { useEffect, useState } from "react";
import axios from "axios";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);

useEffect(() => {
  async function fetchStats() {
    const token = localStorage.getItem("token");

    const res = await axios.get("/api/admin/stats", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setStats(res.data);
  }

  fetchStats();
}, []);

  if (!stats) {
    return <p className="text-center mt-10">Loading dashboard...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-10">

      <h1 className="text-3xl font-bold mb-8 text-center">
        Admin Dashboard
      </h1>

      <div className="grid md:grid-cols-4 gap-6">

        <div className="bg-white p-6 rounded-xl shadow text-center">
          <h2 className="text-gray-500">Users</h2>
          <p className="text-2xl font-bold text-blue-500">
            {stats.totalUsers}
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow text-center">
          <h2 className="text-gray-500">Providers</h2>
          <p className="text-2xl font-bold text-green-500">
            {stats.totalProviders}
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow text-center">
          <h2 className="text-gray-500">Services</h2>
          <p className="text-2xl font-bold text-purple-500">
            {stats.totalServices}
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow text-center">
          <h2 className="text-gray-500">Bookings</h2>
          <p className="text-2xl font-bold text-red-500">
            {stats.totalBookings}
          </p>
        </div>

      </div>

    </div>
  );
};

export default AdminDashboard;
