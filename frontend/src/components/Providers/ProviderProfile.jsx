import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const ProviderProfile = () => {
  const { id } = useParams();

  const [provider, setProvider] = useState(null);
  const [services, setServices] = useState([]);

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        const userRes = await axios.get(`/api/users/${id}`);
        setProvider(userRes.data);

        const serviceRes = await axios.get(
          `/api/services?provider=${id}`
        );
        setServices(serviceRes.data);

      } catch (err) {
        console.error("Error fetching provider:", err);
      }
    };

    fetchData();
  }, [id]);

  if (!provider) {
    return <p className="text-center mt-10">Loading...</p>;
  }

  return (
    <div className="p-6">

      <div className="text-center mb-6">
        <img
          src={provider.profilePic || "/user.png"}
          className="w-24 h-24 rounded-full mx-auto"
        />
        <h2 className="text-xl font-bold mt-3">
          {provider.name}
        </h2>
        <p className="text-gray-500">
          @{provider.username}
        </p>
      </div>

      <h2 className="text-lg font-semibold mb-3">
        Services
      </h2>

      <div className="grid md:grid-cols-3 gap-4">
        {services.map((s) => (
          <div key={s._id} className="border p-4 rounded">
            <h3>{s.title}</h3>
            <p>Rs. {s.price}</p>
          </div>
        ))}
      </div>

    </div>
  );
};

export default ProviderProfile;
