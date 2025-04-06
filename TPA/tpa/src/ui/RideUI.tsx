import CustomerNavbar from "@/components/CustomerNavbar";
import { useCustomer } from "@/hooks/use-customer";
import { invoke } from "@tauri-apps/api/core";
import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router";
import { toast } from "sonner";

export default function RideUI() {
    const navigate = useNavigate();
    const customer = useCustomer();
    const [lastActivity, setLastActivity] = useState(Date.now());
    const inactivityTimeout = 60000;

    const notLoggedItems = [
      { name: "View Ride", onClick: () => navigate("/customer_ride/rides") }
    ];

    const loggedItems = [
      { name: "View Ride", onClick: () => navigate("/customer_ride/rides") },
      { name: "View History", onClick: () => navigate("/customer_ride/history") },
      { name: "Review", onClick: () => navigate("/customer_ride/review") },
    ];

    const handleUserActivity = () => {
      setLastActivity(Date.now());
    };

    const handleLogout = () => {
      invoke<boolean>("logout_customer")
        .then((success) => {
          if (success) {
            toast("Automically logged out!");
            navigate("/customer_ride/rides");
            setTimeout(() => {
              window.location.reload();
            }, 500);
          }
        })
        .catch((error) => {
          toast(error)
        });
    }

    useEffect(() => {
      // Only set up inactivity tracking if a user is logged in
      if (!customer) return;

      // Set up event listeners for user activity
      const activityEvents = [
        "mousedown",
        "mousemove",
        "keypress",
        "scroll",
        "touchstart",
      ];

      activityEvents.forEach((event) => {
        window.addEventListener(event, handleUserActivity);
      });

      // Check for inactivity every 10 seconds
      const interval = setInterval(() => {
        const currentTime = Date.now();
        if (currentTime - lastActivity > inactivityTimeout) {
          handleLogout();
          clearInterval(interval);
        }
      }, 10000); // Check every 10 seconds

      return () => {
        activityEvents.forEach((event) => {
          window.removeEventListener(event, handleUserActivity);
        });
        clearInterval(interval);
      };
    }, [customer, lastActivity, navigate]);

    return (
      <>
        {customer ? <CustomerNavbar navItems={loggedItems}/> : 
        <CustomerNavbar navItems={notLoggedItems}/>}
        <div className="relative min-h-screen p-6 bg-gray-900">
          <div className="text-3xl font-bold flex justify-center text-white mb-4">
            Rides
          </div>

          <Outlet />
        </div>
      </>
    );
}