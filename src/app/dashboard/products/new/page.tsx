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
import { ArrowLeft, Plus, Trash, AlertCircle } from "lucide-react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import CategorySelectField from "@/components/dashboard/category-select";
import { Category } from "@/types/category";

// Define the form schema
const productFormSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  description: z.string().min(1, "Description is required"),
  basePrice: z.coerce.number().min(0.01, "Price must be greater than 0"),
  category: z.string().min(1, "Category is required"),
  printTypes: z.array(z.string()).min(1, "At least one print type is required"),
  availableSizes: z.array(z.string()).min(1, "At least one size is required"),
  colors: z.array(z.string()).min(1, "At least one color is required"),
  materials: z.array(z.string()).min(1, "At least one material is required"),
  minOrderQuantity: z.coerce
    .number()
    .int()
    .min(1, "Minimum order quantity must be at least 1"),
  imageUrls: z.array(z.string()),
  isActive: z.boolean(),
  maxPrintSizeWidth: z.coerce
    .number()
    .min(0, "Width must be a positive number"),
  maxPrintSizeHeight: z.coerce
    .number()
    .min(0, "Height must be a positive number"),
  printPositions: z
    .array(z.string())
    .min(1, "At least one print position is required"),
});

type ProductFormValues = z.infer<typeof productFormSchema>;

// Predefined options
const printTypeOptions = [
  { id: "digital", label: "Digital Print" },
  { id: "screen", label: "Screen Print" },
  { id: "embroidery", label: "Embroidery" },
  { id: "heat_transfer", label: "Heat Transfer" },
  { id: "sublimation", label: "Sublimation" },
  { id: "direct_to_garment", label: "Direct to Garment (DTG)" },
  { id: "vinyl", label: "Vinyl" },
];

const sizeOptions = [
  { id: "xs", label: "XS" },
  { id: "s", label: "S" },
  { id: "m", label: "M" },
  { id: "l", label: "L" },
  { id: "xl", label: "XL" },
  { id: "xxl", label: "2XL" },
  { id: "xxxl", label: "3XL" },
  { id: "xxxxl", label: "4XL" },
  { id: "youth_s", label: "Youth S" },
  { id: "youth_m", label: "Youth M" },
  { id: "youth_l", label: "Youth L" },
];

const colorOptions = [
  { id: "black", label: "Black" },
  { id: "white", label: "White" },
  { id: "navy", label: "Navy" },
  { id: "royal_blue", label: "Royal Blue" },
  { id: "red", label: "Red" },
  { id: "maroon", label: "Maroon" },
  { id: "forest_green", label: "Forest Green" },
  { id: "kelly_green", label: "Kelly Green" },
  { id: "purple", label: "Purple" },
  { id: "orange", label: "Orange" },
  { id: "yellow", label: "Yellow" },
  { id: "light_pink", label: "Light Pink" },
  { id: "sport_grey", label: "Sport Grey" },
  { id: "ash_grey", label: "Ash Grey" },
  { id: "charcoal", label: "Charcoal" },
];

const materialOptions = [
  { id: "cotton", label: "100% Cotton" },
  { id: "poly_cotton", label: "50/50 Poly-Cotton" },
  { id: "poly_cotton_35", label: "65/35 Poly-Cotton" },
  { id: "tri_blend", label: "Tri-Blend" },
  { id: "performance", label: "Performance/Moisture Wicking" },
  { id: "polyester", label: "100% Polyester" },
  { id: "jersey", label: "Jersey Knit" },
  { id: "fleece", label: "Fleece" },
  { id: "canvas", label: "Canvas" },
];

const categoryOptions = [
  { id: "t_shirts", label: "T-Shirts" },
  { id: "hoodies", label: "Hoodies & Sweatshirts" },
  { id: "polos", label: "Polo Shirts" },
  { id: "tank_tops", label: "Tank Tops" },
  { id: "hats_caps", label: "Hats & Caps" },
  { id: "bags", label: "Bags & Totes" },
  { id: "workwear", label: "Workwear & Uniforms" },
  { id: "activewear", label: "Activewear" },
  { id: "accessories", label: "Accessories" },
  { id: "promotional", label: "Promotional Items" },
];

