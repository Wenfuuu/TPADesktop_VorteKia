import { useNavigate } from "react-router";
import { useTime } from "./context/TimeContext";
import { useCustomer } from "@/hooks/use-customer";
import { useEffect, useRef, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { Bell } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ScrollArea } from "./ui/scroll-area";

type NavItem = {
  name: string;
  onClick: () => void;
};

type Props = {
  navItems: NavItem[];
};

export default function CustomerNavbar({ navItems }: Props) {
  const navigate = useNavigate();
  const customer = useCustomer();
  const { currentTime } = useTime();
  const [showBroadcastDialog, setShowBroadcastDialog] = useState(false);
  const [broadcasts, setBroadcasts] = useState<Broadcast[]>([]);
  const prevBroadcastsRef = useRef<Broadcast[]>([]);

  // Function to fetch broadcasts
  const fetchBroadcasts = async () => {
    if (!customer) return;

    try {
      const data: Broadcast[] = await invoke("get_customer_broadcasts", {
        customerid: customer.customer_id
      });

      // Check for new broadcasts by comparing with previous state
      if (prevBroadcastsRef.current.length > 0) {
        const newBroadcasts = data.filter(
          (newBroadcast) =>
            !prevBroadcastsRef.current.some(
              (oldBroadcast) =>
                oldBroadcast.broadcast_id === newBroadcast.broadcast_id
            )
        );

        // Show toast notifications for new broadcasts
        newBroadcasts.forEach((broadcast) => {
          toast("New Broadcast", {
            description: `${broadcast.message}`,
            action: {
              label: "View",
              onClick: () => setShowBroadcastDialog(true),
            },
          });
        });
      }

      // Update state and reference
      setBroadcasts(data);
      prevBroadcastsRef.current = data;
    } catch (error) {
      console.error("Failed to fetch broadcasts:", error);
    }
  };

  // Fetch broadcasts every 5 seconds
  useEffect(() => {
    if (!customer) return;

    // Initial fetch
    fetchBroadcasts();

    // Set up interval for periodic fetching
    const intervalId = setInterval(fetchBroadcasts, 2000);

    // Clean up interval on unmount
    return () => clearInterval(intervalId);
  }, [customer]);

  // Also fetch broadcasts when dialog opens
  useEffect(() => {
    if (showBroadcastDialog) {
      fetchBroadcasts();
    }
  }, [showBroadcastDialog]);

  return (
    <div className="bg-gray-800 p-4">
      <div className="flex justify-between items-center">
        {/* Navigation Items */}
        <div className="flex justify-around items-center space-x-8">
          {navItems.map((item, index) => (
            <div
              key={index}
              className="text-white font-bold text-xl cursor-pointer px-2 py-2 rounded-lg hover:bg-gray-600"
              onClick={item.onClick}
            >
              {item.name}
            </div>
          ))}
        </div>

        {/* Right Side: Time, Balance, Customer Info, and Button */}
        <div className="flex space-x-4 items-center">
          {/* Inbox icon for viewing broadcasts */}
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-gray-700 rounded-full"
            onClick={() => setShowBroadcastDialog(true)}
            aria-label="View broadcasts"
          >
            <Bell size={24} />
          </Button>

          <h2 className="text-white font-bold text-xl">
            {currentTime.toLocaleTimeString("en-US", { hour12: false })}
          </h2>
          {customer ? (
            <>
              <h2 className="text-white font-bold text-xl">
                Balance: Rp{customer.balance.toFixed(2)}
              </h2>
              <h2 className="text-white font-bold text-xl">
                Welcome, {customer.name}
              </h2>
              <button
                className="text-white bg-gray-600 px-4 py-2 rounded-lg hover:bg-gray-500 transition duration-200 ease-in-out cursor-pointer"
                onClick={() => navigate("/customer_login")}
              >
                Logout
              </button>
            </>
          ) : (
            <button
              className="text-white bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-500 transition duration-200 ease-in-out cursor-pointer"
              onClick={() => navigate("/customer_login")}
            >
              Login
            </button>
          )}
        </div>

        {/* Broadcast List Dialog */}
        <Dialog
          open={showBroadcastDialog}
          onOpenChange={setShowBroadcastDialog}
        >
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Broadcasts</DialogTitle>
              <DialogDescription>
                System and administrative messages
              </DialogDescription>
            </DialogHeader>

            <ScrollArea className="h-64">
              {broadcasts.length > 0 ? (
                <div className="space-y-4 p-1">
                  {broadcasts.map((broadcast) => (
                    <div
                      key={broadcast.broadcast_id}
                      className="p-3 rounded-lg bg-gray-100"
                    >
                      <p className="mt-1 text-sm">{broadcast.message}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  No broadcasts available
                </div>
              )}
            </ScrollArea>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
