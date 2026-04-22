// pages/BookService.jsx
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

const BookService = () => {
  const { id } = useParams();

  const [service, setService] = useState(null);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  // Fetch service details
  useEffect(() => {
    async function fetchService() {
      try {
        const res = await axios.get(`/api/services/${id}`);
        setService(res.data);
      } catch (err) {
        console.error(err);
      }
    }

    fetchService();
  }, [id]);

  const timeSlots = [
    "09:00",
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00",
  ];

  const handlePayment = async () => {
    if (!date || !time) {
      return alert("Please select date and time");
    }

    try {
      setLoading(true);

      const res = await axios.post(
        "/api/payment/checkout",
        {
          serviceId: id,
          date,
          time,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      window.location.href = res.data.url;

    } catch (err) {
      alert(err.response?.data?.message || "Payment failed");
    } finally {
      setLoading(false);
    }
  };

  if (!service) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <p>Loading service...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center items-center px-4">

      <div className="bg-white rounded-xl shadow-lg max-w-md w-full overflow-hidden">

        {/* Image */}
        <img
          src={service.image || "/placeholder.jpg"}
          alt={service.title}
          className="h-48 w-full object-cover"
        />

        {/* Content */}
        <div className="p-6">

          <h1 className="text-xl font-bold">{service.title}</h1>

          <p className="text-gray-500 text-sm mt-1">
            {service.description}
          </p>

          <p className="text-blue-500 font-bold mt-2">
            Rs. {service.price}
          </p>

          {/* Date */}
          <div className="mt-4">
            <label className="text-sm text-gray-600">Select Date</label>
            <input
              type="date"
              className="border w-full p-2 mt-1 rounded"
              min={new Date().toISOString().split("T")[0]}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          {/* Time Slots */}
          <div className="mt-4">
            <label className="text-sm text-gray-600">Select Time</label>

            <div className="grid grid-cols-3 gap-2 mt-2">
              {timeSlots.map((slot) => (
                <button
                  key={slot}
                  onClick={() => setTime(slot)}
                  className={`border rounded py-2 text-sm ${
                    time === slot
                      ? "bg-blue-500 text-white"
                      : "hover:bg-gray-100"
                  }`}
                >
                  {slot}
                </button>
              ))}
            </div>
          </div>

          {/* Selected Info */}
          {(date || time) && (
            <div className="mt-4 text-sm text-gray-600">
              <p>
                <strong>Date:</strong> {date || "-"}
              </p>
              <p>
                <strong>Time:</strong> {time || "-"}
              </p>
            </div>
          )}

          {/* Button */}
          <button
            onClick={handlePayment}
            disabled={loading}
            className="mt-6 w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded transition"
          >
            {loading ? "Redirecting..." : "Pay & Book"}
          </button>

        </div>
      </div>

    </div>
  );
};

export default BookService;
