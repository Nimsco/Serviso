const express = require("express");
const router = express.Router();


const { getDashboardStats } = require("../controllers/admin.controller");

const auth = require("../middlewares/auth.middleware");



// admin only
router.get("/stats", auth.protect, auth.admin, getDashboardStats);

module.exports = router;
