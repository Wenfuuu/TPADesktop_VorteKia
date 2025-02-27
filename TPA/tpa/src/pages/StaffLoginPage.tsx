import { invoke } from "@tauri-apps/api/core";
import { useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";

type Props = {
    uiType : string
}

export default function StaffLoginPage({uiType}: Props){
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
      staffId: "",
      password: "",
    });

    const [errors, setErrors] = useState("");

    const handleNavigate = () =>{
        if(uiType === "Lost and Found UI"){
            navigate("/lostandfound/report")
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData({
        ...formData,
        [e.target.id]: e.target.value,
      });

      setErrors("");
    };

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();

      if (!formData.staffId.trim() || !formData.password) {
        setErrors("There are empty form fields.");
        return;
      }

      console.log("Login with:", formData);
      // Invoke backend here
      invoke('login_staff', {
        staffid: formData.staffId,
        pass: formData.password
      }).then((success) =>{
        // console.log(result);
        if(success){
            toast("Login Success")
            handleNavigate()
        }else{
            toast("Invalid StaffID or Password")
        }
      })
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
              htmlFor="staffId"
              className="block text-gray-700 text-sm font-semibold mb-2"
            >
              StaffID
            </label>
            <input
              id="staffId"
              type="text"
              placeholder="Enter your StaffID"
              value={formData.staffId}
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