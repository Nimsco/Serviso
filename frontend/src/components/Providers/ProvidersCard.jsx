import { useNavigate } from "react-router-dom";

const ProviderCard = ({ provider }) => {
  const navigate = useNavigate();

  return (
    <div
      className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition duration-300 p-5 cursor-pointer group"
      onClick={() => navigate(`/provider/${provider._id}`)}
    >

      {/* Profile Image */}
      <div className="flex justify-center">
        <img
          src={provider.profilePic || "/user.png"}
          alt={provider.name}
          className="h-20 w-20 rounded-full object-cover border-4 border-blue-100 group-hover:scale-105 transition"
        />
      </div>

      {/* Info */}
      <div className="text-center mt-4">

        <h2 className="text-lg font-semibold text-gray-800">
          {provider.name}
        </h2>

        <p className="text-sm text-gray-400">
          @{provider.username}
        </p>

        {/* Divider */}
        <div className="w-10 h-1 bg-blue-400 mx-auto mt-2 rounded"></div>

        {/* Provider Details */}
        {provider.providerDetails && (
          <div className="mt-3 text-sm text-gray-600 space-y-1">
            <p>
              <span className="font-medium text-gray-700">
                Experience:
              </span>{" "}
              {provider.providerDetails.experience} yrs
            </p>

            <p>
              <span className="font-medium text-gray-700">
                Rate:
              </span>{" "}
              Rs. {provider.providerDetails.hourlyRate}/hr
            </p>
          </div>
        )}

        {/* Button */}
        <button
          onClick={(e) => {
            e.stopPropagation(); 
            navigate(`/provider/${provider._id}`);
          }}
          className="mt-4 w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg text-sm font-medium transition"
        >
          View Profile
        </button>

      </div>
    </div>
  );
};

export default ProviderCard;
