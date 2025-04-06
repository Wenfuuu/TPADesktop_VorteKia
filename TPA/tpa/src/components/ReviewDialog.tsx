import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
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
import { useCustomer } from "@/hooks/use-customer";
import { useDeviceId } from "@/hooks/use-device-id";

export default function ReviewDialog() {
  const [review, setReview] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const customer = useCustomer();
  const deviceId = useDeviceId();

  // Validation state
  const [errors, setErrors] = useState({
    review: "",
  });

  const validateForm = () => {
    const newErrors = {
      review: "",
    };
    let isValid = true;

    // Validate review
    if (!review.trim()) {
      newErrors.review = "Review text is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    if(!customer) return;
    if(!deviceId) return;
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    setErrors({ review: "" });

    // Invoke backend
    invoke("submit_review", {
      reviewtext: review,
      customerid: customer.customer_id,
      placeid: deviceId,
    })
      .then((success) => {
        if (success) {
          toast("Review submitted successfully!");
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
    setReview("");
    setErrors({ review: "" });
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Submit Your Review</CardTitle>
        <CardDescription>Share your thoughts and experience</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div>
            <Label
              htmlFor="review"
              className={errors.review ? "text-red-500" : ""}
            >
              Review
            </Label>
            <Textarea
              id="review"
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder="Tell us what you think..."
              className={`mt-1 min-h-32 ${
                errors.review ? "border-red-500 focus-visible:ring-red-500" : ""
              }`}
            />
            {errors.review && (
              <p className="text-red-500 text-xs mt-1">{errors.review}</p>
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
          {isSubmitting ? "Submitting..." : "Submit Review"}
        </Button>
      </CardFooter>
    </Card>
  );
}
