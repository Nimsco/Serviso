import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { selectUser, clearCredentials } from "../store/authSlice";
import axios from "axios";
import { toast } from "react-toastify";
import { API_URL } from "../api/config";
import ProviderBookingActions from "../features/provider/components/ProviderBookingActions";
import ServiceStatusCard from "../features/provider/components/ServiceStatusCard";
import { emptyService, serviceToForm, statusStyle } from "../features/provider/providerDashboard.utils";

const ProviderDashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const [profile, setProfile] = useState(null);
  const [services, setServices] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [serviceForm, setServiceForm] = useState(emptyService);
  const [editingService, setEditingService] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [statusSaving, setStatusSaving] = useState(false);

  // Self-contained theme management for provider workspace layout
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "light");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const authConfig = useMemo(() => ({
    withCredentials: true,
  }), []);

  const providerCategory = profile?.providerDetails?.categories?.[0] || services[0]?.category || "Approved category";
  const hasService = services.length > 0;

  const stats = useMemo(() => {
    const pending = bookings.filter((booking) => booking.status === "pending").length;
    const completed = bookings.filter((booking) => booking.status === "completed").length;
    const earnings = bookings
      .filter((booking) => booking.status === "completed")
      .reduce((total, booking) => total + Number(booking.service?.price || 0), 0);

    return {
      pending,
      completed,
      earnings,
      totalBookings: bookings.length,
    };
  }, [bookings]);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (user.role !== "provider") {
      navigate("/");
      return;
    }

    let isActive = true;

    const loadDashboard = async () => {
      try {
        const [profileRes, servicesRes, bookingsRes] = await Promise.all([
          axios.get(`${API_URL}/auth/profile`, authConfig),
          axios.get(`${API_URL}/services/provider/my`, authConfig),
          axios.get(`${API_URL}/bookings/provider`, authConfig),
        ]);

        if (!isActive) return;

        const providerServices = servicesRes.data || [];

        setProfile(profileRes.data);
        setServices(providerServices);
        if (providerServices[0]) {
          setServiceForm(serviceToForm(providerServices[0]));
        }
        setBookings(bookingsRes.data);
      } catch (err) {
        console.error(err);
        toast.error(err.response?.data?.message || "Unable to load provider dashboard");
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    };

    loadDashboard();

    return () => {
      isActive = false;
    };
  }, [authConfig, navigate, user]);

  const handleServiceChange = (e) => {
    const { name, value } = e.target;

    setServiceForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const saveService = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      const payload = {
        ...serviceForm,
        price: Number(serviceForm.price),
      };

      const res = hasService
        ? await axios.patch(`${API_URL}/services/provider/my`, payload, authConfig)
        : await axios.post(`${API_URL}/services`, payload, authConfig);

      setServices([res.data.service]);
      setServiceForm(serviceToForm(res.data.service));
      setEditingService(false);
      toast.success(hasService ? "Service setup updated" : "Service created with your approved category");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Service setup could not be saved");
    } finally {
      setSaving(false);
    }
  };

  const cancelServiceEdit = () => {
    setServiceForm(serviceToForm(services[0]));
    setEditingService(false);
  };

  const toggleServiceStatus = async () => {
    if (!hasService || statusSaving) return;

    const nextStatus = !services[0].isActive;

    try {
      setStatusSaving(true);

      const res = await axios.patch(
        `${API_URL}/services/provider/my/status`,
        { isActive: nextStatus },
        authConfig
      );

      setServices([res.data.service]);
      setServiceForm(serviceToForm(res.data.service));
      toast.success(res.data.message || "Service status updated");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Service status could not be updated");
    } finally {
      setStatusSaving(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await axios.patch(`${API_URL}/bookings/${id}`, { status }, authConfig);

      setBookings((prev) =>
        prev.map((booking) =>
          booking._id === id ? { ...booking, status } : booking
        )
      );

      toast.success("Booking updated");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Booking status could not be updated");
    }
  };

  const logout = async () => {
    try {
      await axios.post(`${API_URL}/auth/logout`, {}, { withCredentials: true });
    } catch (err) {
      console.log(err);
    }
    dispatch(clearCredentials());
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[var(--primary)]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] flex transition-colors duration-200">
      
      {/* SIDEBAR PANEL */}
      <aside className="hidden lg:flex w-72 bg-[var(--bg-card)] border-r border-[var(--border)] p-6 flex-col justify-between">
        <div>
          <div className="flex items-center gap-3">
            <img
              src={profile?.profilePic || "/user.png"}
              alt={profile?.name}
              className="h-12 w-12 rounded-full object-cover border-2 border-[var(--primary-light)] shadow-sm"
              onError={(e) => {
                e.target.src = "https://img.icons8.com/color/96/user-male-circle--v1.png";
              }}
            />
            <div>
              <h1 className="font-bold leading-tight text-[var(--text)]">{profile?.name}</h1>
              <p className="text-[var(--text-muted)] text-xs mt-0.5">{providerCategory}</p>
            </div>
          </div>

          <nav className="mt-10 space-y-1">
            <button className="w-full text-left bg-[var(--primary)] text-white px-4 py-2.5 rounded-xl text-sm font-bold shadow-xs">
              Workspace Dashboard
            </button>
            <button
              onClick={() => navigate("/profile")}
              className="w-full text-left text-[var(--text-secondary)] hover:bg-[var(--bg-card-hover)] px-4 py-2.5 rounded-xl text-sm font-bold transition duration-200 cursor-pointer"
            >
              Profile View
            </button>
          </nav>
        </div>

        <div className="space-y-4 pt-6 border-t border-[var(--border)]">
          <div>
            <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-wide font-bold">
              Account Status
            </p>
            <span className="inline-block bg-[var(--success-bg)] text-[var(--success)] text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full border border-[var(--success)]/20 mt-1">
              {profile?.providerStatus}
            </span>
          </div>

          {/* Theme Selector Toggle */}
          <button
            onClick={toggleTheme}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg-card-hover)] hover:text-[var(--primary)] text-xs font-bold transition duration-200 cursor-pointer"
          >
            {theme === "dark" ? (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m12.728 12.728l.707.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
                </svg>
                Light Theme
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
                Dark Theme
              </>
            )}
          </button>

          <button
            onClick={logout}
            className="w-full bg-red-500 hover:bg-red-600 text-white px-4 py-2.5 rounded-xl text-xs font-bold tracking-wide transition duration-200 cursor-pointer shadow-xs active:scale-98"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* MAIN CONTAINER */}
      <main className="flex-1 p-6 md:p-8 overflow-y-auto space-y-6">
        
        {/* TOP ROW CONTROL */}
        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4 pb-5 border-b border-[var(--border)]">
          <div>
            <p className="text-[var(--primary)] font-bold text-xs uppercase tracking-wider">Provider Workspace</p>
            <h2 className="text-3xl font-extrabold text-[var(--text)] tracking-tight mt-1">
              {providerCategory} Service Dashboard
            </h2>
            <p className="text-sm text-[var(--text-secondary)] mt-1.5 leading-relaxed">
              Your account can configure one active service offering matching your approved service category.
            </p>
          </div>

          <div className="flex gap-3 lg:hidden">
            <button
              onClick={toggleTheme}
              className="bg-[var(--bg-card)] border border-[var(--border)] px-4 py-2 rounded-xl text-xs font-bold"
            >
              Toggle Theme
            </button>
            <button
              onClick={() => navigate("/profile")}
              className="bg-[var(--bg-card)] border border-[var(--border)] px-4 py-2 rounded-xl text-xs font-bold"
            >
              Profile
            </button>
            <button
              onClick={logout}
              className="bg-red-500 text-white px-4 py-2 rounded-xl text-xs font-bold"
            >
              Logout
            </button>
          </div>
        </div>

        {/* METRICS BLOCKS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mt-4">
          <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-5 shadow-xs h-28 flex flex-col justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">Verified Service</span>
            <h3 className="text-2xl font-extrabold text-[var(--primary)] mt-2">{hasService ? 1 : 0}/1</h3>
          </div>
          <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-5 shadow-xs h-28 flex flex-col justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">Pending Requests</span>
            <h3 className="text-2xl font-extrabold text-yellow-500 mt-2">{stats.pending}</h3>
          </div>
          <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-5 shadow-xs h-28 flex flex-col justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">Completed Jobs</span>
            <h3 className="text-2xl font-extrabold text-green-500 mt-2">{stats.completed}</h3>
          </div>
          <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-5 shadow-xs h-28 flex flex-col justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">Earnings</span>
            <h3 className="text-2xl font-extrabold text-purple-500 mt-2">Rs. {stats.earnings}</h3>
          </div>
        </div>

        {/* LAYOUT BODY */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
          
          {/* SETUP FORM */}
          <section className="xl:col-span-1 bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-6 shadow-xs space-y-5">
            <div>
              <h3 className="text-lg font-bold text-[var(--text)] tracking-tight">Service Setup Configuration</h3>
              <p className="text-xs text-[var(--text-secondary)] mt-1 leading-relaxed">
                Your approved business category locks this service specification.
              </p>
            </div>

            <div className="bg-[var(--primary-light)] border border-[var(--primary-border)]/40 rounded-xl p-4">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)] block">Approved Category</span>
              <p className="font-extrabold text-[var(--primary)] text-sm mt-1">{providerCategory}</p>
            </div>

            <div className="bg-[var(--bg-card-hover)]/30 border border-[var(--border)]/70 rounded-xl p-4 text-xs text-[var(--text-secondary)] space-y-1">
              <p className="font-bold text-[var(--text-muted)] uppercase tracking-wider text-[10px] mb-1">Service Attributes</p>
              <p>Name: <span className="font-semibold text-[var(--text)]">{profile?.name} &mdash; {providerCategory}</span></p>
              <p>Thumbnail: <span className="font-semibold text-[var(--text)]">Provider Profile Picture</span></p>
            </div>

            <ServiceStatusCard
              service={services[0]}
              statusSaving={statusSaving}
              onToggle={toggleServiceStatus}
            />

            {hasService && !editingService ? (
              <div className="border border-[var(--border)] rounded-2xl overflow-hidden shadow-xs bg-[var(--bg)]/30">
                <img
                  src={services[0].image || "/provider-2.jpg"}
                  alt={services[0].title}
                  className="h-40 w-full object-cover"
                  onError={(e) => {
                    e.target.src = "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=80";
                  }}
                />
                <div className="p-4 space-y-2">
                  <h4 className="font-bold text-[var(--text)] leading-snug">{services[0].title}</h4>
                  <span className="inline-block text-[10px] font-bold bg-[var(--primary-light)] text-[var(--primary)] border border-[var(--primary-border)]/30 px-2 py-0.5 rounded uppercase tracking-wider">
                    {services[0].category}
                  </span>
                  <p className="font-extrabold text-[var(--primary)] text-base pt-1">Rs. {services[0].price} / hr</p>
                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed pt-1">{services[0].description}</p>
                  {services[0].availability && (
                    <div className="pt-2">
                      <span className="text-[10px] text-[var(--text-muted)] block uppercase tracking-wider font-bold">Availability</span>
                      <p className="text-xs text-[var(--text)] font-semibold mt-0.5">{services[0].availability}</p>
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      setServiceForm(serviceToForm(services[0]));
                      setEditingService(true);
                    }}
                    className="w-full bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white py-3 rounded-xl font-bold tracking-wide transition duration-200 cursor-pointer shadow-md active:scale-98 mt-3"
                  >
                    Edit Service Setup
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={saveService} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">Hourly Rate Price (Rs.)</label>
                  <input
                    type="number"
                    name="price"
                    placeholder="Rate per hour"
                    value={serviceForm.price}
                    onChange={handleServiceChange}
                    min="1"
                    className="w-full border border-[var(--border)] bg-[var(--input-bg)] text-[var(--text)] p-3 rounded-xl focus:outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/10 text-sm transition"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">Description</label>
                  <textarea
                    name="description"
                    placeholder="Describe service details and scope..."
                    value={serviceForm.description}
                    onChange={handleServiceChange}
                    rows="3"
                    className="w-full border border-[var(--border)] bg-[var(--input-bg)] text-[var(--text)] p-3 rounded-xl focus:outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/10 text-sm transition resize-none"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">Availability & Works schedule</label>
                  <textarea
                    name="availability"
                    placeholder="Sunday - Friday: 8 AM - 5 PM"
                    value={serviceForm.availability}
                    onChange={handleServiceChange}
                    rows="2"
                    className="w-full border border-[var(--border)] bg-[var(--input-bg)] text-[var(--text)] p-3 rounded-xl focus:outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/10 text-sm transition resize-none"
                    required
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  {hasService && (
                    <button
                      type="button"
                      onClick={cancelServiceEdit}
                      disabled={saving}
                      className="sm:w-1/3 border border-[var(--border)] bg-[var(--bg-card-hover)] hover:bg-[var(--bg)] text-[var(--text)] py-3.5 rounded-xl font-bold tracking-wide transition duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Cancel
                    </button>
                  )}
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white py-3.5 rounded-xl font-bold tracking-wide transition duration-200 cursor-pointer shadow-md active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {saving ? "Saving..." : hasService ? "Save Service Setup" : "Create Verified Service"}
                  </button>
                </div>
              </form>
            )}
          </section>

          {/* BOOKINGS TABLE */}
          <section className="xl:col-span-2 bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between gap-4 pb-2 border-b border-[var(--border)]/50">
              <div>
                <h3 className="text-lg font-bold text-[var(--text)] tracking-tight">Active Bookings</h3>
                <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                  Manage service requests and execution logs.
                </p>
              </div>
              <span className="text-xs font-bold bg-[var(--bg-card-hover)] px-3 py-1 rounded-full border border-[var(--border)]">
                {stats.totalBookings} Total
              </span>
            </div>

            {bookings.length === 0 ? (
              <p className="text-[var(--text-secondary)] text-sm py-12 text-center">No bookings registered yet.</p>
            ) : (
              <div className="space-y-4 mt-6">
                {bookings.map((booking) => (
                  <div key={booking._id} className="border border-[var(--border)] rounded-2xl p-5 bg-[var(--bg)]/30 hover:border-[var(--primary)]/20 transition-all duration-200 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                      <div className="space-y-1">
                        <h4 className="font-bold text-[var(--text)] leading-snug">{booking.service?.title}</h4>
                        <p className="text-xs text-[var(--text-secondary)]">
                          Customer: <span className="font-semibold text-[var(--text)]">{booking.customer?.name || booking.customer?.username}</span>
                        </p>
                        {booking.customer?.phone && (
                          <p className="text-xs text-[var(--text-secondary)]">
                            Phone: <span className="font-semibold text-[var(--text)]">{booking.customer.phone}</span>
                          </p>
                        )}
                        {booking.customer?.address && (
                          <p className="text-xs text-[var(--text-secondary)]">
                            Address: <span className="font-semibold text-[var(--text)]">{booking.customer.address}</span>
                          </p>
                        )}
                        <p className="text-xs text-[var(--text-secondary)]">
                          Schedule: <span className="font-semibold text-[var(--text)]">{booking.date?.slice(0, 10)} at {booking.time}</span>
                        </p>
                      </div>

                      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border w-fit ${statusStyle[booking.status] || "bg-slate-100 text-slate-600"}`}>
                        {booking.status}
                      </span>
                    </div>

                    <ProviderBookingActions booking={booking} updateStatus={updateStatus} />
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* LOWER ANALYTICS SUMMARY BOXES */}
          <section className="xl:col-span-3 grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
            <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-6 shadow-xs space-y-4">
              <h3 className="text-lg font-bold text-[var(--text)] tracking-tight">Reviews & Service Rating</h3>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                Rating score averages based on feedback submitted by customers after booking closures.
              </p>
              <div className="flex items-center gap-5 border border-[var(--border)] rounded-2xl p-4 bg-[var(--bg)]/30 w-fit">
                <p className="text-4xl font-black text-yellow-500">
                  ★ {services[0]?.rating || 0}
                </p>
                <div className="h-8 w-px bg-[var(--border)]"></div>
                <p className="text-xs font-semibold text-[var(--text-secondary)]">
                  {services[0]?.totalReviews || 0} customer reviews
                </p>
              </div>
            </div>

            <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-6 shadow-xs flex flex-col justify-between">
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-[var(--text)] tracking-tight">Public Profile Settings</h3>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                  Modify details to display correct credentials and rates to search results.
                </p>
              </div>
              <button
                onClick={() => navigate("/profile")}
                className="mt-5 w-fit bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white px-6 py-2.5 rounded-xl text-xs font-bold transition duration-200 cursor-pointer shadow-md hover:shadow-lg active:scale-98"
              >
                Manage Profile
              </button>
            </div>
          </section>

        </div>
      </main>

    </div>
  );
};

export default ProviderDashboard;
