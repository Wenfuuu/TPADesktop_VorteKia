import StaffNavbar from "@/components/StaffNavbar";
import { Outlet, useNavigate } from "react-router";

export default function StaffRestaurantUI() {
  const navigate = useNavigate();

  const navItems = [
    { name: "View Restaurants", onClick: () => navigate("/restaurant/view") },
    { name: "Propose Restaurants", onClick: () => navigate("/restaurant/propose") },
    { name: "Chat", onClick: () => navigate("/restaurant/chat") },
  ];

  return (
    <>
      <StaffNavbar navItems={navItems} />
      <div className="relative min-h-screen p-6 bg-gray-900">
        <div className="text-3xl font-bold flex justify-center text-white mb-4">
          Restaurant
        </div>

        <Outlet />
      </div>
    </>
  );
}
