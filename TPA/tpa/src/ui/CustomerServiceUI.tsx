import StaffNavbar from "@/components/StaffNavbar";
import { Outlet, useNavigate } from "react-router";

export default function CustomerServiceUI() {
  const navigate = useNavigate();
  
    const navItems = [
      { name: "View Restaurants", onClick: () => navigate("/customerservice/restaurants") },
      { name: "View Rides", onClick: () => navigate("/customerservice/rides") },
      { name: "Send Broadcast", onClick: () => navigate("/customerservice/broadcast") },
      { name: "Create Customer", onClick: () => navigate("/customerservice/create_customer") },
      { name: "Chat", onClick: () => navigate("/customerservice/chat") },
    ];
  
    return (
      <>
        <StaffNavbar navItems={navItems} />
        <div className="relative min-h-screen p-6 bg-gray-900">
          <div className="text-3xl font-bold flex justify-center text-white mb-4">
            Customer Service
          </div>
  
          <Outlet />
        </div>
      </>
    );
}
