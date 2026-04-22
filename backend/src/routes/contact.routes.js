const express = require("express");
const router = express.Router();

const { sendContactEmail } = require("../controllers/contact.controllers");

router.post("/", sendContactEmail);

module.exports = router;
