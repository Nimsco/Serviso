import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { logoutUser, getProfile } from "../api/auth";
import { toast } from "react-toastify";
import axios from "axios";


const Profile = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(true);

const fetchBookings = async () => {
  try {
    const token = localStorage.getItem("token");

    const res = await axios.get("/api/bookings/my", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setBookings(res.data);

  } catch (err) {
    console.log(err);
  } finally {
    setLoadingBookings(false);
  }
};

fetchBookings(); // 



const handleLogout = async () => {
  try {
    await logoutUser();

   
    localStorage.removeItem("user");

    toast.success("Logged out successfully");
    navigate("/login");

  } catch (err) {
    console.log(err);
  }
};

  // FETCH USER DATA
useEffect(() => {
  const fetchProfile = async () => {
    try {
      const res = await getProfile();
      setUserData(res.data);

      localStorage.setItem("user", JSON.stringify(res.data));

    } catch (err) {
      console.log(err);

      // only redirect if truly unauthorized
      if (err.response?.status === 401) {
        navigate("/login");
      }
    }
  };

  fetchProfile();
}, [navigate]);

  // LOADING STATE
  if (!userData) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50">
      <p className="text-blue-500 text-lg">Loading profile...</p>
    </div>
  );
}

  return (
    <div className="min-h-screen bg-blue-50 px-6 md:px-12 py-16">

      <div className="text-center max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-blue-500">My Profile</h1>
      </div>

      <div className="grid md:grid-cols-3 gap-10 mt-12 max-w-6xl mx-auto">

        {/* LEFT */}
        <div className="bg-white p-6 rounded-xl shadow-md text-center">

          <img
            src={userData.profilePic || "/user.png"}
            alt="profile"
            className="w-32 h-32 rounded-full mx-auto border-4 border-blue-200 object-cover"
            onError={(e) => (e.target.src = "/user.png")}
          />

          <h2 className="text-2xl font-bold mt-4 text-blue-500">
            {userData.name}
          </h2>

          <p className="text-gray-600 mt-2">
            @{userData.username}
          </p>

          <div className="mt-4 inline-block bg-blue-100 text-blue-600 px-4 py-2 rounded-full font-medium">
            {userData.role}
          </div>

          <button
            onClick={handleLogout}
            className="w-full mt-6 bg-red-500 text-white py-2 rounded-md hover:bg-red-600 transition"
          >
            Logout
          </button>
          <button
  onClick={() => navigate("/edit-profile")}
  className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
>
  Edit Profile
</button>
        </div>

        

        {/* RIGHT */}
        <div className="md:col-span-2 bg-white p-6 rounded-xl shadow-md">

          <h2 className="text-2xl font-semibold text-blue-500 mb-6">
            Profile Information
          </h2>

          <div className="grid md:grid-cols-2 gap-6">

            <div className="border p-4 rounded-lg bg-blue-50">
              <p className="font-semibold">Email</p>
              <p className="text-gray-600">{userData.email}</p>
            </div>

            <div className="border p-4 rounded-lg bg-blue-50">
              <p className="font-semibold">Phone</p>
              <p className="text-gray-600">{userData.phone}</p>
            </div>

            <div className="border p-4 rounded-lg bg-blue-50">
              <p className="font-semibold">Gender</p>
              <p className="text-gray-600">{userData.gender}</p>
            </div>

            <div className="border p-4 rounded-lg bg-blue-50">
              <p className="font-semibold">Date of Birth</p>
              <p className="text-gray-600">
                {userData.dob?.slice(0, 10)}
              </p>
            </div>

            <div className="border p-4 rounded-lg bg-blue-50 md:col-span-2">
              <p className="font-semibold">Address</p>
              <p className="text-gray-600">{userData.address}</p>
            </div>

          </div>

        </div>
        {/* BOOKINGS SECTION */}
<div className="max-w-6xl mx-auto mt-10">
  <h2 className="text-2xl font-semibold text-blue-500 mb-6">
    My Bookings
  </h2>

  {loadingBookings ? (
    <p>Loading bookings...</p>
  ) : bookings.length === 0 ? (
    <p>No bookings yet</p>
  ) : (
    <div className="grid md:grid-cols-2 gap-6">
      {bookings.map((b) => (
        <div
          key={b._id}
          className="bg-white p-4 rounded-lg shadow border"
        >
          <h3 className="font-semibold text-lg">
            {b.service?.title}
          </h3>

          <p className="text-sm text-gray-500">
            Provider: {b.provider?.name}
          </p>

          <p className="text-sm">
            Date: {new Date(b.date).toDateString()}
          </p>

          <p className="text-sm">
            Time: {b.time}
          </p>

          <p className="text-sm mt-1">
            Status:{" "}
            <span className={`font-medium ${
              b.status === "pending" ? "text-yellow-500" :
              b.status === "accepted" ? "text-green-500" :
              b.status === "cancelled" ? "text-red-500" :
              "text-gray-500"
            }`}>
              {b.status}
            </span>
          </p>
        </div>
      ))}
    </div>
  )}
</div>


      </div>
    </div>
  );
};

export default Profile;