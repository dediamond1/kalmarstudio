"use client";

import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js/pure";
import { useCartStore } from "@/store/cart";
import CheckoutForm from "./components/CheckoutForm";
import { useState, useEffect } from "react";
import { AddAddressModal } from "./components/AddAddressModal";
import { CheckoutProvider } from "./context";
import { createPaymentIntent } from "@/lib/api/payments";
import { useToast } from "@/components/ui/toast";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

export function CheckoutContent() {
  const [clientSecret, setClientSecret] = useState("");
  const { items } = useCartStore();
  const { toast } = useToast();
  const total = items.reduce(
    (sum, item) =>
      sum +
      item.sizes.reduce(
        (itemSum, size) => itemSum + item.price * size.quantity,
        0
      ),
    0
  );
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [selectedAddressIndex, setSelectedAddressIndex] = useState(0);
  const [selectedShippingMethod, setSelectedShippingMethod] =
    useState("standard");
  const [addresses, setAddresses] = useState([
    {
      fullName: "Sunny Singh",
      email: "sunny@example.com",
      contactNo: "+1 555-123-4567",
      street: "123 Main St, Apt 4B",
      city: "New York",
      state: "NY",
      zipCode: "10001",
      country: "United States",
    },
    {
      fullName: "John Doe",
      email: "john@example.com",
      contactNo: "+1 555-123-4567",
      street: "123 Main St, Apt 4B",
      city: "New York",
      state: "NY",
      zipCode: "10001",
      country: "United States",
    },
  ]);

  const handleSaveAddress = (newAddress: {
    fullName: string;
    email: string;
    contactNo: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  }) => {
    setAddresses([...addresses, newAddress]);
  };

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
  }, [items, total]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Address & Shipping */}
        <div className="lg:col-span-2 space-y-6">
          <section className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>
            <div className="space-y-4">
              {addresses.map((address, index) => (
                <div
                  key={index}
                  className={`border rounded-lg p-4 mb-4 cursor-pointer transition-all
                    ${
                      selectedAddressIndex === index
                        ? "border-[var(--primary-color)] bg-[var(--primary-color)]/5 shadow-md"
                        : "hover:border-primary/50 hover:bg-gray-50"
                    }`}
                  onClick={() => setSelectedAddressIndex(index)}
                >
                  <div className="flex justify-between items-start">
                    <h3 className="font-medium">Shipping Address</h3>
                    {selectedAddressIndex === index && (
                      <span className="text-primary font-medium">
                        ✓ Selected
                      </span>
                    )}
                  </div>
                  {address.fullName && (
                    <p className="text-muted-foreground">{address.fullName}</p>
                  )}
                  <p className="text-muted-foreground">{address.street}</p>
                  <p className="text-muted-foreground">
                    {address.city}, {address.state} {address.zipCode}
                  </p>
                  <p className="text-muted-foreground">{address.country}</p>
                  {address.email && (
                    <p className="text-muted-foreground">{address.email}</p>
                  )}
                  {address.contactNo && (
                    <p className="text-muted-foreground">{address.contactNo}</p>
                  )}
                </div>
              ))}
              <button
                className="mt-2 text-sm text-primary cursor-pointer"
                onClick={() => setIsAddressModalOpen(true)}
              >
                + Add New Address
              </button>
              <AddAddressModal
                open={isAddressModalOpen}
                onOpenChange={setIsAddressModalOpen}
                onSave={handleSaveAddress}
              />
            </div>
          </section>

          <section className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Shipping Method</h2>
            <div className="space-y-3">
              <div
                className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-all ${
                  selectedShippingMethod === "standard"
                    ? "border-primary bg-primary/5 shadow-md"
                    : "hover:border-primary/50 hover:bg-gray-50"
                }`}
                onClick={() => setSelectedShippingMethod("standard")}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium">Standard Shipping</h3>
                    {selectedShippingMethod === "standard" && (
                      <span className="text-primary">✓</span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    3-5 business days
                  </p>
                </div>
                <span className="font-medium">$5.99</span>
              </div>
              <div
                className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-all ${
                  selectedShippingMethod === "express"
                    ? "border-primary bg-primary/5 shadow-md"
                    : "hover:border-primary/50 hover:bg-gray-50"
                }`}
                onClick={() => setSelectedShippingMethod("express")}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium">Express Shipping</h3>
                    {selectedShippingMethod === "express" && (
                      <span className="text-primary">✓</span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    1-2 business days
                  </p>
                </div>
                <span className="font-medium">$12.99</span>
              </div>
            </div>
          </section>
        </div>

        {/* Right Column - Order Summary & Payment */}
        <div className="space-y-6">
          <section className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>
                  ${selectedShippingMethod === "standard" ? "5.99" : "12.99"}
                </span>
              </div>
              <div className="border-t pt-4 flex justify-between font-semibold">
                <span>Total</span>
                <span>
                  $
                  {(
                    total +
                    (selectedShippingMethod === "standard" ? 5.99 : 12.99)
                  ).toFixed(2)}
                </span>
              </div>
            </div>
          </section>

          {clientSecret ? (
            <Elements stripe={stripePromise} options={{ clientSecret }}>
              <CheckoutForm />
            </Elements>
          ) : (
            <div className="flex justify-center items-center h-32">
              <p className="text-gray-500">Loading payment information...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <CheckoutProvider>
      <CheckoutContent />
    </CheckoutProvider>
  );
}
