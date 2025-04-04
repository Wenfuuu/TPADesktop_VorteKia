import StaffNavbar from "@/components/StaffNavbar";
import { useStaff } from "@/hooks/use-staff";
import { Outlet, useNavigate } from "react-router";

export default function StaffStoreUI() {
    const navigate = useNavigate();
    const staff = useStaff();

    const navItems = [
      { name: "View Stores", onClick: () => navigate("/store/view") },
      { name: "Propose Stores", onClick: () => navigate("/store/propose") },
      { name: "Chat", onClick: () => navigate("/store/chat") },
    ];

    const staffNavItems = [
      { name: "View Stores", onClick: () => navigate("/store/staff_view") },
      { name: "Chat", onClick: () => navigate("/store/chat") },
    ];

    return (
      <>
        {staff?.role === "retail manager" ? <StaffNavbar navItems={navItems}/> : <StaffNavbar navItems={staffNavItems}/>}
        <div className="relative min-h-screen p-6 bg-gray-900">
          <div className="text-3xl font-bold flex justify-center text-white mb-4">
            Store
          </div>

          <Outlet />
        </div>
      </>
    );
}