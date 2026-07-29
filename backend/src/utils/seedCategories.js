const Category = require("../models/category.model");

const defaultCategories = [
  { name: "AC Repair", image: "/acrepair.png" },
  { name: "Electrician", image: "/electrician.png" },
  { name: "Plumber", image: "/plumber.jpg" },
  { name: "Cleaning", image: "/cleaning.png" },
  { name: "Appliance Repair", image: "/appliancerepair.png" },
  { name: "Carpentry", image: "/carpentry.png" },
];

async function seedCategories() {
  for (const category of defaultCategories) {
    await Category.updateOne(
      { name: category.name },
      { $setOnInsert: category },
      { upsert: true }
    );
  }
}

module.exports = seedCategories;
