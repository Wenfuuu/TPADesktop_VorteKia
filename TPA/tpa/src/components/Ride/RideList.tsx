import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Edit, Trash2, Wrench } from "lucide-react";
import { invoke } from "@tauri-apps/api/core";
import { RideQueueDialog } from "./RideQueueDialog";

type Props = {
  rides: Ride[];
  onEdit: (ride: Ride) => void;
  onRemove: (ride: Ride) => void;
  onMaintenance: (ride: Ride) => void;
};

export default function RideList({
  rides,
  onEdit,
  onRemove,
  onMaintenance,
}: Props) {
  const [imageUrls, setImageUrls] = useState<{ [key: string]: string }>({});
  const [staff, setStaff] = useState<Staff | null>(null);
  const [queue, setQueue] = useState<RideQueue[]>([]);

  const [assignedRide, setAssignedRide] = useState<Ride | null>(null);
  const [customers, setCustomers] = useState<Customer[]>([]);

  useEffect(() => {
    get_staff();
    fetchCustomers();
  }, []);

  useEffect(() => {
    fetchAssignedRide();
  }, [staff]);

  useEffect(() => {
    fetchQueue();
  }, [assignedRide]);

  const fetchAssignedRide = async () => {
    if(staff?.role !== "ride staff") return;
    const ride: Ride = await invoke("get_assigned_ride", {
      staffid: staff?.staff_id,
    });
    if (ride !== null) {
      console.log(ride);
      setAssignedRide(ride);
    }
  };

  const get_staff = async () => {
    const response = await invoke("get_current_staff");
    if (response !== null) {
      setStaff(response as Staff);
    }
  };

  const fetchQueue = async () => {
    if (assignedRide?.ride_id) {
      const queueData: RideQueue[] = await invoke("get_ride_queue", {
        rideid: assignedRide?.ride_id,
      });
      console.log(queueData);
      setQueue(queueData);
    }
  };

  const fetchCustomers = async () => {
    const customerData: Customer[] = await invoke("get_all_customers");
    console.log(customerData);
    setCustomers(customerData);
  };

  useEffect(() => {
    // Process ride images
    const newImageUrls: { [key: string]: string } = {};

    rides.forEach((ride) => {
      if (ride.image) {
        const imageUrl = URL.createObjectURL(
          new Blob([new Uint8Array(ride.image)], {
            type: "image/png",
          })
        );
        newImageUrls[ride.ride_id] = imageUrl;
      }
    });

    // Update image URLs with ride images
    setImageUrls((prevUrls) => ({
      ...prevUrls,
      ...newImageUrls,
    }));

    // Cleanup function for image URLs
    return () => {
      Object.values(imageUrls).forEach((url) => {
        URL.revokeObjectURL(url);
      });
    };
  }, [rides]); // Only re-run when rides change

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 mb-6 max-w-6xl mx-auto">
      {rides.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-40 bg-gray-50 rounded-lg border border-dashed border-gray-300">
          <p className="text-gray-500 mb-2">No rides available.</p>
          <p className="text-sm text-gray-400">Add a ride to get started</p>
        </div>
      ) : (
        <ul className="space-y-6">
          {rides.map((ride) => {
            const imageUrl = imageUrls[ride.ride_id];

            return (
              <li
                key={ride.ride_id}
                className="p-5 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 flex gap-4 flex-col bg-gray-50"
              >
                <div className="flex justify-between items-center gap-6">
                  <div className="w-40 h-28 flex-shrink-0">
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={ride.name}
                        className="w-full h-full object-cover rounded-lg border shadow-sm"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-200 rounded-lg">
                        <span className="text-gray-500 text-sm">No Image</span>
                      </div>
                    )}
                  </div>

                  <div className="flex-1">
                    <p className="font-semibold text-lg">{ride.name}</p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Operating Hours:</span>{" "}
                      {ride.opening_hours} - {ride.closing_hours}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      <span className="font-medium">Price:</span> Rp
                      {ride.price.toLocaleString()}
                    </p>
                    <p
                      className={`text-white rounded-full px-3 py-1 mt-2 text-xs font-medium inline-block ${
                        ride.status === "Open"
                          ? "bg-green-500"
                          : ride.status === "Maintenance"
                          ? "bg-yellow-500"
                          : "bg-red-500"
                      }`}
                    >
                      {ride.status}
                    </p>
                  </div>

                  <div className="flex flex-col gap-2">
                    <Button
                      onClick={() => onEdit(ride)}
                      className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer flex justify-around"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      View Details
                    </Button>

                    {staff?.role === "ride manager" ? (
                      <div className="flex flex-col gap-2">
                        <Button
                          disabled={ride.status === "Maintenance"}
                          onClick={() => onMaintenance(ride)}
                          className="bg-yellow-500 hover:bg-yellow-600 text-white cursor-pointer flex justify-around"
                        >
                          <Wrench className="w-4 h-4 mr-2" />
                          Request Maintenance
                        </Button>

                        <Button
                          onClick={() => onRemove(ride)}
                          className="bg-red-600 hover:bg-red-700 text-white cursor-pointer flex justify-around"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Propose Removal
                        </Button>
                      </div>
                    ) : (
                      // Only show Edit Queue for the assigned ride
                      assignedRide?.ride_id === ride.ride_id && (
                        <RideQueueDialog
                          ride={ride}
                          customers={customers}
                          queue={queue}
                          onQueueRefresh={fetchQueue}
                        />
                      )
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
