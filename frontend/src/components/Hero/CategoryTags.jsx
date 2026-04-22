import React from "react";

const categories = [
  "Plumbing",
  "Painting",
  "Car Wash",
  "Electrical",
  "Carpentry",
  "Cleaning",
];

const CategoryTags = () => {
  return (
    <div className="mt-10 flex flex-wrap gap-4">
      {categories.map((cat) => (
        <div
          key={cat}
          className="px-4 py-2 bg-gray-800 rounded-lg text-sm hover:bg-blue-500 transition cursor-pointer"
        >
          {cat}
        </div>
      ))}
    </div>
  );
};

export default CategoryTags;