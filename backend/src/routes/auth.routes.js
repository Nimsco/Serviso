const express = require("express");
const router = express.Router();

const upload = require("../middlewares/multer");
const { registerUser, loginUser, getProfile, logoutUser } = require("../controllers/auth.controller");
const { protect } = require("../middlewares/auth.middleware");

// REGISTER with image upload
router.post("/register", upload.single("profilePic"), registerUser);

// LOGIN
router.post("/login", loginUser);

router.post("/logout", logoutUser);

// GET PROFILE
router.get("/profile", protect, getProfile);

module.exports = router;