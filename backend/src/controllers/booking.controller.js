const Booking = require("../models/booking.model");
const Service = require("../models/service.model");

//  CREATE BOOKING (Customer)
async function createBooking(req, res) {
  try {
    const { serviceId, date, time } = req.body;
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

    const booking = await Booking.create({
      customer: req.user._id,
      provider: service.provider,
      service: serviceId,
      date,
      time,
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


//  CUSTOMER BOOKINGS
async function getMyBookings(req, res) {
    try {
        const bookings = await Booking.find({ customer: req.user._id })
            .populate("service", "title price")
            .populate("provider", "name username");

        res.json(bookings);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

// PROVIDER BOOKINGS
async function getProviderBookings(req, res) {
    try {
        const bookings = await Booking.find({ provider: req.user._id })
            .populate("service", "title price")
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

module.exports = {
    createBooking,
    getMyBookings,
    getProviderBookings,
    updateBookingStatus
};