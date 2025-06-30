"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CheckCircle } from "lucide-react";

export default function CheckoutSuccess() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12 text-center">
      <div className="bg-green-50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
        <CheckCircle className="w-10 h-10 text-green-600" />
      </div>

      <h1 className="text-3xl font-bold mb-4">Order Confirmed!</h1>
      <p className="text-lg text-gray-600 mb-8">
        Thank you for your purchase. Your order has been received and is being
        processed.
      </p>

      <div className="flex justify-center gap-4">
        <Button asChild>
          <Link href="/orders">View Orders</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/">Continue Shopping</Link>
        </Button>
      </div>
    </div>
  );
}
