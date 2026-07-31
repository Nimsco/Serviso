const express = require("express");
const router = express.Router();

const { protect, authorizeRoles } = require("../middlewares/auth.middleware");
const { createService, updateProviderService, updateProviderServiceStatus, getAllServices, getServiceById, getProviderServices, getPublicCategories } = require("../controllers/service.controller");

router.get("/", getAllServices);

router.get("/categories", getPublicCategories);

router.post("/", protect, authorizeRoles("provider"), createService);

router.get("/provider/my", protect, getProviderServices);
router.patch("/provider/my", protect, authorizeRoles("provider"), updateProviderService);
router.patch("/provider/my/status", protect, authorizeRoles("provider"), updateProviderServiceStatus);

router.get("/:id", getServiceById);



module.exports = router;
