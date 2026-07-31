import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { API_URL } from "../api/config";
import { selectIsAuthenticated } from "../store/authSlice";
import BrandMark from "../components/UI/BrandMark";
import EmptyState from "../components/UI/EmptyState";

const toDateInputValue = (date) => {
  const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return localDate.toISOString().split("T")[0];
};

const timeSlots = ["06:00", "07:00", "08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"];

const BookService = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const [service, setService] = useState(null);
  const [serviceError, setServiceError] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [loading, setLoading] = useState(false);

  const today = new Date();
  const maxBookingDate = new Date();
  maxBookingDate.setDate(maxBookingDate.getDate() + 7);
  const todayString = toDateInputValue(today);
  const maxBookingString = toDateInputValue(maxBookingDate);

  useEffect(() => {
    async function fetchService() {
      try {
        const res = await axios.get(`${API_URL}/services/${id}`);
        setService(res.data);
      } catch (err) {
        console.error(err);
        setServiceError(err.response?.data?.message || "This service is not available for booking");
      }
    }

    fetchService();
  }, [id]);

  const handlePayment = async () => {
    if (!isAuthenticated) {
      alert("Please login before booking");
      navigate("/login");
      return;
    }

    if (!date || !time) {
      alert("Please select date and time");
      return;
    }

    const selectedAppointment = new Date(`${date}T${time}:00`);
    if (Number.isNaN(selectedAppointment.getTime()) || selectedAppointment <= new Date()) {
      alert("Please select a future date and time");
      return;
    }

    const maxDateOnly = new Date(`${maxBookingString}T23:59:59`);
    if (new Date(`${date}T00:00:00`) > maxDateOnly) {
      alert("Bookings can only be made up to 7 days from today");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(`${API_URL}/payment/checkout`, { serviceId: id, date, time }, { withCredentials: true });
      window.location.href = res.data.url;
    } catch (err) {
      const message = err.response?.data?.message || "Payment failed";

      if (message.toLowerCase().includes("complete your profile")) {
        alert(message);
        navigate("/edit-profile");
        return;
      }

      alert(message);
    } finally {
      setLoading(false);
    }
  };

  if (serviceError) {
    return (
      <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] px-4 py-16">
        <EmptyState
          title="Service unavailable"
          description={serviceError}
          actionLabel="Browse Providers"
          onAction={() => navigate("/providers")}
        />
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-[var(--bg)]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[var(--primary)]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] px-6 md:px-12 py-10 transition-colors duration-200">
      <div className="max-w-6xl mx-auto space-y-8">
        <BrandMark />

        <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-6 items-start">
          <section className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl shadow-lg overflow-hidden">
            <img
              src={service.image || service.provider?.profilePic || "/provider-2.jpg"}
              alt={service.title}
              className="h-72 w-full object-cover"
              onError={(e) => {
                e.target.src = "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=900&q=80";
              }}
            />
            <div className="p-6 md:p-8 space-y-6">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--primary)] bg-[var(--primary-light)] px-2.5 py-1 rounded-full border border-[var(--primary-border)]/40">
                  {service.category}
                </span>
                <h1 className="text-3xl md:text-4xl font-black text-[var(--text)] tracking-tight mt-4">{service.title}</h1>
                <p className="text-[var(--text-secondary)] text-sm md:text-base mt-3 leading-relaxed">{service.description}</p>
              </div>

              <div className="grid sm:grid-cols-3 gap-3">
                <div className="border border-[var(--border)] bg-[var(--bg)]/50 rounded-xl p-4">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">Provider</p>
                  <p className="font-extrabold text-[var(--text)] mt-1">{service.provider?.name}</p>
                </div>
                <div className="border border-[var(--border)] bg-[var(--bg)]/50 rounded-xl p-4">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">Hourly Price</p>
                  <p className="font-extrabold text-[var(--primary)] mt-1">Rs. {service.price}</p>
                </div>
                <div className="border border-[var(--border)] bg-[var(--bg)]/50 rounded-xl p-4">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">Availability</p>
                  <p className="font-extrabold text-[var(--text)] mt-1 text-sm">{service.availability || "Not specified"}</p>
                </div>
              </div>
            </div>
          </section>

          <aside className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl shadow-lg p-6 space-y-5 lg:sticky lg:top-24">
            <div>
              <p className="text-[var(--primary)] font-bold text-xs uppercase tracking-wider">Book this service</p>
              <h2 className="text-2xl font-black text-[var(--text)] mt-1">Choose a date and slot</h2>
              <p className="text-sm text-[var(--text-secondary)] mt-2 leading-relaxed">
                Providers accept or cancel requests after payment confirmation. You can book up to 7 days ahead.
              </p>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">Select Date</label>
              <input
                type="date"
                className="border border-[var(--border)] bg-[var(--input-bg)] text-[var(--text)] w-full p-3 rounded-xl focus:outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/10 transition duration-200"
                min={todayString}
                max={maxBookingString}
                value={date}
                onChange={(e) => {
                  setDate(e.target.value);
                  setTime("");
                }}
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">Select Time Slot</label>
              <div className="grid grid-cols-4 gap-2">
                {timeSlots.map((slot) => {
                  const isPastSlot = Boolean(date) && new Date(`${date}T${slot}:00`) <= new Date();

                  return (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setTime(slot)}
                      disabled={isPastSlot}
                      className={`border py-2 rounded-xl text-xs font-bold transition duration-200 ${
                        time === slot
                          ? "bg-[var(--primary)] border-[var(--primary)] text-white shadow-xs"
                          : isPastSlot
                            ? "border-[var(--border)] bg-[var(--bg-card-hover)] text-[var(--text-muted)] opacity-50 cursor-not-allowed"
                            : "border-[var(--border)] bg-[var(--bg-card-hover)] hover:bg-[var(--primary-light)] hover:text-[var(--primary)] text-[var(--text-secondary)] cursor-pointer"
                      }`}
                    >
                      {slot}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="bg-[var(--primary-light)] border border-[var(--primary-border)]/60 rounded-xl p-4 text-xs text-[var(--text-secondary)] leading-relaxed">
              Secure checkout creates a paid booking request. The provider must accept it before the job is considered scheduled.
            </div>

            <button
              type="button"
              onClick={handlePayment}
              disabled={loading}
              className="w-full bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white py-3.5 rounded-xl font-bold tracking-wide transition duration-200 cursor-pointer shadow-md hover:shadow-lg active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Redirecting to Stripe..." : `Pay Rs. ${service.price} & Book`}
            </button>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default BookService;
