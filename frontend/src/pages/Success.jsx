import React, { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectIsAuthenticated } from "../store/authSlice";
import axios from "axios";
import { API_URL } from "../api/config";

const Success = () => {
  const hasRun = useRef(false); 
  const navigate = useNavigate();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const [bookingState, setBookingState] = React.useState("finalizing");
  const [message, setMessage] = React.useState("Your payment was successful. We are creating your booking now.");

  const query = new URLSearchParams(useLocation().search);

  const serviceId = query.get("serviceId");
  const date = query.get("date");
  const time = query.get("time");
  const checkoutSessionId = query.get("session_id");

  useEffect(() => {
    if (hasRun.current) return;

    async function createBooking() {
      try {
        await axios.post(
          `${API_URL}/bookings`,
          { serviceId, date, time, checkoutSessionId },
          { withCredentials: true }
        );
        setBookingState("success");
        setMessage("Your payment was successful and your appointment has been booked.");
      } catch (err) {
        console.error(err);
        if (err.response?.status === 409) {
          setBookingState("success");
          setMessage("Your booking was already confirmed for this payment.");
          return;
        }

        setBookingState("error");
        setMessage(err.response?.data?.message || "Payment succeeded, but booking confirmation failed. Please contact support.");
      }
    }

    if (serviceId && date && time && checkoutSessionId && isAuthenticated) {
      createBooking();
      hasRun.current = true;
    } else if (!isAuthenticated) {
      hasRun.current = true;
      Promise.resolve().then(() => {
        setBookingState("error");
        setMessage("Please log in again so we can confirm your booking.");
      });
    } else {
      hasRun.current = true;
      Promise.resolve().then(() => {
        setBookingState("error");
        setMessage("Missing booking details. Please contact support if payment was taken.");
      });
    }
  }, [serviceId, date, time, checkoutSessionId, isAuthenticated]);

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] flex flex-col justify-center items-center px-4 transition-colors duration-200">
      
      <div className="bg-[var(--bg-card)] border border-[var(--border)] p-8 md:p-10 rounded-2xl shadow-lg max-w-sm w-full text-center space-y-6">
        
        {/* CHECK ICON */}
        {bookingState === "finalizing" ? (
          <div className="animate-spin rounded-full h-14 w-14 border-b-2 border-[var(--primary)] mx-auto"></div>
        ) : (
          <div className={`h-16 w-16 rounded-full flex items-center justify-center mx-auto border ${
            bookingState === "success"
              ? "bg-green-500/10 text-green-600 border-green-500/25"
              : "bg-red-500/10 text-red-600 border-red-500/25"
          }`}>
            {bookingState === "success" ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
          </div>
        )}

        <div className="space-y-2">
          <h1 className="text-2xl font-extrabold text-[var(--text)] tracking-tight">
            {bookingState === "finalizing" && "Finalizing Booking"}
            {bookingState === "success" && "Booking Confirmed!"}
            {bookingState === "error" && "Booking Needs Attention"}
          </h1>
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
            {message}
          </p>
        </div>

        <button
          onClick={() => navigate("/profile")}
          className="w-full bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white py-3 rounded-xl font-bold text-sm tracking-wide transition duration-200 cursor-pointer shadow-md hover:shadow-lg active:scale-98"
        >
          View My Bookings
        </button>

      </div>

    </div>
  );
};

export default Success;
