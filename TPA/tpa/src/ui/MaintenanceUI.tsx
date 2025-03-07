import StaffNavbar from "@/components/StaffNavbar";
import { invoke } from "@tauri-apps/api/core";
import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router";

export default function MaintenanceUI() {
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

    const managerNavItems = [
      { name: "View Reports", onClick: () => navigate("/maintenance/reports") },
      { name: "View Tasks", onClick: () => navigate("/maintenance/tasks") },
      { name: "View Logs", onClick: () => navigate("/maintenance/logs") },
      { name: "Chat", onClick: () => navigate("/maintenance/chat") },
    ];

    const staffNavItems = [
      { name: "View Reports", onClick: () => navigate("/maintenance/staff_reports") },
      { name: "View Tasks", onClick: () => navigate("/maintenance/staff_tasks") },
      { name: "Chat", onClick: () => navigate("/maintenance/staff_chat") },
    ];

    return (
        <>
        {staff?.role === "maintenance manager" ? <StaffNavbar navItems={managerNavItems} /> : <StaffNavbar navItems={staffNavItems} />}
        <div className="relative min-h-screen p-6 bg-gray-900">
            <div className="text-3xl font-bold flex justify-center text-white mb-4">
            Maintenances
            </div>

            <Outlet />
        </div>
        </>
    );
}
