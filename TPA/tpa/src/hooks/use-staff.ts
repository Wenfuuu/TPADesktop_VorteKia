import { invoke } from "@tauri-apps/api/core";
import { useState, useEffect } from "react";

export function useStaff() {
  const [staff, setStaff] = useState<Staff | null>(null);

  useEffect(() => {
    const getStaff = async () => {
      const response = await invoke("get_current_staff");
      if (response !== null) {
        setStaff(response as Staff);
      }
    };

    getStaff();
  }, []);

  return staff;
}