const Booking = require("../models/booking.model");
const Service = require("../models/service.model");
const Stripe = require("stripe");
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

//  CREATE BOOKING (Customer)
async function createBooking(req, res) {
  try {
    const { serviceId, date, time, checkoutSessionId } = req.body;
    if (req.user.role === "provider") {
      return res.status(403).json({
        message: "Providers cannot book services",
      });
    }

    if (!serviceId || !date || !time) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const service = await Service.findById(serviceId);

    if (!service) {
      return res.status(404).json({
        message: "Service not found",
      });
    }

    if (service.provider.toString() === req.user._id.toString()) {
      return res.status(400).json({
        message: "You cannot book your own service",
      });
    }

    // Check if the customer already booked this specific slot
    const existingCustomerBooking = await Booking.findOne({
      customer: req.user._id,
      service: serviceId,
      date,
      time,
      status: { $ne: "cancelled" }
    });

    if (existingCustomerBooking) {
      return res.status(400).json({
        message: "You have already booked this slot",
      });
    }

    // Check if the provider is already booked for this slot by anyone
    const doubleBooking = await Booking.findOne({
      provider: service.provider,
      date,
      time,
      status: { $ne: "cancelled" }
    });

    if (doubleBooking) {
      return res.status(400).json({
        message: "This time slot is already booked for this provider",
      });
    }

    // Check Stripe session if ID is provided
    let verifiedPaymentStatus = "pending";
    if (checkoutSessionId) {
      try {
        const session = await stripe.checkout.sessions.retrieve(checkoutSessionId);
        if (session.payment_status === "paid") {
          verifiedPaymentStatus = "paid";
        } else {
          return res.status(400).json({ message: "Payment not verified" });
        }
      } catch (stripeErr) {
        return res.status(400).json({ message: "Invalid payment session" });
      }
    }

    const booking = await Booking.create({
      customer: req.user._id,
      provider: service.provider,
      service: serviceId,
      date,
      time,
      paymentStatus: verifiedPaymentStatus,
      amount: service.price,
      checkoutSessionId: checkoutSessionId || "",
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
            .populate("customer", "name username");

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