const printPositionOptions = [
  { id: "front_center", label: "Front Center" },
  { id: "front_left_chest", label: "Front Left Chest" },
  { id: "front_right_chest", label: "Front Right Chest" },
  { id: "back_center", label: "Back Center" },
  { id: "back_top", label: "Back Top (Yoke)" },
  { id: "left_sleeve", label: "Left Sleeve" },
  { id: "right_sleeve", label: "Right Sleeve" },
  { id: "left_hip", label: "Left Hip" },
  { id: "right_hip", label: "Right Hip" },
  { id: "hat_front", label: "Hat Front" },
  { id: "hat_side", label: "Hat Side" },
  { id: "hat_back", label: "Hat Back" },
];

// Tab error mapping - fields to their respective tabs
const tabFieldMapping = {
  details: [
    "name",
    "description",
    "basePrice",
    "minOrderQuantity",
    "category",
    "isActive",
  ],
  print: [
    "printTypes",
    "printPositions",
    "maxPrintSizeWidth",
    "maxPrintSizeHeight",
  ],
  options: ["availableSizes", "colors", "materials"],
  images: ["imageUrls"],
};

export default function NewProductPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("details");
  const [tabErrors, setTabErrors] = useState<Record<string, boolean>>({
    details: false,
    print: false,
    options: false,
    images: false,
  });
  const router = useRouter();

  // Setup form with default values
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema) as any,
    defaultValues: {
      name: "",
      description: "",
      basePrice: 0,
      category: "", // Initialize the category field
      printTypes: [],
      availableSizes: [],
      colors: [],
      materials: [],
      minOrderQuantity: 12, // More realistic default for custom apparel
      imageUrls: [""],
      isActive: true,
      maxPrintSizeWidth: 12, // Default 12 inches
      maxPrintSizeHeight: 14, // Default 14 inches
      printPositions: [],
    },
  });

  useEffect(() => {
    const checkCategories = async () => {
      try {
        const response = await fetch("/api/categories");
        const data = await response.json();

        if (!data.success) {
          throw new Error(data.error || "Failed to fetch categories");
        }

        const activeCategories = data.data.filter(
          (category: Category) => category.isActive
        );

        if (activeCategories.length === 0) {
          toast.warning("You need to create a category before adding products");

          // Delay redirect to ensure toast is visible
          setTimeout(() => {
            router.push("/dashboard/categories/new");
          }, 2000);
        }
      } catch (error) {
        console.error("Error checking categories:", error);
        toast.error("Failed to check if categories exist");
      }
    };

    checkCategories();
  }, [router]);

  useEffect(() => {
    const updateTabErrors = () => {
      if (Object.keys(form.formState.errors).length > 0) {
        const newTabErrors = {
          details: false,
          print: false,
          options: false,
          images: false,
        };

        Object.keys(form.formState.errors).forEach((fieldName) => {
          // Find which tab this field belongs to
          for (const [tab, fields] of Object.entries(tabFieldMapping)) {
            if (
              fields.some(
                (field) =>
                  fieldName === field ||
                  fieldName.startsWith(`${field}.`) ||
                  fieldName.startsWith(`${field}[`)
              )
            ) {
              newTabErrors[tab as keyof typeof newTabErrors] = true;
            }
          }
        });

        setTabErrors(newTabErrors);
      } else {
        setTabErrors({
          details: false,
          print: false,
          options: false,
          images: false,
        });
      }
    };

    // Run once on mount and whenever form state errors change
    updateTabErrors();
  }, [form.formState.errors]);
  async function onSubmit(values: ProductFormValues) {
    setIsSubmitting(true);

    try {
      // Clear any previous errors
      console.log("Form values:", values);

      // Check if a category is selected
      if (!values.category || values.category.trim() === "") {
        toast.error("A category is required. Please select a category.");
        setActiveTab("details"); // Switch to the details tab where category is located
        setIsSubmitting(false);
        return;
      }

      // Filter out empty image URLs
      const filteredImageUrls = values.imageUrls.filter(
        (url) => url.trim() !== ""
      );

      const productData = {
        ...values,
        imageUrls: filteredImageUrls,
      };

      console.log("Sending product data:", productData);

      const response = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productData),
      });

      const data = await response.json();

      if (!data.success) {
        console.error("API error:", data);
        if (data.details && Array.isArray(data.details)) {
          // Show specific validation errors
          data.details.forEach((error: string) => {
            toast.error(error);
          });
        } else {
          throw new Error(data.error || "Failed to create product");
        }
        return;
      }

      toast.success("Product created successfully");
      router.push("/dashboard/products");
    } catch (error: any) {
      console.error("Create product error:", error);
      toast.error(error.message || "Failed to create product");
    } finally {
      setIsSubmitting(false);
    }
  }

  // Handle form submission - switch to first tab with errors if validation fails
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Start form submission by calling handleSubmit
    const result = await form.handleSubmit(onSubmit)(e);

    // If there are errors, find and switch to first tab with errors
    if (Object.keys(form.formState.errors).length > 0) {
      const tabsWithErrors = Object.entries(tabErrors)
        .filter(([_, hasError]) => hasError)
        .map(([tab]) => tab);

      if (tabsWithErrors.length > 0) {
        setActiveTab(tabsWithErrors[0]);
      }
    }

    return result;
  };

  // Helper function to add a new image URL field
  const addImageUrl = () => {
    const currentImageUrls = form.getValues().imageUrls || [];
    form.setValue("imageUrls", [...currentImageUrls, ""]);
  };

  // Helper function to remove an image URL field
  const removeImageUrl = (index: number) => {
    const currentImageUrls = form.getValues().imageUrls || [];
    if (currentImageUrls.length > 1) {
      form.setValue(
        "imageUrls",
        currentImageUrls.filter((_, i) => i !== index)
      );
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-10">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
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
            Add a new printable product to the Kalmar Studio catalog.
          </p>
        </div>
      </div>

      <Card>
        <CardContent className="p-6">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid grid-cols-4 mb-6">
              <TabsTrigger value="details" className="relative">
                Basic Details
                {tabErrors.details && (
                  <Badge variant="destructive" className="ml-2 h-5 px-1">
                    <AlertCircle className="h-3 w-3" />
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="print" className="relative">
                Print Options
                {tabErrors.print && (
                  <Badge variant="destructive" className="ml-2 h-5 px-1">
                    <AlertCircle className="h-3 w-3" />
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="options" className="relative">
                Product Variants
                {tabErrors.options && (
                  <Badge variant="destructive" className="ml-2 h-5 px-1">
                    <AlertCircle className="h-3 w-3" />
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="images" className="relative">
                Images
                {tabErrors.images && (
                  <Badge variant="destructive" className="ml-2 h-5 px-1">
                    <AlertCircle className="h-3 w-3" />
                  </Badge>
                )}
              </TabsTrigger>
            </TabsList>

            <Form {...form}>
              <form onSubmit={handleFormSubmit}>
                <TabsContent value="details" className="space-y-6 mt-0">
                  <div className="bg-red-50 p-4 rounded-lg border border-red-200 mb-6">
                    <details className="group">
                      <summary className="flex items-center justify-between cursor-pointer">
                        <h3 className="font-bold text-red-700">
                          Debug Information
                        </h3>
                        <svg
                          className="h-5 w-5 text-red-500 transition-transform group-open:rotate-180"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </summary>
                      <div className="mt-3 text-sm text-red-600 space-y-2">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="font-medium">Form Errors:</p>
                            <pre className="bg-red-100 p-2 rounded text-xs">
                              {JSON.stringify(form.formState.errors, null, 2)}
                            </pre>
                          </div>
                          <div className="space-y-2">
                            <p>Name: {form.getValues("name") || "Empty"}</p>
                            <p>
                              Category: {form.getValues("category") || "Empty"}
                            </p>
                            <p>
                              Name touched:{" "}
                              {form.formState.touchedFields.name ? "Yes" : "No"}
                            </p>
                            <p>
                              Name dirty:{" "}
                              {form.formState.dirtyFields.name ? "Yes" : "No"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </details>
                  </div>

                  <div className="space-y-6">
                    <div className="space-y-2">
                      <h3 className="text-lg font-medium">Basic Information</h3>
                      <div className="grid grid-cols-3 gap-4">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Product Name</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="e.g. Premium Crewneck T-Shirt"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="basePrice"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Base Price ($)</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  placeholder="0.00"
                                  min="0.01"
                                  step="0.01"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* Add the Category field */}
                        <CategorySelectField form={form} />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-lg font-medium">Product Details</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="description"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Description</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Enter product description..."
                                  className="min-h-[120px]"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="minOrderQuantity"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Minimum Order Quantity</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="12"
                                min="1"
                                step="1"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="isActive"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel>Product Status</FormLabel>
                              <FormDescription>
                                Toggle product visibility
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
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="print" className="mt-0">
                  <div className="grid grid-cols-1 gap-6">
                    {/* Print Types */}
                    <div>
                      <FormField
                        control={form.control}
                        name="printTypes"
                        render={({ field }) => (
                          <FormItem>
                            <div className="mb-4">
                              <FormLabel>
                                Available Decoration Methods
                              </FormLabel>
                              <FormDescription>
                                Select all decoration methods available for this
                                product
                              </FormDescription>
                            </div>
                            <div className="grid grid-cols-3 gap-3">
                              {printTypeOptions.map((option) => (
                                <div
                                  key={option.id}
                                  className="flex items-start space-x-3"
                                >
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(option.id)}
                                      onCheckedChange={(checked) => {
                                        const newValue = checked
                                          ? [...field.value, option.id]
                                          : field.value?.filter(
                                              (value) => value !== option.id
                                            );
                                        field.onChange(newValue);
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="font-normal text-sm">
                                    {option.label}
                                  </FormLabel>
                                </div>
                              ))}
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <Separator />

                    {/* Max Print Size */}
                    <div>
                      <h3 className="text-sm font-medium mb-4">
                        Maximum Print Area
                      </h3>
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="maxPrintSizeWidth"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Width (inches)</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  min={0}
                                  step={0.5}
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="maxPrintSizeHeight"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Height (inches)</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  min={0}
                                  step={0.5}
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    <Separator />

                    {/* Print Positions */}
                    <div>
                      <FormField
                        control={form.control}
                        name="printPositions"
                        render={({ field }) => (
                          <FormItem>
                            <div className="mb-4">
                              <FormLabel>Available Print Locations</FormLabel>
                              <FormDescription>
                                Select all possible print locations for this
                                product
                              </FormDescription>
                            </div>
                            <div className="grid grid-cols-3 gap-3">
                              {printPositionOptions.map((option) => (
                                <div
                                  key={option.id}
                                  className="flex items-start space-x-3"
                                >
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(option.id)}
                                      onCheckedChange={(checked) => {
                                        const newValue = checked
                                          ? [...field.value, option.id]
                                          : field.value?.filter(
                                              (value) => value !== option.id
                                            );
                                        field.onChange(newValue);
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="font-normal text-sm">
                                    {option.label}
                                  </FormLabel>
                                </div>
                              ))}
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="options" className="mt-0">
                  <div className="grid grid-cols-1 gap-6">
                    {/* Available Sizes */}
                    <div>
                      <FormField
                        control={form.control}
                        name="availableSizes"
                        render={({ field }) => (
                          <FormItem>
                            <div className="mb-4">
                              <FormLabel>Available Sizes</FormLabel>
                              <FormDescription>
                                Select all available sizes for this product
                              </FormDescription>
                            </div>
                            <div className="grid grid-cols-4 gap-3">
                              {sizeOptions.map((option) => (
                                <div
                                  key={option.id}
                                  className="flex items-start space-x-3"
                                >
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(option.id)}
                                      onCheckedChange={(checked) => {
                                        const newValue = checked
                                          ? [...field.value, option.id]
                                          : field.value?.filter(
                                              (value) => value !== option.id
                                            );
                                        field.onChange(newValue);
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="font-normal text-sm">
                                    {option.label}
                                  </FormLabel>
                                </div>
                              ))}
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <Separator />

                    {/* Colors and Materials */}
                    <div className="grid grid-cols-2 gap-6">
                      {/* Colors */}
                      <div>
                        <FormField
                          control={form.control}
                          name="colors"
                          render={({ field }) => (
                            <FormItem>
                              <div className="mb-4">
                                <FormLabel>Available Colors</FormLabel>
                                <FormDescription>
                                  Select all available colors
                                </FormDescription>
                              </div>
                              <div className="grid grid-cols-2 gap-2 max-h-80 overflow-y-auto pr-2">
                                {colorOptions.map((option) => (
                                  <div
                                    key={option.id}
                                    className="flex items-start space-x-3"
                                  >
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value?.includes(
                                          option.id
                                        )}
                                        onCheckedChange={(checked) => {
                                          const newValue = checked
                                            ? [...field.value, option.id]
                                            : field.value?.filter(
                                                (value) => value !== option.id
                                              );
                                          field.onChange(newValue);
                                        }}
                                      />
                                    </FormControl>
                                    <FormLabel className="font-normal text-sm">
                                      {option.label}
                                    </FormLabel>
                                  </div>
                                ))}
                              </div>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      {/* Materials */}
                      <div>
                        <FormField
                          control={form.control}
                          name="materials"
                          render={({ field }) => (
                            <FormItem>
                              <div className="mb-4">
                                <FormLabel>Available Materials</FormLabel>
                                <FormDescription>
                                  Select all available fabric types
                                </FormDescription>
                              </div>
                              <div className="grid grid-cols-1 gap-2">
                                {materialOptions.map((option) => (
                                  <div
                                    key={option.id}
                                    className="flex items-start space-x-3"
                                  >
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value?.includes(
                                          option.id
                                        )}
                                        onCheckedChange={(checked) => {
                                          const newValue = checked
                                            ? [...field.value, option.id]
                                            : field.value?.filter(
                                                (value) => value !== option.id
                                              );
                                          field.onChange(newValue);
                                        }}
                                      />
                                    </FormControl>
                                    <FormLabel className="font-normal text-sm">
                                      {option.label}
                                    </FormLabel>
                                  </div>
                                ))}
                              </div>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="images" className="mt-0">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-medium">Product Images</h3>
                        <p className="text-sm text-muted-foreground">
                          Add photos of the blank product in different colors or
                          angles
                        </p>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={addImageUrl}
                        className="h-8"
                      >
                        <Plus className="h-3.5 w-3.5 mr-1" />
                        Add Image
                      </Button>
                    </div>

                    <div className="space-y-2">
                      {form.watch("imageUrls")?.map((_, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <FormField
                            control={form.control}
                            name={`imageUrls.${index}`}
                            render={({ field }) => (
                              <FormItem className="flex-1">
                                <FormControl>
                                  <Input
                                    placeholder="Enter image URL"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          {form.watch("imageUrls")?.length > 1 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => removeImageUrl(index)}
                              className="h-8 w-8"
                            >
                              <Trash className="h-4 w-4 text-red-500" />
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                <div className="flex justify-end gap-4 mt-8 pt-4 border-t">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push("/dashboard/products")}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Creating Product..." : "Create Product"}
                  </Button>
                </div>
              </form>
            </Form>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
