// pages/Cancel.jsx
import { useNavigate } from "react-router-dom";

const Cancel = () => {
  const navigate = useNavigate();

  return (
    <div className="h-screen flex flex-col justify-center items-center gap-4">
      
      <h1 className="text-2xl font-bold text-red-500">
        Payment Cancelled 
      </h1>

      <p className="text-gray-500">
        Your booking was not completed.
      </p>

      <button
        onClick={() => navigate("/services")}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Go Back to Services
      </button>

    </div>
  );
};

export default Cancel;
