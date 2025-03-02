import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import ImageUpload from "../ImageUpload";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

type EditSouvenirDialogProps = {
  souvenir: Souvenir;
  onUpdateSouvenir: (
    souvenirId: string,
    updatedSouvenir: Partial<Souvenir>
  ) => void;
};

export default function EditSouvenirDialog({
  souvenir,
  onUpdateSouvenir,
}: EditSouvenirDialogProps) {
  const [open, setOpen] = useState(false);
  const [souvenirName, setSouvenirName] = useState("");
  const [souvenirPrice, setSouvenirPrice] = useState("");
  const [souvenirImage, setSouvenirImage] = useState<Uint8Array | null>(null);
  const [errors, setErrors] = useState<{ name?: string; price?: string }>();

  // Set initial values when souvenir changes or dialog opens
  useEffect(() => {
    if (open && souvenir) {
      setSouvenirName(souvenir.name);
      setSouvenirPrice(souvenir.price.toString());
      setSouvenirImage(souvenir.image);
    }
  }, [souvenir, open]);

  const handleSubmit = () => {
    // Validate form
    const newErrors: { name?: string; price?: string } = {};

    if (!souvenirName.trim()) {
      newErrors.name = "Souvenir name is required";
    }

    if (!souvenirPrice.trim()) {
      newErrors.price = "Price is required";
    } else if (isNaN(Number(souvenirPrice)) || Number(souvenirPrice) <= 0) {
      newErrors.price = "Price must be a positive number";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Update souvenir item
    onUpdateSouvenir(souvenir.souvenir_id, {
      name: souvenirName,
      price: Number(souvenirPrice),
      image: souvenirImage,
      store_id: souvenir.store_id,
    });

    // Close dialog
    setOpen(false);
  };

  const resetForm = () => {
    setSouvenirName(souvenir.name);
    setSouvenirPrice(souvenir.price.toString());
    setSouvenirImage(souvenir.image);
    setErrors({});
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen);
        if (isOpen) {
          resetForm();
        }
      }}
    >
      <Button
        onClick={() => setOpen(true)}
        variant="outline"
        size="sm"
        className="ml-2 h-8 w-8 p-0 cursor-pointer"
      >
        <Edit className="h-4 w-4" />
        <span className="sr-only">Edit souvenir</span>
      </Button>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Souvenir Item</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="edit-name">Souvenir Name</Label>
            <Input
              id="edit-name"
              value={souvenirName}
              onChange={(e) => setSouvenirName(e.target.value)}
              placeholder="Enter souvenir name"
              className={errors?.name ? "border-red-500" : ""}
            />
            {errors?.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name}</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="edit-price">Price (Rp)</Label>
            <Input
              id="edit-price"
              type="number"
              value={souvenirPrice}
              onChange={(e) => setSouvenirPrice(e.target.value)}
              placeholder="Enter price"
              min="0"
              className={errors?.price ? "border-red-500" : ""}
            />
            {errors?.price && (
              <p className="text-red-500 text-xs mt-1">{errors.price}</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label>Souvenir Image</Label>
            <div className="flex justify-center">
              <ImageUpload
                image={souvenirImage}
                onImageUpload={(image) => setSouvenirImage(image)}
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => {
              resetForm();
              setOpen(false);
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
