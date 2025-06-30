"use client";

import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/format-price";
import Image from "next/image";
import { CartItem, CartItemSize } from "@/store/cart";
import { Trash2 } from "lucide-react";
import { images } from "@/constants/images";

export default function CartItemComponent({
  item,
  onUpdateQuantity,
  onRemoveSize,
  index,
}: {
  item: CartItem;
  onUpdateQuantity: (productId: string, size: string, quantity: number) => void;
  onRemoveSize: (productId: string, size: string) => void;
  index: number;
}) {
  return (
    <div key={index} className="border-b pb-4">
      <div className="flex gap-4">
        <div className="w-24 h-24 relative bg-gray-100 rounded-md border">
          <Image
            src={item.image ? item?.image : images.placeholderImage}
            alt={item.name}
            fill
            className="object-cover rounded-md"
          />
        </div>
        <div className="flex-1">
          <div className="flex flex-row items-center justify-between">
            <div>
              <h3 className="font-medium">{item.name}</h3>
              {item.color && (
                <p className="text-sm text-muted-foreground">
                  Color: {item.color}
                </p>
              )}
              {item.material && (
                <p className="text-sm text-muted-foreground">
                  Material: {item.material}
                </p>
              )}
              {item.printType && (
                <p className="text-sm text-muted-foreground">
                  Print Type: {item.printType}
                </p>
              )}
            </div>

            <div className="flex flex-col items-end gap-1 bg-muted/5 p-2 rounded-lg">
              <p className="text-sm text-muted-foreground">
                {formatPrice(item.price)} each
              </p>
              <p className="text-sm text-muted-foreground">
                {item.sizes.reduce((sum, size) => sum + size.quantity, 0)}{" "}
                pieces
              </p>
              <p className="text-lg font-semibold text-primary">
                Total:{" "}
                {formatPrice(
                  item.sizes.reduce(
                    (sum, size) => sum + item.price * size.quantity,
                    0
                  )
                )}
              </p>
            </div>
          </div>
          <div className="mt-2 space-y-2">
            <p className="text-sm font-medium">Selected Sizes:</p>
            {item.sizes.map((size: CartItemSize, sizeIndex: number) => (
              <div
                key={sizeIndex}
                className="flex items-center gap-4 mt-2 bg-muted/10 hover:bg-muted/20 p-3 rounded-lg transition-colors"
              >
                <div className="space-y-1">
                  <span>Size: {size.size}</span>
                </div>
                <div className="flex items-center gap-2 ml-auto">
                  <Button
                    variant="outline"
                    size="sm"
                    className="hover:bg-primary hover:text-primary-foreground transition-colors"
                    onClick={() => {
                      onUpdateQuantity(
                        item.productId,
                        size.size,
                        Math.max(1, size.quantity - 1)
                      );
                    }}
                  >
                    -
                  </Button>
                  <span>{size.quantity}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    className="hover:bg-primary hover:text-primary-foreground transition-colors"
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
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onRemoveSize(item.productId, size.size)}
                  className="text-red-500 hover:bg-red-500/10 hover:text-red-700 transition-colors"
                >
                  <Trash2 size={18} />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
