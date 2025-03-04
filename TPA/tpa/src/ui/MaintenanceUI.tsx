import StaffNavbar from "@/components/StaffNavbar";
import { Outlet, useNavigate } from "react-router";

export default function MaintenanceUI() {
    const navigate = useNavigate();

    const navItems = [
      { name: "View Reports", onClick: () => navigate("/maintenance/reports") },
      { name: "View Tasks", onClick: () => navigate("/maintenance/tasks") },
      { name: "View Logs", onClick: () => navigate("/maintenance/logs") },
      { name: "Chat", onClick: () => navigate("/maintenance/chat") },
    ];

    return (
        <>
        <StaffNavbar navItems={navItems} />
        <div className="relative min-h-screen p-6 bg-gray-900">
            <div className="text-3xl font-bold flex justify-center text-white mb-4">
            Maintenances
            </div>

            <Outlet />
        </div>
        </>
    );
}
