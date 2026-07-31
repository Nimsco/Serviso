import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";
import { API_URL } from "../api/config";
import { clearCredentials, selectUser } from "../store/authSlice";
import AdminBookingsPanel from "../features/admin/components/AdminBookingsPanel";
import AdminCategoriesPanel from "../features/admin/components/AdminCategoriesPanel";
import AdminOverview from "../features/admin/components/AdminOverview";
import AdminProvidersPanel from "../features/admin/components/AdminProvidersPanel";
import AdminServicesPanel from "../features/admin/components/AdminServicesPanel";
import AdminSidebar from "../features/admin/components/AdminSidebar";
import AdminTopbar from "../features/admin/components/AdminTopbar";
import AdminUsersPanel from "../features/admin/components/AdminUsersPanel";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const [activeTab, setActiveTab] = useState("Overview");
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [providers, setProviders] = useState([]);
  const [categories, setCategories] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [services, setServices] = useState([]);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [categoryForm, setCategoryForm] = useState({ name: "", image: "", imageFile: null });
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "light");

  const authConfig = useMemo(() => ({ withCredentials: true }), []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (user.role !== "admin") {
      navigate("/");
      return;
    }

    let isActive = true;

    const loadData = async () => {
      try {
        const userParams = new URLSearchParams({ search, role: roleFilter });
        const [statsRes, usersRes, providersRes, categoriesRes, bookingsRes, servicesRes] = await Promise.all([
          axios.get(`${API_URL}/admin/stats`, authConfig),
          axios.get(`${API_URL}/admin/users?${userParams.toString()}`, authConfig),
          axios.get(`${API_URL}/admin/provider-applications`, authConfig),
          axios.get(`${API_URL}/admin/categories`, authConfig),
          axios.get(`${API_URL}/admin/bookings`, authConfig),
          axios.get(`${API_URL}/admin/services`, authConfig),
        ]);

        if (!isActive) return;

        setStats(statsRes.data);
        setUsers(usersRes.data);
        setProviders(providersRes.data);
        setCategories(categoriesRes.data);
        setBookings(bookingsRes.data);
        setServices(servicesRes.data);
      } catch (err) {
        console.error(err);
        toast.error(err.response?.data?.message || "Unable to load admin dashboard");
      } finally {
        if (isActive) setLoading(false);
      }
    };

    loadData();

    return () => {
      isActive = false;
    };
  }, [authConfig, navigate, roleFilter, search, user]);

  const refreshStats = async () => {
    const res = await axios.get(`${API_URL}/admin/stats`, authConfig);
    setStats(res.data);
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const logout = async () => {
    try {
      await axios.post(`${API_URL}/auth/logout`, {}, { withCredentials: true });
    } catch (err) {
      console.error(err);
    }

    dispatch(clearCredentials());
    navigate("/login");
  };

  const toggleBlock = async (targetUser) => {
    try {
      const res = await axios.patch(
        `${API_URL}/admin/users/${targetUser._id}/block`,
        { isBlocked: !targetUser.isBlocked },
        authConfig
      );

      setUsers((prev) => prev.map((item) => (item._id === targetUser._id ? res.data.user : item)));
      toast.success(targetUser.isBlocked ? "User unblocked" : "User blocked");
      refreshStats();
    } catch (err) {
      toast.error(err.response?.data?.message || "Unable to update user");
    }
  };

  const removeUser = async (id) => {
    if (!window.confirm("Delete this user account permanently?")) return;

    try {
      await axios.delete(`${API_URL}/admin/users/${id}`, authConfig);
      setUsers((prev) => prev.filter((item) => item._id !== id));
      toast.success("User deleted");
      refreshStats();
    } catch (err) {
      toast.error(err.response?.data?.message || "Unable to delete user");
    }
  };

  const decideProvider = async (id, status) => {
    const reason = status === "rejected" ? window.prompt("Reason for rejection") : "";
    if (status === "rejected" && reason === null) return;

    try {
      const res = await axios.patch(
        `${API_URL}/admin/provider-applications/${id}`,
        { status, reason },
        authConfig
      );

      setProviders((prev) => prev.map((provider) => (provider._id === id ? res.data.provider : provider)));
      toast.success(`Provider ${status}`);
      refreshStats();
    } catch (err) {
      toast.error(err.response?.data?.message || "Unable to update provider");
    }
  };

  const addCategory = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("name", categoryForm.name);
      formData.append("image", categoryForm.image);

      if (categoryForm.imageFile) {
        formData.append("imageFile", categoryForm.imageFile);
      }

      const res = await axios.post(`${API_URL}/admin/categories`, formData, {
        ...authConfig,
        headers: { ...authConfig.headers, "Content-Type": "multipart/form-data" },
      });

      setCategories((prev) => [res.data.category, ...prev]);
      setCategoryForm({ name: "", image: "", imageFile: null });
      toast.success("Category added");
      refreshStats();
    } catch (err) {
      toast.error(err.response?.data?.message || "Unable to add category");
    }
  };

  const deleteCategory = async (id) => {
    if (!window.confirm("Delete this category?")) return;

    try {
      await axios.delete(`${API_URL}/admin/categories/${id}`, authConfig);
      setCategories((prev) => prev.filter((category) => category._id !== id));
      toast.success("Category deleted");
      refreshStats();
    } catch (err) {
      toast.error(err.response?.data?.message || "Unable to delete category");
    }
  };

  const adminCancelBooking = async (id) => {
    if (!window.confirm("Force cancel this booking?")) return;

    try {
      const res = await axios.patch(`${API_URL}/admin/bookings/${id}/cancel`, {}, authConfig);
      setBookings((prev) => prev.map((booking) => (booking._id === id ? res.data.booking : booking)));
      toast.success("Booking forcefully cancelled");
      refreshStats();
    } catch (err) {
      toast.error(err.response?.data?.message || "Unable to cancel booking");
    }
  };

  const adminDeleteService = async (id) => {
    if (!window.confirm("Permanently delete this service?")) return;

    try {
      await axios.delete(`${API_URL}/admin/services/${id}`, authConfig);
      setServices((prev) => prev.filter((service) => service._id !== id));
      toast.success("Service deleted");
      refreshStats();
    } catch (err) {
      toast.error(err.response?.data?.message || "Unable to delete service");
    }
  };

  const renderPanel = () => {
    if (activeTab === "Overview" && stats) {
      return <AdminOverview stats={stats} setActiveTab={setActiveTab} />;
    }

    if (activeTab === "Users") {
      return (
        <AdminUsersPanel
          users={users}
          search={search}
          setSearch={setSearch}
          roleFilter={roleFilter}
          setRoleFilter={setRoleFilter}
          toggleBlock={toggleBlock}
          removeUser={removeUser}
        />
      );
    }

    if (activeTab === "Providers") {
      return <AdminProvidersPanel providers={providers} decideProvider={decideProvider} />;
    }

    if (activeTab === "Bookings") {
      return <AdminBookingsPanel bookings={bookings} adminCancelBooking={adminCancelBooking} />;
    }

    if (activeTab === "Services") {
      return <AdminServicesPanel services={services} adminDeleteService={adminDeleteService} />;
    }

    return (
      <AdminCategoriesPanel
        categories={categories}
        categoryForm={categoryForm}
        setCategoryForm={setCategoryForm}
        addCategory={addCategory}
        deleteCategory={deleteCategory}
      />
    );
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
      <AdminSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        user={user}
        theme={theme}
        toggleTheme={toggleTheme}
        logout={logout}
      />

      <main className="flex-1 p-6 md:p-10 overflow-y-auto space-y-8">
        <AdminTopbar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          toggleTheme={toggleTheme}
          logout={logout}
        />
        {renderPanel()}
      </main>
    </div>
  );
};

export default AdminDashboard;
