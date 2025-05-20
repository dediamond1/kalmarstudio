"use client";

import { Button } from "@/components/ui/button";
import type { CartItem, CartItemSize } from "@/store/cart";
import { Trash2 } from "lucide-react";
import { useCartStore } from "@/store/cart";
import Image from "next/image";
import Link from "next/link";
import Container from "@/components/ui/Container";
import CartItemComponent from "./CartItem";

export default function CartReview() {
  const { items, updateSizeQuantity, removeSize } = useCartStore();

  const subtotal = items.reduce<number>(
    (sum: number, item: CartItem) =>
      sum +
      item.price *
        item.sizes.reduce(
          (sizeSum: number, size: CartItemSize) => sizeSum + size.quantity,
          0
        ),
    0
  );

  return (
    <Container className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div className="md:col-span-2">
        <h2 className="text-xl font-semibold mb-4">Your Cart</h2>
        {items.length === 0 ? (
          <p>Your cart is empty</p>
        ) : (
          <div className="space-y-4">
            {items.map((item: CartItem, index: number) => (
              <CartItemComponent
                key={index}
                index={index}
                item={item}
                onUpdateQuantity={updateSizeQuantity}
                onRemoveSize={removeSize}
              />
            ))}
          </div>
        )}
      </div>

      <div className="border rounded-lg p-6 h-fit">
        <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
        <div className="space-y-4">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Shipping</span>
            <span>Calculated at next step</span>
          </div>
          <div className="border-t pt-4 flex justify-between font-semibold">
            <span>Estimated Total</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
        </div>
        <Link
          href="/checkout"
          className="w-full mt-6 flex items-center justify-center bg-gray-800 text-white p-2 rounded-2xl"
        >
          Proceed to Checkout
        </Link>
      </div>
    </Container>
  );
}
