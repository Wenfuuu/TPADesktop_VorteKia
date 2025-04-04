import { invoke } from "@tauri-apps/api/core";
import { useEffect, useState, useRef } from "react";
import { useTime } from "./context/TimeContext";
import { useNavigate } from "react-router";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { useStaff } from "@/hooks/use-staff";

type NavItem = {
  name: string;
  onClick: () => void;
};

type StaffNavbarProps = {
  navItems: NavItem[];
};

export default function StaffNavbar({ navItems }: StaffNavbarProps) {
  const navigate = useNavigate();
  const staff = useStaff();
  const { currentTime } = useTime();
  const [showBroadcastDialog, setShowBroadcastDialog] = useState(false);
  const [broadcasts, setBroadcasts] = useState<Broadcast[]>([]);
  const prevBroadcastsRef = useRef<Broadcast[]>([]);

  // Function to fetch broadcasts
  const fetchBroadcasts = async () => {
    if (!staff) return;

    try {
      const data: Broadcast[] = await invoke("get_staff_broadcasts");

      // Check for new broadcasts by comparing with previous state
      if (prevBroadcastsRef.current.length > 0) {
        const newBroadcasts = data.filter(
          (newBroadcast) =>
            !prevBroadcastsRef.current.some(
              (oldBroadcast) => oldBroadcast.broadcast_id === newBroadcast.broadcast_id
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
    if (!staff) return;

    // Initial fetch
    fetchBroadcasts();

    // Set up interval for periodic fetching
    const intervalId = setInterval(fetchBroadcasts, 2000);

    // Clean up interval on unmount
    return () => clearInterval(intervalId);
  }, [staff]);

  // Also fetch broadcasts when dialog opens
  useEffect(() => {
    if (showBroadcastDialog) {
      fetchBroadcasts();
    }
  }, [showBroadcastDialog]);

  return (
    <div className="bg-gray-800 p-4">
      <div className="flex justify-between items-center">
        <div className="flex justify-around items-center space-x-8">
          {navItems.map((item, index) => (
            <Button
              key={index}
              variant="ghost"
              className="text-white font-bold text-xl hover:bg-gray-600"
              onClick={item.onClick}
            >
              {item.name}
            </Button>
          ))}
        </div>

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
          <h2 className="text-white font-bold text-xl">
            Welcome, {staff?.name}
          </h2>
          <Button
            variant="secondary"
            className="bg-gray-600 hover:bg-gray-500"
            onClick={() => {
              navigate("/");
            }}
          >
            Logout
          </Button>
        </div>
      </div>

      {/* Broadcast List Dialog */}
      <Dialog open={showBroadcastDialog} onOpenChange={setShowBroadcastDialog}>
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
  );
}
