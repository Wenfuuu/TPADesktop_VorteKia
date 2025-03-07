import RideNavbar from "@/components/Ride/RideNavbar";
import { invoke } from "@tauri-apps/api/core";
import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router";


export default function RideUI() {
    const navigate = useNavigate();
    const [_, setCustomer] = useState<Customer | null>(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        get_customer();
    }, [])

    const get_customer = async () => {
      const response = await invoke("get_current_customer");
      if (response !== null) {
        setCustomer(response as Customer);
        setIsLoggedIn(true);
      }
    };

    const notLoggedItems = [
      { name: "View Rides", onClick: () => navigate("/customer_ride/rides") }
    ];

    const loggedItems = [
        { name: "View Rides", onClick: () => navigate("/customer_ride/rides") },
        { name: "View History", onClick: () => navigate("/customer_ride/history") },
        { name: "Chat", onClick: () => navigate("/customer_ride/chat") },
    ]

    return (
      <>
        {isLoggedIn ? (<RideNavbar navItems={loggedItems}/>) : 
        (<RideNavbar navItems={notLoggedItems}/>)}
        <div className="relative min-h-screen p-6 bg-gray-900">
          <div className="text-3xl font-bold flex justify-center text-white mb-4">
            Rides
          </div>

          <Outlet />
        </div>
      </>
    );
}