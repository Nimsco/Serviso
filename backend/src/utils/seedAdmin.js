const bcrypt = require("bcryptjs");
const User = require("../models/user.model");

async function seedAdmin() {
  const adminEmail = "admin@admin.com";
  const adminPassword = "admin123";

  const password = await bcrypt.hash(adminPassword, 10);
  const existingAdmin = await User.findOne({ email: adminEmail });

  if (existingAdmin) {
    existingAdmin.password = password;
    existingAdmin.role = "admin";
    existingAdmin.isBlocked = false;
    existingAdmin.emailVerified = true;
    existingAdmin.providerStatus = "none";
    await existingAdmin.save();
    return;
  }

  await User.create({
    name: "Admin",
    username: "admin",
    email: adminEmail,
    password,
    role: "admin",
    phone: "0000000000",
    address: "Serviso Admin",
    isBlocked: false,
    emailVerified: true,
    providerStatus: "none",
  });

  console.log("Default admin created: admin@admin.com");
}

module.exports = seedAdmin;
