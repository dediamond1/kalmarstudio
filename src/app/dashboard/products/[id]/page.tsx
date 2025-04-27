"use client";

import { useState, useEffect, use } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { ArrowLeft, Edit, Trash } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import type { Product } from "@/types/product";

export default function ProductDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const router = useRouter();
  const productId = use(params).id;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `http://localhost:3000/api/products/${productId}`
        );
        const data = await response.json();
        console.log("responsceceeee", data);

        if (!data.success) {
          throw new Error(data.error || "Failed to fetch product");
        }

        setProduct(data.data);
      } catch (error) {
        console.error("Error fetching product:", error);
        toast.error(
          error instanceof Error
            ? error.message
            : "Failed to load product details"
        );
        router.push("/dashboard/products");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [productId, router]);

  const handleDelete = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/products/${productId}`,
        {
          method: "DELETE",
        }
      );

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || "Failed to delete product");
      }

      toast.success("Product deleted successfully");
      router.push("/dashboard/products");
    } catch (error: unknown) {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete product"
      );
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-center">
          <p>Loading product details...</p>
        </div>
      </div>
    );
  }

  //   if (!product) {
  //     return (
  //       <div className="flex items-center justify-center p-12">
  //         <div className="text-center">
  //           <p>Product not found</p>
  //           <Button variant="outline" className="mt-4" asChild>
  //             <Link href="/dashboard/products">Back to Products</Link>
  //           </Button>
  //         </div>
  //       </div>
  //     );
  //   }

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <Button variant="ghost" size="sm" asChild className="-ml-2 mb-1">
            <Link href="/dashboard/products" className="flex items-center">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Products
            </Link>
          </Button>
          <h2 className="text-2xl font-bold tracking-tight">{product.name}</h2>
          <div className="flex items-center gap-2">
            <Badge variant={product.isActive ? "default" : "outline"}>
              {product.isActive ? "Active" : "Inactive"}
            </Badge>
            <Badge variant="outline" className="font-normal">
              {product.category.name}
            </Badge>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setDeleteConfirmOpen(true)}
          >
            <Trash className="h-4 w-4 mr-1" />
            Delete
          </Button>
          <Button asChild size="sm">
            <Link href={`/dashboard/products/${productId}/edit`}>
              <Edit className="h-4 w-4 mr-1" />
              Edit
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Product Images */}
        <Card>
          <CardHeader>
            <CardTitle>Product Images</CardTitle>
          </CardHeader>
          <CardContent>
            {product.imageUrls && product.imageUrls.length > 0 ? (
              <div className="grid grid-cols-2 gap-4">
                {product.imageUrls.map((url, index) => (
                  <div
                    key={index}
                    className="aspect-square rounded-md overflow-hidden border"
                  >
                    <img
                      src={url}
                      alt={`${product.name} - Image ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No product images available
              </div>
            )}
          </CardContent>
        </Card>

        {/* Product Details */}
        <Card>
          <CardHeader>
            <CardTitle>Product Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="text-sm font-medium">Description</h3>
              <p className="text-sm text-muted-foreground mt-1">
                {product.description}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium">Base Price</h3>
                <p className="text-sm font-mono mt-1">
                  ${product.basePrice.toFixed(2)}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-medium">Minimum Order</h3>
                <p className="text-sm font-mono mt-1">
                  {product.minOrderQuantity} units
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium">Category</h3>
              <p className="text-sm text-primary mt-1">
                <Link
                  href={`/dashboard/categories/${product.category.id}`}
                  className="hover:underline"
                >
                  {product.category.name}
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Print Options & Variants */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Print Types */}
        <Card>
          <CardHeader>
            <CardTitle>Print Options</CardTitle>
          </CardHeader>
          <CardContent>
            <h3 className="text-sm font-medium mb-2">Available Print Types</h3>
            <div className="flex flex-wrap gap-2">
              {product.printTypes.map((type) => (
                <Badge key={type} variant="outline">
                  {type}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Available Variants */}
        <Card>
          <CardHeader>
            <CardTitle>Product Variants</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="text-sm font-medium mb-2">Available Sizes</h3>
              <div className="flex flex-wrap gap-2">
                {product.availableSizes.map((size) => (
                  <Badge key={size} variant="outline">
                    {size}
                  </Badge>
                ))}
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="text-sm font-medium mb-2">Available Colors</h3>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((color) => (
                  <Badge key={color} variant="outline">
                    {color}
                  </Badge>
                ))}
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="text-sm font-medium mb-2">Available Materials</h3>
              <div className="flex flex-wrap gap-2">
                {product.materials.map((material) => (
                  <Badge key={material} variant="outline">
                    {material}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the product "{product.name}"? This
              action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteConfirmOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
