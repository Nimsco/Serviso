const Stripe = require("stripe");
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const Service = require("../models/service.model");
const Booking = require("../models/booking.model");

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

async function createCheckoutSession(req, res) {
  try {
    const { serviceId, date, time } = req.body;

    if (req.user.role !== "customer") {
      return res.status(403).json({ message: "Only customers can book services" });
    }

    if (!hasCompleteCustomerProfile(req.user)) {
      return res.status(400).json({
        message: "Please complete your profile before booking a service",
      });
    }

    if (!serviceId || !date || !time) {
      return res.status(400).json({ message: "Service, date, and time are required" });
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
      return res.status(404).json({ message: "Service not found" });
    }

    if (!service.isActive || service.provider?.providerStatus !== "approved" || service.provider?.isBlocked) {
      return res.status(400).json({ message: "This service is not available for booking" });
    }

    if (service.provider._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: "You cannot book your own service" });
    }

    const existingCustomerBooking = await Booking.findOne({
      customer: req.user._id,
      service: serviceId,
      date: bookingDate,
      time,
      status: { $ne: "cancelled" },
    });

    if (existingCustomerBooking) {
      return res.status(400).json({ message: "You have already booked this slot" });
    }

    const doubleBooking = await Booking.findOne({
      provider: service.provider._id,
      date: bookingDate,
      time,
      status: { $ne: "cancelled" },
    });

    if (doubleBooking) {
      return res.status(400).json({ message: "This time slot is already booked for this provider" });
    }

    const amount = Math.round(Number(service.price) * 100);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",

      line_items: [
        {
          price_data: {
            currency: "npr", // or "usd"
            product_data: {
              name: service.title,
            },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],

      success_url: `${process.env.CLIENT_URL}/success?serviceId=${encodeURIComponent(serviceId)}&date=${encodeURIComponent(date)}&time=${encodeURIComponent(time)}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/cancel`,
      metadata: {
        serviceId,
        date,
        time,
        customerId: req.user._id.toString(),
      },
    });

    res.json({ url: session.url });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

module.exports = { createCheckoutSession };
