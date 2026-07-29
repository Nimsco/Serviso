const mongoose = require("mongoose");
const seedAdmin = require("../utils/seedAdmin");
const seedCategories = require("../utils/seedCategories");

async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        await seedAdmin();
        await seedCategories();

        console.log("Database connected successfully");
    } catch (err) {
        console.log("Database connection failed", err);
    }
}

module.exports = connectDB;
