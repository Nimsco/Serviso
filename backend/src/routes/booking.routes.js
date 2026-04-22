const express = require("express");
const router = express.Router();
const { allowCustomer } = require("../middlewares/role.middleware");


const {
  createBooking,
  getMyBookings,
  getProviderBookings,
  updateBookingStatus
} = require("../controllers/booking.controller");



const auth = require("../middlewares/auth.middleware");


// create booking

router.get("/my", auth.protect, getMyBookings);

router.get("/provider", auth.protect, getProviderBookings);

router.patch("/:id", auth.protect, updateBookingStatus);

router.post("/", auth.protect, allowCustomer, createBooking);

router.post("/", auth.protect, allowCustomer, createBooking);


module.exports = router;