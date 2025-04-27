"use client";

import { Button } from "@/components/ui/button";
import { useCartStore, type CartItem } from "@/store/cart";
import Link from "next/link";
import Image from "next/image";
import { useToast } from "@/components/ui/use-toast";
import { QuantityInput } from "@/components/products/quantity-input";
import CartItemComponent from "./CartItem";
import { useMemo } from "react";

export default function CartPage() {
  const { toast } = useToast();
  const items = useCartStore(state => state.items);
  const removeItem = useCartStore(state => state.removeItem);
  const updateSizeQuantity = useCartStore(state => state.updateSizeQuantity);
  const removeSize = useCartStore(state => state.removeSize);
  const totalItems = useCartStore(state => state.totalItems);

  const subtotal = useMemo(() => items.reduce(
    (sum: number, item: CartItem) =>
      sum +
      item.price *
      item.sizes.reduce((sizeSum, size) => sizeSum + size.quantity, 0),
    0
  ), [items]);

  const handleRemoveItem = (item: CartItem) => {
    removeItem(item.productId);
    toast({
      title: "Removed from cart",
      description: `${item.name} was removed from your cart`,
      action: (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            // Re-add the item with original sizes
            item.sizes.forEach((size) => {
              updateSizeQuantity(item.productId, size.size, size.quantity);
            });
          }}
        >
          Undo
        </Button>
      ),
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Your Cart ({totalItems()})</h1>

      {items.length === 0 ? (
        <div className="text-center py-12 space-y-4">
          <p className="text-lg">Your cart is empty</p>
          <Button asChild>
            <Link href="/products">Continue Shopping</Link>
          </Button>
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {items.map((item: CartItem) => (
              <CartItemComponent
                key={`${item.productId}-${item.color}`}
                item={item}
                onRemove={handleRemoveItem}
                onUpdateQuantity={updateSizeQuantity}
                onRemoveSize={removeSize}
              />
            ))}
          </div>

          <div className="border rounded-lg p-6 h-fit sticky top-4">
            <h2 className="text-xl font-bold mb-6">Order Summary</h2>
            <div className="space-y-4 mb-6">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>Calculated at checkout</span>
              </div>
              <div className="flex justify-between font-bold text-lg pt-4 border-t">
                <span>Total</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
            </div>
            <Button className="w-full" size="lg" asChild>
              <Link href="/checkout">Proceed to Checkout</Link>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
