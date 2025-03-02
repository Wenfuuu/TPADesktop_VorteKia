import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import ImageUpload from "../ImageUpload";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type AddSouvenirDialogProps = {
  storeId: string;
  onAddSouvenir: (souvenir: Omit<Souvenir, "souvenir_id">) => void;
};

export default function AddSouvenirDialog({
  storeId,
  onAddSouvenir,
}: AddSouvenirDialogProps) {
  const [open, setOpen] = useState(false);
  const [souvenirName, setSouvenirName] = useState("");
  const [souvenirDesc, setSouvenirDesc] = useState("");
  const [souvenirPrice, setSouvenirPrice] = useState("");
  const [souvenirImage, setSouvenirImage] = useState<Uint8Array | null>(null);
  const [errors, setErrors] = useState<{
    name?: string;
    price?: string;
    description?: string;
  }>();

  const handleSubmit = () => {
    // Validate form
    const newErrors: {
      name?: string;
      price?: string;
      description?: string;
    } = {};

    if (!souvenirName.trim()) {
      newErrors.name = "Souvenir name is required";
    }

    if (!souvenirDesc.trim()) {
      newErrors.description = "Souvenir description is required";
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

    // Create new souvenir item
    onAddSouvenir({
      store_id: storeId,
      name: souvenirName,
      description: souvenirDesc, // Handle empty description
      price: Number(souvenirPrice),
      image: souvenirImage,
    });

    // Reset form and close dialog
    resetForm();
    setOpen(false);
  };

  const resetForm = () => {
    setSouvenirName("");
    setSouvenirDesc("");
    setSouvenirPrice("");
    setSouvenirImage(null);
    setErrors({});
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen);
        if (!isOpen) resetForm();
      }}
    >
      <DialogTrigger asChild>
        <Button
          className="bg-green-600 hover:bg-green-700 text-white text-sm cursor-pointer"
          size="sm"
        >
          <PlusCircle className="w-4 h-4 mr-1" />
          Add Souvenir
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Souvenir</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Souvenir Name</Label>
            <Input
              id="name"
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
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={souvenirDesc}
              onChange={(e) => setSouvenirDesc(e.target.value)}
              placeholder="Enter souvenir description"
              className={errors?.description ? "border-red-500" : ""}
              rows={3}
            />
            {errors?.description && (
              <p className="text-red-500 text-xs mt-1">{errors.description}</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="price">Price (Rp)</Label>
            <Input
              id="price"
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
            className="bg-green-600 hover:bg-green-700"
          >
            Add Souvenir
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
