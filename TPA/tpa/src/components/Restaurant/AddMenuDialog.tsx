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

type AddMenuDialogProps = {
  restaurantId: string;
  onAddMenu: (menu: Omit<Menu, "menu_id">) => void;
};

export default function AddMenuDialog({
  restaurantId,
  onAddMenu,
}: AddMenuDialogProps) {
  const [open, setOpen] = useState(false);
  const [menuName, setMenuName] = useState("");
  const [menuPrice, setMenuPrice] = useState("");
  const [menuImage, setMenuImage] = useState<Uint8Array | null>(null);
  const [errors, setErrors] = useState<{ name?: string; price?: string, image?: string }>();

  const handleSubmit = () => {
    // Validate form
    const newErrors: { name?: string; price?: string, image?: string } = {};

    if (!menuName.trim()) {
      newErrors.name = "Menu name is required";
    }

    if (!menuPrice.trim()) {
      newErrors.price = "Price is required";
    } else if (isNaN(Number(menuPrice)) || Number(menuPrice) <= 0) {
      newErrors.price = "Price must be a positive number";
    }

    if(!menuImage){
      newErrors.image = "Image is required"
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Create new menu item
    onAddMenu({
      restaurant_id: restaurantId,
      name: menuName,
      price: Number(menuPrice),
      image: menuImage,
    });

    // Reset form and close dialog
    resetForm();
    setOpen(false);
  };

  const resetForm = () => {
    setMenuName("");
    setMenuPrice("");
    setMenuImage(null);
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
          Add Menu Item
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Menu Item</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Menu Name</Label>
            <Input
              id="name"
              value={menuName}
              onChange={(e) => setMenuName(e.target.value)}
              placeholder="Enter menu name"
              className={errors?.name ? "border-red-500" : ""}
            />
            {errors?.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name}</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="price">Price (Rp)</Label>
            <Input
              id="price"
              type="number"
              value={menuPrice}
              onChange={(e) => setMenuPrice(e.target.value)}
              placeholder="Enter price"
              min="0"
              className={errors?.price ? "border-red-500" : ""}
            />
            {errors?.price && (
              <p className="text-red-500 text-xs mt-1">{errors.price}</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label>Menu Image</Label>
            <div className="flex justify-center">
              <ImageUpload
                image={menuImage}
                onImageUpload={(image) => setMenuImage(image)}
              />
            </div>
            {errors?.image && (
              <p className="text-red-500 text-xs mt-1 text-center">{errors.image}</p>
            )}
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
            Add Menu
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
