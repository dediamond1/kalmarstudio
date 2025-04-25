import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Category } from "@/types/category";

const CategorySelectField = ({
  form,
  required = true,
}: {
  form: any;
  required?: boolean;
}) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/categories");
        const result = await response.json();

        if (!result.success) {
          throw new Error(result.error || "Failed to fetch categories");
        }

        // Filter to only show active categories
        const activeCategories = result.data.filter(
          (category: Category) => category.isActive
        );

        setCategories(activeCategories);

        // If no categories are available, show a warning
        if (activeCategories.length === 0) {
          toast.warning(
            "No active categories found. Please create a category first."
          );
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
        toast.error(
          error instanceof Error ? error.message : "Failed to fetch categories"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <FormField
      control={form.control}
      name="category"
      render={({ field }) => (
        <FormItem>
          <FormLabel>{required ? "Category *" : "Category"}</FormLabel>
          <Select onValueChange={field.onChange} value={field.value || ""}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {loading ? (
                <div className="flex justify-center p-2">Loading...</div>
              ) : categories.length === 0 ? (
                <div className="p-2 text-center text-sm text-muted-foreground">
                  No categories available. Please create one first.
                </div>
              ) : (
                categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default CategorySelectField;
