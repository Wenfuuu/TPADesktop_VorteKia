import StaffNavbar from "@/components/StaffNavbar";
import { invoke } from "@tauri-apps/api/core";
import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router";

export default function ExecutiveUI() {
    const navigate = useNavigate();

    const [staff, setStaff] = useState<Staff | null>(null);

    useEffect(() => {
      get_staff();
    }, []);

    const get_staff = async () => {
      const response = await invoke("get_current_staff");
      if (response !== null) {
        setStaff(response as Staff);
        console.log(staff)
      }
    };

    const cooNavItems = [
      { name: "View Rides", onClick: () => navigate("/coo/ride_view") },
      { name: "View Reports", onClick: () => navigate("/coo/reports") },
      { name: "View Tasks", onClick: () => navigate("/coo/tasks") },
      { name: "View Ride Proposals", onClick: () => navigate("/coo/ride_proposals") },
      { name: "Create Staff", onClick: () => navigate("/coo/create_staff") },
      { name: "Chat", onClick: () => navigate("/coo/chat") },
    ];

    const ceoNavItems = [
      { name: "View Reports", onClick: () => navigate("/ceo/reports") },
      { name: "View Tasks", onClick: () => navigate("/ceo/tasks") },
      { name: "View Ride Proposals", onClick: () => navigate("/ceo/proposals") },
      { name: "Chat", onClick: () => navigate("/ceo/chat") },
    ];

    const cfoNavItems = [
      { name: "View Reports", onClick: () => navigate("/cfo/reports") },
      { name: "View Tasks", onClick: () => navigate("/cfo/tasks") },
      { name: "Chat", onClick: () => navigate("/cfo/chat") },
    ];

    return (
      <>
        {staff?.role === "coo" ? (
          <StaffNavbar navItems={cooNavItems} />
        ) : staff?.role === "ceo" ? (
          <StaffNavbar navItems={ceoNavItems} />
        ) : (
          <StaffNavbar navItems={cfoNavItems} />
        )}

        <div className="relative min-h-screen p-6 bg-gray-900">
          <div className="text-3xl font-bold flex justify-center text-white mb-4">
            Executives
          </div>

          <Outlet />
        </div>
      </>
    );
}