import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

type Props = {
  ride: Ride;
  onMaintenanceRide: (ride: Ride, reason: string) => void;
  onClose: () => void;
  open: boolean;
};

export default function MaintenanceDialog({
  ride,
  onMaintenanceRide,
  onClose,
  open,
}: Props) {
  if (!ride) return null;

  const [maintenanceReason, setMaintenanceReason] = useState<string>("");
  const [errors, setErrors] = useState<string>("");

  const handleMaintenance = () => {
    // Validate that a reason is provided
    if (!maintenanceReason.trim()) {
      setErrors("Please provide a reason for maintenance.");
      return;
    }

    // Clear any errors
    setErrors("");

    // Call parent handler with ride and reason
    onMaintenanceRide(ride, maintenanceReason);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Request for Maintenance</DialogTitle>
        </DialogHeader>

        {errors && (
          <div className="text-red-500 text-sm mt-1 mb-2">{errors}</div>
        )}

        <div className="grid grid-cols-1 gap-3 py-2">
          <div className="space-y-1">
            <div className="mb-2">
              Are you sure you want to request{" "}
              <span className="font-semibold">{ride.name}</span> for a
              maintenance?
            </div>
            <Label htmlFor="maintenance-reason">Reason for Maintenance</Label>
            <Textarea
              id="maintenance-reason"
              placeholder="Please provide a reason for requesting this ride for a maintenance..."
              value={maintenanceReason}
              onChange={(e) => setMaintenanceReason(e.target.value)}
              className="min-h-24"
            />
          </div>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={onClose} className="sm:order-1">
            Cancel
          </Button>
          <Button
            onClick={handleMaintenance}
            className="sm:order-2"
          >
            Request Maintenance
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
