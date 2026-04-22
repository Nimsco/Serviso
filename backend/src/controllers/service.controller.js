const Service = require("../models/service.model");

// CREATE SERVICE (ONLY PROVIDER)
async function createService(req, res) {
    try {
        const { title, description, category, price, image } = req.body;

        const service = await Service.create({
            title,
            description,
            category,
            price,
            image,
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
    const filter = {};

    if (req.query.provider) {
      filter.provider = req.query.provider;
    }

    const services = await Service.find(filter)
      .populate("provider", "name username profilePic");

    res.json(services);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}



async function getServiceById(req, res) {
  try {
    const service = await Service.findById(req.params.id)
      .populate("provider", "name username profilePic"); // ✅ FIX

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


module.exports = {
    createService,
    getAllServices,
    getServiceById,
    getAllServices,
    getProviderServices
};