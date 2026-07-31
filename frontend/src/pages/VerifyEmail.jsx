import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { verifyEmail } from "../api/auth";
import { setCredentials } from "../store/authSlice";

const VerifyEmail = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [form, setForm] = useState({
    email: localStorage.getItem("pendingUserEmail") || "",
    code: "",
  });
  const [loading, setLoading] = useState(false);

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
      setLoading(true);
      const res = await verifyEmail(form);
      localStorage.removeItem("pendingUserEmail");
      toast.success(res.data.message);

      if (res.data.autoLogin) {
        // Store user + access token in Redux (auto-login for customers)
        dispatch(setCredentials({
          user: res.data.user,
          accessToken: res.data.accessToken,
        }));
        navigate("/profile");
      } else {
        navigate("/login");
      }
    } catch (err) {
      console.log(err.response?.data);
      toast.error(err.response?.data?.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg)] text-[var(--text)] px-4 transition-colors duration-200">
      <div className="bg-[var(--bg-card)] border border-[var(--border)] p-8 rounded-2xl shadow-lg w-full max-w-md space-y-6">
        
        <div className="text-center space-y-2">
          <div className="text-4xl">✉️</div>
          <h1 className="text-2xl font-extrabold text-[var(--primary)] tracking-tight">
            Verify Email
          </h1>
          <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
            Enter the 6-digit code sent to your email to verify your account.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">Email Address</label>
            <input
              type="email"
              name="email"
              placeholder="provider@example.com"
              value={form.email}
              onChange={handleChange}
              className="w-full border border-[var(--border)] bg-[var(--input-bg)] text-[var(--text)] placeholder-[var(--text-muted)] p-3 rounded-xl focus:outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/10 transition"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">6-Digit Code</label>
            <input
              type="text"
              name="code"
              placeholder="000000"
              value={form.code}
              onChange={handleChange}
              className="w-full border border-[var(--border)] bg-[var(--input-bg)] text-[var(--text)] placeholder-[var(--text-muted)] p-3 rounded-xl focus:outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/10 text-center tracking-widest font-mono text-lg transition"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white py-3.5 rounded-xl font-bold tracking-wide transition duration-200 cursor-pointer shadow-md hover:shadow-lg active:scale-98 disabled:bg-[var(--primary)]/50 disabled:cursor-not-allowed"
          >
            {loading ? "Verifying..." : "Verify Email"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default VerifyEmail;
