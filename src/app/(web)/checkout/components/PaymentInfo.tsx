"use client";

import { useCheckout } from "../context";
import { Button } from "@/components/ui/button";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { useState } from "react";
import { PaymentMethod } from "../types";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY!);

function StripePaymentForm() {
  const stripe = useStripe();
  const elements = useElements();
  const { dispatch } = useCheckout();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: elements.getElement(CardElement)!,
    });

    if (!error && paymentMethod) {
      dispatch({
        type: "SET_PAYMENT_METHOD",
        payload: {
          id: paymentMethod.id,
          name: "Credit Card",
          icon: paymentMethod.card?.brand,
        } as PaymentMethod,
      });
      dispatch({ type: "SET_STEP", payload: "review" });
    }
    setLoading(false);
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
      <Button type="submit" className="w-full" disabled={!stripe || loading}>
        {loading ? "Processing..." : "Review Order"}
      </Button>
    </form>
  );
}

export default function PaymentInfo() {
  const { state } = useCheckout();

  if (!state.paymentIntent) {
    return <div className="space-y-4">Loading payment information...</div>;
  }

  return (
    <div className="space-y-4">
      <Elements
        stripe={stripePromise}
        options={{ clientSecret: state.paymentIntent }}
      >
        <StripePaymentForm />
      </Elements>
    </div>
  );
}
