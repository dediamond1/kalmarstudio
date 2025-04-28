"use client";

import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { useCheckout } from "../context";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

export default function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const { state, dispatch } = useCheckout();
  const { toast } = useToast();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    try {
      dispatch({ type: "SET_LOADING", payload: true });

      const { error, paymentIntent } = await stripe.confirmCardPayment(
        state.clientSecret!,
        {
          payment_method: {
            card: elements.getElement(CardElement)!,
          },
        }
      );

      if (error) {
        throw error;
      }

      if (paymentIntent.status === "succeeded") {
        dispatch({ type: "SET_STEP", payload: "confirmation" });
      }
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
  );
}
