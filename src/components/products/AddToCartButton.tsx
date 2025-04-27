"use client";

import { useState } from "react";
import { Product } from "@/types/product";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useCartStore } from "@/store/cart";
import { ShoppingCart, Check } from "lucide-react";

interface AddToCartButtonProps {
  product: Product;
  selectedOptions: {
    color: string | null;
    printType: string | null;
    material: string | null;
  };
  selections: Record<
    string,
    {
      selected: boolean;
      quantity: number;
    }
  >;
  getSelectedItems: () => Array<{ size: string; quantity: number }>;
}

export function AddToCartButton({
  product,
  selectedOptions,
  selections,
  getSelectedItems,
}: AddToCartButtonProps) {
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [added, setAdded] = useState(false);
  const { toast } = useToast();
  const cart = useCartStore();

  const handleAddToCart = () => {
    // Validate all required selections
    setIsAddingToCart(true);
    try {
      const errors = [];
      const selectedItems = getSelectedItems();

      if (product.colors?.length && !selectedOptions.color) {
        errors.push("Please select a color");
      }
      if (product.printTypes?.length && !selectedOptions.printType) {
        errors.push("Please select a print type");
      }
      if (product.materials?.length && !selectedOptions.material) {
        errors.push("Please select a material");
      }

      if (selectedItems.length === 0) {
        errors.push("Please select at least one size and quantity");
      }

      if (errors.length > 0) {
        toast({
          variant: "destructive",
          title: "Missing selections",
          description: errors.join("\n"),
        });
        return;
      }

      let totalItems = 0;
      let sizeDescriptions: string[] = [];

      // Optimistically update UI
      const newItems = selectedItems.map(({ size, quantity }) => {
        const item = {
          productId: product.id,
          name: product.name,
          price: product.discountPrice || product.basePrice,
          image: product.imageUrls?.[0] || "",
          color: selectedOptions.color || undefined,
          printType: selectedOptions.printType || undefined,
          material: selectedOptions.material || undefined,
          size, // Required for addItem
          sizes: [{ size, quantity }],
          totalQuantity: quantity,
        };
        cart.addItem(item);
        totalItems += quantity;
        sizeDescriptions.push(`${quantity} × ${size}`);
        return item;
      });

      setAdded(true);
      setTimeout(() => setAdded(false), 2000);

      toast({
        title: "Added to cart",
        description: `Added ${totalItems} item${
          totalItems > 1 ? "s" : ""
        } to your cart: ${product.name} ${
          selectedOptions.color ? `(${selectedOptions.color})` : ""
        } - ${sizeDescriptions.join(", ")}`,
        action: (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              newItems.forEach((item) => {
                cart.removeItem(item.productId);
              });
            }}
          >
            Undo
          </Button>
        ),
      });
    } finally {
      setIsAddingToCart(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="text-muted-foreground text-sm">
        <span className="font-medium text-foreground">
          {product.minOrderQuantity > 1
            ? `Minimum order: ${product.minOrderQuantity} items`
            : ""}
        </span>
      </div>
      <Button
        size="lg"
        className="w-full h-14 text-lg font-medium"
        onClick={handleAddToCart}
        disabled={isAddingToCart}
      >
        {isAddingToCart ? (
          <span className="flex items-center justify-center gap-2">
            <span className="animate-spin">↻</span>
            Adding...
          </span>
        ) : added ? (
          <span className="flex items-center justify-center gap-2">
            <Check className="h-5 w-5" />
            Added to Cart
          </span>
        ) : (
          <span className="flex items-center justify-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Add to Cart
          </span>
        )}
      </Button>

      {product.minOrderQuantity > 1 && (
        <p className="text-sm text-muted-foreground text-center">
          This product requires a minimum order of {product.minOrderQuantity}{" "}
          items.
        </p>
      )}
    </div>
  );
}
