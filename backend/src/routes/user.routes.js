const express = require("express");
const router = express.Router();

const { protect } = require("../middlewares/auth.middleware");
const { getUserById } = require("../controllers/user.controller");
const upload = require("../middlewares/multer");

const {
  getProviders,
  getMe,
  updateProfile
} = require("../controllers/user.controller");

// existing routes
router.get("/providers", getProviders);
router.get("/me",protect, getMe);
router.put("/me",protect, updateProfile);

router.put("/update", protect, upload.single("profilePic"), updateProfile);

router.get("/:id", getUserById);

module.exports = router;