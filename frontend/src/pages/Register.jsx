import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../api/auth";
import { toast } from "react-toastify";

const Register = () => {
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
  
  const navigate = useNavigate();

  const [preview, setPreview] = useState(null);

const handleChange = (e) => {
  const { name, files } = e.target;

  if (name === "profilePic") {
    const file = files[0];

    if (preview) {
      URL.revokeObjectURL(preview);
    }

    setForm((prev) => ({ ...prev, profilePic: file }));

    if (file) {
      const newPreview = URL.createObjectURL(file);
      setPreview(newPreview);
    } else {
      setPreview(null);
    }

  } else {
    const { value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }
};

const removeImage = () => {
  if (preview) {
    URL.revokeObjectURL(preview);
  }

  setForm({ ...form, profilePic: null });
  setPreview(null);
};

const handleSubmit = async (e) => {
  e.preventDefault();

  if (form.password !== form.confirmPassword) {
    toast.error("Passwords do not match")
    return;
  }

  try {
    const formData = new FormData();

    Object.keys(form).forEach((key) => {
      formData.append(key, form[key]);
    });

const res = await registerUser(formData);


if (res.status === 201) {
  navigate("/profile");
}

  } catch (err) {
    console.log(err.response?.data);
    toast.error("Registration failed")
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50 px-4">

      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-2xl">

        <h2 className="text-2xl font-bold text-center text-blue-500">
          Create Your Account
        </h2>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">

          {/* Name */}
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            className="w-full border p-2 rounded-md focus:outline-blue-500"
            required
          />

          {/* Username */}
          <input
            type="text"
            name="username"
            placeholder="Username (unique)"
            value={form.username}
            onChange={handleChange}
            className="w-full border p-2 rounded-md focus:outline-blue-500"
            required
          />

          {/* Email */}
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={form.email}
            onChange={handleChange}
            className="w-full border p-2 rounded-md"
            required
          />

          {/* Phone */}
          <input
            type="text"
            name="phone"
            placeholder="Phone Number"
            value={form.phone}
            onChange={handleChange}
            className="w-full border p-2 rounded-md"
            required
          />

          {/* Password */}
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="w-full border p-2 rounded-md"
            required
          />

          {/* Confirm Password */}
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={form.confirmPassword}
            onChange={handleChange}
            className="w-full border p-2 rounded-md"
            required
          />

          {/* Gender + DOB */}
          <div className="flex gap-4">
            <select
              name="gender"
              value={form.gender}
              onChange={handleChange}
              className="w-1/2 border p-2 rounded-md"
              required
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>

            <input
              type="date"
              name="dob"
              value={form.dob}
              onChange={handleChange}
              className="w-1/2 border p-2 rounded-md"
              required
            />
          </div>

          {/* Role */}
          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="w-full border p-2 rounded-md"
          >
            <option value="customer">Customer</option>
            <option value="provider">Service Provider</option>
          </select>

          {/* Address */}
          <input
            type="text"
            name="address"
            placeholder="Address (City / Area)"
            value={form.address}
            onChange={handleChange}
            className="w-full border p-2 rounded-md"
            required
          />

          {/* Profile Picture */}
          <div>
            <label className="block text-sm text-gray-600 mb-2">
              Profile Picture
            </label>

            <div className="flex items-center gap-4">

              {/* Upload Button */}
              <label className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition">
                Upload Image
                <input
  type="file"
  name="profilePic"
  accept="image/*"
  onChange={handleChange}
  className="hidden"
/>
              </label>

              {/* Preview */}
              {preview && (
                <div className="relative">
                  <img
                    src={preview}
                    alt="preview"
                    className="h-14 w-14 rounded-full object-cover border"
                  />

                  {/* Remove Button */}
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full h-5 w-5 flex items-center justify-center text-xs"
                  >
                    ✕
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Submit */}
          <button
  type="submit"
  disabled={form.password !== form.confirmPassword}
  className={`w-full py-2 rounded-md transition text-white
    ${form.password !== form.confirmPassword
      ? "bg-blue-300 cursor-not-allowed"
      : "bg-blue-500 hover:bg-blue-600"
    }`}
>
  Register
</button>

        </form>
        <p className="text-center text-sm text-gray-600 mt-6">
  Already have an account?{" "}
  <span
    className="text-blue-500 cursor-pointer hover:underline"
    onClick={() => navigate("/login")}
  >
    Login
  </span>
</p>

      </div>

    </div>
  );
};

export default Register;