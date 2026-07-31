import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { googleLogin, registerUser } from "../api/auth";
import { toast } from "react-toastify";
import AuthShell from "../components/UI/AuthShell";

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    gender: "",
    dob: "",
    role: "customer",
    address: "",
    profilePic: null,
  });
  const [preview, setPreview] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    const { name, files, value } = e.target;

    if (name === "profilePic") {
      const file = files[0];

      if (preview) {
        URL.revokeObjectURL(preview);
      }

      setForm((prev) => ({ ...prev, profilePic: file }));
      setPreview(file ? URL.createObjectURL(file) : null);
      return;
    }

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const removeImage = () => {
    if (preview) {
      URL.revokeObjectURL(preview);
    }

    setForm((prev) => ({ ...prev, profilePic: null }));
    setPreview(null);
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
        if (res.data.requiresEmailVerification) {
          localStorage.setItem("pendingUserEmail", res.data.email);
          toast.success("Registration successful. Please verify your email.");
          navigate("/verify-email");
        }
      }
    } catch (err) {
      console.log(err.response?.data);
      toast.error(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <AuthShell
      title="Create Customer Account"
      description="Set up a complete profile so providers can confirm jobs with the right contact and service details."
      sideTitle="Book with more confidence."
      sideItems={[
        { title: "Verified providers", description: "Provider documents and categories are reviewed before approval." },
        { title: "Clear scheduling", description: "Bookings are limited to the next 7 days for realistic availability." },
        { title: "Status tracking", description: "See pending, accepted, completed, and cancelled bookings in your profile." },
      ]}
    >
      <div className="space-y-6">

        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">Full Name</label>
              <input
                type="text"
                name="name"
                placeholder="John Doe"
                value={form.name}
                onChange={handleChange}
                className="w-full border border-[var(--border)] bg-[var(--input-bg)] text-[var(--text)] placeholder-[var(--text-muted)] p-3 rounded-xl focus:outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/10 transition duration-200"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">Username</label>
              <input
                type="text"
                name="username"
                placeholder="johndoe12"
                value={form.username}
                onChange={handleChange}
                className="w-full border border-[var(--border)] bg-[var(--input-bg)] text-[var(--text)] placeholder-[var(--text-muted)] p-3 rounded-xl focus:outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/10 transition duration-200"
                required
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">Email Address</label>
              <input
                type="email"
                name="email"
                placeholder="john@example.com"
                value={form.email}
                onChange={handleChange}
                className="w-full border border-[var(--border)] bg-[var(--input-bg)] text-[var(--text)] placeholder-[var(--text-muted)] p-3 rounded-xl focus:outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/10 transition duration-200"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">Phone Number</label>
              <input
                type="text"
                name="phone"
                placeholder="9800000000"
                value={form.phone}
                onChange={handleChange}
                className="w-full border border-[var(--border)] bg-[var(--input-bg)] text-[var(--text)] placeholder-[var(--text-muted)] p-3 rounded-xl focus:outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/10 transition duration-200"
                required
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={handleChange}
                  className="w-full border border-[var(--border)] bg-[var(--input-bg)] text-[var(--text)] placeholder-[var(--text-muted)] p-3 pr-10 rounded-xl focus:outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/10 transition duration-200"
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
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">Confirm Password</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="••••••••"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  className="w-full border border-[var(--border)] bg-[var(--input-bg)] text-[var(--text)] placeholder-[var(--text-muted)] p-3 pr-10 rounded-xl focus:outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/10 transition duration-200"
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
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">Gender</label>
              <select
                name="gender"
                value={form.gender}
                onChange={handleChange}
                className="w-full border border-[var(--border)] bg-[var(--input-bg)] text-[var(--text)] p-3 rounded-xl focus:outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/10 transition duration-200"
                required
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">Date of Birth</label>
              <input
                type="date"
                name="dob"
                value={form.dob}
                onChange={handleChange}
                max={new Date().toISOString().split("T")[0]}
                className="w-full border border-[var(--border)] bg-[var(--input-bg)] text-[var(--text)] p-3 rounded-xl focus:outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/10 transition duration-200"
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">Address (City / Area)</label>
            <input
              type="text"
              name="address"
              placeholder="e.g. Kamalpokhari, Kathmandu"
              value={form.address}
              onChange={handleChange}
              className="w-full border border-[var(--border)] bg-[var(--input-bg)] text-[var(--text)] placeholder-[var(--text-muted)] p-3 rounded-xl focus:outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/10 transition duration-200"
              required
            />
          </div>

          <div className="space-y-2 pt-2">
            <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
              Profile Picture
            </label>

            <div className="flex items-center gap-4">
              <label className="cursor-pointer bg-[var(--bg-card-hover)] hover:bg-[var(--primary-light)] text-[var(--text)] border border-[var(--border)] hover:border-[var(--primary)] px-4 py-2.5 rounded-xl font-semibold text-xs tracking-wide transition duration-200">
                Upload Image
                <input
                  type="file"
                  name="profilePic"
                  accept="image/*"
                  onChange={handleChange}
                  className="hidden"
                />
              </label>

              {preview && (
                <div className="relative">
                  <img
                    src={preview}
                    alt="preview"
                    className="h-14 w-14 rounded-full object-cover border-2 border-[var(--primary)] shadow-sm animate-fade-in"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full h-5 w-5 flex items-center justify-center text-[10px] font-bold cursor-pointer"
                  >
                    ✕
                  </button>
                </div>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={form.password !== form.confirmPassword}
            className={`w-full py-3.5 rounded-xl font-bold tracking-wide transition duration-200 text-white shadow-md cursor-pointer ${
              form.password !== form.confirmPassword
                ? "bg-[var(--primary)]/50 cursor-not-allowed"
                : "bg-[var(--primary)] hover:bg-[var(--primary-hover)] hover:shadow-lg active:scale-98"
            }`}
          >
            Register Account
          </button>
         </form>

         {/* Google Register */}
         <div className="mt-4">
           <button
             onClick={googleLogin}
             className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-700 py-2.5 rounded-xl font-semibold tracking-wide transition duration-200 cursor-pointer shadow hover:shadow-md"
           >
             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24">
               <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
               <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
               <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
               <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
             </svg>
             Register with Google
           </button>
         </div>

         <div className="text-center text-sm text-[var(--text-secondary)] space-y-2 pt-3 border-t border-[var(--border)]">
           <p>
             Already have an account?{" "}
             <span
               className="text-[var(--primary)] font-semibold cursor-pointer hover:underline"
               onClick={() => navigate("/login")}
             >
               Login
             </span>
           </p>
           <p className="text-xs text-[var(--text-muted)]">
             Want to work with Serviso?{" "}
             <span
               className="text-[var(--primary)] font-semibold cursor-pointer hover:underline"
               onClick={() => navigate("/provider-register")}
             >
               Apply as provider
             </span>
           </p>
         </div>
       </div>
    </AuthShell>
   );
};

export default Register;
