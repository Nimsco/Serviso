import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

const Success = () => {
  const hasRun = useRef(false); 

  const query = new URLSearchParams(useLocation().search);

  const serviceId = query.get("serviceId");
  const date = query.get("date");
  const time = query.get("time");

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (hasRun.current) return;

    async function createBooking() {
      try {
        await axios.post(
          "/api/bookings",
          { serviceId, date, time },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } catch (err) {
        console.error(err);
      }
    }

    if (serviceId && date && time && token) {
      createBooking();
      hasRun.current = true;
    }
  }, [serviceId, date, time, token]);

  return (
    <div className="h-screen flex justify-center items-center">
      <h1 className="text-2xl font-bold text-green-600">
        Payment Successful 
      </h1>
    </div>
  );
};

export default Success;
