import StaffNavbar from "@/components/StaffNavbar";
import { Outlet, useNavigate } from "react-router";

export default function LostAndFoundUI(){
  const navigate = useNavigate();

  const navItems = [
    { name: "Report Item", onClick: () => navigate("/lostandfound/report") },
    { name: "View Item", onClick: () => navigate("/lostandfound/view") },
    { name: "Chat", onClick: () => navigate("/lostandfound/chat") },
  ];

  return (
    <>
      <StaffNavbar navItems={navItems} />
      <div className="relative min-h-screen p-6 bg-gray-900">
        <div className="text-3xl font-bold flex justify-center text-white mb-4">
          Lost & Found
        </div>

        <Outlet />
      </div>
    </>
  );
}