const User = require("../models/user.model");
const Service = require("../models/service.model");
const Booking = require("../models/booking.model");

async function getDashboardStats(req, res) {
  try {
    const totalUsers = await User.countDocuments();

    const totalProviders = await User.countDocuments({
      role: "provider",
    });

    const totalServices = await Service.countDocuments();

    const totalBookings = await Booking.countDocuments();

    res.json({
      totalUsers,
      totalProviders,
      totalServices,
      totalBookings,
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

module.exports = { getDashboardStats };
