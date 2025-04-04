import { invoke } from "@tauri-apps/api/core";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";

export default function CustomerLoginPage() {
  const navigate = useNavigate();
  const [customerID, setCustomerID] = useState("");
  const [deviceId, setDeviceId] = useState<string | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    invoke<string>("get_device_id")
      .then((id) => {
        if (id) {
          setDeviceId(id);
        }
      })
      .catch((err) => {
        console.error("Error fetching device ID:", err);
        toast("Failed to retrieve device ID.");
      });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomerID(e.target.value);
    setError("");
  };

  const handleNavigate = () => {
    if (deviceId) {
        if (deviceId.startsWith("RIDE")) {
          navigate("/customer_ride/rides");
        } else if (deviceId.startsWith("RES")) {
          navigate("/customer_restaurant/restaurants");
        } else if(deviceId.startsWith("STR")) {
          navigate("/customer_store/stores");
        } else if(deviceId.startsWith("CUSTOMER")) {
          navigate("/customer/restaurants");
        }
        else {
          toast("Unknown device ID.");
        }
    } else {
      toast("Device ID not found. Please try again.");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!customerID.trim()) {
      setError("Customer ID is required.");
      return;
    }

    invoke<boolean>("login_customer", { customerid: customerID })
      .then((success) => {
        if (success) {
          toast("Login Successful");
          handleNavigate();
        } else {
          toast("Invalid Customer ID");
        }
      })
      .catch((error) => {
        console.error("Login error:", error);
        toast("Login failed. Please try again.");
      });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <form
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm"
        onSubmit={handleSubmit}
      >
        <h2 className="text-4xl font-bold mb-6 text-gray-800 text-center">
          VorteKia
        </h2>
        <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">
          Login as Customer
        </h2>
        {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
        <div className="mb-6">
          <label
            htmlFor="customerID"
            className="block text-gray-700 text-sm font-semibold mb-2"
          >
            Customer ID
          </label>
          <input
            id="customerID"
            type="text"
            placeholder="Enter your Customer ID"
            value={customerID}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-md 
                      hover:bg-blue-500 active:bg-blue-400 transition duration-200 ease-in-out
                      cursor-pointer"
        >
          Login
        </button>
      </form>
    </div>
  );
}
