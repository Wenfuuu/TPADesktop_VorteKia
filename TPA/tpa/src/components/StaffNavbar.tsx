import { invoke } from "@tauri-apps/api/core";
import { useEffect, useState } from "react";
import { useTime } from "./context/TimeContext";

type NavItem = {
  name: string;
  onClick: () => void;
}

type StaffNavbarProps = {
  navItems: NavItem[]
}

export default function StaffNavbar({navItems}: StaffNavbarProps) {
  const [staff, setStaff] = useState<Staff | null>(null);
  const { currentTime } = useTime();

  async function get_staff() {
    // setUser(await invoke("get_current_user"))
    const response = await invoke("get_current_staff");
    if (response !== null) {
      setStaff(response as Staff);
    }
  }

  useEffect(() => {
    get_staff();
  }, []);

  return (
    <div className="bg-gray-800 p-4">
      <div className="flex justify-between items-center">
        <div className="flex justify-around items-center space-x-8">
          {navItems.map((item, index) => (
            <div
              key={index}
              className="text-white font-bold text-xl cursor-pointer px-2 py-2 rounded-lg hover:bg-gray-600"
              onClick={item.onClick}
            >
              {item.name}
            </div>
          ))}
        </div>

        <div className="flex space-x-4 items-center">
          <h2 className="text-white font-bold text-xl">
            {currentTime.toLocaleTimeString("en-US", { hour12: false })}
          </h2>
          <h2 className="text-white font-bold text-xl">
            Welcome, {staff?.name}
          </h2>
          <button
            className="text-white bg-gray-600 px-4 py-2 
                    rounded-lg hover:bg-gray-500 transition duration-200 ease-in-out
                    cursor-pointer"
            onClick={() => {}}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
