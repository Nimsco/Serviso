import { useEffect, useState } from "react";
import axios from "axios";

const ProviderDashboard = () => {
  const [services, setServices] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loadingServices, setLoadingServices] = useState(true);
  const [loadingBookings, setLoadingBookings] = useState(true);

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) return;

    const fetchData = async () => {
      try {
        // ✅ Fetch provider services
        const servicesRes = await axios.get(
          "/api/services/provider/my",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setServices(servicesRes.data);

        // ✅ Fetch bookings
        const bookingsRes = await axios.get(
          "/api/bookings/provider",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setBookings(bookingsRes.data);

      } catch (err) {
        console.error(err);
      } finally {
        setLoadingServices(false);
        setLoadingBookings(false);
      }
    };

    fetchData();
  }, [token]);

  // ✅ Update booking status
  const updateStatus = async (id, status) => {
    try {
      await axios.patch(
        `/api/bookings/${id}`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // refresh bookings
      const res = await axios.get("/api/bookings/provider", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setBookings(res.data);

    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6">

      <h1 className="text-2xl font-bold mb-6">
        Provider Dashboard
      </h1>

      {/* SERVICES */}
      <h2 className="text-xl font-semibold mb-3">My Services</h2>

      {loadingServices ? (
        <p>Loading services...</p>
      ) : services.length === 0 ? (
        <p className="text-gray-500">No services added yet</p>
      ) : (
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          {services.map((s) => (
            <div key={s._id} className="border p-4 rounded">
              <h3 className="font-bold">{s.title}</h3>
              <p>Rs. {s.price}</p>
              <p className="text-sm text-gray-500">{s.category}</p>
            </div>
          ))}
        </div>
      )}

      {/* BOOKINGS */}
      <h2 className="text-xl font-semibold mb-3">Bookings</h2>

      {loadingBookings ? (
        <p>Loading bookings...</p>
      ) : bookings.length === 0 ? (
        <p className="text-gray-500">No bookings yet</p>
      ) : (
        <div className="space-y-4">
          {bookings.map((b) => (
            <div key={b._id} className="border p-4 rounded">

              <p><b>Service:</b> {b.service?.title}</p>
              <p><b>Customer:</b> {b.customer?.name}</p>
              <p><b>Date:</b> {b.date?.slice(0, 10)}</p>
              <p><b>Time:</b> {b.time}</p>
              <p>
                <b>Status:</b>{" "}
                <span className="capitalize">{b.status}</span>
              </p>

              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => updateStatus(b._id, "accepted")}
                  className="bg-blue-500 text-white px-3 py-1 rounded"
                >
                  Accept
                </button>

                <button
                  onClick={() => updateStatus(b._id, "completed")}
                  className="bg-green-500 text-white px-3 py-1 rounded"
                >
                  Complete
                </button>

                <button
                  onClick={() => updateStatus(b._id, "cancelled")}
                  className="bg-red-500 text-white px-3 py-1 rounded"
                >
                  Cancel
                </button>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
};

export default ProviderDashboard;
