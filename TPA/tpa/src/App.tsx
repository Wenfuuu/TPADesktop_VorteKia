import { useEffect, useState } from "react";
import "./App.css";
import { invoke } from "@tauri-apps/api/core";
import StaffLoginPage from "./pages/StaffLoginPage";

function App() {
  // async function greet() {
  //   // Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
  //   setGreetMsg(await invoke("greet", { name }));
  // }

  const [deviceId, setDeviceId] = useState<string | null>(null)
  const [uiType, setUIType] = useState<string>("")

  useEffect(() => {
    invoke<string>("get_device_id")
      .then((id) =>{
        if(id){
          setDeviceId(id)
        }
      })
  }, [])

  useEffect(() =>{
    if(deviceId){
      // if(deviceId === "ST-002") setUIType("Lost and Found UI")
      // else if(deviceId === "ST-001") setUIType("Restaurant UI")
      // else if(deviceId === "ST-003") setUIType("Store UI")
      if(deviceId.startsWith("ST")) setUIType("Staff UI")
    }
  }, [deviceId])

  return (
    <div>
      {/* {uiType === "Lost and Found UI" && <LostAndFoundUI/>} */}
      
      {/* {deviceId?.startsWith("ST") && <StaffLoginPage uiType={uiType} />} */}
      {deviceId?.startsWith("ST") && <StaffLoginPage />}

      {/* <StaffLoginPage uiType={uiType} /> */}
    </div>
  );
}

export default App;
