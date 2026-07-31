import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { googleLogin, loginUser } from "../api/auth";
import { setCredentials } from "../store/authSlice";
import { toast } from "react-toastify";
import AuthShell from "../components/UI/AuthShell";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await loginUser(form);

      // Store user + access token in Redux (also persists to localStorage via the slice)
      dispatch(setCredentials({
        user: res.data.user,
        accessToken: res.data.accessToken,
      }));

      toast.success("Login successful!");

      if (res.data.user.role === "provider") {
        navigate("/provider-dashboard");
      } else if (res.data.user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }

    } catch (err) {
      console.log(err.response?.data);
      if (err.response?.data?.requiresEmailVerification) {
        localStorage.setItem("pendingUserEmail", err.response.data.email);
        navigate("/verify-email");
        return;
      }

      toast.error(err.response?.data?.message || "Login Failed");
    }
  };

  return (
    <AuthShell
      title="Login to Serviso"
      description="Access bookings, provider tools, and admin controls from one secure account."
      sideTitle="Your local service work, organized."
      sideItems={[
        { title: "Customers", description: "Book verified services, track request status, and review completed jobs." },
        { title: "Providers", description: "Accept work, manage active status, and update service setup whenever needed." },
        { title: "Admins", description: "Review providers, monitor platform health, and manage service categories." },
      ]}
    >
      <div className="space-y-6">

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Email */}
          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">Email Address</label>
            <input
              type="email"
              name="email"
              placeholder="name@example.com"
              value={form.email}
              onChange={handleChange}
              className="w-full border border-[var(--border)] bg-[var(--input-bg)] text-[var(--text)] placeholder-[var(--text-muted)] p-3 rounded-xl focus:outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/10 transition duration-200"
              required
            />
          </div>

          {/* Password */}
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">Password</label>
              <span className="text-xs text-[var(--primary)] font-semibold cursor-pointer hover:underline">
                Forgot password?
              </span>
            </div>
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

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white py-3.5 rounded-xl font-bold tracking-wide transition duration-200 cursor-pointer shadow-md hover:shadow-lg active:scale-98"
          >
            Sign In
          </button>

        </form>

        {/* Google Login */}
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
            Continue with Google
          </button>
        </div>

        {/* Register link */}
        <div className="text-center text-sm text-[var(--text-secondary)] space-y-2.5 pt-3 border-t border-[var(--border)]">
          <p>
            Don't have an account?{" "}
            <span
              className="text-[var(--primary)] font-semibold cursor-pointer hover:underline"
              onClick={() => navigate("/register")}
            >
              Register
            </span>
          </p>
          <p className="text-xs text-[var(--text-muted)]">
            Are you a service professional?{" "}
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

export default Login;
