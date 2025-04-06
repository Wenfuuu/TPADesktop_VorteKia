import { invoke } from "@tauri-apps/api/core";
import { useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";

export default function StaffLoginPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    staffName: "",
    password: "",
  });
  const [errors, setErrors] = useState("");

  const getStaff = async () => {
    try {
      const result = await invoke<Staff>("get_current_staff");
      if (result) {
        handleNavigate(result);
      }
    } catch (error) {
      console.error("Error fetching staff:", error);
      toast("Error fetching staff details");
    }
  };

  const handleNavigate = (staffData: Staff) => {
    console.log("Staff role:", staffData.role);
    if (staffData.role === "f&b supervisor") {
      navigate("/restaurant/view");
    } else if (staffData.role === "chef" || staffData.role === "waiter") {
      navigate("/restaurant/staff_view");
    } else if (staffData.role === "retail manager") {
      navigate("/store/view");
    } else if (staffData.role === "sales associate") {
      navigate("/store/staff_view");
    } else if (staffData.role === "lost and found staff") {
      navigate("/lostandfound/report");
    } else if (staffData.role === "ride manager") {
      navigate("/ride/view");
    } else if (staffData.role === "ride staff") {
      navigate("/ride/staff_view");
    } else if (staffData.role === "maintenance manager") {
      navigate("/maintenance/reports");
    } else if (staffData.role === "maintenance staff") {
      navigate("/maintenance/staff_reports");
    } else if (staffData.role === "coo") {
      navigate("/coo/ride_view");
    } else if (staffData.role === "cfo") {
      navigate("/cfo/ride_view");
    } else if (staffData.role === "ceo") {
      navigate("/ceo/ride_view");
    } else if (staffData.role === "customer service") {
      navigate("/customerservice/restaurants");
    } else {
      toast("Unknown staff role.");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });

    setErrors("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.staffName.trim() || !formData.password) {
      setErrors("There are empty form fields.");
      return;
    }

    console.log("Login with:", formData);
    // Invoke backend here
    invoke<boolean>("login_staff", {
      staffname: formData.staffName,
      pass: formData.password,
    })
      .then((success) => {
        if (success) {
          toast("Login Success");
          getStaff();
        } else {
          toast("Invalid StaffID or Password");
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
          Login as Staff
        </h2>
        {errors && <div className="text-red-500 text-sm mt-2">{errors}</div>}
        <div className="mb-4">
          <label
            htmlFor="staffName"
            className="block text-gray-700 text-sm font-semibold mb-2"
          >
            Username
          </label>
          <input
            id="staffName"
            type="text"
            placeholder="Enter your username"
            value={formData.staffName}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-6">
          <label
            htmlFor="password"
            className="block text-gray-700 text-sm font-semibold mb-2"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            placeholder="Enter your password"
            value={formData.password}
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