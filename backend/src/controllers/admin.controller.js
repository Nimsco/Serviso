const User = require("../models/user.model");
const Service = require("../models/service.model");
const Booking = require("../models/booking.model");
const Category = require("../models/category.model");
const sendEmail = require("../utils/sendEmail");
const imagekit = require("../config/imagekit");

async function uploadCategoryImage(file) {
  if (!file) return "";

  const uploadedImage = await imagekit.upload({
    file: file.buffer.toString("base64"),
    fileName: Date.now() + "-" + file.originalname,
  });

  return uploadedImage.url;
}

async function getDashboardStats(req, res) {
  try {
    const [
      totalUsers,
      totalCustomers,
      totalProviders,
      pendingProviders,
      blockedUsers,
      totalServices,
      totalBookings,
      completedBookings,
      bookingsByStatus,
      usersByRole,
      recentBookings
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: "customer" }),
      User.countDocuments({ role: "provider", providerStatus: "approved" }),
      User.countDocuments({ role: "provider", providerStatus: "pending" }),
      User.countDocuments({ isBlocked: true }),
      Service.countDocuments(),
      Booking.countDocuments(),
      Booking.countDocuments({ status: "completed" }),
      Booking.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]),
      User.aggregate([{ $group: { _id: "$role", count: { $sum: 1 } } }]),
      Booking.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .populate("service", "title price")
        .populate("customer", "name")
        .populate("provider", "name")
    ]);

    const completedValue = await Booking.aggregate([
      { $match: { status: "completed" } },
      {
        $lookup: {
          from: "services",
          localField: "service",
          foreignField: "_id",
          as: "serviceData",
        },
      },
      { $unwind: "$serviceData" },
      { $group: { _id: null, total: { $sum: "$serviceData.price" } } },
    ]);

    res.json({
      totalUsers,
      totalCustomers,
      totalProviders,
      pendingProviders,
      blockedUsers,
      totalServices,
      totalBookings,
      completedBookings,
      completedValue: completedValue[0]?.total || 0,
      bookingsByStatus,
      usersByRole,
      recentBookings,
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function getUsers(req, res) {
  try {
    const { search = "", role = "" } = req.query;
    
    let filter = {};

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { username: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }
    
    if (role && role !== "All") {
      filter.role = role;
    }

    const users = await User.find(filter)
      .select("-password -emailOtp")
      .sort({ createdAt: -1 });

    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function updateUserBlock(req, res) {
  try {
    const { isBlocked } = req.body;

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role === "admin") {
      return res.status(400).json({ message: "Admin account cannot be blocked" });
    }

    user.isBlocked = Boolean(isBlocked);
    await user.save();

    res.json({
      message: user.isBlocked ? "User blocked" : "User unblocked",
      user,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function deleteUser(req, res) {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role === "admin") {
      return res.status(400).json({ message: "Admin account cannot be deleted" });
    }

    await User.findByIdAndDelete(req.params.id);

    res.json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function getProviderApplications(req, res) {
  try {
    const providers = await User.find({
      role: "provider",
      providerStatus: { $in: ["none", "pending", "approved", "rejected"] },
    })
      .select("-password -emailOtp")
      .sort({ createdAt: -1 });

    res.json(providers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function updateProviderApplication(req, res) {
  try {
    const { status, reason = "" } = req.body;

    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid provider status" });
    }

    const provider = await User.findOne({
      _id: req.params.id,
      role: "provider",
    });

    if (!provider) {
      return res.status(404).json({ message: "Provider not found" });
    }

    provider.providerStatus = status;
    provider.providerDecisionReason = reason;
    provider.providerDetails = provider.providerDetails || {};
    provider.providerDetails.isVerified = status === "approved";
    await provider.save();

    await sendEmail({
      to: provider.email,
      subject: `Serviso provider application ${status}`,
      text:
        status === "approved"
          ? "Congratulations! Your Serviso provider application has been approved. You can now log in to your provider dashboard."
          : `Your Serviso provider application was rejected.${reason ? ` Reason: ${reason}` : ""}`,
    });

    res.json({
      message: `Provider ${status}`,
      provider,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function getCategories(req, res) {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function createCategory(req, res) {
  try {
    const { name, image } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Category name is required" });
    }

    const uploadedImage = await uploadCategoryImage(req.file);
    const category = await Category.create({
      name,
      image: uploadedImage || image || "",
    });

    res.status(201).json({
      message: "Category created",
      category,
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ message: "Category already exists" });
    }

    res.status(500).json({ message: err.message });
  }
}

async function updateCategory(req, res) {
  try {
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.json({
      message: "Category updated",
      category,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function deleteCategory(req, res) {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.json({ message: "Category deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function getAllBookings(req, res) {
  try {
    const bookings = await Booking.find()
      .populate("customer", "name email")
      .populate("provider", "name email")
      .populate("service", "title price")
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function adminCancelBooking(req, res) {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (booking.status === "cancelled" || booking.status === "completed") {
      return res.status(400).json({ message: "Booking cannot be cancelled from its current state" });
    }

    booking.status = "cancelled";
    await booking.save();

    res.json({ message: "Booking forcefully cancelled by Admin", booking });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function getAllServices(req, res) {
  try {
    const services = await Service.find()
      .populate("provider", "name email")
      .sort({ createdAt: -1 });
    
    res.json(services);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function adminDeleteService(req, res) {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);

    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    res.json({ message: "Service deleted by Admin" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

module.exports = {
  getDashboardStats,
  getUsers,
  updateUserBlock,
  deleteUser,
  getProviderApplications,
  updateProviderApplication,
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getAllBookings,
  adminCancelBooking,
  getAllServices,
  adminDeleteService,
};
