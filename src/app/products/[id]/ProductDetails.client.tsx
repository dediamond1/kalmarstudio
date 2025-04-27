"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Heart, Share2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useProductSelection } from "@/hooks/use-product-selection";
import { QuantityInput } from "@/components/products/quantity-input";
import { Product } from "@/types/product";
import { useCartStore } from "@/store/cart";

interface ProductDetailsProps {
  product: Product;
}

export function ProductDetails({ product }: ProductDetailsProps) {
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const { toast } = useToast();
  const { selections, toggleSelection, updateQuantity, getSelectedItems } =
    useProductSelection(product?.availableSizes || []);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold">Product not found</h2>
          <p className="text-muted-foreground mt-2">
            The product you're looking for doesn't exist or may have been
            removed
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="aspect-square relative rounded-lg overflow-hidden bg-muted/50">
            {product.imageUrls?.[0] ? (
              <Image
                src={product.imageUrls[0]}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-muted-foreground">
                  No image available
                </span>
              </div>
            )}
          </div>
          <div className="grid grid-cols-4 gap-2">
            {product.imageUrls?.slice(1).map((image: string, index: number) => (
              <div
                key={index}
                className="aspect-square relative rounded-md overflow-hidden"
              >
                <Image
                  src={image}
                  alt={`${product.name} - ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Product Details */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold tracking-tight">
              {product.name}
            </h1>
            <div className="flex items-center gap-1">
              <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
              <span className="font-medium">4.8</span>
              <span className="text-muted-foreground text-sm">
                (24 reviews)
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {product.discountPrice ? (
              <>
                <span className="text-3xl font-bold">
                  ${product.discountPrice.toFixed(2)}
                </span>
                <span className="text-lg text-muted-foreground line-through">
                  ${product.basePrice.toFixed(2)}
                </span>
                <Badge variant="destructive" className="font-semibold">
                  {Math.round(
                    ((product.basePrice - product.discountPrice) /
                      product.basePrice) *
                      100
                  )}
                  % OFF
                </Badge>
              </>
            ) : (
              <span className="text-3xl font-bold">
                ${product.basePrice.toFixed(2)}
              </span>
            )}
            {product.isNew && (
              <Badge variant="secondary" className="font-semibold">
                NEW
              </Badge>
            )}
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="font-medium">Description</h3>
              <p className="text-muted-foreground">{product.description}</p>
            </div>

            {product.colors?.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-medium">Color</h3>
                <div className="flex flex-wrap gap-3">
                  {product.colors.map((color: string) => (
                    <button
                      key={color}
                      className={`w-10 h-10 rounded-full border-2 transition-all cursor-pointer ${
                        selectedColor === color
                          ? "border-primary"
                          : "border-transparent hover:border-primary"
                      }`}
                      style={{ backgroundColor: color }}
                      aria-label={color}
                      title={color}
                      onClick={() => setSelectedColor(color)}
                    />
                  ))}
                </div>
              </div>
            )}

            {product.availableSizes?.length > 0 && (
              <div className="space-y-4">
                <h3 className="font-medium">Size & Quantity</h3>
                <div className="space-y-3">
                  {product.availableSizes.map((size: string) => (
                    <div
                      key={size}
                      className={`flex items-center justify-between p-2 rounded-lg transition-all ${
                        selections[size]?.selected
                          ? "bg-primary/10 border border-primary"
                          : "hover:bg-accent/50 border border-transparent"
                      }`}
                    >
                      <div
                        className="flex-1 cursor-pointer p-2"
                        onClick={() => toggleSelection(size)}
                      >
                        <span className="font-medium">{size}</span>
                        {selections[size]?.selected && (
                          <span className="ml-2 text-sm text-muted-foreground">
                            (Selected)
                          </span>
                        )}
                      </div>
                      <QuantityInput
                        value={selections[size].quantity}
                        onChange={(qty) => updateQuantity(size, qty)}
                        selected={selections[size]?.selected}
                        disabled={!selections[size]?.selected}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-6 space-y-4 border-t">
              <Button
                size="lg"
                className="w-full h-14 text-lg"
                onClick={() => {
                  // Validate all required selections
                  setIsAddingToCart(true);
                  try {
                    const errors = [];
                    const selectedItems = getSelectedItems();

                    if (product.colors?.length && !selectedColor) {
                      errors.push("Please select a color");
                    }

                    if (selectedItems.length === 0) {
                      errors.push(
                        "Please select at least one size and quantity"
                      );
                    }

                    if (errors.length > 0) {
                      toast({
                        variant: "destructive",
                        title: "Missing selections",
                        description: errors.join("\n"),
                      });
                      return;
                    }

                    const cart = useCartStore.getState();
                    let totalItems = 0;
                    let sizeDescriptions: string[] = [];

                    // Optimistically update UI
                    const newItems = selectedItems.map(({ size, quantity }) => {
                      const item = {
                        productId: product.id,
                        name: product.name,
                        price: product.discountPrice || product.basePrice,
                        image: product.imageUrls?.[0] || "",
                        color: selectedColor || undefined,
                        sizes: [{ size, quantity }],
                      };
                      cart.addItem(item);
                      totalItems += quantity;
                      sizeDescriptions.push(`${quantity} × ${size}`);
                      return item;
                    });

                    toast({
                      title: "Added to cart",
                      description: `Added ${totalItems} item${totalItems > 1 ? "s" : ""} to your cart: ${product.name} (${selectedColor || "No color"}) - ${sizeDescriptions.join(", ")}`,
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
                }}
              >
                {isAddingToCart ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="animate-spin">↻</span>
                    Adding...
                  </span>
                ) : (
                  `Add to Cart - $${product.discountPrice?.toFixed(2) || product.basePrice.toFixed(2)}`
                )}
              </Button>
              <div className="flex gap-4">
                <Button variant="outline" size="lg" className="flex-1">
                  <Heart className="w-5 h-5 mr-2" />
                  Save
                </Button>
                <Button variant="outline" size="lg" className="flex-1">
                  <Share2 className="w-5 h-5 mr-2" />
                  Share
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
