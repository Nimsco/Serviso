const userModel = require("../models/user.model");
const imagekit = require("../config/imagekit");


// 🔹 GET ALL PROVIDERS
async function getProviders(req, res) {
  try {
    const providers = await userModel
      .find({ role: "provider" })
      .select("-password");

    res.status(200).json(providers);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}


// 🔹 GET LOGGED-IN USER
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


// 🔹 UPDATE PROFILE
async function updateProfile(req, res) {
  try {
    const userId = req.user.id;

    //  ONLY allow safe fields
    const allowedFields = [
      "name",
      "phone",
      "gender",
      "dob",
      "address"
      // email removed 
    ];

    let updateData = {};

    //  whitelist filtering
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    });

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

const User = require("../models/user.model");

async function getUserById(req, res) {
  try {
    const user = await User.findById(req.params.id)
      .select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.json(user);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

module.exports = {
  getUserById,
};


module.exports = {
  getProviders,
  getMe,
  updateProfile,
  getUserById
};