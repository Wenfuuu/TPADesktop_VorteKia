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
    }
  }, [deviceId]); // Depend on `deviceId` to trigger navigation when it changes

  return <div>{deviceId?.startsWith("ST") && <StaffLoginPage />}</div>;
}

export default App;
