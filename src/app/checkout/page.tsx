"use client";

import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js/pure";
import { useCartStore } from "@/store/cart";
import CheckoutForm from "./components/CheckoutForm";
import { useState, useEffect } from "react";
import { AddAddressModal } from "./components/AddAddressModal";
import { AlertModal } from "@/components/common/AlertModal";
import { CheckoutProvider } from "./context";
import { createPaymentIntent } from "@/lib/api/payments";
import { useToast } from "@/components/ui/toast";
import { useUserStore } from "@/store/user";
import { Trash2 } from "lucide-react";

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
  interface Address {
    _id?: string;
    fullName: string;
    email: string;
    contactNo: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  }

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    async function loadAddresses() {
      try {
        const userEmail = useUserStore.getState().user?.email;
        if (userEmail) {
          const response = await fetch(
            `/api/addresses?email=${encodeURIComponent(userEmail)}`
          );
          if (response.ok) {
            const { addresses: fetchedAddresses = [] } = await response.json();
            if (!Array.isArray(fetchedAddresses)) {
              throw new Error("Invalid addresses data format");
            }
            setAddresses(fetchedAddresses);
          }
        }
      } catch (error) {
        console.error("Failed to load addresses:", error);
        toast({
          title: "Address Error",
          description:
            error instanceof Error ? error.message : "Failed to load addresses",
          variant: "destructive",
        });
      }
    }
    loadAddresses();
  }, []);

  const handleDeleteAddress = async (index: number) => {
    try {
      const addressToDelete = addresses[index];
      console.log("Deleting address:", addressToDelete);
      const response = await fetch("/api/addresses", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ _id: addressToDelete._id }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to delete address");
      }

      setAddresses(addresses.filter((_, i) => i !== index));
      if (selectedAddressIndex === index) {
        setSelectedAddressIndex(0);
      }
    } catch (error) {
      console.error("Error deleting address:", error);
      toast({
        title: "Address Error",
        description:
          error instanceof Error ? error.message : "Failed to delete address",
        variant: "destructive",
      });
    }
  };

  const handleSaveAddress = async (newAddress: Address) => {
    try {
      const response = await fetch("/api/addresses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newAddress),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to save address");
      }
      setAddresses([...addresses, data.address]);
    } catch (error) {
      console.error("Error saving address:", error);
      toast({
        title: "Address Error",
        description:
          error instanceof Error ? error.message : "Failed to save address",
        variant: "destructive",
      });
    }
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

  const handlePayment = () => {
    if (addresses.length < 1 || selectedAddressIndex === undefined) {
      setShowAlert(true);
      return false;
    }
    return true;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <AlertModal
        open={showAlert}
        onOpenChange={setShowAlert}
        title="Address Required"
        message="Please add and select a shipping address before proceeding with payment."
        confirmText="OK"
        onConfirm={() => {}}
      />
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
                    <div className="flex gap-2">
                      {selectedAddressIndex === index && (
                        <span className="text-primary font-medium">
                          ✓ Selected
                        </span>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteAddress(index);
                        }}
                        className="text-red-500 hover:text-red-700 p-1"
                        title="Delete address"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
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
              {addresses?.length < 3 && (
                <button
                  className="mt-2 text-sm text-primary cursor-pointer"
                  onClick={() => setIsAddressModalOpen(true)}
                >
                  + Add New Address
                </button>
              )}
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
              <CheckoutForm onPayment={handlePayment} />
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
