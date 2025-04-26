// src/app/dashboard/orders/[id]/edit/page.tsx

"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { OrderForm } from "@/components/dashboard/orders/order-form";
import { getOrder, updateOrder } from "@/lib/api/orders";
import { Order } from "@/types/order";

export default function EditOrderPage() {
  const params = useParams();
  const orderId = params.id as string;
  const router = useRouter();

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchOrderData = async () => {
      try {
        setLoading(true);
        const data = await getOrder(orderId);
        setOrder(data);
      } catch (error) {
        console.error("Error fetching order:", error);
        toast.error(
          error instanceof Error
            ? error.message
            : "Failed to load order details"
        );
        router.push("/dashboard/orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrderData();
  }, [orderId, router]);

  const handleSubmit = async (formData: any) => {
    setIsSubmitting(true);
    try {
      await updateOrder(orderId, formData);
      toast.success("Order updated successfully");
      router.push(`/dashboard/orders/${orderId}`);
    } catch (error) {
      console.error("Error updating order:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to update order"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-center">
          <p>Loading order details...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-center">
          <p>Order not found</p>
          <Button variant="outline" className="mt-4" asChild>
            <Link href="/dashboard/orders">Back to Orders</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-10">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <Button variant="ghost" size="sm" asChild className="-ml-2 mb-1">
            <Link
              href={`/dashboard/orders/${orderId}`}
              className="flex items-center"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Order
            </Link>
          </Button>
          <h2 className="text-2xl font-bold tracking-tight">
            Edit Order #{orderId.substring(0, 8)}
          </h2>
          <p className="text-muted-foreground">
            Update the details of this order
          </p>
        </div>
      </div>

      <OrderForm
        initialData={order}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        onCancel={() => router.push(`/dashboard/orders/${orderId}`)}
        isEditing={true}
      />
    </div>
  );
}
