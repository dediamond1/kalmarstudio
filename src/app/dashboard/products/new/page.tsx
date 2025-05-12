"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
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
import MultiSelect from "@/components/ui/MultiSelect";

export default function NewProductPage() {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    basePrice: 0,
    category: "",
    printTypes: [] as string[],
    availableSizes: [] as string[],
    colors: [] as string[],
    materials: [] as string[],
    minOrderQuantity: 1,
    imageUrls: [] as string[],
    isActive: true,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const router = useRouter();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/categories");
        const data = await response.json();

        if (!data.success) {
          throw new Error(data.error || "Failed to fetch categories");
        }

        setCategories(data.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
        toast.error(
          error instanceof Error ? error.message : "Failed to load categories"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    // Basic validation
    if (!formData.name.trim()) {
      setErrors({ name: "Product name is required" });
      setIsSubmitting(false);
      return;
    }
    if (!formData.description.trim()) {
      setErrors({ description: "Description is required" });
      setIsSubmitting(false);
      return;
    }
    if (formData.basePrice <= 0) {
      setErrors({ basePrice: "Price must be greater than 0" });
      setIsSubmitting(false);
      return;
    }
    if (!formData.category) {
      setErrors({ category: "Category is required" });
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || "Failed to create product");
      }

      toast.success("Product created successfully");
      router.push("/dashboard/products");
    } catch (error: any) {
      toast.error(error.message || "Failed to create product");
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

  const handleNumberChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: string
  ) => {
    const value = parseFloat(e.target.value) || 0;
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSwitchChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, isActive: checked }));
  };

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({ ...prev, category: value }));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-center">
          <p>Loading categories...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-10">
      <div>
        <Button variant="ghost" size="sm" asChild className="-ml-2 mb-1">
          <Link href="/dashboard/products" className="flex items-center">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Products
          </Link>
        </Button>
        <h2 className="text-2xl font-bold tracking-tight">
          Create New Product
        </h2>
        <p className="text-muted-foreground">
          Add a new product to your catalog
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6">
          {/* Product Name */}
          <div className="space-y-2">
            <label htmlFor="name" className="block text-sm font-medium">
              Product Name *
            </label>
            <Input
              id="name"
              name="name"
              placeholder="Enter product name"
              value={formData.name}
              onChange={handleChange}
              required
            />
            {errors.name && (
              <p className="text-sm font-medium text-destructive">
                {errors.name}
              </p>
            )}
          </div>

          {/* Base Price */}
          <div className="space-y-2">
            <label htmlFor="basePrice" className="block text-sm font-medium">
              Base Price *
            </label>
            <Input
              id="basePrice"
              name="basePrice"
              type="number"
              min="0"
              step="0.01"
              placeholder="0.00"
              value={formData.basePrice}
              onChange={(e) => handleNumberChange(e, "basePrice")}
              required
            />
            {errors.basePrice && (
              <p className="text-sm font-medium text-destructive">
                {errors.basePrice}
              </p>
            )}
          </div>
          {/* </div> */}

          {/* Category */}
          <div className="w-full space-y-2 gap-[1px] flex flex-col">
            <label htmlFor="category" className="text-sm font-medium">
              Category *
            </label>

            <Select
              onValueChange={handleSelectChange}
              value={formData.category}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.category && (
              <p className="text-sm font-medium text-destructive">
                {errors.category}
              </p>
            )}
          </div>

          {/* </div> */}

          {/* Product Attributes */}
          {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-6"> */}
          {/* Print Types */}
          <MultiSelect
            label="Print Types"
            options={["Digital", "Screen", "Offset"]}
            value={formData.printTypes}
            onChange={(selected) =>
              setFormData((prev) => ({ ...prev, printTypes: selected }))
            }
            placeholder="Choose print types"
          />

          {/* Available Sizes */}
          <MultiSelect
            label="Available Sizes"
            options={["S", "M", "L", "XL", "XXL", "3XL"]}
            value={formData.availableSizes}
            onChange={(selected) =>
              setFormData((prev) => ({ ...prev, availableSizes: selected }))
            }
            placeholder="Choose print types"
          />

          {/* Colors */}
          <MultiSelect
            label="Colors"
            options={["Red", "Blue", "Green", "Black", "White"]}
            value={formData.colors}
            onChange={(selected) =>
              setFormData((prev) => ({ ...prev, colors: selected }))
            }
            placeholder="Choose print types"
          />

          {/* Materials */}
          <MultiSelect
            label="Materials"
            options={["Cotton", "Polyester", "Silk", "Wool"]}
            value={formData.materials}
            onChange={(selected) =>
              setFormData((prev) => ({ ...prev, materials: selected }))
            }
            placeholder="Choose print types"
          />

          {/* Minimum Order Quantity */}
          <div className="space-y-2">
            <label
              htmlFor="minOrderQuantity"
              className="block text-sm font-medium"
            >
              Minimum Order Quantity
            </label>
            <Input
              id="minOrderQuantity"
              name="minOrderQuantity"
              type="number"
              min="1"
              value={formData.minOrderQuantity}
              onChange={(e) => handleNumberChange(e, "minOrderQuantity")}
            />
          </div>
          {/* </div> */}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {/* Description */}
          <div className="space-y-2">
            <label htmlFor="description" className="block text-sm font-medium">
              Description *
            </label>
            <Textarea
              id="description"
              name="description"
              placeholder="Enter product description"
              className="resize-none h-24"
              value={formData.description}
              onChange={handleChange}
              required
            />
            {errors.description && (
              <p className="text-sm font-medium text-destructive">
                {errors.description}
              </p>
            )}
          </div>

          {/* Image URLs */}
          <div className="space-y-2">
            <label htmlFor="imageUrls" className="block text-sm font-medium">
              Image URLs
            </label>
            <Textarea
              id="imageUrls"
              name="imageUrls"
              placeholder="Enter image URLs, one per line"
              className="resize-none h-24"
              value={formData.imageUrls.join("\n")}
              onChange={(e) => {
                const urls = e.target.value
                  .split("\n")
                  .filter((url) => url.trim());
                setFormData((prev) => ({ ...prev, imageUrls: urls }));
              }}
            />
          </div>
        </div>

        {/* Active Status */}
        <div className="flex items-center justify-between rounded-lg border p-4 shadow-sm my-6">
          <div className="space-y-0.5">
            <label className="text-base font-medium">Product Active</label>
            <p className="text-sm text-muted-foreground">
              {`Inactive products won\'t show in the catalog`}
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
            onClick={() => router.push("/dashboard/products")}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create Product"}
          </Button>
        </div>
      </form>
    </div>
  );
}
