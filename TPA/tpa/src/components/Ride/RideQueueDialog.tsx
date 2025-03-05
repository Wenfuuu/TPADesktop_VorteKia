import { useState } from "react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "../ui/dialog";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Wrench, Edit, Trash2, Plus } from "lucide-react";
import { invoke } from "@tauri-apps/api/core";
import { toast } from "sonner";

type Props = {
  ride: Ride;
  customers: Customer[];
  queue: RideQueue[];
  onQueueRefresh: () => void;
};

export function RideQueueDialog({
  ride,
  customers,
  queue,
  onQueueRefresh,
}: Props) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null);
  const [selectedQueueToEdit, setSelectedQueueToEdit] =
    useState<RideQueue | null>(null);
  const [newPosition, setNewPosition] = useState<number | string>("");

  const handleAddQueue = async () => {
    try {
      if (!selectedCustomer) {
        toast("Please select a customer");
        return;
      }

      await invoke("add_queue", {
        rideid: ride.ride_id,
        customerid: selectedCustomer,
      });

      toast("Queue added successfully");

      // Reset customer selection
      setSelectedCustomer(null);

      // Refresh queue
      onQueueRefresh();
    } catch (error) {
      console.error("Error adding queue:", error);
      toast("Failed to add queue");
    }
  };

  const handleEditQueue = async (queue: RideQueue) => {
    setSelectedQueueToEdit(queue);
    setNewPosition(queue.position);
  };

  const handleRemoveQueue = async (queue: RideQueue) => {
    try {
      await invoke("remove_queue", {
        rideid: queue.ride_id,
        customerid: queue.customer_id,
      });

      toast("Queue removed successfully");

      onQueueRefresh();
    } catch (error) {
      console.error("Error removing queue:", error);
      toast("Failed to remove queue");
    }
  };

  const handleUpdateQueuePosition = async () => {
    if (!selectedQueueToEdit) {
      toast("No queue selected");
      return;
    }

    const position = Number(newPosition);
    if (isNaN(position) || position < 1) {
      toast("Please enter a valid position number");
      return;
    }

    try {
      await invoke("update_queue", {
        rideid: selectedQueueToEdit.ride_id,
        customerid: selectedQueueToEdit.customer_id,
        newpos: position,
      });

      toast("Queue position updated successfully");

      // Reset selections
      setSelectedQueueToEdit(null);
      setNewPosition("");

      onQueueRefresh();
    } catch (error) {
      console.error("Error updating queue position:", error);
      toast("Failed to update queue position");
    }
  };

  const getCustomerName = (customerId: string) => {
    const customer = customers.find((c) => c.customer_id === customerId);
    return customer ? customer.name : "Unassigned";
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button
          disabled={ride.status === "Maintenance"}
          className="bg-yellow-500 hover:bg-yellow-600 text-white cursor-pointer flex justify-around"
        >
          <Wrench className="w-4 h-4 mr-2" />
          Edit Queue
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Queue Management for {ride.name}</DialogTitle>
          <DialogDescription>
            Manage and edit queues for this ride
          </DialogDescription>
        </DialogHeader>

        {/* Customer Selection for Adding Queue */}
        <div className="flex gap-4 items-center">
          <Select
            value={selectedCustomer || undefined}
            onValueChange={setSelectedCustomer}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Customer" />
            </SelectTrigger>
            <SelectContent>
              {customers.map((customer) => (
                <SelectItem
                  key={customer.customer_id}
                  value={customer.customer_id}
                >
                  {customer.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Add Queue Button */}
          <Button
            onClick={handleAddQueue}
            className="bg-green-500 hover:bg-green-600 flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Queue
          </Button>
        </div>

        {/* Queue List */}
        <div className="overflow-auto flex-grow mt-4">
          {queue.length === 0 ? (
            <div className="text-center text-gray-500 py-6">
              No queues available for this ride
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Position</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {queue.map((queueItem) => (
                  <TableRow key={queueItem.queue_id}>
                    <TableCell>{queueItem.position}</TableCell>
                    <TableCell>
                      {getCustomerName(queueItem.customer_id)}
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEditQueue(queueItem)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleRemoveQueue(queueItem)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>

        {/* Edit Queue Position Dialog */}
        {selectedQueueToEdit && (
          <Dialog
            open={!!selectedQueueToEdit}
            onOpenChange={() => setSelectedQueueToEdit(null)}
          >
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Queue Position</DialogTitle>
                <DialogDescription>
                  Update the position for{" "}
                  {getCustomerName(selectedQueueToEdit.customer_id)}'s queue
                </DialogDescription>
              </DialogHeader>

              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="position" className="text-right">
                    Position
                  </label>
                  <Input
                    id="position"
                    type="number"
                    min="1"
                    value={newPosition}
                    onChange={(e) => setNewPosition(e.target.value)}
                    className="col-span-3"
                    placeholder="Enter new position"
                  />
                </div>
              </div>

              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button onClick={handleUpdateQueuePosition}>
                  Update Position
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </DialogContent>
    </Dialog>
  );
}
