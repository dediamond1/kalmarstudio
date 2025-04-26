// src/app/dashboard/orders/new/page.tsx

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { OrderForm } from "@/components/dashboard/orders/order-form";
import { createOrder } from "@/lib/api/orders";

export default function NewOrderPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async (formData: any) => {
    setIsSubmitting(true);
    try {
      await createOrder(formData);
      toast.success("Order created successfully");
      router.push("/dashboard/orders");
    } catch (error) {
      console.error("Error creating order:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to create order"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-10">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <Button variant="ghost" size="sm" asChild className="-ml-2 mb-1">
            <Link href="/dashboard/orders" className="flex items-center">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Orders
            </Link>
          </Button>
          <h2 className="text-2xl font-bold tracking-tight">
            Create New Order
          </h2>
          <p className="text-muted-foreground">
            Create a new order for a customer
          </p>
        </div>
      </div>

      <OrderForm
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        onCancel={() => router.push("/dashboard/orders")}
      />
    </div>
  );
}
