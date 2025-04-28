"use client";

import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js/pure";
import { useCartStore } from "@/store/cart";
import CheckoutForm from "./components/CheckoutForm";
import { useEffect, useState } from "react";
import { createPaymentIntent } from "@/lib/api/payments";
import { useToast } from "@/components/ui/use-toast";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

export default function CheckoutPage() {
  const [clientSecret, setClientSecret] = useState("");
  const { items, total } = useCartStore();
  const { toast } = useToast();

  useEffect(() => {
    async function setupPayment() {
      try {
        if (items.length === 0) {
          throw new Error("Your cart is empty");
        }

        const { clientSecret } = await createPaymentIntent({
          amount: Math.round(total * 100),
          currency: "usd",
        });
        setClientSecret(clientSecret);
      } catch (error) {
        toast({
          title: "Payment Error",
          description:
            error instanceof Error
              ? error.message
              : "Failed to initialize payment",
          variant: "destructive",
        });
      }
    }

    setupPayment();
  }, [items, total, toast]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">Checkout</h1>

      {clientSecret ? (
        <Elements stripe={stripePromise} options={{ clientSecret }}>
          <CheckoutForm />
        </Elements>
      ) : (
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-500">Loading payment information...</p>
        </div>
      )}
    </div>
  );
}
