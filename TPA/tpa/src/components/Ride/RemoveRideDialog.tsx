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
  onRemoveRide: (ride: Ride, reason: string) => void;
  onClose: () => void;
  open: boolean;
};

export default function RemoveRideDialog({
  ride,
  onRemoveRide,
  onClose,
  open,
}: Props) {
  if (!ride) return null;

  const [removalReason, setRemovalReason] = useState<string>("");
  const [errors, setErrors] = useState<string>("");

  const handleRemove = () => {
    // Validate that a reason is provided
    if (!removalReason.trim()) {
      setErrors("Please provide a reason for removal.");
      return;
    }

    // Clear any errors
    setErrors("");

    // Call parent handler with ride and reason
    onRemoveRide(ride, removalReason);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Propose Ride Removal</DialogTitle>
        </DialogHeader>

        {errors && (
          <div className="text-red-500 text-sm mt-1 mb-2">{errors}</div>
        )}

        <div className="grid grid-cols-1 gap-3 py-2">
          <div className="space-y-1">
            <div className="mb-2">
              Are you sure you want to propose a removal for{" "}
              <span className="font-semibold">{ride.name}</span>? This action
              cannot be undone.
            </div>
            <Label htmlFor="removal-reason">Reason for Removal</Label>
            <Textarea
              id="removal-reason"
              placeholder="Please provide a reason for removing this ride..."
              value={removalReason}
              onChange={(e) => setRemovalReason(e.target.value)}
              className="min-h-24"
            />
          </div>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={onClose} className="sm:order-1">
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleRemove}
            className="sm:order-2"
          >
            Propose Removal
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
