const Service = require("../models/service.model");
const Category = require("../models/category.model");

// CREATE SERVICE (ONLY PROVIDER)
async function createService(req, res) {
    try {
        const { description, price, availability } = req.body;
        const providerCategory = req.user.providerDetails?.categories?.[0];

        if (req.user.providerStatus !== "approved") {
            return res.status(403).json({ message: "Provider account is not approved" });
        }

        if (!providerCategory) {
            return res.status(400).json({ message: "No approved provider category found" });
        }

        const existingService = await Service.findOne({
            provider: req.user._id,
        });

        if (existingService) {
            return res.status(400).json({
                message: "Each provider account can create only one service"
            });
        }

        const service = await Service.create({
            title: `${req.user.name} - ${providerCategory}`,
            description,
            category: providerCategory,
            price,
            image: req.user.profilePic,
            availability,
            provider: req.user._id
        });

        res.status(201).json({
            message: "Service created",
            service
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

// GET ALL SERVICES (PUBLIC)
async function getAllServices(req, res) {
  try {
    const filter = { isActive: true };

    if (req.query.provider) {
      filter.provider = req.query.provider;
    }

    if (req.query.category) {
      filter.category = { $regex: `^${req.query.category}$`, $options: "i" };
    }

    const services = await Service.find(filter)
      .populate("provider", "name username profilePic providerStatus isBlocked address");

    const approvedServices = services.filter((service) =>
      service.provider &&
      service.provider.providerStatus === "approved" &&
      !service.provider.isBlocked
    );

    res.json(approvedServices);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}



async function getServiceById(req, res) {
  try {
    const service = await Service.findById(req.params.id)
      .populate("provider", "name username profilePic address providerStatus isBlocked");

    if (!service) {
      return res.status(404).json({
        message: "Service not found",
      });
    }

    res.json(service);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function getProviderServices(req, res) {
  try {
    const services = await Service.find({
      provider: req.user._id,
    });

    res.json(services);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function getPublicCategories(req, res) {
  try {
    const categories = await Category.find({ isActive: true }).sort({ name: 1 });
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}


module.exports = {
    createService,
    getAllServices,
    getServiceById,
    getProviderServices,
    getPublicCategories
};
