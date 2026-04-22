import { useNavigate } from "react-router-dom";

const CTASection = () => {
  const navigate = useNavigate();

  return (
    <div className="px-6 md:px-12 py-16 bg-white flex justify-center">

      <div className="bg-blue-50 p-10 rounded-2xl shadow-md max-w-xl w-full text-center">

        <h3 className="text-2xl font-bold text-blue-600">
          Join Our Platform
        </h3>

        <p className="mt-3 text-gray-600">
          Book trusted professionals or offer your services and grow your business.
        </p>

        <ul className="mt-6 text-gray-600 text-sm space-y-2">
          <li>✔ Easy Booking</li>
          <li>✔ Verified Providers</li>
          <li>✔ Secure Payments</li>
        </ul>

        <button
          onClick={() => navigate("/register")}
          className="mt-8 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition"
        >
          Get Started
        </button>

      </div>

    </div>
  );
};

export default CTASection;
