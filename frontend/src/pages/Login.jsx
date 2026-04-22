import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../api/auth";
import { toast } from "react-toastify";

const Login = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

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

    localStorage.setItem("user", JSON.stringify(res.data.user));

    toast.success("Login successful!");

    navigate("/");

  } catch (err) {
    console.log(err.response?.data);
    toast.error("Login Failed")
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50 px-4">

      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">

        <h2 className="text-2xl font-bold text-center text-blue-500">
          Login to Serviso
        </h2>

        <p className="text-center text-gray-500 text-sm mt-2">
          Access trusted services near you
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">

          {/* Email */}
          <input
            type="email"
            name="email"
            placeholder="Email address"
            value={form.email}
            onChange={handleChange}
            className="w-full border p-2 rounded-md focus:outline-blue-500"
            required
          />

          {/* Password */}
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="w-full border p-2 rounded-md focus:outline-blue-500"
            required
          />

          {/* Forgot Password */}
          <div className="text-right text-sm">
            <span className="text-blue-500 cursor-pointer hover:underline">
              Forgot password?
            </span>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition"
          >
            Login
          </button>

        </form>

        {/* Register link */}
        <p className="text-center text-sm text-gray-600 mt-6">
          Don’t have an account?{" "}
          <span
            className="text-blue-500 cursor-pointer hover:underline"
            onClick={() => navigate("/register")}
          >
            Register
          </span>
        </p>

      </div>

    </div>
  );
};

export default Login;