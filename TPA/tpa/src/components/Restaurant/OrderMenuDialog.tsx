import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

type Props = {
  menu: Menu;
  onOrder: (menuId: string, quantity: number, totalPrice: number) => void;
};

export default function OrderMenuDialog({ menu, onOrder }: Props) {
  const [open, setOpen] = useState(false);
  const [quantity, setQuantity] = useState("1");
  const [errors, setErrors] = useState<{ quantity?: string }>();

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuantity(e.target.value);
  };

  const resetForm = () => {
    setQuantity("1");
    setErrors({});
  };

  const handleSubmit = () => {
    const newErrors: { quantity?: string } = {};

    if (!quantity.trim()) {
      newErrors.quantity = "Quantity is required";
    } else if (isNaN(Number(quantity)) || Number(quantity) <= 0) {
      newErrors.quantity = "Quantity must be a positive number";
    } else if (!Number.isInteger(Number(quantity))) {
      newErrors.quantity = "Quantity must be a whole number";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onOrder(menu.menu_id, parseInt(quantity), totalPrice);

    resetForm();
    setOpen(false);
  };

  // Calculate total price
  const totalPrice = Number(quantity) > 0 ? Number(quantity) * menu.price : 0;

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        className="ml-2 bg-blue-600 hover:bg-blue-700 text-white"
        size="sm"
      >
        Order
      </Button>

      <Dialog
        open={open}
        onOpenChange={(isOpen) => {
          setOpen(isOpen);
          if (!isOpen) resetForm();
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Order {menu.name}</DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="flex items-center gap-4">
              {menu.image && (
                <div className="w-20 h-20 rounded-lg overflow-hidden border border-gray-200">
                  <img
                    src={URL.createObjectURL(
                      new Blob([new Uint8Array(menu.image)], {
                        type: "image/png",
                      })
                    )}
                    alt={menu.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div>
                <h3 className="font-medium">{menu.name}</h3>
                <p className="text-sm text-gray-600">
                  Rp{menu.price.toLocaleString()}
                </p>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="quantity">Quantity</Label>
              <div className="flex items-center">
                <Input
                  id="quantity"
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={handleQuantityChange}
                  className={`h-10 rounded-none text-center w-full ${
                    errors?.quantity ? "border-red-500" : ""
                  }`}
                />
              </div>
              {errors?.quantity && (
                <p className="text-red-500 text-xs mt-1">{errors.quantity}</p>
              )}
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <span>Price per item:</span>
                <span>Rp{menu.price.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center font-medium mt-2">
                <span>Total:</span>
                <span>Rp{totalPrice.toLocaleString()}</span>
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
              Place Order
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
