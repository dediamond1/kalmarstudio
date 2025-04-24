"use client";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Order, OrderItem } from "../../types/order";

interface OrderDetailsProps {
  order: Order | null;
  open: boolean;
  onClose: () => void;
}

export function OrderDetails({ order, open, onClose }: OrderDetailsProps) {
  if (!order) return null;

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Order #{order.id}</SheetTitle>
          <div className="flex items-center gap-2">
            <Badge
              variant={
                order.status === "Completed"
                  ? "secondary"
                  : order.status === "Processing"
                  ? "default"
                  : "outline"
              }
            >
              {order.status}
            </Badge>
            <span className="text-sm text-muted-foreground">
              Due: {order.dueDate}
            </span>
          </div>
        </SheetHeader>

        <div className="grid gap-6 py-6">
          <div className="grid gap-2">
            <h3 className="font-medium">Customer</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Name</p>
                <p>{order.customer.name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Contact</p>
                <p>{order.customer.email}</p>
                <p>{order.customer.phone}</p>
              </div>
            </div>
          </div>

          <div className="grid gap-2">
            <h3 className="font-medium">Order Items</h3>
            <div className="border rounded-lg divide-y">
              {order.items.map((item: OrderItem, i: number) => (
                <div key={i} className="p-4 grid grid-cols-3">
                  <div>
                    <p className="font-medium">{item.product}</p>
                    <p className="text-sm text-muted-foreground">{item.size}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Quantity</p>
                    <p>{item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Price</p>
                    <p>${item.price.toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-2">
            <h3 className="font-medium">Design Details</h3>
            <p className="text-sm">{order.design.description}</p>
            {order.design.mockupUrl && (
              <div className="mt-2 border rounded-lg p-4">
                <img
                  src={order.design.mockupUrl}
                  alt="Design mockup"
                  className="w-full h-auto rounded"
                />
              </div>
            )}
          </div>

          <div className="grid gap-2">
            <h3 className="font-medium">Payment</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <Badge
                  variant={
                    order.payment.status === "Paid"
                      ? "secondary"
                      : order.payment.status === "Pending"
                      ? "default"
                      : "destructive"
                  }
                >
                  {order.payment.status}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total</p>
                <p>${order.payment.total.toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
