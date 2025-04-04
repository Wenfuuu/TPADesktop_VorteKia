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
import { invoke } from "@tauri-apps/api/core";
import { toast } from "sonner";
import { useCustomer } from "@/hooks/use-customer";

export default function TopupDialog() {
  const [amount, setAmount] = useState("");
  const [error, setError] = useState<string | null>(null);
  const customer = useCustomer();

  const validateForm = () => {
    setError(null);
    // Check if amount is provided
    if (!amount.trim()) {
      setError("Amount is required");
      return false;
    }
    // Check if amount is a valid number
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      setError("Please enter a valid positive amount");
      return false;
    }

    return true;
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    invoke("topup_balance", {
        customerid: customer?.customer_id,
        amount: parseInt(amount),
    }).then((success) => {
        if (success) {
          toast("Topup successful!");
          resetForm();
        }
    }).catch((e) => {
        toast(e)
    });
  };

  const resetForm = () => {
    setAmount("");
    setError(null);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Top Up Balance</CardTitle>
        <CardDescription>Add funds to your account</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div>
            <Label
              htmlFor="topup-amount"
              className={error ? "text-red-500" : ""}
            >
              Amount
            </Label>
            <Input
              id="topup-amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              type="number"
              min="0"
              className={`mt-1 ${
                error ? "border-red-500 focus-visible:ring-red-500" : ""
              }`}
            />
            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={resetForm}>
          Reset
        </Button>
        <Button type="submit" onClick={handleFormSubmit}>
          Confirm Topup
        </Button>
      </CardFooter>
    </Card>
  );
}
