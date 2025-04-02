import { invoke } from "@tauri-apps/api/core";
import { useEffect, useState } from "react";


export function useDeviceId(){
    const [deviceId, setDeviceId] = useState<string | null>(null);

    useEffect(() => {
        const getId = async () => {
            await invoke<string>("get_device_id")
            .then((id) => {
                if (id) {
                    setDeviceId(id);
                }
            })
            .catch((error) => {
                console.error("Error fetching device ID:", error);
            });
        }

        getId();
    }, []);

    return deviceId;
}