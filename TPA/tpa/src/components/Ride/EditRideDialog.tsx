import { useEffect, useState } from "react";
import ImageUpload from "../ImageUpload";
import { invoke } from "@tauri-apps/api/core";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";

type Props = {
  ride: Ride;
  onUpdateRide: (ride: Ride) => void;
  onClose: () => void;
  open: boolean;
};

export default function EditRideDialog({
  ride,
  onUpdateRide,
  onClose,
  open,
}: Props) {
  if (!ride) return null;

  const [updatedRide, setUpdatedRide] = useState<Ride>({
    ...ride,
    assigned_staff: Array.isArray(ride.assigned_staff)
      ? [...ride.assigned_staff]
      : [],
  });
  const [allStaff, setAllStaff] = useState<Staff[]>([]);
  const [errors, setErrors] = useState("");
  const [staff, setStaff] = useState<Staff | null>(null);

  useEffect(() => {
    get_staff();
  }, []);

  const get_staff = async () => {
    const response = await invoke("get_current_staff");
    if (response !== null) {
      setStaff(response as Staff);
    }
  };

  async function fetchStaff() {
    try {
      const fetchedStaff: Staff[] = await invoke("get_all_ride_staffs");
      console.log(fetchedStaff)
      setAllStaff(fetchedStaff);
    } catch (error) {
      console.error("Failed to fetch staff:", error);
    }
  }

  useEffect(() => {
    if (open) {
      fetchStaff();
      setUpdatedRide({
        ...ride,
        assigned_staff: Array.isArray(ride.assigned_staff)
          ? [...ride.assigned_staff]
          : [],
      });
      setErrors("");
    }
  }, [ride, open]);

  // Toggle staff selection
  function toggleStaffSelection(staff: Staff) {
    setUpdatedRide((prev) => {
      const currentAssignedStaff = Array.isArray(prev.assigned_staff)
        ? prev.assigned_staff
        : [];

      const isStaffAssigned = currentAssignedStaff.some(
        (assignedStaff) => assignedStaff.staff_id === staff.staff_id
      );

      const newAssignedStaff = isStaffAssigned
        ? currentAssignedStaff.filter(
            (assignedStaff) => assignedStaff.staff_id !== staff.staff_id
          )
        : [...currentAssignedStaff, staff];

      // If removing staff would result in no staff but status is Open, show error
      if (newAssignedStaff.length === 0 && prev.status === "Open") {
        setErrors("Cannot have Open status with no staff assigned.");
      } else {
        setErrors("");
      }

      return {
        ...prev,
        assigned_staff: newAssignedStaff,
      };
    });
  }

  // Handle status change with validation
  function handleStatusChange(value: string) {
    const hasStaff =
      Array.isArray(updatedRide.assigned_staff) &&
      updatedRide.assigned_staff.length > 0;

    if (value === "Open" && !hasStaff) {
      setErrors("Cannot set status to Open with no staff assigned.");
      return;
    }

    setErrors("");
    setUpdatedRide({
      ...updatedRide,
      status: value,
    });
  }

  // Check if a staff member is currently assigned
  function isStaffAssigned(staffId: string): boolean {
    return (
      Array.isArray(updatedRide.assigned_staff) &&
      updatedRide.assigned_staff.some((staff) => staff.staff_id === staffId)
    );
  }

  function handleUpdate() {
    // Check for empty fields
    if (
      !updatedRide.name ||
      !updatedRide.opening_hours ||
      !updatedRide.closing_hours ||
      !updatedRide.status ||
      updatedRide.price === undefined ||
      updatedRide.price === null ||
      !updatedRide.image
    ) {
      setErrors("There are empty form fields.");
      return;
    }

    // Check staff validation
    const hasStaff =
      Array.isArray(updatedRide.assigned_staff) &&
      updatedRide.assigned_staff.length > 0;

    if (updatedRide.status === "Open" && !hasStaff) {
      setErrors("Cannot save with Open status and no staff assigned.");
      return;
    }

    setErrors("");
    onUpdateRide(updatedRide);
    onClose();
  }

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Update Ride</DialogTitle>
        </DialogHeader>

        {errors && (
          <div className="text-red-500 text-sm mt-1 mb-2">{errors}</div>
        )}

        <div className="grid grid-cols-1 gap-3 py-2">
          <div className="space-y-1">
            <Label htmlFor="name">Ride Name</Label>
            <Input
              id="name"
              value={updatedRide.name}
              onChange={(e) =>
                setUpdatedRide({
                  ...updatedRide,
                  name: e.target.value,
                })
              }
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <Label htmlFor="opening">Operating Hours</Label>
              <Input
                id="opening"
                type="time"
                value={
                  updatedRide.opening_hours
                    ? updatedRide.opening_hours.slice(0, 5)
                    : ""
                }
                onChange={(e) =>
                  setUpdatedRide({
                    ...updatedRide,
                    opening_hours: e.target.value + ":00",
                  })
                }
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="closing">Closing Hours</Label>
              <Input
                id="closing"
                type="time"
                value={
                  updatedRide.closing_hours
                    ? updatedRide.closing_hours.slice(0, 5)
                    : ""
                }
                onChange={(e) =>
                  setUpdatedRide({
                    ...updatedRide,
                    closing_hours: e.target.value + ":00",
                  })
                }
              />
            </div>
          </div>

          {/* Price input field */}
          <div className="space-y-1">
            <Label htmlFor="price">Price ($)</Label>
            <Input
              id="price"
              type="number"
              min="0"
              step="0.01"
              value={updatedRide.price || ""}
              onChange={(e) =>
                setUpdatedRide({
                  ...updatedRide,
                  price: parseFloat(e.target.value),
                })
              }
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="status">Status</Label>
            <Select
              value={updatedRide.status}
              onValueChange={handleStatusChange}
            >
              <SelectTrigger id="status">
                <SelectValue placeholder="Select Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Open">Open</SelectItem>
                <SelectItem value="Maintenance">Maintenance</SelectItem>
                <SelectItem value="Closed">Closed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Staff Allocation Section */}
          <div className="space-y-1 py-1">
            <Label htmlFor="staff-list">
              Assign Staff{" "}
              {updatedRide.status === "Open" && (
                <span className="text-red-500">*</span>
              )}
            </Label>
            <ScrollArea className="border rounded h-20 p-2" id="staff-list">
              {allStaff.length === 0 ? (
                <p className="text-gray-500 text-sm">Loading staff...</p>
              ) : (
                <div className="space-y-1">
                  {allStaff.map((staff) => (
                    <div
                      key={staff.staff_id}
                      className="flex items-center space-x-2"
                    >
                      <Checkbox
                        id={staff.staff_id}
                        checked={isStaffAssigned(staff.staff_id)}
                        onCheckedChange={() => toggleStaffSelection(staff)}
                      />
                      <Label
                        htmlFor={staff.staff_id}
                        className="text-sm flex cursor-pointer items-center"
                      >
                        <span>{staff.name}</span>
                        <span className="text-xs text-gray-500 ml-1">
                          ({staff.role})
                        </span>
                      </Label>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
            {updatedRide.status === "Open" && (
              <p className="text-xs text-gray-500">
                * Staff required for Open status
              </p>
            )}
          </div>

          {/* Centered Image Upload */}
          <div className="flex justify-center py-2">
            <ImageUpload
              image={updatedRide.image}
              onImageUpload={(binaryImage) =>
                setUpdatedRide({
                  ...updatedRide,
                  image: binaryImage,
                })
              }
            />
          </div>
        </div>

        <DialogFooter>
          <Button 
          onClick={handleUpdate} 
          className="w-full"
          disabled={staff?.role !== "ride manager"}>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
