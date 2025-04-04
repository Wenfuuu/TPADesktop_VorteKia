import { useEffect } from "react";
import "./App.css";
import StaffLoginPage from "./pages/StaffLoginPage";
import { useNavigate } from "react-router";
import { useDeviceId } from "./hooks/use-device-id";

function App() {
  const deviceId = useDeviceId();
  const navigate = useNavigate();

  useEffect(() => {
    if(!deviceId) return;
    if (deviceId.startsWith("RIDE")) {
      navigate("/customer_ride/rides");
    } else if (deviceId.startsWith("RES")) {
      navigate("/customer_restaurant/restaurants");
    } else if(deviceId.startsWith("STR")) {
      navigate("/customer_store/stores");
    } else if(deviceId.startsWith("CUSTOMER")) {
      navigate("/customer/restaurants");
    }
  }, [deviceId]);

  return (
    <div>
      {deviceId?.startsWith("STAFF") && <StaffLoginPage />}
    </div>
  )
}

export default App;
