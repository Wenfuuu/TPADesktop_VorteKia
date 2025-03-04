import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { PlusCircle, Clock, Edit } from "lucide-react";
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
import { Input } from "../ui/input";
import { invoke } from "@tauri-apps/api/core";

type Props = {
  tasks: Task[];
  onAdd: (task: Omit<Task, "task_id">) => void;
  onUpdate: (task: Task) => void;
};

export default function TaskList({ tasks, onAdd, onUpdate }: Props) {
  const [allStaff, setAllStaff] = useState<Staff[]>([]);
  const [allRides, setAllRides] = useState<{ ride_id: string; name: string }[]>([]);
  const [errors, setErrors] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editTask, setEditTask] = useState<Task | null>(null)

  const [updatedTimes, setUpdatedTimes] = useState({
    start_time: "",
    end_time: ""
  })

  // New task form state
  const [newTask, setNewTask] = useState({
    ride_id: "",
    assigned_to: "",
    start_time: "",
    end_time: "",
    status: "In Progress"
  });

  useEffect(() => {
    fetchStaff();
    fetchRides();
  }, []);

  async function fetchStaff() {
    try {
      const fetchedStaff: Staff[] = await invoke("get_all_maintenance_staffs");
      setAllStaff(fetchedStaff);
    } catch (error) {
      console.error("Failed to fetch staff:", error);
      setErrors("Failed to load maintenance staff. Please try again.");
    }
  }

  async function fetchRides() {
    try {
      const fetchedRides = await invoke("get_all_rides");
      setAllRides(fetchedRides as { ride_id: string; name: string }[]);
    } catch (error) {
      console.error("Failed to fetch rides:", error);
      setErrors("Failed to load rides. Please try again.");
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setNewTask({
      ...newTask,
      [field]: value,
    });
    // Clear errors when user makes changes
    setErrors("");
  };

  const handleUpdateTask = () => {
    if(editTask){
        setEditTask({
            ...editTask,
            start_time: updatedTimes.start_time,
            end_time: updatedTimes.end_time
        })
        onUpdate(editTask)
        setEditTask(null)
    }
  }

  const handleCreateTask = () => {
    // Validate all fields are filled
    if (
      !newTask.ride_id ||
      !newTask.assigned_to ||
      !newTask.start_time ||
      !newTask.end_time
    ) {
      setErrors("Please fill all required fields");
      return;
    }

    // Validate end time is after start time
    if (new Date(newTask.end_time) <= new Date(newTask.start_time)) {
      setErrors("End time must be after start time");
      return;
    }

    onAdd(newTask)

    // Close dialog and reset form
    setIsDialogOpen(false);
    setNewTask({
        ride_id: "",
        assigned_to: "",
        start_time: "",
        end_time: "",
        status: "In Progress"
    });
  };

  // Helper function to get staff name by ID
  const getStaffNameById = (staffId: string): string => {
    const staff = allStaff.find((s) => s.staff_id === staffId);
    return staff ? staff.name : "Unknown Staff";
  };

  // Helper function to get ride name by ID
  const getRideNameById = (rideId: string): string => {
    const ride = allRides.find((r) => r.ride_id === rideId);
    return ride ? ride.name : rideId;
  };

  // Helper function to format date-time
  const formatDateTime = (dateTimeStr: string): string => {
    return new Date(dateTimeStr).toLocaleString();
  };

  return (
    <>
      <div className="bg-white shadow-lg rounded-lg p-6 mb-6 max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Maintenance Tasks</h2>
          <Button
            onClick={() => setIsDialogOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <PlusCircle className="w-4 h-4 mr-2" />
            Create New Task
          </Button>
        </div>

        {tasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 bg-gray-50 rounded-lg border border-dashed border-gray-300">
            <p className="text-gray-500 mb-2">
              No maintenance tasks scheduled.
            </p>
            <p className="text-sm text-gray-400">
              Create a new task to schedule maintenance
            </p>
          </div>
        ) : (
          <ul className="space-y-6">
            {tasks.map((task) => (
              <li
                key={task.task_id}
                className="p-5 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 flex gap-4 flex-col bg-gray-50"
              >
                <div className="flex justify-between items-start gap-6">
                  <div className="flex-1">
                    <p className="font-semibold text-lg text-black">
                      Ride: {getRideNameById(task.ride_id)}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Task ID:</span>{" "}
                      {task.task_id}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      <span className="font-medium">Assigned to:</span>{" "}
                      {getStaffNameById(task.assigned_to)}
                    </p>
                    <div className="flex items-center text-sm text-gray-600 mt-1">
                      <Clock className="w-4 h-4 mr-1" />
                      <div className="flex justify-between min-w-42">
                        <span className="font-medium">Start: </span>
                        {formatDateTime(task.start_time)}
                      </div>
                    </div>
                    <div className="flex items-center text-sm text-gray-600 mt-1">
                      <Clock className="w-4 h-4 mr-1" />
                      <div className="flex justify-between min-w-42">
                        <span className="font-medium">End: </span>
                        {formatDateTime(task.end_time)}
                      </div>
                    </div>
                    <p
                      className={`text-white rounded-full px-3 py-1 mt-2 text-xs font-medium inline-block ${
                        task.status === "Completed"
                          ? "bg-green-500"
                          : task.status === "In Progress"
                          ? "bg-blue-500"
                          : "bg-gray-500"
                      }`}
                    >
                      {task.status}
                    </p>
                  </div>

                  <div className="flex flex-col gap-2">
                    {task.status !== "Completed" && (
                      <Button
                        className="bg-green-600 hover:bg-green-700 text-white cursor-pointer flex justify-around"
                        onClick={() => {
                            setEditTask(task)
                            setIsEditDialogOpen(true);
                        }}
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Edit Schedule
                      </Button>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Edit schedule dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Task Schedule</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col space-y-4 py-4">
            <div className="flex flex-col space-y-2">
              <Label htmlFor="edit-start-time">New Start Time</Label>
              <Input
                id="edit-start-time"
                type="datetime-local"
                value={updatedTimes.start_time}
                onChange={(e) =>
                  setUpdatedTimes({
                    ...updatedTimes,
                    start_time: e.target.value,
                  })
                }
              />
            </div>
            <div className="flex flex-col space-y-2">
              <Label htmlFor="edit-end-time">New End Time</Label>
              <Input
                id="edit-end-time"
                type="datetime-local"
                value={updatedTimes.end_time}
                onChange={(e) =>
                  setUpdatedTimes({ ...updatedTimes, end_time: e.target.value })
                }
              />
            </div>
            {errors && <p className="text-sm text-red-500">{errors}</p>}
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button
              onClick={handleUpdateTask}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Update Schedule
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Task Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create New Maintenance Task</DialogTitle>
          </DialogHeader>

          <div className="flex flex-col space-y-4 py-4">
            {/* Ride Selection */}
            <div className="flex flex-col space-y-2">
              <Label htmlFor="ride-select">Select Ride</Label>
              <Select
                value={newTask.ride_id}
                onValueChange={(value) => handleInputChange("ride_id", value)}
              >
                <SelectTrigger id="ride-select">
                  <SelectValue placeholder="Select a ride" />
                </SelectTrigger>
                <SelectContent>
                  {allRides.map((ride) => (
                    <SelectItem key={ride.ride_id} value={ride.ride_id}>
                      {ride.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Staff Selection */}
            <div className="flex flex-col space-y-2">
              <Label htmlFor="staff-select">Assign Maintenance Staff</Label>
              <Select
                value={newTask.assigned_to}
                onValueChange={(value) =>
                  handleInputChange("assigned_to", value)
                }
              >
                <SelectTrigger id="staff-select">
                  <SelectValue placeholder="Select a staff member" />
                </SelectTrigger>
                <SelectContent>
                  {allStaff.map((staff) => (
                    <SelectItem key={staff.staff_id} value={staff.staff_id}>
                      {staff.name} - {staff.role}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Start Time */}
            <div className="flex flex-col space-y-2">
              <Label htmlFor="start-time">Start Time</Label>
              <Input
                id="start-time"
                type="datetime-local"
                value={newTask.start_time}
                onChange={(e) =>
                  handleInputChange("start_time", e.target.value)
                }
              />
            </div>

            {/* End Time */}
            <div className="flex flex-col space-y-2">
              <Label htmlFor="end-time">End Time</Label>
              <Input
                id="end-time"
                type="datetime-local"
                value={newTask.end_time}
                onChange={(e) => handleInputChange("end_time", e.target.value)}
              />
            </div>

            {errors && <p className="text-sm text-red-500">{errors}</p>}

            <div className="bg-gray-50 p-3 rounded-md">
              <p className="text-sm text-gray-700">
                Creating this task will schedule maintenance for the selected
                ride and assign it to the specified staff member.
              </p>
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button
              onClick={handleCreateTask}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Create Task
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
