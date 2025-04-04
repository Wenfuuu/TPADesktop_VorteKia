import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { invoke } from "@tauri-apps/api/core";
import { toast } from "sonner";

export default function BroadcastDialog() {
  const [broadcastType, setBroadcastType] = useState<"staff" | "customer">(
    "staff"
  );
  const [message, setMessage] = useState("");
  const [customerId, setCustomerId] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [customers, setCustomers] = useState<Customer[]>([]);

  useEffect(() => {
    const fetchCustomers = async () => {
      const customerData: Customer[] = await invoke("get_all_customers");
      console.log(customerData);
      setCustomers(customerData);
    };

    fetchCustomers();
  }, []);

  const validateForm = () => {
    setError(null);
    // Check if message is provided
    if (!message.trim()) {
      setError("Message is required");
      return false;
    }

    // If customer broadcast is selected, check if customer ID is provided
    if (broadcastType === "customer" && !customerId) {
      setError("Please select a customer");
      return false;
    }

    return true;
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (broadcastType === "staff") {
        invoke("broadcast_to_staff", {msg: message})
        .then((success) => {
            if (success) {
                toast("Broadcast sent successfully!");
                resetForm();
            }
        })
        .catch((e) => {
            toast(e);
        });
    } else {
        invoke("broadcast_to_customer", {
            msg: message,
            customerid: customerId
        }).then((success) => {
            if (success) {
                toast("Broadcast sent successfully!");
                resetForm();
            }
        })
        .catch((e) => {
            toast(e);
        });
    }
  };

  const resetForm = () => {
    setMessage("");
    setCustomerId("");
    setError(null);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Send Broadcast</CardTitle>
        <CardDescription>Send messages to staff or customers</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div>
            <Label htmlFor="broadcast-type">Broadcast Type</Label>
            <Select
              value={broadcastType}
              onValueChange={(value: "staff" | "customer") => {
                setBroadcastType(value);
                setCustomerId(""); // Reset customer ID when changing broadcast type
              }}
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select broadcast type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="staff">Staff Broadcast</SelectItem>
                <SelectItem value="customer">Customer Broadcast</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {broadcastType === "customer" && (
            <div>
              <Label
                htmlFor="customer-select"
                className={
                  error && error.includes("customer") ? "text-red-500" : ""
                }
              >
                Select Customer
              </Label>
              <Select value={customerId} onValueChange={setCustomerId}>
                <SelectTrigger
                  className={`mt-1 ${
                    error && error.includes("customer")
                      ? "border-red-500 focus-visible:ring-red-500"
                      : ""
                  }`}
                >
                  <SelectValue placeholder="Select a customer" />
                </SelectTrigger>
                <SelectContent>
                  {customers.map((customer) => (
                    <SelectItem
                      key={customer.customer_id}
                      value={customer.customer_id}
                    >
                      {customer.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div>
            <Label
              htmlFor="broadcast-message"
              className={
                error && error.includes("Message") ? "text-red-500" : ""
              }
            >
              Message
            </Label>
            <Textarea
              id="broadcast-message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Enter your broadcast message"
              rows={4}
              className={`mt-1 ${
                error && error.includes("Message")
                  ? "border-red-500 focus-visible:ring-red-500"
                  : ""
              }`}
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={resetForm}>
          Reset
        </Button>
        <Button type="submit" onClick={handleFormSubmit}>
          Send Broadcast
        </Button>
      </CardFooter>
    </Card>
  );
}
