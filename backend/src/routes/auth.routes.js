const express = require("express");
const router = express.Router();

const upload = require("../middlewares/multer");
const {
    registerUser,
    loginUser,
    getProfile,
    logoutUser,
    verifyEmail,
    refreshAccessToken
} = require("../controllers/auth.controller");
const { protect } = require("../middlewares/auth.middleware");

// REGISTER
router.post("/register", upload.fields([
  { name: "profilePic", maxCount: 1 },
  { name: "citizenshipFront", maxCount: 1 },
  { name: "citizenshipBack", maxCount: 1 },
  { name: "extraDocument", maxCount: 1 },
]), registerUser);

// LOGIN
router.post("/login", loginUser);

// VERIFY EMAIL (OTP)
router.post("/verify-email", verifyEmail);

// REFRESH ACCESS TOKEN
router.post("/refresh", refreshAccessToken);

// LOGOUT
router.post("/logout", logoutUser);

// GET PROFILE (protected)
router.get("/profile", protect, getProfile);

module.exports = router;
