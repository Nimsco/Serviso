import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../api/auth";
import { toast } from "react-toastify";
import { API_URL } from "../api/config";
import PageHeader from "../components/UI/PageHeader";

const ProviderRegister = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [form, setForm] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    gender: "",
    dob: "",
    role: "provider",
    category: "",
    experience: "",
    bio: "",
    profilePic: null,
    citizenshipFront: null,
    citizenshipBack: null,
    extraDocument: null,
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${API_URL}/services/categories`);
        const data = await res.json();
        setCategories(data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (files) {
      setForm((prev) => ({
        ...prev,
        [name]: files[0],
      }));
      return;
    }

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      toast.error("Please provide a valid email address");
      return;
    }

    const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!passwordRegex.test(form.password)) {
      toast.error("Password must be at least 8 characters long and contain at least one uppercase letter and one number");
      return;
    }

    if (form.dob && new Date(form.dob) > new Date()) {
      toast.error("Date of birth cannot be in the future");
      return;
    }

    try {
      const formData = new FormData();

      Object.keys(form).forEach((key) => {
        formData.append(key, form[key]);
      });

      const res = await registerUser(formData);

      if (res.status === 201) {
        localStorage.setItem("pendingUserEmail", res.data.email);
        toast.success("Verification code sent to your email");
        navigate("/verify-email");
      }
    } catch (err) {
      console.log(err.response?.data);
      toast.error(err.response?.data?.message || "Provider application failed");
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] transition-colors duration-200">
      <PageHeader
        eyebrow="Provider application"
        title="Apply once, then manage your service like a professional."
        description="Submit identity details and verification documents. After admin approval, you can configure price, availability, active status, and booking requests from your provider dashboard."
        image="/provider-2.jpg"
        actions={(
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="bg-[var(--bg-card)] text-[var(--primary)] border border-[var(--primary-border)] hover:bg-[var(--primary-light)] px-5 py-2.5 rounded-xl font-bold text-sm tracking-wide transition duration-200 cursor-pointer shadow-xs"
          >
            Login Instead
          </button>
        )}
        stats={[
          { value: "Docs", label: "Citizenship review" },
          { value: "Admin", label: "Manual approval" },
          { value: "Setup", label: "Service config after approval" },
          { value: "Active", label: "Booking status control" },
        ]}
      />

      <main className="max-w-5xl mx-auto px-6 py-10">
        <form onSubmit={handleSubmit} className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl shadow-lg p-6 md:p-8 space-y-8">
          <div className="grid lg:grid-cols-3 gap-8">
            
            {/* LEFT 2 COLUMNS: FORM DETAILS */}
            <section className="lg:col-span-2 space-y-6">
              <div>
                <h2 className="text-xl font-extrabold text-[var(--primary)] tracking-tight">
                  Personal Information
                </h2>
                <p className="text-xs text-[var(--text-secondary)] mt-1 font-medium">
                  Review is conducted by admin before your provider workspace is unlocked.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <input name="name" placeholder="Full Name" value={form.name} onChange={handleChange} className="border border-[var(--border)] bg-[var(--input-bg)] text-[var(--text)] p-3 rounded-xl focus:outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/10 transition" required />
                <input name="username" placeholder="Username" value={form.username} onChange={handleChange} className="border border-[var(--border)] bg-[var(--input-bg)] text-[var(--text)] p-3 rounded-xl focus:outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/10 transition" required />
                <input type="email" name="email" placeholder="Email Address" value={form.email} onChange={handleChange} className="border border-[var(--border)] bg-[var(--input-bg)] text-[var(--text)] p-3 rounded-xl focus:outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/10 transition" required />
                <input name="phone" placeholder="Phone Number" value={form.phone} onChange={handleChange} className="border border-[var(--border)] bg-[var(--input-bg)] text-[var(--text)] p-3 rounded-xl focus:outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/10 transition" required />
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Password"
                    value={form.password}
                    onChange={handleChange}
                    className="w-full border border-[var(--border)] bg-[var(--input-bg)] text-[var(--text)] p-3 pr-10 rounded-xl focus:outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/10 transition"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text)] transition cursor-pointer"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    className="w-full border border-[var(--border)] bg-[var(--input-bg)] text-[var(--text)] p-3 pr-10 rounded-xl focus:outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/10 transition"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text)] transition cursor-pointer"
                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                  >
                    {showConfirmPassword ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
                <select name="gender" value={form.gender} onChange={handleChange} className="border border-[var(--border)] bg-[var(--input-bg)] text-[var(--text)] p-3 rounded-xl focus:outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/10 transition" required>
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
                <input type="date" name="dob" value={form.dob} onChange={handleChange} max={new Date().toISOString().split("T")[0]} className="border border-[var(--border)] bg-[var(--input-bg)] text-[var(--text)] p-3 rounded-xl focus:outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/10 transition" required />
              </div>

              <div className="border-t border-[var(--border)] pt-6">
                <h2 className="text-xl font-extrabold text-[var(--primary)] tracking-tight">
                  Service Category
                </h2>
                <p className="text-xs text-[var(--text-secondary)] mt-1 font-medium">
                  Price and availability are configured from your provider dashboard after approval.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <select name="category" value={form.category} onChange={handleChange} className="border border-[var(--border)] bg-[var(--input-bg)] text-[var(--text)] p-3 rounded-xl focus:outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/10 transition" required>
                  <option value="">Select Category</option>
                  {categories.map((category) => (
                    <option key={category._id} value={category.name}>
                      {category.name}
                    </option>
                  ))}
                </select>
                <input type="number" name="experience" placeholder="Experience in years" value={form.experience} onChange={handleChange} className="border border-[var(--border)] bg-[var(--input-bg)] text-[var(--text)] p-3 rounded-xl focus:outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/10 transition" min="0" required />
              </div>

              <textarea
                name="bio"
                placeholder="Brief professional profile / bio description..."
                value={form.bio}
                onChange={handleChange}
                rows="4"
                className="w-full border border-[var(--border)] bg-[var(--input-bg)] text-[var(--text)] p-3 rounded-xl focus:outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/10 transition resize-none"
                required
              />
            </section>

            {/* RIGHT SIDEBAR: DOCUMENTS UPLOAD */}
            <aside className="space-y-6 lg:border-l lg:border-[var(--border)] lg:pl-6">
              <div>
                <h2 className="text-xl font-extrabold text-[var(--primary)] tracking-tight">
                  Verification Files
                </h2>
                <p className="text-xs text-[var(--text-secondary)] mt-1 font-medium">
                  Official citizenship documents are required for background verification.
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">Profile Picture</label>
                  <input type="file" name="profilePic" accept="image/*" onChange={handleChange} className="w-full border border-[var(--border)] bg-[var(--input-bg)] text-[var(--text)] p-2.5 rounded-xl text-xs" />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">Citizenship Front</label>
                  <input type="file" name="citizenshipFront" accept="image/*,.pdf" onChange={handleChange} className="w-full border border-[var(--border)] bg-[var(--input-bg)] text-[var(--text)] p-2.5 rounded-xl text-xs" required />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">Citizenship Back</label>
                  <input type="file" name="citizenshipBack" accept="image/*,.pdf" onChange={handleChange} className="w-full border border-[var(--border)] bg-[var(--input-bg)] text-[var(--text)] p-2.5 rounded-xl text-xs" required />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">Extra Document (License, Certs)</label>
                  <input type="file" name="extraDocument" accept="image/*,.pdf" onChange={handleChange} className="w-full border border-[var(--border)] bg-[var(--input-bg)] text-[var(--text)] p-2.5 rounded-xl text-xs" />
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={form.password !== form.confirmPassword}
                  className={`w-full py-3.5 rounded-xl font-bold text-sm tracking-wide transition duration-200 text-white shadow-md cursor-pointer ${
                    form.password !== form.confirmPassword
                      ? "bg-[var(--primary)]/50 cursor-not-allowed"
                      : "bg-[var(--primary)] hover:bg-[var(--primary-hover)] hover:shadow-lg active:scale-98"
                  }`}
                >
                  Submit Application
                </button>
              </div>
            </aside>

          </div>
        </form>
      </main>

    </div>
  );
};

export default ProviderRegister;
