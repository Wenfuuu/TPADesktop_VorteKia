import StaffNavbar from "@/components/StaffNavbar";
import { invoke } from "@tauri-apps/api/core";
import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router";

export default function StaffRideUI() {
  const navigate = useNavigate();
  const [staff, setStaff] = useState<Staff | null>(null);

  useEffect(() => {
    get_staff();
  });

  const get_staff = async () => {
    const response = await invoke("get_current_staff");
    if (response !== null) {
      setStaff(response as Staff);
    }
  };

  const managerNavItems = [
    { name: "View Rides", onClick: () => navigate("/ride/view") },
    { name: "Propose Rides", onClick: () => navigate("/ride/propose") },
    { name: "Chat", onClick: () => navigate("/ride/chat") },
  ];

  const staffNavItems = [
    { name: "View Rides", onClick: () => navigate("/ride/staff_view") },
    { name: "Chat", onClick: () => navigate("/ride/chat") },
  ];

  return (
    <>
      {staff?.role === "ride manager" ? <StaffNavbar navItems={managerNavItems} /> : <StaffNavbar navItems={staffNavItems} />}
      <div className="relative min-h-screen p-6 bg-gray-900">
        <div className="text-3xl font-bold flex justify-center text-white mb-4">
          Ride
        </div>

        <Outlet />
      </div>
    </>
  );
}
