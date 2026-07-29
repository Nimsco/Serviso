const express = require("express");
const router = express.Router();
const { allowCustomer } = require("../middlewares/role.middleware");

const {
  createBooking,
  getMyBookings,
  getProviderBookings,
  updateBookingStatus,
  submitBookingReview,
  getServiceReviews,
  cancelBooking,
} = require("../controllers/booking.controller");

const auth = require("../middlewares/auth.middleware");

// customer bookings
router.get("/my", auth.protect, getMyBookings);

// provider bookings
router.get("/provider", auth.protect, getProviderBookings);

// public: get reviews for a service
router.get("/service/:serviceId/reviews", getServiceReviews);

// update booking status (provider)
router.patch("/:id", auth.protect, updateBookingStatus);

// submit review (customer)
router.post("/:id/review", auth.protect, submitBookingReview);

// cancel booking (customer)
router.patch("/:id/cancel", auth.protect, allowCustomer, cancelBooking);

// create booking (customer)
router.post("/", auth.protect, allowCustomer, createBooking);

module.exports = router;
