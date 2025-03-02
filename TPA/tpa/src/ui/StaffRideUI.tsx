import StaffNavbar from "@/components/StaffNavbar";
import { Outlet, useNavigate } from "react-router";

export default function StaffRideUI() {
  const navigate = useNavigate();

  const navItems = [
    { name: "View Rides", onClick: () => navigate("/ride/view") },
    { name: "Propose Rides", onClick: () => navigate("/ride/propose") },
    { name: "Chat", onClick: () => navigate("/ride/chat") },
  ];

  return (
    <>
      <StaffNavbar navItems={navItems} />
      <div className="relative min-h-screen p-6 bg-gray-900">
        <div className="text-3xl font-bold flex justify-center text-white mb-4">
          Ride
        </div>

        <Outlet />
      </div>
    </>
  );
}
