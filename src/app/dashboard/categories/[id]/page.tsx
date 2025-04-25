"use client";

import { useState, useEffect, use } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { ArrowLeft, Edit, Trash, Plus } from "lucide-react";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Category } from "@/types/category";
import { Product } from "@/types/product";
import { Separator } from "@/components/ui/separator";

export default function CategoryDetailPage({
  params,
}: {
  params: { id: unknown };
}) {
  const [category, setCategory] = useState<Category | null>(null);
  const [subcategories, setSubcategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const router = useRouter();
  const categoryId = use(params).id;
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch category details
        const categoryResponse = await fetch(`/api/categories/${categoryId}`);
        const categoryData = await categoryResponse.json();

        if (!categoryData.success) {
          throw new Error(categoryData.error || "Failed to fetch category");
        }

        setCategory(categoryData.data);

        // Fetch subcategories
        const subcategoriesResponse = await fetch(
          `/api/categories?parentId=${categoryId}`
        );
        const subcategoriesData = await subcategoriesResponse.json();

        if (!subcategoriesData.success) {
          throw new Error(
            subcategoriesData.error || "Failed to fetch subcategories"
          );
        }

        setSubcategories(subcategoriesData.data);

        // Fetch products in this category (sample code - needs to be implemented in API)
        // TODO: Create an API endpoint for fetching products by category
        /* 
        const productsResponse = await fetch(`/api/products?categoryId=${categoryId}`);
        const productsData = await productsResponse.json();
        
        if (!productsData.success) {
          throw new Error(productsData.error || 'Failed to fetch products');
        }
        
        setProducts(productsData.data);
        */
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error(
          error instanceof Error
            ? error.message
            : "Failed to load category details"
        );
        router.push("/dashboard/categories");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [categoryId, router]);

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/categories/${categoryId}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || "Failed to delete category");
      }

      toast.success("Category deleted successfully");
      router.push("/dashboard/categories");
    } catch (error: unknown) {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete category"
      );
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-center">
          <p>Loading category details...</p>
        </div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-center">
          <p>Category not found</p>
          <Button variant="outline" className="mt-4" asChild>
            <Link href="/dashboard/categories">Back to Categories</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <Button variant="ghost" size="sm" asChild className="-ml-2 mb-1">
            <Link href="/dashboard/categories" className="flex items-center">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Categories
            </Link>
          </Button>
          <h2 className="text-2xl font-bold tracking-tight">{category.name}</h2>
          <div className="flex items-center gap-2">
            <Badge variant={category.parentId ? "outline" : "default"}>
              {category.parentId ? "Subcategory" : "Category"}
            </Badge>
            <Badge variant={category.isActive ? "default" : "outline"}>
              {category.isActive ? "Active" : "Inactive"}
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
            <Link href={`/dashboard/categories/${categoryId}/edit`}>
              <Edit className="h-4 w-4 mr-1" />
              Edit
            </Link>
          </Button>
          <Button asChild variant="default" size="sm">
            <Link href={`/dashboard/categories/new?parentId=${categoryId}`}>
              <Plus className="h-4 w-4 mr-1" />
              Add Subcategory
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Category Details */}
        <Card>
          <CardHeader>
            <CardTitle>Category Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {category.description && (
              <div>
                <h3 className="text-sm font-medium">Description</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {category.description}
                </p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium">Slug</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {category.slug}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-medium">Sort Order</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {category.sortOrder}
                </p>
              </div>
            </div>

            {category.parentId && (
              <div>
                <h3 className="text-sm font-medium">Parent Category</h3>
                <p className="text-sm text-primary mt-1">
                  <Link
                    href={`/dashboard/categories/${category.parentId}`}
                    className="hover:underline"
                  >
                    {/* You would ideally display the parent name here */}
                    View Parent Category
                  </Link>
                </p>
              </div>
            )}

            {category.imageUrl && (
              <div>
                <h3 className="text-sm font-medium">Category Image</h3>
                <div className="mt-2 aspect-video w-full rounded-md overflow-hidden border">
                  <img
                    src={category.imageUrl}
                    alt={category.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Subcategories */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Subcategories</CardTitle>
            <Button variant="outline" size="sm" asChild>
              <Link href={`/dashboard/categories/new?parentId=${categoryId}`}>
                <Plus className="h-4 w-4 mr-1" />
                Add
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {subcategories.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-sm text-muted-foreground">
                  No subcategories found
                </p>
                <Button variant="outline" size="sm" className="mt-2" asChild>
                  <Link
                    href={`/dashboard/categories/new?parentId=${categoryId}`}
                  >
                    Create Subcategory
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead className="text-right">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {subcategories.map((subcategory) => (
                      <TableRow key={subcategory.id}>
                        <TableCell>
                          <Link
                            href={`/dashboard/categories/${subcategory.id}`}
                            className="hover:underline font-medium"
                          >
                            {subcategory.name}
                          </Link>
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge
                            variant={
                              subcategory.isActive ? "default" : "outline"
                            }
                          >
                            {subcategory.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Products Section - This would be implemented once you have product-category relationship */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Products in this Category</CardTitle>
          <Button variant="outline" size="sm" asChild>
            <Link href={`/dashboard/products/new?categoryId=${categoryId}`}>
              <Plus className="h-4 w-4 mr-1" />
              Add Product
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <p className="text-sm text-muted-foreground">
              No products found in this category
            </p>
            <Button variant="outline" size="sm" className="mt-2" asChild>
              <Link href={`/dashboard/products/new?categoryId=${categoryId}`}>
                Add Product to Category
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the category "{category.name}"?
              This action cannot be undone and may affect subcategories and
              products.
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
