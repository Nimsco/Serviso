import React, { useEffect, useState } from "react";
import { getProfile, updateProfile } from "../api/auth";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { selectAccessToken, setCredentials } from "../store/authSlice";

const EditProfile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const accessToken = useSelector(selectAccessToken);

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
  const isProvider = formData.role === "provider";
  const profileIncomplete = !formData.phone || !formData.gender || !formData.dob || (!isProvider && !formData.address);

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

    if (formData.dob && new Date(formData.dob) > new Date()) {
      toast.error("Date of birth cannot be in the future");
      return;
    }

    setLoading(true);

    const data = new FormData();

    Object.keys(formData).forEach((key) => {
      if (formData[key]) {
        data.append(key, formData[key]);
      }
    });

    try {
      const res = await updateProfile(data);
      const user = res.data.user;

      dispatch(setCredentials({
        user: {
          id: user._id,
          name: user.name,
          username: user.username,
          email: user.email,
          role: user.role,
          phone: user.phone,
          gender: user.gender,
          dob: user.dob,
          address: user.address,
          profilePic: user.profilePic,
        },
        accessToken,
      }));

      toast.success("Profile updated successfully");
      navigate("/profile");
    } catch (err) {
      console.log(err);
      toast.error(err.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] flex items-center justify-center px-4 py-12 transition-colors duration-200">
      <div className="bg-[var(--bg-card)] border border-[var(--border)] shadow-lg rounded-2xl w-full max-w-3xl p-8 space-y-6">

        <h2 className="text-3xl font-extrabold text-[var(--primary)] text-center tracking-tight">
          {profileIncomplete ? "Complete Profile" : "Edit Profile"}
        </h2>

        {profileIncomplete && (
          <p className="text-center text-sm text-[var(--text-secondary)] max-w-xl mx-auto">
            Add your phone number, gender, and date of birth{isProvider ? "" : ", plus your home address"} so your Google account has the same profile details as a regular Serviso account.
          </p>
        )}

        {/* PROFILE IMAGE */}
        <div className="flex flex-col items-center gap-3">
          <img
            src={preview || "/user.png"}
            alt="preview"
            className="w-28 h-28 rounded-full object-cover border-4 border-[var(--primary-light)] shadow-sm"
            onError={(e) => {
              e.target.src = "https://img.icons8.com/color/96/user-male-circle--v1.png";
            }}
          />

          <label className="cursor-pointer text-xs font-bold uppercase tracking-wider text-[var(--primary)] hover:underline">
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
        <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-5 pt-4">

          {/* NAME */}
          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">Full Name</label>
            <input
              name="name"
              value={formData.name || ""}
              onChange={handleChange}
              className="w-full border border-[var(--border)] bg-[var(--input-bg)] text-[var(--text)] p-3 rounded-xl focus:outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/10 transition duration-200"
              required
            />
          </div>

          {/* EMAIL (disabled) */}
          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">Email Address</label>
            <input
              name="email"
              value={formData.email || ""}
              disabled
              className="w-full border border-[var(--border)] bg-[var(--bg-card-hover)] text-[var(--text-muted)] p-3 rounded-xl cursor-not-allowed"
            />
          </div>

          {/* PHONE */}
          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">Phone Number</label>
            <input
              name="phone"
              value={formData.phone || ""}
              onChange={handleChange}
              className="w-full border border-[var(--border)] bg-[var(--input-bg)] text-[var(--text)] p-3 rounded-xl focus:outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/10 transition duration-200"
              required
            />
          </div>

          {/* GENDER */}
          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">Gender</label>
            <select
              name="gender"
              value={formData.gender || ""}
              onChange={handleChange}
              className="w-full border border-[var(--border)] bg-[var(--input-bg)] text-[var(--text)] p-3 rounded-xl focus:outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/10 transition duration-200"
              required
            >
              <option value="">Select</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* DOB */}
          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">Date of Birth</label>
            <input
              type="date"
              name="dob"
              value={formData.dob?.slice(0, 10) || ""}
              onChange={handleChange}
              max={new Date().toISOString().split("T")[0]}
              className="w-full border border-[var(--border)] bg-[var(--input-bg)] text-[var(--text)] p-3 rounded-xl focus:outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/10 transition duration-200"
              required
            />
          </div>

          {/* ADDRESS */}
          {!isProvider && (
            <div className="md:col-span-2 space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">Address</label>
              <input
                name="address"
                value={formData.address || ""}
                onChange={handleChange}
                className="w-full border border-[var(--border)] bg-[var(--input-bg)] text-[var(--text)] p-3 rounded-xl focus:outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/10 transition duration-200"
                required
              />
            </div>
          )}

          {/* BUTTON */}
          <div className="md:col-span-2 mt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white py-3.5 rounded-xl font-bold tracking-wide transition duration-200 cursor-pointer shadow-md hover:shadow-lg active:scale-98"
            >
              {loading ? "Updating..." : "Save Changes"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default EditProfile;
