"use client";

import { Button } from "@/components/ui/button";
import { useCartStore, type CartItem } from "@/store/cart";
import Link from "next/link";
import Image from "next/image";
import { useToast } from "@/components/ui/use-toast";
import { QuantityInput } from "@/components/products/quantity-input";

export default function CartPage() {
  const { toast } = useToast();
  const {
    items,
    removeItem,
    updateSizeQuantity,
    removeSize,
    clearCart,
    totalItems,
  } = useCartStore();

  const subtotal = items.reduce(
    (sum: number, item: CartItem) =>
      sum +
      item.price *
        item.sizes.reduce((sizeSum, size) => sizeSum + size.quantity, 0),
    0
  );

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
              <div
                key={`${item.productId}-${item.color}`}
                className="border rounded-lg p-4 space-y-4"
              >
                <div className="flex gap-6">
                  <div className="w-32 h-32 relative bg-muted rounded-lg">
                    {item.image && (
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover rounded-lg"
                      />
                    )}
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex justify-between">
                      <h3 className="font-bold text-lg">{item.name}</h3>
                      <p className="font-medium">${item.price.toFixed(2)}</p>
                    </div>

                    {item.color && (
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">Color:</span>
                        <div
                          className="w-5 h-5 rounded-full border"
                          style={{ backgroundColor: item.color }}
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  {item.sizes.map((size) => (
                    <div
                      key={size.size}
                      className="flex items-center gap-4 p-3 bg-muted/20 rounded-lg"
                    >
                      <div className="flex-1">
                        <p className="font-medium">Size: {size.size}</p>
                        <div className="flex items-center gap-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              updateSizeQuantity(
                                item.productId,
                                size.size,
                                Math.max(1, size.quantity - 1)
                              )
                            }
                          >
                            -
                          </Button>
                          <span className="w-8 text-center">
                            {size.quantity}
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              updateSizeQuantity(
                                item.productId,
                                size.size,
                                size.quantity + 1
                              )
                            }
                          >
                            +
                          </Button>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          removeSize(item.productId, size.size);
                          toast({
                            title: "Size removed",
                            description: `Removed size ${size.size} from ${item.name}`,
                            action: (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  updateSizeQuantity(
                                    item.productId,
                                    size.size,
                                    size.quantity
                                  );
                                }}
                              >
                                Undo
                              </Button>
                            ),
                          });
                        }}
                        className="text-destructive hover:text-destructive"
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
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
