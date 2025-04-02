import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { ArrowRight } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "../ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Label } from "../ui/label";
import { invoke } from "@tauri-apps/api/core";

type Props = {
  orders: Order[];
  onUpdate: (
    order: Order,
    newStatus: string,
    assignedChefId?: string
  ) => void;
};

export default function OrderList({ orders, onUpdate }: Props) {
  const [allStaff, setAllStaff] = useState<Staff[]>([]);
  const [chefStaff, setChefStaff] = useState<Staff[]>([]);
  const [allCustomers, setAllCustomers] = useState<
    { customer_id: string; name: string }[]
  >([]);
  const [errors, setErrors] = useState("");
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [currentStaff, setCurrentStaff] = useState<Staff | null>(null);
  const [newStatus, setNewStatus] = useState("");
  const [selectedChefId, setSelectedChefId] = useState("");

  useEffect(() => {
    fetchAllStaff();
    fetchChefStaff();
    fetchAllCustomers();
    getCurrentStaff();
  }, []);

  const getCurrentStaff = async () => {
    try {
      const response = await invoke("get_current_staff");
      if (response !== null) {
        setCurrentStaff(response as Staff);
      }
    } catch (error) {
      console.error("Failed to fetch current staff:", error);
    }
  };

  const fetchAllStaff = async () => {
    try {
      const fetchedStaff: Staff[] = await invoke("get_all_staffs");
      setAllStaff(fetchedStaff);
    } catch (error) {
      console.error("Failed to fetch staff:", error);
      setErrors("Failed to load staff. Please try again.");
    }
  };

  const fetchChefStaff = async () => {
    try {
      const fetchedStaff: Staff[] = await invoke("get_all_chef_staffs");
      setChefStaff(fetchedStaff);
    } catch (error) {
      console.error("Failed to fetch chef staff:", error);
      setErrors("Failed to load chef staff. Please try again.");
    }
  };

  const fetchAllCustomers = async () => {
    try {
      const fetchedCustomers = await invoke("get_all_customers");
      setAllCustomers(
        fetchedCustomers as { customer_id: string; name: string }[]
      );
    } catch (error) {
      console.error("Failed to fetch customers:", error);
      setErrors("Failed to load customers. Please try again.");
    }
  };

  const handleOpenUpdateDialog = (order: Order) => {
    setCurrentOrder(order);
    const nextStatus = getNextStatus(order.status);
    setNewStatus(nextStatus);
    setSelectedChefId("");
    if(nextStatus === "Cooking"){
        setIsUpdateDialogOpen(true);
    }else{
        handleUpdateOrder();
    }
  };

  const handleUpdateOrder = () => {
    if (currentOrder && newStatus) {
      if (currentOrder.status === "Pending" && newStatus === "Cooking") {
        // Validate chef selection when assigning to cooking
        if (!selectedChefId) {
          setErrors("Please select a chef");
          return;
        }
        onUpdate(currentOrder, newStatus, selectedChefId);
      } else {
        onUpdate(currentOrder, newStatus);
      }

      setIsUpdateDialogOpen(false);
      setCurrentOrder(null);
      setNewStatus("");
      setSelectedChefId("");
    } else {
      setErrors("Please select a valid status");
    }
  };

  // Helper function to get staff name by ID
  const getStaffNameById = (staffId: string): string => {
    const staff = allStaff.find((s) => s.staff_id === staffId);
    return staff ? staff.name : "Unassigned";
  };

  // Helper function to get customer name by ID
  const getCustomerNameById = (customerId: string): string => {
    const customer = allCustomers.find((c) => c.customer_id === customerId);
    return customer ? customer.name : "Table " + customerId;
  };

  // Helper function to get the next status in the workflow
  const getNextStatus = (currentStatus: string): string => {
    switch (currentStatus) {
      case "Pending":
        return "Cooking";
      case "Cooking":
        return "Ready to Serve";
      case "Ready to Serve":
        return "Complete";
      default:
        return currentStatus;
    }
  };

  // Helper function to get button text based on status
  const getButtonText = (status: string): string => {
    switch (status) {
      case "Pending":
        return "Assign to Chef";
      case "Cooking":
        return "Mark Ready";
      case "Ready to Serve":
        return "Mark Delivered";
      default:
        return "Update";
    }
  };

  // Helper function to check if staff can update this order
  const canUpdateOrder = (order: Order): boolean => {
    if (!currentStaff) return false;

    // Waiters can update Pending and Ready to Serve orders
    if (currentStaff.role === "waiter") {
      return order.status === "Pending" || order.status === "Ready to Serve";
    }

    // Chefs can update Cooking orders
    if (currentStaff.role === "chef") {
      return order.status === "Cooking";
    }

    // Managers can update all orders
    if (currentStaff.role === "manager") {
      return order.status !== "Complete";
    }

    return false;
  };

  // Helper function to get status color
  const getStatusColor = (status: string): string => {
    switch (status) {
      case "Pending":
        return "bg-yellow-500";
      case "Cooking":
        return "bg-orange-500";
      case "Ready to Serve":
        return "bg-blue-500";
      case "Complete":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <>
      <div className="bg-white shadow-lg rounded-lg p-6 mb-6 max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-black">Restaurant Orders</h2>
        </div>

        {orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 bg-gray-50 rounded-lg border border-dashed border-gray-300">
            <p className="text-gray-500 mb-2">No orders available.</p>
            <p className="text-sm text-gray-400">
              Orders will appear here when customers place them
            </p>
          </div>
        ) : (
          <ul className="space-y-6">
            {orders.map((order) => (
              <li
                key={order.order_id}
                className="p-5 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 flex gap-4 flex-col bg-gray-50"
              >
                <div className="flex justify-between items-center gap-6">
                  <div className="flex-1">
                    <p className="font-semibold text-lg text-black">
                      Customer: {getCustomerNameById(order.customer_id)}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Order ID: </span>
                      {order.order_id}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Restaurant ID: </span>
                      {order.restaurant_id}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Menu ID: </span>
                      {order.menu_id}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      {order.assigned_to ? (
                        <>
                          <span className="font-medium">Assigned to: </span>
                          {getStaffNameById(order.assigned_to)}
                        </>
                      ) : (
                        <span className="italic text-gray-500">
                          Not yet assigned
                        </span>
                      )}
                    </p>
                    <p
                      className={`text-white rounded-full px-3 py-1 mt-2 text-xs font-medium inline-block ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {order.status}
                    </p>
                  </div>

                  <div className="flex flex-col gap-2">
                    {order.status !== "Complete" && canUpdateOrder(order) && (
                      <Button
                        className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer flex justify-around"
                        onClick={() => handleOpenUpdateDialog(order)}
                      >
                        <ArrowRight className="w-4 h-4 mr-2" />
                        {getButtonText(order.status)}
                      </Button>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Update Order Status Dialog */}
      <Dialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Update Order Status</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col space-y-4 py-4">
            {/* Chef selection dropdown - only shown when moving from Pending to Cooking */}
            {currentOrder?.status === "Pending" && newStatus === "Cooking" && (
              <div className="flex flex-col space-y-2">
                <Label htmlFor="chef-select">Assign Chef</Label>
                <Select
                  value={selectedChefId}
                  onValueChange={setSelectedChefId}
                >
                  <SelectTrigger id="chef-select">
                    <SelectValue placeholder="Select a chef" />
                  </SelectTrigger>
                  <SelectContent>
                    {chefStaff.map((chef) => (
                      <SelectItem key={chef.staff_id} value={chef.staff_id}>
                        {chef.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="bg-gray-200 p-3 rounded-md">
              <p className="text-sm">
                Assign the order to a chef to start cooking. 🔥
              </p>
            </div>

            {errors && <p className="text-sm text-red-500">{errors}</p>}
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button
              onClick={handleUpdateOrder}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Assign
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
