const express = require("express");
const router = express.Router();

const {
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
} = require("../controllers/admin.controller");

const auth = require("../middlewares/auth.middleware");
const upload = require("../middlewares/multer");

router.use(auth.protect, auth.admin);

router.get("/stats", getDashboardStats);
router.get("/users", getUsers);
router.patch("/users/:id/block", updateUserBlock);
router.delete("/users/:id", deleteUser);

router.get("/provider-applications", getProviderApplications);
router.patch("/provider-applications/:id", updateProviderApplication);

router.get("/categories", getCategories);
router.post("/categories", upload.single("imageFile"), createCategory);
router.patch("/categories/:id", updateCategory);
router.delete("/categories/:id", deleteCategory);

router.get("/bookings", getAllBookings);
router.patch("/bookings/:id/cancel", adminCancelBooking);

router.get("/services", getAllServices);
router.delete("/services/:id", adminDeleteService);

module.exports = router;
