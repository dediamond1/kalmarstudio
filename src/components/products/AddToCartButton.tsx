// src/components/products/AddToCartButton.tsx
"use client";

import { useState } from "react";
import { Product } from "@/types/product";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useCartStore } from "@/store/cart";
import { ShoppingCart, Check } from "lucide-react";
import { AlertModal } from "../common/AlertModal";
import { useRouter } from "next/navigation";
import { Routes } from "@/config/Routes";
import { useUserStore } from "@/store/user";
import { saveCart } from "@/lib/api/cart";

interface AddToCartButtonProps {
  product: Product;
  selectedOptions: {
    color: string | null;
    printType: string | null;
    material: string | null;
  };
  getSelectedItems: () => Array<{ size: string; quantity: number }>;
}

export function AddToCartButton({
  product,
  selectedOptions,
  getSelectedItems,
}: AddToCartButtonProps) {
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [added, setAdded] = useState(false);
  const { toast } = useToast();
  const { addItem } = useCartStore();
  const { user } = useUserStore();

  const [showAlert, setShowAlert] = useState(false);
  const router = useRouter();

  const handleAddToCart = async () => {
    console.log("AddToCartButton", user);
    if (!user) {
      setShowAlert(true);
    } else {
      setIsAddingToCart(true);
      try {
        const errors = [];
        const selectedItems = getSelectedItems();

        // Validation
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
          setIsAddingToCart(false);
          return;
        }

        // Create the base cart item
        const cartItemBase = {
          productId: product.id,
          name: product.name,
          price: product.discountPrice || product.basePrice,
          image: product.imageUrls?.[0] || "",
          color: selectedOptions.color || undefined,
          printType: selectedOptions.printType || undefined,
          material: selectedOptions.material || undefined,
        };

        // Add all selected sizes with their quantities
        if (selectedItems.length > 0) {
          // First update local state
          selectedItems.forEach(({ size, quantity }) => {
            addItem({
              ...cartItemBase,
              size,
              quantity,
            });
          });

          // Then explicitly trigger API save with current cart state
          const currentCart = useCartStore.getState().items;
          try {
            await saveCart(user?.email, currentCart);
          } catch (error) {
            console.error("Failed to save cart via API:", error);
          }
        }

        const totalItems = selectedItems.reduce(
          (sum, { quantity }) => sum + quantity,
          0
        );
        const sizeDescriptions = selectedItems.map(
          ({ size, quantity }) => `${quantity} × ${size}`
        );

        setAdded(true);
        setTimeout(() => setAdded(false), 2000);

        toast({
          title: "Added to cart",
          description: `Added ${totalItems} item${
            totalItems > 1 ? "s" : ""
          } to your cart: ${product.name} ${
            selectedOptions.color ? `(${selectedOptions.color})` : ""
          } - ${sizeDescriptions.join(", ")}`,
        });
      } finally {
        setIsAddingToCart(false);
      }
    }
  };

  const onLogin = () => {
    router.push(Routes.LOGIN);
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

      <AlertModal
        open={showAlert}
        onOpenChange={setShowAlert}
        title="🔒 Login Required"
        message="You must be logged in to add items to your cart. Please sign in to continue."
        confirmText="Login"
        onConfirm={onLogin}
      />
    </div>
  );
}
