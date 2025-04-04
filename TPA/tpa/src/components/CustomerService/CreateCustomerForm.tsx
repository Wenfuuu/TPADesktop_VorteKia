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
import { toast } from "sonner";
import { invoke } from "@tauri-apps/api/core";

export default function CreateCustomerForm() {
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validation state
  const [errors, setErrors] = useState({
    name: "",
  });

  const validateForm = () => {
    const newErrors = {
      name: "",
    };
    let isValid = true;

    // Validate name
    if (!name.trim()) {
      newErrors.name = "Customer name is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    if (!validateForm()) return;

    setIsSubmitting(true);
    setErrors({ name: "" });

    // Invoke backend
    invoke("create_customer", {
      customername: name,
    })
      .then((success) => {
        if (success) {
          toast("Customer account created successfully!");
          resetForm();
        }
      })
      .catch((e) => {
        toast(e);
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  const resetForm = () => {
    setName("");
    setErrors({ name: "" });
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Create New Customer</CardTitle>
        <CardDescription>Add a new customer to the system</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name" className={errors.name ? "text-red-500" : ""}>
              Name
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter customer name"
              className={`mt-1 ${
                errors.name ? "border-red-500 focus-visible:ring-red-500" : ""
              }`}
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name}</p>
            )}
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={resetForm}>
          Cancel
        </Button>
        <Button
          type="submit"
          onClick={handleFormSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Creating..." : "Create Customer"}
        </Button>
      </CardFooter>
    </Card>
  );
}
