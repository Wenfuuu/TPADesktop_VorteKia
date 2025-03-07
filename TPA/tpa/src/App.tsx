import { useEffect, useState } from "react";
import "./App.css";
import { invoke } from "@tauri-apps/api/core";
import StaffLoginPage from "./pages/StaffLoginPage";
import { useNavigate } from "react-router";

function App() {
  const [deviceId, setDeviceId] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    invoke<string>("get_device_id")
      .then((id) => {
        if (id) {
          setDeviceId(id);
        }
      })
      .catch((error) => {
        console.error("Error fetching device ID:", error);
      });
  }, []);

  useEffect(() => {
    if (deviceId?.startsWith("ID")) {
      navigate("/customer_ride/rides");
    }
  }, [deviceId, navigate]); // Depend on `deviceId` to trigger navigation when it changes

  return <div>{deviceId?.startsWith("ST") && <StaffLoginPage />}</div>;
}

export default App;
