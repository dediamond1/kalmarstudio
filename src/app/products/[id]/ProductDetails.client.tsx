"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Product } from "@/types/product";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ImageGallery } from "@/components/products/ImageGallery";
import { ProductOptions } from "@/components/products/ProductOptions";
import { AddToCartButton } from "@/components/products/AddToCartButton";
import { useProductSelection } from "@/hooks/use-product-selection";
import {
  Truck,
  ShieldCheck,
  RotateCcw,
  Star,
  StarHalf,
  Package,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SquarePen } from "lucide-react";

interface ProductDetailsProps {
  product: Product;
}

export function ProductDetails({ product }: ProductDetailsProps) {
  const router = useRouter();

  const [selectedOptions, setSelectedOptions] = useState({
    color: product.colors?.[0] || null,
    printType: product.printTypes?.[0] || null,
    material: product.materials?.[0] || null,
  });

  const { selections, toggleSelection, updateQuantity, getSelectedItems } =
    useProductSelection(product?.availableSizes || []);

  const handleOptionChange = (
    optionType: "color" | "printType" | "material",
    value: string
  ) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [optionType]: value,
    }));
  };

  return (
    <div className="bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-8">
          <a
            href="/products"
            className="hover:text-foreground transition-colors"
          >
            Products
          </a>
          <span>/</span>
          <a
            href={`/products?category=${product.category.id}`}
            className="hover:text-foreground transition-colors"
          >
            {product.category.name}
          </a>
          <span>/</span>
          <span className="text-foreground">{product?.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <ImageGallery
            images={product?.imageUrls}
            productName={product?.name}
          />

          {/* Product Details */}
          <div className="flex flex-col space-y-8">
            <div>
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-3xl font-bold tracking-tight">
                    {product.name}
                  </h1>
                  <div className="flex items-center mt-2 gap-4">
                    <div className="flex items-center">
                      <div className="flex">
                        {[1, 2, 3, 4].map((i) => (
                          <Star
                            key={i}
                            className="h-4 w-4 fill-yellow-400 text-yellow-400"
                          />
                        ))}
                        <StarHalf className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      </div>
                      <span className="ml-2 text-sm text-muted-foreground">
                        (24 reviews)
                      </span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      SKU: {product.id.substring(0, 8).toUpperCase()}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {product.isNew && (
                    <Badge className="font-semibold bg-blue-500">NEW</Badge>
                  )}
                  {product.discountPrice && (
                    <Badge className="font-semibold bg-red-500">SALE</Badge>
                  )}
                </div>
              </div>

              <div className="mt-4">
                {product.discountPrice ? (
                  <div className="flex items-center gap-2">
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
                  </div>
                ) : (
                  <span className="text-3xl font-bold">
                    ${product.basePrice.toFixed(2)}
                  </span>
                )}
              </div>
            </div>

            <Separator />

            <div>
              <p className="text-base text-muted-foreground leading-relaxed">
                {product.description}
              </p>
            </div>

            <Separator />

            {/* Product Options */}
            <ProductOptions
              product={product}
              selectedOptions={selectedOptions}
              onOptionChange={handleOptionChange}
              selections={selections}
              toggleSelection={toggleSelection}
              updateQuantity={updateQuantity}
            />

            <Separator />

            {/* Add to Cart Button */}
            <div className="flex flex-row items-center gap-4">
              <Button
                size="lg"
                className="flex-1 h-14 text-lg font-medium"
                onClick={() => {
                  router.push("/products/customize");
                }}
              >
                <SquarePen className="h-5 w-5" />
                Customize Image
              </Button>
              <AddToCartButton
                product={product}
                selectedOptions={selectedOptions}
                selections={selections}
                getSelectedItems={getSelectedItems}
              />
            </div>

            {/* Product Benefits */}
            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="flex items-center gap-2">
                <Truck className="h-5 w-5 text-primary" />
                <span className="text-sm">Free shipping over $100</span>
              </div>
              <div className="flex items-center gap-2">
                <RotateCcw className="h-5 w-5 text-primary" />
                <span className="text-sm">30-day returns</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-primary" />
                <span className="text-sm">Quality guarantee</span>
              </div>
              <div className="flex items-center gap-2">
                <Package className="h-5 w-5 text-primary" />
                <span className="text-sm">Secure packaging</span>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-16">
          <Tabs defaultValue="details">
            <TabsList className="w-full border-b bg-transparent p-0 justify-start gap-8">
              <TabsTrigger
                value="details"
                className="border-b-2 border-transparent data-[state=active]:border-primary rounded-none py-3 px-1 data-[state=active]:text-primary"
              >
                Product Details
              </TabsTrigger>
              <TabsTrigger
                value="materials"
                className="border-b-2 border-transparent data-[state=active]:border-primary rounded-none py-3 px-1 data-[state=active]:text-primary"
              >
                Materials
              </TabsTrigger>
              <TabsTrigger
                value="sizing"
                className="border-b-2 border-transparent data-[state=active]:border-primary rounded-none py-3 px-1 data-[state=active]:text-primary"
              >
                Sizing Guide
              </TabsTrigger>
              <TabsTrigger
                value="reviews"
                className="border-b-2 border-transparent data-[state=active]:border-primary rounded-none py-3 px-1 data-[state=active]:text-primary"
              >
                Customer Reviews
              </TabsTrigger>
            </TabsList>
            <TabsContent value="details" className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-medium mb-3">
                    Product Description
                  </h3>
                  <p className="text-muted-foreground">{product.description}</p>

                  <h3 className="text-lg font-medium mt-6 mb-3">Features</h3>
                  <ul className="list-disc pl-5 text-muted-foreground">
                    <li>Premium quality materials</li>
                    <li>Professionally printed with care</li>
                    <li>Long-lasting and durable</li>
                    <li>Perfect for all occasions</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-3">Specifications</h3>
                  <div className="space-y-2">
                    <div className="grid grid-cols-2 border-b pb-2">
                      <span className="font-medium">Print Types</span>
                      <span className="text-muted-foreground">
                        {product.printTypes.join(", ")}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 border-b pb-2">
                      <span className="font-medium">Available Sizes</span>
                      <span className="text-muted-foreground">
                        {product.availableSizes.join(", ")}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 border-b pb-2">
                      <span className="font-medium">Available Colors</span>
                      <span className="text-muted-foreground">
                        {product.colors.join(", ")}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 border-b pb-2">
                      <span className="font-medium">Materials</span>
                      <span className="text-muted-foreground">
                        {product.materials.join(", ")}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 border-b pb-2">
                      <span className="font-medium">Minimum Order</span>
                      <span className="text-muted-foreground">
                        {product.minOrderQuantity} units
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="materials" className="pt-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Materials Information</h3>
                <p className="text-muted-foreground">
                  Our products are made with the finest materials to ensure
                  quality and durability. We carefully select each material to
                  provide the best printing surface and comfort.
                </p>

                <div className="mt-6 space-y-6">
                  {product.materials.map((material) => (
                    <div key={material} className="space-y-2">
                      <h4 className="font-medium">{material}</h4>
                      <p className="text-muted-foreground">
                        Information about {material} properties, care
                        instructions, and benefits.
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
            <TabsContent value="sizing" className="pt-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Sizing Guide</h3>
                <p className="text-muted-foreground mb-6">
                  Use this guide to find the right size for your needs. If
                  you're between sizes, we recommend sizing up for a more
                  comfortable fit.
                </p>

                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-muted">
                        <th className="border p-2 text-left">Size</th>
                        <th className="border p-2 text-left">Width (cm)</th>
                        <th className="border p-2 text-left">Height (cm)</th>
                        <th className="border p-2 text-left">
                          Recommended For
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {product.availableSizes.map((size) => (
                        <tr key={size} className="border-b">
                          <td className="border p-2 font-medium">{size}</td>
                          <td className="border p-2">Example width</td>
                          <td className="border p-2">Example height</td>
                          <td className="border p-2">Recommendation</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="reviews" className="pt-6">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Customer Reviews</h3>
                  <button className="text-primary hover:underline">
                    Write a Review
                  </button>
                </div>

                <div className="border rounded-lg p-6 space-y-4">
                  <p className="text-center text-muted-foreground">
                    No reviews yet. Be the first to review this product!
                  </p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
