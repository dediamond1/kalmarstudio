"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { CheckCircle2, Truck } from "lucide-react";
import Link from "next/link";

interface CheckoutSuccessModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orderId: string;
}

export function CheckoutSuccessModal({
  open,
  onOpenChange,
  orderId,
}: CheckoutSuccessModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex flex-col items-center gap-4">
            <div className="bg-green-100 p-3 rounded-full">
              <CheckCircle2 className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-center">Order Confirmed!</h2>
            <p className="text-muted-foreground text-center">
              Your order #{orderId} has been placed successfully.
            </p>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 p-2 rounded-full">
                <Truck className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium">Shipping Details</h3>
                <p className="text-sm text-muted-foreground">
                  Your order will be shipped within 1-2 business days
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <Button asChild className="w-full">
              <Link href={`/orders/${orderId}`}>View Order Details</Link>
            </Button>
            <Button variant="outline" asChild className="w-full">
              <Link href="/products">Continue Shopping</Link>
            </Button>
          </div>

          <div className="text-center text-sm text-muted-foreground">
            <p>We&#39;ve sent a confirmation email with your order details.</p>
            <p>Thank you for shopping with us!</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
