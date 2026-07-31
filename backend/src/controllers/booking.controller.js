const Booking = require("../models/booking.model");
const Service = require("../models/service.model");
const Stripe = require("stripe");
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

function hasCompleteCustomerProfile(user) {
  return Boolean(user.phone && user.gender && user.dob && user.address);
}

function getAppointmentDate(date, time) {
  const dateMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date || "");
  const timeMatch = /^(\d{2}):(\d{2})$/.exec(time || "");

  if (!dateMatch || !timeMatch) {
    return null;
  }

  const [, year, month, day] = dateMatch.map(Number);
  const [, hours, minutes] = timeMatch.map(Number);

  if (hours > 23 || minutes > 59) {
    return null;
  }

  const appointmentDate = new Date(year, month - 1, day, hours, minutes, 0, 0);

  if (
    appointmentDate.getFullYear() !== year ||
    appointmentDate.getMonth() !== month - 1 ||
    appointmentDate.getDate() !== day
  ) {
    return null;
  }

  return appointmentDate;
}

function getMaxBookingDate() {
  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + 7);
  maxDate.setHours(23, 59, 59, 999);
  return maxDate;
}

function getStoredAppointmentDate(booking) {
  const appointmentDate = new Date(booking.date);

  if (Number.isNaN(appointmentDate.getTime()) || !/^\d{2}:\d{2}$/.test(booking.time || "")) {
    return null;
  }

  const [hours, minutes] = booking.time.split(":").map(Number);

  if (hours > 23 || minutes > 59) {
    return null;
  }

  appointmentDate.setHours(hours, minutes, 0, 0);
  return appointmentDate;
}

async function assertSlotIsAvailable({ customerId, providerId, serviceId, date, time }) {
  const existingCustomerBooking = await Booking.findOne({
    customer: customerId,
    service: serviceId,
    date,
    time,
    status: { $ne: "cancelled" },
  });

  if (existingCustomerBooking) {
    return "You have already booked this slot";
  }

  const doubleBooking = await Booking.findOne({
    provider: providerId,
    date,
    time,
    status: { $ne: "cancelled" },
  });

  if (doubleBooking) {
    return "This time slot is already booked for this provider";
  }

  return "";
}

