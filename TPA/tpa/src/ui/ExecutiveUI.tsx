import StaffNavbar from "@/components/StaffNavbar";
import { useStaff } from "@/hooks/use-staff";
import { Outlet, useNavigate } from "react-router";

export default function ExecutiveUI() {
    const navigate = useNavigate();
    const staff = useStaff();

    const cooNavItems = [
      { name: "Rides", onClick: () => navigate("/coo/ride_view") },
      { name: "Reports", onClick: () => navigate("/coo/reports") },
      { name: "Tasks", onClick: () => navigate("/coo/tasks") },
      { name: "Logs", onClick: () => navigate("/coo/logs") },
      { name: "Ride Proposals", onClick: () => navigate("/coo/ride_proposals") },
      { name: "Create Staff", onClick: () => navigate("/coo/create_staff") },
      { name: "Chat", onClick: () => navigate("/coo/chat") },
    ];

    const ceoNavItems = [
      { name: "Rides", onClick: () => navigate("/ceo/ride_view") },
      { name: "Reports", onClick: () => navigate("/ceo/reports") },
      { name: "Tasks", onClick: () => navigate("/ceo/tasks") },
      { name: "Logs", onClick: () => navigate("/ceo/logs") },
      { name: "Stores", onClick: () => navigate("/ceo/store_view") },
      { name: "Restaurant Proposals", onClick: () => navigate("/ceo/restaurant_proposals") },
      { name: "Store Proposals", onClick: () => navigate("/ceo/store_proposals") },
      { name: "Chat", onClick: () => navigate("/ceo/chat") },
    ];

    const cfoNavItems = [
      { name: "View Rides", onClick: () => navigate("/cfo/ride_view") },
      { name: "View Stores", onClick: () => navigate("/cfo/store_view") },
      { name: "View Restaurants", onClick: () => navigate("/cfo/restaurant_view") },
      { name: "View Restaurant Proposals", onClick: () => navigate("/cfo/restaurant_proposals") },
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