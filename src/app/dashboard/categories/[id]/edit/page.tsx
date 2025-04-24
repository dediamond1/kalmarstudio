"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Category } from "@/types/category";

// Define form schema
const categoryFormSchema = z.object({
  name: z.string().min(1, "Category name is required"),
  slug: z.string().optional(),
  description: z.string().optional(),
  parentId: z.string().optional().nullable(),
  isActive: z.boolean().default(true),
  sortOrder: z.coerce.number().int().default(0),
  imageUrl: z.string().optional().nullable(),
});

type CategoryFormValues = z.infer<typeof categoryFormSchema>;

export default function EditCategoryPage({
  params,
}: {
  params: { id: string };
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const router = useRouter();
  const categoryId = params.id;

  // Setup form with empty default values initially
  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categoryFormSchema) as any,
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      parentId: null,
      isActive: true,
      sortOrder: 0,
      imageUrl: "",
    },
  });

  // Fetch category data and other categories for parent selection
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        // Fetch the category to edit
        const categoryResponse = await fetch(`/api/categories/${categoryId}`);
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

        // Filter out the current category and its subcategories from parent options
        // to prevent circular references
        const filteredCategories = categoriesData.data.filter(
          (cat: Category) =>
            cat.id !== categoryId &&
            // Prevent selecting any descendants as parent
            !isDescendantOf(cat, categoryId, categoriesData.data)
        );

        setCategories(filteredCategories);

        // Reset form with category data
        form.reset({
          name: categoryData.data.name,
          slug: categoryData.data.slug,
          description: categoryData.data.description || "",
          parentId: categoryData.data.parentId,
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
  }, [categoryId, form, router]);

  // Helper function to check if a category is a descendant of another
  function isDescendantOf(
    category: Category,
    ancestorId: string,
    allCategories: Category[]
  ): boolean {
    if (!category.parentId) return false;
    if (category.parentId === ancestorId) return true;

    const parent = allCategories.find((cat) => cat.id === category.parentId);
    return parent ? isDescendantOf(parent, ancestorId, allCategories) : false;
  }

  async function onSubmit(values: CategoryFormValues) {
    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/categories/${categoryId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
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
  }

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
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Category Name */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter category name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Category Slug */}
                <FormField
                  control={form.control}
                  name="slug"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>URL Slug</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter URL slug"
                          {...field}
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormDescription>
                        Used in URLs. Be careful when changing existing slugs.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Description */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter category description (optional)"
                        className="resize-none h-24"
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Parent Category */}
                <FormField
                  control={form.control}
                  name="parentId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Parent Category</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value || ""}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="None (Top-level category)" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="">
                            None (Top-level category)
                          </SelectItem>
                          {categories.map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Select a parent for a subcategory, or none for a
                        top-level category
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Sort Order */}
                <FormField
                  control={form.control}
                  name="sortOrder"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sort Order</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} min={0} />
                      </FormControl>
                      <FormDescription>
                        Lower numbers appear first in listings
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Image URL */}
              <FormField
                control={form.control}
                name="imageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image URL</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter image URL (optional)"
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormDescription>
                      Optional image to represent this category
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Active Status */}
              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
                        Category Active
                      </FormLabel>
                      <FormDescription>
                        Inactive categories won't show in the product catalog
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

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
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
