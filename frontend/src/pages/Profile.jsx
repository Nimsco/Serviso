import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logoutUser, getProfile } from "../api/auth";
import { clearCredentials } from "../store/authSlice";
import { toast } from "react-toastify";
import axios from "axios";
import { API_URL } from "../api/config";

const StarSelector = ({ rating, onRate, hoveredStar, onHover, onLeave }) => {
  return (
    <div className="flex gap-1" onMouseLeave={onLeave}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onRate(star)}
          onMouseEnter={() => onHover(star)}
          className="text-3xl transition-all duration-200 cursor-pointer hover:scale-125 active:scale-95"
          style={{
            color: star <= (hoveredStar || rating) ? "#f59e0b" : "var(--border)",
            filter: star <= (hoveredStar || rating) ? "drop-shadow(0 0 4px rgba(245,158,11,0.4))" : "none",
          }}
        >
          ★
        </button>
      ))}
    </div>
  );
};

const StarDisplay = ({ rating }) => {
  return (
    <span className="inline-flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className="text-sm"
          style={{ color: star <= rating ? "#f59e0b" : "var(--border)" }}
        >
          ★
        </span>
      ))}
    </span>
  );
};

const Profile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [userData, setUserData] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(true);

  // Review modal state
  const [reviewModal, setReviewModal] = useState(null); // booking object or null
  const [reviewRating, setReviewRating] = useState(0);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [reviewComment, setReviewComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  const isProfileComplete = Boolean(
    userData?.phone &&
    userData?.gender &&
    userData?.dob &&
    (userData?.role === "provider" || userData?.address)
  );

  const handleLogout = async () => {
    try {
      await logoutUser();
      dispatch(clearCredentials());
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

  useEffect(() => {
    if (userData?.role === "customer" || userData?.role === "provider") {
      let isActive = true;

      const loadBookings = async () => {
        try {
          const endpoint = userData.role === "provider"
            ? `${API_URL}/bookings/provider`
            : `${API_URL}/bookings/my`;

          const res = await axios.get(endpoint, {
            withCredentials: true,
          });

          if (isActive) {
            setBookings(res.data);
          }
        } catch (err) {
          console.log(err);
        } finally {
          if (isActive) {
            setLoadingBookings(false);
          }
        }
      };

      loadBookings();

      return () => {
        isActive = false;
      };
    }
  }, [userData]);

  const openReviewModal = (booking) => {
    setReviewModal(booking);
    setReviewRating(0);
    setHoveredStar(0);
    setReviewComment("");
  };

  const closeReviewModal = () => {
    setReviewModal(null);
    setReviewRating(0);
    setHoveredStar(0);
    setReviewComment("");
  };

  const handleSubmitReview = async () => {
    if (reviewRating < 1) {
      toast.error("Please select a rating");
      return;
    }

    try {
      setSubmittingReview(true);

      await axios.post(
        `${API_URL}/bookings/${reviewModal._id}/review`,
        { rating: reviewRating, reviewComment },
        { withCredentials: true }
      );

      // update local state
      setBookings((prev) =>
        prev.map((b) =>
          b._id === reviewModal._id
            ? { ...b, isReviewed: true, rating: reviewRating, reviewComment }
            : b
        )
      );

      toast.success("Review submitted successfully!");
      closeReviewModal();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit review");
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;

    try {
      await axios.patch(`${API_URL}/bookings/${bookingId}/cancel`, {}, {
        withCredentials: true
      });

      setBookings((prev) =>
        prev.map((b) => (b._id === bookingId ? { ...b, status: "cancelled" } : b))
      );

      toast.success("Booking cancelled successfully");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to cancel booking");
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "accepted":
        return {
          border: "var(--success)",
          badge: "bg-[var(--success-bg)] text-[var(--success)] border-[var(--success)]/20",
        };
      case "completed":
        return {
          border: "#8b5cf6",
          badge: "bg-purple-500/10 text-purple-500 border-purple-500/20",
        };
      case "cancelled":
        return {
          border: "var(--danger)",
          badge: "bg-[var(--danger-bg)] text-[var(--danger)] border-[var(--danger)]/20",
        };
      default:
        return {
          border: "var(--warning)",
          badge: "bg-[var(--warning-bg)] text-[var(--warning)] border-[var(--warning)]/20",
        };
    }
  };

  // LOADING STATE
  if (!userData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg)]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[var(--primary)]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] px-6 md:px-12 py-16 transition-colors duration-200">

      <div className="text-center max-w-3xl mx-auto space-y-2">
        <h1 className="text-4xl font-extrabold text-[var(--primary)] tracking-tight">My Profile</h1>
        <div className="w-12 h-1 bg-[var(--primary)] mx-auto rounded-full"></div>
      </div>

      <div className="grid md:grid-cols-3 gap-8 mt-12 max-w-6xl mx-auto items-start">

        {/* LEFT COLUMN: AVATAR CARD */}
        <div className="bg-[var(--bg-card)] border border-[var(--border)] p-6 rounded-2xl shadow-xs text-center flex flex-col items-center">
          <img
            src={userData.profilePic || "/user.png"}
            alt="profile"
            className="w-32 h-32 rounded-full border-4 border-[var(--primary-light)] object-cover shadow-sm"
            onError={(e) => {
              e.target.src = "https://img.icons8.com/color/96/user-male-circle--v1.png";
            }}
          />

          <h2 className="text-2xl font-bold mt-4 text-[var(--text)] leading-tight">
            {userData.name}
          </h2>

          <p className="text-[var(--text-muted)] text-sm mt-1">
            @{userData.username}
          </p>

          <span className="mt-4 text-xs font-bold uppercase tracking-wider bg-[var(--primary-light)] text-[var(--primary)] px-4 py-1.5 rounded-full border border-[var(--primary-border)]/50">
            {userData.role}
          </span>

          <div className="w-full space-y-2.5 mt-8 pt-6 border-t border-[var(--border)]">
            <button
              onClick={() => navigate("/edit-profile")}
              className="w-full bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white py-2.5 rounded-xl font-bold text-sm tracking-wide transition duration-200 cursor-pointer shadow-xs active:scale-98"
            >
              Edit Profile
            </button>

            {userData.role === "provider" && (
              <button
                onClick={() => navigate("/provider-dashboard")}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-2.5 rounded-xl font-bold text-sm tracking-wide transition duration-200 cursor-pointer shadow-xs active:scale-98"
              >
                Provider Dashboard
              </button>
            )}

            <button
              onClick={handleLogout}
              className="w-full bg-red-500/10 hover:bg-red-500 hover:text-white text-red-500 border border-red-500/20 py-2.5 rounded-xl font-bold text-sm tracking-wide transition duration-200 cursor-pointer active:scale-98"
            >
              Log Out
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN: INFORMATION LIST */}
        <div className="md:col-span-2 bg-[var(--bg-card)] border border-[var(--border)] p-8 rounded-2xl shadow-xs space-y-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <h2 className="text-2xl font-bold text-[var(--primary)] tracking-tight">
              Profile Information
            </h2>

            {!isProfileComplete && (
              <button
                onClick={() => navigate("/edit-profile")}
                className="bg-[var(--warning-bg)] text-[var(--warning)] border border-[var(--warning)]/20 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer hover:bg-[var(--warning)] hover:text-white transition duration-200"
              >
                Complete Profile
              </button>
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            <div className="border border-[var(--border)] p-4 rounded-xl bg-[var(--bg)]/50">
              <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">Email Address</span>
              <p className="text-[var(--text)] font-semibold mt-1 break-all">{userData.email}</p>
            </div>

            <div className="border border-[var(--border)] p-4 rounded-xl bg-[var(--bg)]/50">
              <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">Phone Number</span>
              <p className="text-[var(--text)] font-semibold mt-1">{userData.phone || "Not added yet"}</p>
            </div>

            <div className="border border-[var(--border)] p-4 rounded-xl bg-[var(--bg)]/50">
              <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">Gender</span>
              <p className="text-[var(--text)] font-semibold mt-1 capitalize">{userData.gender || "Not added yet"}</p>
            </div>

            <div className="border border-[var(--border)] p-4 rounded-xl bg-[var(--bg)]/50">
              <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">Date of Birth</span>
              <p className="text-[var(--text)] font-semibold mt-1">
                {userData.dob ? new Date(userData.dob).toLocaleDateString() : "—"}
              </p>
            </div>

            {userData.role !== "provider" && (
              <div className="border border-[var(--border)] p-4 rounded-xl bg-[var(--bg)]/50 md:col-span-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">Home Address</span>
                <p className="text-[var(--text)] font-semibold mt-1">{userData.address || "Not added yet"}</p>
              </div>
            )}
          </div>
        </div>

        {/* CUSTOMER BOOKINGS LIST */}
        {userData.role === "customer" && (
          <div className="md:col-span-3 mt-8">
            <h2 className="text-2xl font-bold text-[var(--text)] tracking-tight mb-6">
              My Bookings
            </h2>

            {loadingBookings ? (
              <div className="flex justify-center items-center py-10 bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--primary)]"></div>
              </div>
            ) : bookings.length === 0 ? (
              <div className="text-center py-12 bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl">
                <p className="text-[var(--text-secondary)]">No bookings found yet.</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {bookings.map((b) => {
                  const statusInfo = getStatusStyle(b.status);
                  return (
                    <div
                      key={b._id}
                      className="bg-[var(--bg-card)] border border-[var(--border)] p-5 rounded-2xl shadow-xs hover:shadow-md transition-all duration-200 border-l-4"
                      style={{ borderLeftColor: statusInfo.border }}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-bold text-lg text-[var(--text)] leading-snug">
                            {b.service?.title}
                          </h3>
                          <p className="text-sm text-[var(--text-secondary)] font-medium mt-1">
                            Provider: <span className="text-[var(--text)]">{b.provider?.name}</span>
                          </p>
                        </div>
                        <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider border ${statusInfo.badge}`}>
                          {b.status}
                        </span>
                      </div>

                      {b.status === "pending" && (
                        <p className="mt-4 text-xs text-[var(--text-secondary)] bg-[var(--warning-bg)] border border-[var(--warning)]/20 rounded-xl p-3 leading-relaxed">
                          Waiting for the provider to accept your request. You will see the status change here once it is accepted or cancelled.
                        </p>
                      )}

                      <div className="grid grid-cols-2 gap-4 mt-5 pt-4 border-t border-[var(--border)]/50 text-xs text-[var(--text-secondary)]">
                        <div>
                          <span className="text-[10px] text-[var(--text-muted)] block uppercase tracking-wider font-bold">Appointment Date</span>
                          <span className="font-semibold text-[var(--text)] text-sm">{new Date(b.date).toDateString()}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-[var(--text-muted)] block uppercase tracking-wider font-bold">Time Slot</span>
                          <span className="font-semibold text-[var(--text)] text-sm">{b.time}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-[var(--text-muted)] block uppercase tracking-wider font-bold">Payment Status</span>
                          <span className="font-semibold text-[var(--text)] text-sm capitalize">{b.paymentStatus}</span>
                        </div>
                      </div>

                      {/* REVIEW SECTION FOR COMPLETED BOOKINGS */}
                      {b.status === "completed" && (
                        <div className="mt-4 pt-4 border-t border-[var(--border)]/50">
                          {b.isReviewed ? (
                            <div className="bg-[var(--bg)]/50 border border-[var(--border)] rounded-xl p-4 space-y-2">
                              <div className="flex items-center gap-2">
                                <StarDisplay rating={b.rating} />
                                <span className="text-xs font-bold text-[var(--text-muted)]">Your Review</span>
                              </div>
                              {b.reviewComment && (
                                <p className="text-sm text-[var(--text-secondary)] leading-relaxed italic">
                                  "{b.reviewComment}"
                                </p>
                              )}
                            </div>
                          ) : (
                            <button
                              onClick={() => openReviewModal(b)}
                              className="w-full bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600 text-white text-sm py-2.5 rounded-xl font-bold transition-all duration-200 cursor-pointer shadow-md hover:shadow-lg active:scale-98 flex items-center justify-center gap-2"
                            >
                              <span>★</span> Rate & Review
                            </button>
                          )}
                        </div>
                      )}

                      {/* CANCEL SECTION FOR PENDING/ACCEPTED BOOKINGS */}
                      {(b.status === "pending" || b.status === "accepted") && (() => {
                        const appointmentDate = new Date(b.date);
                        const [hours, minutes] = b.time.split(":");
                        appointmentDate.setHours(parseInt(hours, 10), parseInt(minutes || 0, 10), 0, 0);

                        const now = new Date();
                        const timeDifference = appointmentDate.getTime() - now.getTime();
                        const hoursDifference = timeDifference / (1000 * 60 * 60);

                        if (hoursDifference >= 3) {
                          return (
                            <div className="mt-4 pt-4 border-t border-[var(--border)]/50">
                              <button
                                onClick={() => handleCancelBooking(b._id)}
                                className="w-full bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white text-sm py-2.5 rounded-xl font-bold transition-all duration-200 cursor-pointer shadow-sm border border-red-500/20 active:scale-98"
                              >
                                Cancel Booking
                              </button>
                            </div>
                          );
                        } else {
                          return (
                            <div className="mt-4 pt-4 border-t border-[var(--border)]/50 text-center">
                              <p className="text-[10px] text-[var(--text-muted)] font-medium bg-[var(--bg-card-hover)] p-2 rounded-lg">
                                ⏳ Cancellation deadline passed (less than 3 hours remaining).
                              </p>
                            </div>
                          );
                        }
                      })()}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* PROVIDER BOOKINGS LIST */}
        {userData.role === "provider" && (
          <div className="md:col-span-3 mt-8">
            <h2 className="text-2xl font-bold text-[var(--text)] tracking-tight mb-6">
              Provider Bookings
            </h2>

            {loadingBookings ? (
              <div className="flex justify-center items-center py-10 bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--primary)]"></div>
              </div>
            ) : bookings.length === 0 ? (
              <div className="text-center py-12 bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl">
                <p className="text-[var(--text-secondary)]">No bookings assigned to you yet.</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {bookings.map((b) => {
                  const statusInfo = getStatusStyle(b.status);
                  return (
                    <div
                      key={b._id}
                      className="bg-[var(--bg-card)] border border-[var(--border)] p-5 rounded-2xl shadow-xs hover:shadow-md transition-all duration-200 border-l-4"
                      style={{ borderLeftColor: statusInfo.border }}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-bold text-lg text-[var(--text)] leading-snug">
                            {b.service?.title}
                          </h3>
                          <p className="text-sm text-[var(--text-secondary)] font-medium mt-1">
                            Customer: <span className="text-[var(--text)]">{b.customer?.name || b.customer?.username}</span>
                          </p>
                        </div>
                        <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider border ${statusInfo.badge}`}>
                          {b.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mt-5 pt-4 border-t border-[var(--border)]/50 text-xs text-[var(--text-secondary)]">
                        <div>
                          <span className="text-[10px] text-[var(--text-muted)] block uppercase tracking-wider font-bold">Appointment Date</span>
                          <span className="font-semibold text-[var(--text)] text-sm">{new Date(b.date).toDateString()}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-[var(--text-muted)] block uppercase tracking-wider font-bold">Time Slot</span>
                          <span className="font-semibold text-[var(--text)] text-sm">{b.time}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-[var(--text-muted)] block uppercase tracking-wider font-bold">Payment Status</span>
                          <span className="font-semibold text-[var(--text)] text-sm capitalize">{b.paymentStatus}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

      </div>

      {/* REVIEW MODAL OVERLAY */}
      {reviewModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: "rgba(0,0,0,0.6)", backdropFilter: "blur(6px)" }}
        >
          <div
            className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl shadow-2xl w-full max-w-md p-8 space-y-6 relative"
            style={{ animation: "fadeInScale 0.25s ease-out" }}
          >
            {/* Close Button */}
            <button
              onClick={closeReviewModal}
              className="absolute top-4 right-4 text-[var(--text-muted)] hover:text-[var(--text)] text-xl cursor-pointer transition-colors"
            >
              ✕
            </button>

            {/* Header */}
            <div className="text-center space-y-2">
              <div className="w-14 h-14 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
                <span className="text-white text-2xl">★</span>
              </div>
              <h3 className="text-xl font-extrabold text-[var(--text)] tracking-tight">Rate Your Experience</h3>
              <p className="text-sm text-[var(--text-secondary)]">
                How was <span className="font-semibold text-[var(--text)]">{reviewModal.service?.title}</span>?
              </p>
            </div>

            {/* Star Rating */}
            <div className="flex justify-center py-2">
              <StarSelector
                rating={reviewRating}
                onRate={setReviewRating}
                hoveredStar={hoveredStar}
                onHover={setHoveredStar}
                onLeave={() => setHoveredStar(0)}
              />
            </div>

            {reviewRating > 0 && (
              <p className="text-center text-sm font-bold text-yellow-500">
                {reviewRating === 1 && "Poor"}
                {reviewRating === 2 && "Fair"}
                {reviewRating === 3 && "Good"}
                {reviewRating === 4 && "Very Good"}
                {reviewRating === 5 && "Excellent!"}
              </p>
            )}

            {/* Comment */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
                Write a review (optional)
              </label>
              <textarea
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                placeholder="Share your experience with this service..."
                rows="3"
                className="w-full border border-[var(--border)] bg-[var(--input-bg)] text-[var(--text)] p-3 rounded-xl focus:outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/10 text-sm transition resize-none"
              />
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={closeReviewModal}
                className="flex-1 border border-[var(--border)] text-[var(--text-secondary)] py-3 rounded-xl font-bold text-sm transition duration-200 cursor-pointer hover:bg-[var(--bg-card-hover)]"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitReview}
                disabled={submittingReview || reviewRating < 1}
                className="flex-1 bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600 text-white py-3 rounded-xl font-bold text-sm transition-all duration-200 cursor-pointer shadow-md hover:shadow-lg active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submittingReview ? "Submitting..." : "Submit Review"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal animation keyframes */}
      <style>{`
        @keyframes fadeInScale {
          from { opacity: 0; transform: scale(0.92); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>

    </div>
  );
};

export default Profile;
