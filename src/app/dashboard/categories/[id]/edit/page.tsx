"use client";

import { useState, useEffect } from "react";
import * as React from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Category } from "@/types/category";

export default function EditCategoryPage({
  params: paramsPromise,
}: {
  params: Promise<{ id: string }>;
}) {
  const params = React.use(paramsPromise);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    parentId: "",
    isActive: true,
    sortOrder: 0,
    imageUrl: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        // Fetch the category to edit
        const categoryResponse = await fetch(`/api/categories/${params.id}`);
        const categoryData = await categoryResponse.json();

        if (!categoryData.success) {
          throw new Error(categoryData.error || "Failed to fetch category");
        }

        // Fetch all categories for parent dropdown
        const categoriesResponse = await fetch("/api/categories");
        const categoriesData = await categoriesResponse.json();

        if (!categoriesData.success) {
          throw new Error(categoriesData.error || "Failed to fetch categories");
        }

        // Filter out current category and its subcategories from parent options
        const filteredCategories = categoriesData.data.filter(
          (cat: Category) => cat.id !== params.id
        );

        setCategories(filteredCategories);

        // Set form data with category data
        setFormData({
          name: categoryData.data.name,
          slug: categoryData.data.slug || "",
          description: categoryData.data.description || "",
          parentId: categoryData.data.parentId || "",
          isActive: categoryData.data.isActive,
          sortOrder: categoryData.data.sortOrder,
          imageUrl: categoryData.data.imageUrl || "",
        });
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error(
          error instanceof Error ? error.message : "Failed to load category"
        );
        router.push("/dashboard/categories");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [params.id, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    // Basic validation
    if (!formData.name.trim()) {
      setErrors({ name: "Category name is required" });
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch(`/api/categories/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          parentId: formData.parentId || null,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || "Failed to update category");
      }

      toast.success("Category updated successfully");
      router.push("/dashboard/categories");
    } catch (error: any) {
      toast.error(error.message || "Failed to update category");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, isActive: checked }));
  };

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({ ...prev, parentId: value }));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-center">
          <p>Loading category data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto pb-10">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <Button variant="ghost" size="sm" asChild className="-ml-2 mb-1">
            <Link href="/dashboard/categories" className="flex items-center">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Categories
            </Link>
          </Button>
          <h2 className="text-2xl font-bold tracking-tight">Edit Category</h2>
          <p className="text-muted-foreground">
            Update this category's details
          </p>
        </div>
      </div>

      <Card>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Category Name */}
              <div className="space-y-2">
                <label htmlFor="name" className="block text-sm font-medium">
                  Category Name
                </label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Enter category name"
                  value={formData.name}
                  onChange={handleChange}
                />
                {errors.name && (
                  <p className="text-sm font-medium text-destructive">
                    {errors.name}
                  </p>
                )}
              </div>

              {/* URL Slug */}
              <div className="space-y-2">
                <label htmlFor="slug" className="block text-sm font-medium">
                  URL Slug
                </label>
                <Input
                  id="slug"
                  name="slug"
                  placeholder="Enter URL slug"
                  value={formData.slug}
                  onChange={handleChange}
                />
                <p className="text-sm text-muted-foreground">
                  Used in URLs. Be careful when changing existing slugs.
                </p>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label
                htmlFor="description"
                className="block text-sm font-medium"
              >
                Description
              </label>
              <Textarea
                id="description"
                name="description"
                placeholder="Enter category description (optional)"
                className="resize-none h-24"
                value={formData.description}
                onChange={handleChange}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Parent Category */}
              <div className="space-y-2">
                <label htmlFor="parentId" className="block text-sm font-medium">
                  Parent Category
                </label>
                <Select
                  onValueChange={handleSelectChange}
                  value={formData.parentId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="None (Top-level category)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">None (Top-level category)</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground">
                  Select a parent for a subcategory, or none for a top-level
                  category
                </p>
              </div>

              {/* Sort Order */}
              <div className="space-y-2">
                <label
                  htmlFor="sortOrder"
                  className="block text-sm font-medium"
                >
                  Sort Order
                </label>
                <Input
                  id="sortOrder"
                  name="sortOrder"
                  type="number"
                  min={0}
                  value={formData.sortOrder}
                  onChange={handleChange}
                />
                <p className="text-sm text-muted-foreground">
                  Lower numbers appear first in listings
                </p>
              </div>
            </div>

            {/* Image URL */}
            <div className="space-y-2">
              <label htmlFor="imageUrl" className="block text-sm font-medium">
                Image URL
              </label>
              <Input
                id="imageUrl"
                name="imageUrl"
                placeholder="Enter image URL (optional)"
                value={formData.imageUrl}
                onChange={handleChange}
              />
              <p className="text-sm text-muted-foreground">
                Optional image to represent this category
              </p>
            </div>

            {/* Active Status */}
            <div className="flex items-center justify-between rounded-lg border p-4 shadow-sm">
              <div className="space-y-0.5">
                <label className="text-base font-medium">Category Active</label>
                <p className="text-sm text-muted-foreground">
                  Inactive categories won't show in the product catalog
                </p>
              </div>
              <Switch
                checked={formData.isActive}
                onCheckedChange={handleSwitchChange}
              />
            </div>

            {/* Form Actions */}
            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/dashboard/categories")}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
