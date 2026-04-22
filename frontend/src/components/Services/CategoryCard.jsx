import { useNavigate } from "react-router-dom";

const CategoryCard = ({ category }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/services/${category.name}`);
  };

  return (
    <div
      onClick={handleClick}
      className="bg-white border rounded-xl p-6 text-center cursor-pointer hover:shadow-md transition"
    >
      <img
        src={category.image}
        alt={category.name}
        className="w-16 h-16 mx-auto mb-3"
      />

      <p className="font-semibold text-gray-700">
        {category.name}
      </p>
    </div>
  );
};

export default CategoryCard;
