// src/app/dashboard/orders/[id]/page.tsx

"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { toast } from "sonner";
import { ArrowLeft, Edit, Printer, Trash } from "lucide-react";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { getOrder, deleteOrder } from "@/lib/api/orders";
import { Order } from "@/types/order";
import { OrderPaymentDetails } from "@/components/dashboard/orders/order-payment-details";
import { OrderItemsTable } from "@/components/dashboard/orders/order-items-table";
import { OrderStatusBadge } from "@/components/dashboard/orders/order-status-badge";
import { OrderCustomerDetails } from "@/components/dashboard/orders/order-customer-details";

export default function OrderDetailPage() {
  const params = useParams();
  const orderId = params.id as string;
  const router = useRouter();

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

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

    if (orderId) {
      fetchOrderData();
    }
  }, [orderId, router]);

  const handleDelete = async () => {
    try {
      await deleteOrder(orderId);
      toast.success("Order deleted successfully");
      router.push("/dashboard/orders");
    } catch (error) {
      console.error("Error deleting order:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to delete order"
      );
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
      {/* Order Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <Button variant="ghost" size="sm" asChild className="-ml-2 mb-1">
            <Link href="/dashboard/orders" className="flex items-center">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Orders
            </Link>
          </Button>
          <h2 className="text-2xl font-bold tracking-tight">
            Order #{order.id.substring(0, 8)}
          </h2>
          <div className="flex items-center gap-2">
            <OrderStatusBadge status={order.status} />
            <Badge variant="outline">
              Created {format(new Date(order.createdAt), "MMM d, yyyy")}
            </Badge>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setDeleteConfirmOpen(true)}
          >
            <Trash className="h-4 w-4 mr-1" />
            Delete
          </Button>
          <Button variant="outline" size="sm">
            <Printer className="h-4 w-4 mr-1" />
            Print
          </Button>
          <Button asChild size="sm">
            <Link href={`/dashboard/orders/${order.id}/edit`}>
              <Edit className="h-4 w-4 mr-1" />
              Edit
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Customer Information */}
        <OrderCustomerDetails customer={order.customer} />

        {/* Order Status & Dates */}
        <Card>
          <CardHeader>
            <CardTitle>Order Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <div>
                <h3 className="text-sm font-medium">Status</h3>
                <OrderStatusBadge status={order.status} className="mt-1" />
              </div>
              <div className="text-right">
                <h3 className="text-sm font-medium">Due Date</h3>
                <p className="text-sm mt-1">
                  {format(new Date(order.dueDate), "MMMM d, yyyy")}
                </p>
              </div>
            </div>

            {order.design && (
              <>
                <Separator />
                <div>
                  <h3 className="text-sm font-medium">Design Details</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {order.design.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {order.design.placement && (
                      <Badge variant="outline">
                        Placement: {order.design.placement}
                      </Badge>
                    )}
                    {order.design.colors && order.design.colors.length > 0 && (
                      <Badge variant="outline">
                        Colors: {order.design.colors.join(", ")}
                      </Badge>
                    )}
                  </div>
                </div>
              </>
            )}

            {order.notes && (
              <>
                <Separator />
                <div>
                  <h3 className="text-sm font-medium">Order Notes</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {order.notes}
                  </p>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Order Items */}
      <OrderItemsTable items={order.items} />

      {/* Payment Details */}
      <OrderPaymentDetails payment={order.payment} />

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this order? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteConfirmOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
