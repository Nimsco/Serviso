const mongoose = require("mongoose");


const providerDetailsSchema = new mongoose.Schema({
  categories: [String],
  experience: {
    type: Number,
    default: 0,
  },
  hourlyRate: {
    type: Number,
    default: 0,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  availability: [String],
}, { _id: false });

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    phone: {
      type: String,
      trim: true,
    },

    gender: {
      type: String,
      enum: ["male", "female", "other"],
    },

    dob: {
      type: Date,
    },

    address: {
      type: String,
      trim: true,
    },

    profilePic: {
      type: String,
      default: "",
    },

    role: {
      type: String,
      enum: ["customer", "provider", "admin"],
      default: "customer",
    },

    providerDetails: {
  type: providerDetailsSchema,
  default: undefined
},
  },
  { timestamps: true }
);



const userModel = mongoose.model("User", userSchema);

module.exports = userModel;