//  CREATE BOOKING (Customer)
async function createBooking(req, res) {
  try {
    const { serviceId, date, time, checkoutSessionId } = req.body;

    if (req.user.role === "provider") {
      return res.status(403).json({
        message: "Providers cannot book services",
      });
    }

    if (!hasCompleteCustomerProfile(req.user)) {
      return res.status(400).json({
        message: "Please complete your profile before booking a service",
      });
    }

    if (!serviceId || !date || !time || !checkoutSessionId) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const bookingDate = getAppointmentDate(date, time);

    if (!bookingDate) {
      return res.status(400).json({ message: "Invalid booking date or time" });
    }

    if (bookingDate <= new Date()) {
      return res.status(400).json({ message: "Booking date and time must be in the future" });
    }

    if (bookingDate > getMaxBookingDate()) {
      return res.status(400).json({ message: "Bookings can only be made up to 7 days from today" });
    }

    const service = await Service.findById(serviceId)
      .populate("provider", "providerStatus isBlocked");

    if (!service) {
      return res.status(404).json({
        message: "Service not found",
      });
    }

    if (!service.isActive || service.provider?.providerStatus !== "approved" || service.provider?.isBlocked) {
      return res.status(400).json({
        message: "This service is not available for booking",
      });
    }

    if (service.provider._id.toString() === req.user._id.toString()) {
      return res.status(400).json({
        message: "You cannot book your own service",
      });
    }

    const usedSession = await Booking.findOne({ checkoutSessionId });

    if (usedSession) {
      return res.status(409).json({
        message: "This payment session has already been used for a booking",
      });
    }

    const slotError = await assertSlotIsAvailable({
      customerId: req.user._id,
      providerId: service.provider._id,
      serviceId,
      date: bookingDate,
      time,
    });

    if (slotError) {
      return res.status(400).json({
        message: slotError,
      });
    }

    let session;

    try {
      session = await stripe.checkout.sessions.retrieve(checkoutSessionId);
    } catch {
      return res.status(400).json({
        message: "Invalid payment session",
      });
    }

    const expectedAmount = Math.round(Number(service.price) * 100);
    const sessionMatchesBooking =
      session.payment_status === "paid" &&
      session.metadata?.customerId === req.user._id.toString() &&
      session.metadata?.serviceId === serviceId &&
      session.metadata?.date === date &&
      session.metadata?.time === time &&
      session.amount_total === expectedAmount;

    if (!sessionMatchesBooking) {
      return res.status(400).json({ message: "Payment does not match this booking" });
    }

    const booking = await Booking.create({
      customer: req.user._id,
      provider: service.provider._id,
      service: serviceId,
      date: bookingDate,
      time,
      paymentStatus: "paid",
      amount: service.price,
      checkoutSessionId,
    });

    res.status(201).json({
      message: "Booking created successfully",
      booking,
    });

  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
}

// CANCEL BOOKING (Customer)
async function cancelBooking(req, res) {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (booking.customer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    if (booking.status === "cancelled" || booking.status === "completed") {
      return res.status(400).json({ message: "Booking cannot be cancelled" });
    }

    // Parse date and time to create appointment Date object
    // date is stored as ISO string/Date, time is stored as "HH:mm"
    const appointmentDate = new Date(booking.date);
    const [hours, minutes] = booking.time.split(":");
    appointmentDate.setHours(parseInt(hours, 10), parseInt(minutes || 0, 10), 0, 0);

    const now = new Date();
    const timeDifference = appointmentDate.getTime() - now.getTime();
    const hoursDifference = timeDifference / (1000 * 60 * 60);

    if (hoursDifference < 3) {
      return res.status(400).json({ 
        message: "Bookings can only be cancelled at least 3 hours before the scheduled time" 
      });
    }

    booking.status = "cancelled";
    await booking.save();

    res.json({
      message: "Booking cancelled successfully",
      booking
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

//  CUSTOMER BOOKINGS
async function getMyBookings(req, res) {
    try {
        const bookings = await Booking.find({ customer: req.user._id })
            .sort({ createdAt: -1 })
            .populate("service", "title price category image")
            .populate("provider", "name username address");

        res.json(bookings);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

// PROVIDER BOOKINGS
async function getProviderBookings(req, res) {
    try {
        const bookings = await Booking.find({ provider: req.user._id })
            .sort({ createdAt: -1 })
            .populate("service", "title price category image")
            .populate("customer", "name username phone address");

        res.json(bookings);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

// UPDATE STATUS (Provider)
async function updateBookingStatus(req, res) {
    try {
        const { status } = req.body;

        const booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }

        // only provider can update
        if (booking.provider.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Unauthorized" });
        }

        // prevent updating if already completed or cancelled
        if (booking.status === "completed" || booking.status === "cancelled") {
            return res.status(400).json({ message: "Cannot update a completed or cancelled booking" });
        }

        // validate the new status
        if (!["accepted", "completed", "cancelled"].includes(status)) {
            return res.status(400).json({ message: "Invalid status update" });
        }

        const allowedTransitions = {
            pending: ["accepted", "cancelled"],
            accepted: ["completed", "cancelled"],
        };

        if (!allowedTransitions[booking.status]?.includes(status)) {
            return res.status(400).json({
                message: `Cannot change booking from ${booking.status} to ${status}`,
            });
        }

        if (status === "completed") {
            const appointmentDate = getStoredAppointmentDate(booking);

            if (!appointmentDate) {
                return res.status(400).json({ message: "Invalid booking schedule" });
            }

            if (appointmentDate > new Date()) {
                return res.status(400).json({
                    message: "Booking can only be marked completed after the scheduled time has passed",
                });
            }
        }

        booking.status = status;
        await booking.save();

        res.json({
            message: "Booking updated",
            booking
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

// SUBMIT REVIEW (Customer)
async function submitBookingReview(req, res) {
  try {
    const { rating, reviewComment } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Rating must be between 1 and 5" });
    }

    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // only the customer who made the booking can review
    if (booking.customer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    if (booking.status !== "completed") {
      return res.status(400).json({ message: "Only completed bookings can be reviewed" });
    }

    if (booking.isReviewed) {
      return res.status(400).json({ message: "This booking has already been reviewed" });
    }

    booking.rating = rating;
    booking.reviewComment = reviewComment || "";
    booking.isReviewed = true;
    await booking.save();

    // recalculate service average rating
    const allReviews = await Booking.find({
      service: booking.service,
      isReviewed: true,
    });

    const totalReviews = allReviews.length;
    const avgRating = totalReviews > 0
      ? parseFloat((allReviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews).toFixed(1))
      : 0;

    await Service.findByIdAndUpdate(booking.service, {
      rating: avgRating,
      totalReviews,
    });

    res.json({
      message: "Review submitted successfully",
      booking,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

// GET REVIEWS FOR A SERVICE (Public)
async function getServiceReviews(req, res) {
  try {
    const reviews = await Booking.find({
      service: req.params.serviceId,
      isReviewed: true,
    })
      .sort({ updatedAt: -1 })
      .populate("customer", "name username profilePic");

    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

module.exports = {
    createBooking,
    getMyBookings,
    getProviderBookings,
    updateBookingStatus,
    submitBookingReview,
    getServiceReviews,
    cancelBooking,
};
