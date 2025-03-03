import { useEffect, useState } from "react";
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

export default function ProposeRideDialog() {
  const [rideName, setRideName] = useState("");
  const [description, setDescription] = useState("");
  const [prototypeDesign, setPrototypeDesign] = useState<Uint8Array | null>(
    null
  );
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

    // Validate ride name
    if (!rideName.trim()) {
      newErrors.name = "Ride name is required";
      isValid = false;
    }

    // Validate description
    if (!description.trim()) {
      newErrors.description = "Description is required";
      isValid = false;
    }

    // Validate prototype design (image)
    if (!prototypeDesign) {
      newErrors.image = "Prototype design image is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    if (!validateForm()) {
    //   setErrors((prev) => ({
    //     ...prev,
    //     form: "Please fix the errors before submitting",
    //   }));
      return;
    }

    setErrors({});

    // invoke backend
    invoke("propose_new_ride", {
      staffid: staff?.staff_id,
      ridename: rideName,
      desc: description,
      newimagedata: prototypeDesign,
    }).then((success) => {
        if (success) {
          toast("New ride has been proposed!");
          resetForm();
        }
    }).catch((e) => {
        console.log(e);
        toast("Failed to propose a new ride!");
    });
  };

  const resetForm = () => {
    setRideName("");
    setDescription("");
    setPrototypeDesign(null);
    setErrors({});
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Propose New Ride</CardTitle>
        <CardDescription>Submit your idea for a new attraction</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div>
            <Label
              htmlFor="ride-name"
              className={errors.name ? "text-red-500" : ""}
            >
              Ride Name
            </Label>
            <Input
              id="ride-name"
              value={rideName}
              onChange={(e) => setRideName(e.target.value)}
              placeholder="Enter ride name"
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
              placeholder="Describe your ride idea"
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
              Prototype Design
            </Label>
            <div
              className={`mt-2 border-2 border-dashed rounded-md p-4 flex flex-col items-center ${
                errors.image ? "border-red-500" : "border-slate-200"
              }`}
            >
              <ImageUpload
                image={prototypeDesign}
                onImageUpload={(image) => setPrototypeDesign(image)}
              />
              <p className="text-xs text-slate-500 mt-2 text-center">
                Upload concept art or design for your ride
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
