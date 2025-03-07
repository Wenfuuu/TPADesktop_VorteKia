import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Edit, Trash2, Wrench, Users, PlusCircle, DollarSign } from "lucide-react";
import { invoke } from "@tauri-apps/api/core";
import { RideQueueDialog } from "./RideQueueDialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "../ui/dialog";
import { toast } from "sonner";

type Props = {
  rides: Ride[];
  onEdit: (ride: Ride) => void;
  onRemove: (ride: Ride) => void;
  onMaintenance: (ride: Ride) => void;
  onIncome: (ride: Ride) => void;
};

export default function RideList({
  rides,
  onEdit,
  onRemove,
  onMaintenance,
  onIncome
}: Props) {
  const [imageUrls, setImageUrls] = useState<{ [key: string]: string }>({});
  const [staff, setStaff] = useState<Staff | null>(null);
  const [queue, setQueue] = useState<RideQueue[]>([]);

  const [assignedRide, setAssignedRide] = useState<Ride | null>(null);
  const [customers, setCustomers] = useState<Customer[]>([]);

  const [customer, setCustomer] = useState<Customer | null>(null);

  // Dialog state
  const [queueDialogOpen, setQueueDialogOpen] = useState(false);
  const [selectedRide, setSelectedRide] = useState<Ride | null>(null);
  const [isQueuing, setIsQueuing] = useState(false);

  useEffect(() => {
    get_staff();
    get_customer();
    fetchCustomers();
  }, []);

  useEffect(() => {
    fetchAssignedRide();
  }, [staff]);

  useEffect(() => {
    fetchQueue();
  }, [assignedRide]);

  async function get_customer() {
    const response = await invoke("get_current_customer");
    if (response !== null) {
      setCustomer(response as Customer);
    }
  }

  const fetchAssignedRide = async () => {
    if (staff?.role !== "ride staff") return;
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
    if (selectedRide?.ride_id) {
      const queueData: RideQueue[] = await invoke("get_ride_queue", {
        rideid: selectedRide?.ride_id,
      });
      console.log(queueData);
      setQueue(queueData);
    } else if (assignedRide?.ride_id) {
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

  // Modified function to handle viewing a ride's queue
  const handleViewQueue = async (ride: Ride) => {
    setSelectedRide(ride);
    const queueData: RideQueue[] = await invoke("get_ride_queue", {
      rideid: ride.ride_id,
    });
    setQueue(queueData);
    setQueueDialogOpen(true);
  };

  // Function to handle queueing for a ride
  const handleQueueForRide = async (ride: Ride) => {
    if (!customer) {
      toast("Login required");
      return;
    }

    setIsQueuing(true);
    try {
      // Check if customer is already in queue
      const customerInQueue = queue.some(
        (item) => item.customer_id === customer.customer_id
      );

      if (customerInQueue) {
        toast("Already in queue");
        setIsQueuing(false);
        return;
      }

      // Add customer to queue
      await invoke("add_queue_from_customer", {
        rideid: ride.ride_id,
        customerid: customer.customer_id,
      });

      // Refresh queue data
      const updatedQueue: RideQueue[] = await invoke("get_ride_queue", {
        rideid: ride.ride_id,
      });
      setQueue(updatedQueue);

      toast("Added to queue");
    } catch (error) {
      toast("Failed to join queue");
      console.error("Queue error:", error);
    } finally {
      setIsQueuing(false);
    }
  };

  // Function to get customer name by ID
  const getCustomerName = (customerId: string): string => {
    const customer = customers.find((c) => c.customer_id === customerId);
    return customer
      ? `${customer.name}`
      : "Unknown Customer";
  };

  // Function to check if the current customer is in the queue for a ride
  const isCustomerInQueue = (rideId: string): boolean => {
    if (!customer) return false;
    return queue.some(
      (item) =>
        item.ride_id === rideId && item.customer_id === customer.customer_id
    );
  };

  // Function to get the customer's position in the queue
  const getCustomerPosition = (rideId: string): number | null => {
    if (!customer) return null;
    const queueItem = queue.find(
      (item) =>
        item.ride_id === rideId && item.customer_id === customer.customer_id
    );
    return queueItem ? queueItem.position : null;
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

  // Check if user is authenticated as staff or customer
  const isAuthenticated = staff !== null || customer !== null;

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
            const customerQueuePosition = getCustomerPosition(ride.ride_id);

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

                    {/* Show position information if customer is in queue */}
                    {customer && customerQueuePosition !== null && (
                      <p className="mt-2 text-sm text-indigo-600 font-medium">
                        Your position in queue: {customerQueuePosition}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col gap-2">
                    {/* GUEST VIEW - Only show View Queue button */}
                    {!isAuthenticated && (
                      <Button
                        onClick={() => handleViewQueue(ride)}
                        className="bg-purple-600 hover:bg-purple-700 text-white cursor-pointer flex justify-around"
                        disabled={ride.status !== "Open"}
                      >
                        <Users className="w-4 h-4 mr-2" />
                        View Queue
                      </Button>
                    )}

                    {/* CUSTOMER VIEW - Show View Queue and Queue for Ride buttons */}
                    {customer && (
                      <>
                        <Button
                          onClick={() => handleViewQueue(ride)}
                          className="bg-purple-600 hover:bg-purple-700 text-white cursor-pointer flex justify-around"
                          disabled={ride.status !== "Open"}
                        >
                          <Users className="w-4 h-4 mr-2" />
                          View Queue
                        </Button>

                        <Button
                          onClick={() => handleQueueForRide(ride)}
                          className="bg-green-600 hover:bg-green-700 text-white cursor-pointer flex justify-around"
                          disabled={
                            ride.status !== "Open" ||
                            isCustomerInQueue(ride.ride_id) ||
                            isQueuing
                          }
                        >
                          <PlusCircle className="w-4 h-4 mr-2" />
                          {isCustomerInQueue(ride.ride_id)
                            ? "In Queue"
                            : isQueuing
                            ? "Joining..."
                            : "Queue for Ride"}
                        </Button>
                      </>
                    )}

                    {/* STAFF VIEW - Show View Details button */}
                    {staff && (
                      <Button
                        onClick={() => onEdit(ride)}
                        className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer flex justify-around"
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        View Details
                      </Button>
                    )}

                    {/* Ride Manager specific buttons */}
                    {staff?.role === "ride manager" && (
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

                        <Button
                          onClick={() => onIncome(ride)}
                          className="bg-green-600 hover:bg-green-700 text-white cursor-pointer flex justify-around"
                        >
                          <DollarSign className="w-4 h-4 mr-2" />
                          View Income
                        </Button>
                      </div>
                    )}

                    {/* Ride Staff queue dialog */}
                    {staff?.role === "ride staff" &&
                      assignedRide?.ride_id === ride.ride_id && (
                        <RideQueueDialog
                          ride={ride}
                          customers={customers}
                          queue={queue}
                          onQueueRefresh={fetchQueue}
                        />
                      )}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {/* Queue View Dialog */}
      <Dialog open={queueDialogOpen} onOpenChange={setQueueDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Queue for {selectedRide?.name || "Ride"}</DialogTitle>
            <DialogDescription>
              Current queue positions and waiting customers
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4">
            {queue.length === 0 ? (
              <div className="py-8 text-center bg-gray-50 rounded-md">
                <p className="text-gray-500">
                  No customers in queue at the moment.
                </p>
                {customer && selectedRide && selectedRide.status === "Open" && (
                  <div className="mt-4">
                    <Button
                      onClick={() => handleQueueForRide(selectedRide)}
                      disabled={isQueuing}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      {isQueuing ? "Joining..." : "Be the first to queue!"}
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <div className="border rounded-md overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Position
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Customer
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {queue
                      .sort((a, b) => a.position - b.position)
                      .map((queueItem) => (
                        <tr
                          key={queueItem.queue_id}
                          className={
                            customer &&
                            queueItem.customer_id === customer.customer_id
                              ? "bg-green-50"
                              : ""
                          }
                        >
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {queueItem.position}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {getCustomerName(queueItem.customer_id)}
                            {customer &&
                              queueItem.customer_id ===
                                customer.customer_id && (
                                <span className="ml-2 text-xs text-white bg-green-500 px-2 py-1 rounded-full">
                                  You
                                </span>
                              )}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="flex justify-between mt-4">
            {customer &&
              selectedRide &&
              selectedRide.status === "Open" &&
              !isCustomerInQueue(selectedRide.ride_id) && (
                <Button
                  onClick={() => handleQueueForRide(selectedRide)}
                  disabled={isQueuing}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <PlusCircle className="w-4 h-4 mr-2" />
                  {isQueuing ? "Joining..." : "Join Queue"}
                </Button>
              )}
            <div className="flex-1"></div>
            <DialogClose asChild>
              <Button>Close</Button>
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
