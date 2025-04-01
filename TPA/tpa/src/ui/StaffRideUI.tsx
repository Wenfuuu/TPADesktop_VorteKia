import StaffNavbar from "@/components/StaffNavbar";
import { useStaff } from "@/hooks/use-staff";
import { Outlet, useNavigate } from "react-router";

export default function StaffRideUI() {
  const navigate = useNavigate();
  const staff = useStaff();

  const managerNavItems = [
    { name: "View Rides", onClick: () => navigate("/ride/view") },
    { name: "Propose Rides", onClick: () => navigate("/ride/propose") },
    { name: "Chat", onClick: () => navigate("/ride/chat") },
  ];

  const staffNavItems = [
    { name: "View Rides", onClick: () => navigate("/ride/staff_view") },
    { name: "Chat", onClick: () => navigate("/ride/staff_chat") },
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
