import React, { useEffect, useState } from "react";
import { getProfile, updateProfile } from "../api/auth";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const EditProfile = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    gender: "",
    dob: "",
    address: "",
    profilePic: null
  });

  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const res = await getProfile();
      setFormData(res.data);
      setPreview(res.data.profilePic);
    };
    fetchUser();
  }, []);

  const handleChange = (e) => {
    if (e.target.name === "profilePic") {
      const file = e.target.files[0];
      setFormData({ ...formData, profilePic: file });
      setPreview(URL.createObjectURL(file));
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();

    Object.keys(formData).forEach((key) => {
      if (formData[key]) {
        data.append(key, formData[key]);
      }
    });

    try {
      await updateProfile(data);
      toast.success("Profile updated successfully")
      navigate("/profile");
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-blue-50 flex items-center justify-center px-4">
      <div className="bg-white shadow-xl rounded-2xl w-full max-w-3xl p-8">

        <h2 className="text-3xl font-bold text-blue-600 text-center mb-6">
          Edit Profile
        </h2>

        {/* PROFILE IMAGE */}
        <div className="flex flex-col items-center mb-6">
          <img
            src={preview || "/user.png"}
            alt="preview"
            className="w-28 h-28 rounded-full object-cover border-4 border-blue-200"
          />

          <label className="mt-3 cursor-pointer text-sm text-blue-500 hover:underline">
            Change Photo
            <input
              type="file"
              name="profilePic"
              onChange={handleChange}
              className="hidden"
            />
          </label>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-5">

          {/* NAME */}
          <div>
            <label className="text-sm text-gray-600">Full Name</label>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full mt-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* EMAIL (disabled) */}
          <div>
            <label className="text-sm text-gray-600">Email</label>
            <input
              name="email"
              value={formData.email}
              disabled
              className="w-full mt-1 p-2 border rounded-lg bg-gray-100 cursor-not-allowed"
            />
          </div>

          {/* PHONE */}
          <div>
            <label className="text-sm text-gray-600">Phone</label>
            <input
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* GENDER */}
          <div>
            <label className="text-sm text-gray-600">Gender</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
            >
              <option value="">Select</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* DOB */}
          <div>
            <label className="text-sm text-gray-600">Date of Birth</label>
            <input
              type="date"
              name="dob"
              value={formData.dob?.slice(0, 10)}
              onChange={handleChange}
              className="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* ADDRESS */}
          <div className="md:col-span-2">
            <label className="text-sm text-gray-600">Address</label>
            <input
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* BUTTON */}
          <div className="md:col-span-2 mt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600 transition"
            >
              {loading ? "Updating..." : "Update Profile"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default EditProfile;