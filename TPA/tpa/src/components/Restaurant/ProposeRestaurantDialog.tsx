import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import ImageUpload from "../ImageUpload";
import { invoke } from "@tauri-apps/api/core";
import { toast } from "sonner";
import { useStaff } from "@/hooks/use-staff";

export default function ProposeRestaurantDialog() {
  const [restaurantName, setRestaurantName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<Uint8Array | null>(null);
  const staff = useStaff();

  // Validation state
  const [errors, setErrors] = useState<{
    name?: string;
    description?: string;
    image?: string;
  }>({});

  const validateForm = () => {
    const newErrors: {
      name?: string;
      description?: string;
      image?: string;
    } = {};
    let isValid = true;

    // Validate restaurant name
    if (!restaurantName.trim()) {
      newErrors.name = "Restaurant name is required";
      isValid = false;
    }

    // Validate description
    if (!description.trim()) {
      newErrors.description = "Description is required";
      isValid = false;
    }

    // Validate image
    if (!image) {
      newErrors.image = "Restaurant image is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    if (!validateForm()) return;

    setErrors({});

    // Invoke backend
    invoke("propose_new_restaurant", {
      staffid: staff?.staff_id,
      restaurantname: restaurantName,
      desc: description,
      newimagedata: image,
    })
      .then((success) => {
        if (success) {
          toast("New restaurant has been proposed!");
          resetForm();
        }
      })
      .catch((e) => {
        console.log(e);
        toast("Failed to propose a new restaurant!");
      });
  };

  const resetForm = () => {
    setRestaurantName("");
    setDescription("");
    setImage(null);
    setErrors({});
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Propose New Restaurant</CardTitle>
        <CardDescription>Submit your idea for a new restaurant</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div>
            <Label
              htmlFor="restaurant-name"
              className={errors.name ? "text-red-500" : ""}
            >
              Restaurant Name
            </Label>
            <Input
              id="restaurant-name"
              value={restaurantName}
              onChange={(e) => setRestaurantName(e.target.value)}
              placeholder="Enter restaurant name"
              className={`mt-1 ${
                errors.name ? "border-red-500 focus-visible:ring-red-500" : ""
              }`}
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name}</p>
            )}
          </div>

          <div>
            <Label
              htmlFor="description"
              className={errors.description ? "text-red-500" : ""}
            >
              Description
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your restaurant idea"
              className={`mt-1 h-24 ${
                errors.description
                  ? "border-red-500 focus-visible:ring-red-500"
                  : ""
              }`}
            />
            {errors.description && (
              <p className="text-red-500 text-xs mt-1">{errors.description}</p>
            )}
          </div>

          <div>
            <Label className={errors.image ? "text-red-500" : ""}>
              Restaurant Image
            </Label>
            <div
              className={`mt-2 border-2 border-dashed rounded-md p-4 flex flex-col items-center ${
                errors.image ? "border-red-500" : "border-slate-200"
              }`}
            >
              <ImageUpload
                image={image}
                onImageUpload={(img) => setImage(img)}
              />
              <p className="text-xs text-slate-500 mt-2 text-center">
                Upload an image or concept for your restaurant
              </p>
            </div>
            {errors.image && (
              <p className="text-red-500 text-xs mt-1">{errors.image}</p>
            )}
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={resetForm}>
          Cancel
        </Button>
        <Button type="submit" onClick={handleFormSubmit}>
          Submit Proposal
        </Button>
      </CardFooter>
    </Card>
  );
}
