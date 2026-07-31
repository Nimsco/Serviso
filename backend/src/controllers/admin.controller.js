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
    const today = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(today.getDate() - 6);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const [
      totalUsers,
      totalCustomers,
      totalProviders,
      pendingProviders,
      blockedUsers,
      totalServices,
      activeServices,
      inactiveServices,
      totalBookings,
      completedBookings,
      pendingBookings,
      acceptedBookings,
      cancelledBookings,
      bookingsByStatus,
      usersByRole,
      recentBookings,
      bookingsByDay,
      revenueByDay,
      providerStatusCounts
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: "customer" }),
      User.countDocuments({ role: "provider", providerStatus: "approved" }),
      User.countDocuments({ role: "provider", providerStatus: "pending" }),
      User.countDocuments({ isBlocked: true }),
      Service.countDocuments(),
      Service.countDocuments({ isActive: true }),
      Service.countDocuments({ isActive: false }),
      Booking.countDocuments(),
      Booking.countDocuments({ status: "completed" }),
      Booking.countDocuments({ status: "pending" }),
      Booking.countDocuments({ status: "accepted" }),
      Booking.countDocuments({ status: "cancelled" }),
      Booking.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]),
      User.aggregate([{ $group: { _id: "$role", count: { $sum: 1 } } }]),
      Booking.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .populate("service", "title price")
        .populate("customer", "name")
        .populate("provider", "name"),
      Booking.aggregate([
        { $match: { createdAt: { $gte: sevenDaysAgo } } },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]),
      Booking.aggregate([
        { $match: { status: "completed", updatedAt: { $gte: sevenDaysAgo } } },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$updatedAt" } },
            total: { $sum: "$amount" },
          },
        },
        { $sort: { _id: 1 } },
      ]),
      User.aggregate([
        { $match: { role: "provider" } },
        { $group: { _id: "$providerStatus", count: { $sum: 1 } } },
      ]),
    ]);

    const completedValue = await Booking.aggregate([
      { $match: { status: "completed" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    res.json({
      totalUsers,
      totalCustomers,
      totalProviders,
      pendingProviders,
      blockedUsers,
      totalServices,
      activeServices,
      inactiveServices,
      totalBookings,
      completedBookings,
      pendingBookings,
      acceptedBookings,
      cancelledBookings,
      completedValue: completedValue[0]?.total || 0,
      completionRate: totalBookings ? Math.round((completedBookings / totalBookings) * 100) : 0,
      bookingsByStatus,
      usersByRole,
      bookingsByDay,
      revenueByDay,
      providerStatusCounts,
      recentBookings,
      notifications: [
        ...(pendingProviders
          ? [{ type: "warning", title: "Provider approvals waiting", message: `${pendingProviders} provider application${pendingProviders === 1 ? "" : "s"} need review.` }]
          : []),
        ...(pendingBookings
          ? [{ type: "info", title: "Pending booking requests", message: `${pendingBookings} booking request${pendingBookings === 1 ? "" : "s"} are still waiting for provider action.` }]
          : []),
        ...(inactiveServices
          ? [{ type: "danger", title: "Inactive services", message: `${inactiveServices} service${inactiveServices === 1 ? "" : "s"} are hidden from customers.` }]
          : []),
        ...(blockedUsers
          ? [{ type: "danger", title: "Blocked accounts", message: `${blockedUsers} account${blockedUsers === 1 ? "" : "s"} are currently blocked.` }]
          : []),
      ],
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

    const activeBookings = await Booking.countDocuments({
      $or: [{ customer: user._id }, { provider: user._id }],
      status: { $in: ["pending", "accepted"] },
    });

    if (activeBookings > 0) {
      return res.status(400).json({ message: "User has active bookings and cannot be deleted" });
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
    const trimmedName = name?.trim();

    if (!trimmedName) {
      return res.status(400).json({ message: "Category name is required" });
    }

    if (image) {
      try {
        new URL(image);
      } catch {
        return res.status(400).json({ message: "Category image must be a valid URL" });
      }
    }

    const uploadedImage = await uploadCategoryImage(req.file);
    const category = await Category.create({
      name: trimmedName,
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
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    const activeServices = await Service.countDocuments({ category: category.name });

    if (activeServices > 0) {
      return res.status(400).json({ message: "Category has services and cannot be deleted" });
    }

    await Category.findByIdAndDelete(req.params.id);

    res.json({ message: "Category deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function getAllBookings(req, res) {
  try {
    const bookings = await Booking.find()
      .populate("customer", "name email phone address")
      .populate("provider", "name email phone")
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
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    const activeBookings = await Booking.countDocuments({
      service: service._id,
      status: { $in: ["pending", "accepted"] },
    });

    if (activeBookings > 0) {
      return res.status(400).json({ message: "Service has active bookings and cannot be deleted" });
    }

    await Service.findByIdAndDelete(req.params.id);

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
