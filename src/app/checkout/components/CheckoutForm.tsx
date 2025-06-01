"use client";

import { useState } from "react";

interface CheckoutFormProps {
  onPayment: () => boolean;
}
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { CheckoutSuccessModal } from "./CheckoutSuccessModal";
import { useCheckout } from "../context";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

export default function CheckoutForm({ onPayment }: CheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const { state, dispatch } = useCheckout();
  const { toast } = useToast();

  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!stripe || !elements || !onPayment()) {
      return;
    }
    try {
      dispatch({ type: "SET_LOADING", payload: true });

      // Mock successful payment
      await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulate processing delay
      setShowSuccess(true);
    } catch (error) {
      toast({
        title: "Payment Error",
        description: error instanceof Error ? error.message : "Payment failed",
        variant: "destructive",
      });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4">
        <CardElement
          options={{
            style: {
              base: {
                fontSize: "16px",
                color: "#424770",
                "::placeholder": {
                  color: "#aab7c4",
                },
              },
              invalid: {
                color: "#9e2146",
              },
            },
          }}
        />

        <Button
          type="submit"
          disabled={!stripe || state.isLoading}
          className="w-full"
        >
          {state.isLoading ? "Processing..." : "Pay Now"}
        </Button>
      </form>

      <CheckoutSuccessModal
        open={showSuccess}
        onOpenChange={setShowSuccess}
        orderId={`DEMO-${Math.floor(Math.random() * 10000)}`}
      />
    </>
  );
}
