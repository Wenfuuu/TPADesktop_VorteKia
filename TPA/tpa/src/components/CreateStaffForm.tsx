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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { invoke } from "@tauri-apps/api/core";

export default function CreateStaffForm() {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validation state
  const [errors, setErrors] = useState<{
    name?: string;
    password?: string;
    confirmPassword?: string;
    role?: string;
  }>({});

  const validateForm = () => {
    const newErrors: {
      name?: string;
      password?: string;
      confirmPassword?: string;
      role?: string;
    } = {};
    let isValid = true;

    // Validate name
    if (!name.trim()) {
      newErrors.name = "Staff name is required";
      isValid = false;
    }

    // Validate password
    if (!password) {
      newErrors.password = "Password is required";
      isValid = false;
    }

    // Validate password confirmation
    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords don't match";
      isValid = false;
    }

    // Validate role
    if (!role) {
      newErrors.role = "Please select a role";
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
    setErrors({});

    // Invoke backend
    invoke("register_staff", {
      staffname: name,
      pass: password,
      staffrole: role,
    })
      .then((success) => {
        if (success) {
          toast("Staff account created successfully!");
          resetForm();
        }
      })
      .catch((e) => {
        console.log(e);
        toast("Failed to create staff account!");
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  const resetForm = () => {
    setName("");
    setPassword("");
    setConfirmPassword("");
    setRole("");
    setErrors({});
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Create New Staff Account</CardTitle>
        <CardDescription>Add a new staff member to the system</CardDescription>
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
              placeholder="Enter staff name"
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
              htmlFor="password"
              className={errors.password ? "text-red-500" : ""}
            >
              Password
            </Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className={`mt-1 ${
                errors.password
                  ? "border-red-500 focus-visible:ring-red-500"
                  : ""
              }`}
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password}</p>
            )}
          </div>

          <div>
            <Label
              htmlFor="confirm-password"
              className={errors.confirmPassword ? "text-red-500" : ""}
            >
              Confirm Password
            </Label>
            <Input
              id="confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm password"
              className={`mt-1 ${
                errors.confirmPassword
                  ? "border-red-500 focus-visible:ring-red-500"
                  : ""
              }`}
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-xs mt-1">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="role" className={errors.role ? "text-red-500" : ""}>
              Role
            </Label>
            <Select onValueChange={setRole} value={role}>
              <SelectTrigger
                id="role"
                className={`mt-1 ${
                  errors.role ? "border-red-500 focus-visible:ring-red-500" : ""
                }`}
              >
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="customer_service">Customer Service</SelectItem>
                <SelectItem value="lost and found staff">Lost and Found Staff</SelectItem>
                <SelectItem value="ride manager">Ride Manager</SelectItem>
                <SelectItem value="ride staff">Ride Staff</SelectItem>
                <SelectItem value="f&b supervisor">F&B Supervisor</SelectItem>
                <SelectItem value="chef">Chef</SelectItem>
                <SelectItem value="waiter">Waiter</SelectItem>
                <SelectItem value="maintenance manager">Maintenance Manager</SelectItem>
                <SelectItem value="maintenance staff">Maintenance Staff</SelectItem>
                <SelectItem value="retail manager">Retail Manager</SelectItem>
                <SelectItem value="sales associate">Sales Associate</SelectItem>
              </SelectContent>
            </Select>
            {errors.role && (
              <p className="text-red-500 text-xs mt-1">{errors.role}</p>
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
          {isSubmitting ? "Creating..." : "Create Staff"}
        </Button>
      </CardFooter>
    </Card>
  );
}
