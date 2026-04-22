const express = require("express");
const router = express.Router();

const { createCheckoutSession } = require("../controllers/payment.controller");
const auth = require("../middlewares/auth.middleware");

router.post("/checkout", auth.protect, createCheckoutSession);

module.exports = router;
