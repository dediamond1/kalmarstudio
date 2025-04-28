// src/app/cart/CartItem.tsx
"use client";

import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import Image from "next/image";
import { CartItem } from "@/store/cart";

export default function CartItemComponent({
  item,
  onRemove,
  onUpdateQuantity,
  onRemoveSize,
}: {
  item: CartItem;
  onRemove: (item: CartItem) => void;
  onUpdateQuantity: (productId: string, size: string, quantity: number) => void;
  onRemoveSize: (productId: string, size: string) => void;
}) {
  const { toast } = useToast();

  return (
    <div className="border rounded-lg p-4 space-y-4">
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

          {item.printType && (
            <div className="text-sm text-muted-foreground">
              Print Type: {item.printType}
            </div>
          )}

          {item.material && (
            <div className="text-sm text-muted-foreground">
              Material: {item.material}
            </div>
          )}
        </div>
      </div>

      <div className="space-y-3">
        <h4 className="font-medium">Selected Sizes:</h4>
        {item.sizes.map((size, index) => (
          <div
            key={`${item.productId}-${size.size}`}
            className="flex items-center gap-4 p-3 bg-muted/20 rounded-lg"
          >
            <div className="flex-1">
              <p className="font-medium">Size: {size.size}</p>
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    onUpdateQuantity(
                      item.productId,
                      size.size,
                      Math.max(1, size.quantity - 1)
                    )
                  }
                >
                  -
                </Button>
                <span className="w-8 text-center">{size.quantity}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    onUpdateQuantity(
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
                onRemoveSize(item.productId, size.size);
                toast({
                  title: "Size removed",
                  description: `Removed size ${size.size} from ${item.name}`,
                  action: (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        onUpdateQuantity(
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

      <div className="pt-3 border-t mt-3">
        <Button
          variant="ghost"
          className="text-destructive hover:text-destructive w-full"
          onClick={() => onRemove(item)}
        >
          Remove Item
        </Button>
      </div>
    </div>
  );
}
