const userModel = require("../models/user.model");
const imagekit = require("../config/imagekit");
const Service = require("../models/service.model");

function parseDob(dob) {
  if (!dob) return null;

  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dob);
  if (!match) return null;

  const [, year, month, day] = match.map(Number);
  const parsedDob = new Date(year, month - 1, day);

  if (
    parsedDob.getFullYear() !== year ||
    parsedDob.getMonth() !== month - 1 ||
    parsedDob.getDate() !== day
  ) {
    return null;
  }

  return parsedDob;
}

function isFutureDate(date) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const value = new Date(date);
  value.setHours(0, 0, 0, 0);

  return value > today;
}

//  GET ALL PROVIDERS
async function getProviders(req, res) {
  try {
    const { search = "" } = req.query;
    
    let filter = { role: "provider", providerStatus: "approved", isBlocked: false };
    
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { username: { $regex: search, $options: "i" } },
      ];
    }

    const providers = await userModel
      .find(filter)
      .select("name username profilePic address providerDetails providerStatus");

    const providerIds = providers.map((provider) => provider._id);
    const services = await Service.find({
      provider: { $in: providerIds },
      isActive: true
    });

    const serviceMap = services.reduce((map, service) => {
      map[service.provider.toString()] = service;
      return map;
    }, {});

    const safeProviders = providers.map((provider) => {
      const item = provider.toObject();

      if (item.providerDetails?.documents) {
        delete item.providerDetails.documents;
      }

      return {
        ...item,
        service: serviceMap[provider._id.toString()] || null,
      };
    });

    res.status(200).json(safeProviders);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}


// GET LOGGED-IN USER
async function getMe(req, res) {
  try {
    const user = await userModel
      .findById(req.user.id)
      .select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}


// UPDATE PROFILE
async function updateProfile(req, res) {
  try {
    const userId = req.user.id;

    //  ONLY allow safe fields
    const allowedFields = [
      "name",
      "phone",
      "gender",
      "dob",
      // email removed 
    ];

    const currentUser = await userModel.findById(userId).select("role");

    if (!currentUser) {
      return res.status(404).json({ message: "User not found" });
    }

    if (currentUser.role !== "provider") {
      allowedFields.push("address");
    }

    let updateData = {};

    //  whitelist filtering
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    });

    if (req.body.dob !== undefined) {
      const parsedDob = parseDob(req.body.dob);

      if (!parsedDob || isFutureDate(parsedDob)) {
        return res.status(400).json({ message: "Date of birth cannot be in the future" });
      }

      updateData.dob = parsedDob;
    }

    //  IMAGE UPLOAD
    if (req.file) {
      const uploadedImage = await imagekit.upload({
        file: req.file.buffer.toString("base64"),
        fileName: Date.now() + "-" + req.file.originalname
      });

      updateData.profilePic = uploadedImage.url;
    }

    const updatedUser = await userModel.findByIdAndUpdate(
      userId,
      { $set: updateData },
      {
        new: true,
        runValidators: true
      }
    ).select("-password");

    res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function getUserById(req, res) {
  try {
    const user = await userModel.findById(req.params.id)
      .select("name username profilePic address role providerDetails providerStatus");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const safeUser = user.toObject();

    if (safeUser.providerDetails?.documents) {
      delete safeUser.providerDetails.documents;
    }

    res.json(safeUser);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

module.exports = {
  getProviders,
  getMe,
  updateProfile,
  getUserById
};
