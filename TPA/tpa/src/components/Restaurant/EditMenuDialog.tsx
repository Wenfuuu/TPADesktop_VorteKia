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
import { useStaff } from "@/hooks/use-staff";

type EditMenuDialogProps = {
  menu: Menu;
  onUpdateMenu: (menuId: string, updatedMenu: Partial<Menu>) => void;
};

export default function EditMenuDialog({
  menu,
  onUpdateMenu,
}: EditMenuDialogProps) {
  const [open, setOpen] = useState(false);
  const [menuName, setMenuName] = useState("");
  const [menuPrice, setMenuPrice] = useState("");
  const [menuImage, setMenuImage] = useState<Uint8Array | null>(null);
  const [errors, setErrors] = useState<{ name?: string; price?: string, image?: string }>();
  const staff = useStaff();

  // Set initial values when menu changes or dialog opens
  useEffect(() => {
    if (open && menu) {
      setMenuName(menu.name);
      setMenuPrice(menu.price.toString());
      setMenuImage(menu.image);
    }
  }, [menu, open]);

  const handleSubmit = () => {
    // Validate form
    const newErrors: { name?: string; price?: string; image?: string } = {};

    if (!menuName.trim()) {
      newErrors.name = "Menu name is required";
    }

    if (!menuPrice.trim()) {
      newErrors.price = "Price is required";
    } else if (isNaN(Number(menuPrice)) || Number(menuPrice) <= 0) {
      newErrors.price = "Price must be a positive number";
    }

    if(!menuImage){
      newErrors.image = "Image can't be empty"
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Update menu item
    onUpdateMenu(menu.menu_id, {
      name: menuName,
      price: Number(menuPrice),
      image: menuImage,
    });

    // Close dialog
    setOpen(false);
  };

  const resetForm = () => {
    setMenuName(menu.name);
    setMenuPrice(menu.price.toString());
    setMenuImage(menu.image);
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
      {staff?.role === "f&b supervisor" && (
        <Button
          onClick={() => setOpen(true)}
          variant="outline"
          size="sm"
          className="ml-2 h-8 w-8 p-0 cursor-pointer"
        >
          <Edit className="h-4 w-4" />
          <span className="sr-only">Edit menu</span>
        </Button>
      )}

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Menu Item</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="edit-name">Menu Name</Label>
            <Input
              id="edit-name"
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
            <Label htmlFor="edit-price">Price (Rp)</Label>
            <Input
              id="edit-price"
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
            <div className="text-red-500 text-xs mt-1 text-center">
              {errors?.image}
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