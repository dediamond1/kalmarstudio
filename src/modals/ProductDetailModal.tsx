"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Product } from "@/types/product";

interface ProductDetailModalProps {
  product: Product | null;
  onOpenChange: (open: boolean) => void;
  onAddToCart?: (product: Product) => void;
}

export function ProductDetailModal({
  product,
  onOpenChange,
  onAddToCart,
}: ProductDetailModalProps) {
  return (
    <Dialog open={!!product} onOpenChange={onOpenChange}>
      <DialogContent className="w-[80vw] h-[80%]">
        {product && (
          <>
            <DialogHeader>
              <DialogTitle>{product.name}</DialogTitle>
            </DialogHeader>

            <div className="gap-8 overflow-y-auto">
              {/* Product Images */}
              <div className="">
                <div className="aspect-square bg-muted rounded-lg overflow-hidden relative">
                  {product.imageUrls?.[0] ? (
                    <Image
                      src={product.imageUrls[0]}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                      No Image
                    </div>
                  )}
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {product.imageUrls?.slice(1).map((url, i) => (
                    <div
                      key={i}
                      className="aspect-square bg-muted rounded overflow-hidden relative"
                    >
                      <Image
                        src={url}
                        alt={`${product.name} ${i + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Product Details */}
              <div className="space-y-6">
                <div className="flex items-center justify-between mt-4">
                  <div className="text-2xl font-bold">
                    ${product.basePrice.toFixed(2)}
                    {product.discountPrice && (
                      <span className="ml-2 text-sm text-muted-foreground line-through">
                        ${product.discountPrice.toFixed(2)}
                      </span>
                    )}
                  </div>
                  <Badge variant={product.isActive ? "default" : "outline"}>
                    {product.isActive ? "Active" : "In-Active"}
                  </Badge>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium">Description</h3>
                    <p className="text-muted-foreground">
                      {product.description}
                    </p>
                  </div>

                  {product.availableSizes?.length > 0 && (
                    <div>
                      <h3 className="font-medium">Sizes</h3>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {product.availableSizes.map((size) => (
                          <Button key={size} variant="outline" size="sm">
                            {size}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}

                  {product.colors?.length > 0 && (
                    <div>
                      <h3 className="font-medium">Colors</h3>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {product.colors.map((color) => (
                          <Button key={color} variant="outline" size="sm">
                            {color}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {onAddToCart && (
                  <Button
                    size="lg"
                    className="w-full"
                    onClick={() => onAddToCart(product)}
                  >
                    Add to Cart
                  </Button>
                )}
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
