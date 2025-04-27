// src/components/dashboard/orders/order-form.tsx

"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, Plus, Trash } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Order } from "@/types/order";
import { CustomerSelector } from "@/components/dashboard/orders/customer-selector";
import { ProductSelector } from "@/components/dashboard/orders/product-selector";

// Define form schema
const orderFormSchema = z.object({
  customer: z.object({
    id: z.string().min(1, "Customer is required"),
    name: z.string(),
    email: z.string().email(),
    phone: z.string(),
    company: z.string().optional(),
  }),
  status: z.enum([
    "Pending",
    "Processing",
    "Completed",
    "Shipped",
    "Cancelled",
  ]),
  dueDate: z.date({
    required_error: "Due date is required",
  }),
  items: z
    .array(
      z.object({
        product: z.object({
          id: z.string(),
          name: z.string(),
        }),
        quantity: z.coerce.number().min(1, "Quantity must be at least 1"),
        size: z.string().min(1, "Size is required"),
        color: z.string().min(1, "Color is required"),
        material: z.string().min(1, "Material is required"),
        price: z.coerce.number().min(0, "Price must be at least 0"),
        printType: z.string().optional(),
      })
    )
    .min(1, "At least one item is required"),
  design: z.object({
    description: z.string().min(1, "Design description is required"),
    placement: z.string().optional(),
    colors: z.array(z.string()).optional(),
    mockupUrl: z.string().optional(),
  }),
  payment: z.object({
    status: z.enum(["Pending", "Paid", "Refunded"]),
    method: z.string().min(1, "Payment method is required"),
    amount: z.coerce.number().min(0, "Amount must be at least 0"),
    tax: z.coerce.number().min(0, "Tax must be at least 0"),
    discount: z.coerce
      .number()
      .min(0, "Discount must be at least 0")
      .optional(),
    shipping: z.coerce
      .number()
      .min(0, "Shipping cost must be at least 0")
      .optional(),
    total: z.coerce.number().min(0, "Total must be at least 0"),
  }),
  notes: z.string().optional(),
});

type OrderFormValues = z.infer<typeof orderFormSchema>;

// Size options for the form
const sizeOptions = [
  { value: "xs", label: "XS" },
  { value: "s", label: "S" },
  { value: "m", label: "M" },
  { value: "l", label: "L" },
  { value: "xl", label: "XL" },
  { value: "xxl", label: "2XL" },
];

// Color options for the form
const colorOptions = [
  { value: "black", label: "Black" },
  { value: "white", label: "White" },
  { value: "navy", label: "Navy" },
  { value: "red", label: "Red" },
  { value: "grey", label: "Grey" },
  { value: "blue", label: "Blue" },
];

// Material options for the form
const materialOptions = [
  { value: "cotton", label: "100% Cotton" },
  { value: "poly_cotton", label: "Poly-Cotton" },
  { value: "polyester", label: "Polyester" },
];

// Print type options for the form
const printTypeOptions = [
  { value: "screen", label: "Screen Print" },
  { value: "digital", label: "Digital Print" },
  { value: "embroidery", label: "Embroidery" },
  { value: "vinyl", label: "Vinyl" },
];

// Placement options for the form
const placementOptions = [
  { value: "front_center", label: "Front Center" },
  { value: "back_center", label: "Back Center" },
  { value: "left_chest", label: "Left Chest" },
  { value: "right_sleeve", label: "Right Sleeve" },
  { value: "left_sleeve", label: "Left Sleeve" },
];

// Payment method options
const paymentMethodOptions = [
  { value: "credit_card", label: "Credit Card" },
  { value: "bank_transfer", label: "Bank Transfer" },
  { value: "paypal", label: "PayPal" },
  { value: "cash", label: "Cash" },
  { value: "invoice", label: "Invoice" },
];

interface OrderFormProps {
  initialData?: Order;
  onSubmit: (data: OrderFormValues) => void;
  isSubmitting: boolean;
  onCancel: () => void;
  isEditing?: boolean;
}

export function OrderForm({
  initialData,
  onSubmit,
  isSubmitting,
  onCancel,
  isEditing = false,
}: OrderFormProps) {
  const [activeTab, setActiveTab] = useState("customer");

  // Transform initial data to form values if provided
  const getDefaultValues = () => {
    if (!initialData) {
      return {
        customer: { id: "", name: "", email: "", phone: "", company: "" },
        status: "Pending" as const,
        dueDate: new Date(),
        items: [
          {
            product: { id: "", name: "" },
            quantity: 1,
            size: "m",
            color: "black",
            material: "cotton",
            price: 0,
            printType: "screen",
          },
        ],
        design: {
          description: "",
          placement: "front_center",
          colors: [],
          mockupUrl: "",
        },
        payment: {
          status: "Pending" as const,
          method: "credit_card",
          amount: 0,
          tax: 0,
          discount: 0,
          shipping: 0,
          total: 0,
        },
        notes: "",
      };
    }

    // Transform initialData to form values
    return {
      customer: {
        id: initialData.customer.id,
        name: initialData.customer.name,
        email: initialData.customer.email,
        phone: initialData.customer.phone,
        company: initialData.customer.company || "",
      },
      status: initialData.status,
      dueDate: new Date(initialData.dueDate),
      items: initialData.items.map((item) => ({
        product:
          typeof item.product === "string"
            ? { id: item.product, name: item.product }
            : { id: item.product.id, name: item.product.name },
        quantity: item.quantity,
        size: item.size,
        color: item.color,
        material: item.material,
        price: item.price,
        printType: item.printType || "screen",
      })),
      design: {
        description: initialData.design.description,
        placement: initialData.design.placement || "front_center",
        colors: initialData.design.colors || [],
        mockupUrl: initialData.design.mockupUrl || "",
      },
      payment: {
        status: initialData.payment.status,
        method: initialData.payment.method,
        amount: initialData.payment.amount,
        tax: initialData.payment.tax,
        discount: initialData.payment.discount || 0,
        shipping: initialData.payment.shipping || 0,
        total: initialData.payment.total,
      },
      notes: initialData.notes || "",
    };
  };

  // Initialize form
  const form = useForm<OrderFormValues>({
    resolver: zodResolver(orderFormSchema),
    defaultValues: getDefaultValues(),
  });

  // Calculate total based on items, tax, discount, and shipping
  useEffect(() => {
    const items = form.watch("items");
    const tax = form.watch("payment.tax") || 0;
    const discount = form.watch("payment.discount") || 0;
    const shipping = form.watch("payment.shipping") || 0;

    if (items && items.length > 0) {
      const subtotal = items.reduce((sum, item) => {
        return sum + (item.price || 0) * (item.quantity || 0);
      }, 0);

      const total = subtotal + tax + shipping - discount;

      form.setValue("payment.amount", subtotal);
      form.setValue("payment.total", total);
    }
  }, [
    form.watch("items"),
    form.watch("payment.tax"),
    form.watch("payment.discount"),
    form.watch("payment.shipping"),
    form,
  ]);

  // Add a new item to the order
  const addItem = () => {
    const currentItems = form.getValues("items") || [];
    form.setValue("items", [
      ...currentItems,
      {
        product: { id: "", name: "" },
        quantity: 1,
        size: "m",
        color: "black",
        material: "cotton",
        price: 0,
        printType: "screen",
      },
    ]);
  };

  // Remove an item from the order
  const removeItem = (index: number) => {
    const currentItems = form.getValues("items") || [];
    if (currentItems.length > 1) {
      form.setValue(
        "items",
        currentItems.filter((_, i) => i !== index)
      );
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-4 mb-6">
            <TabsTrigger value="customer">Customer & Details</TabsTrigger>
            <TabsTrigger value="items">Order Items</TabsTrigger>
            <TabsTrigger value="design">Design Info</TabsTrigger>
            <TabsTrigger value="payment">Payment & Notes</TabsTrigger>
          </TabsList>

          <Form {...form} onSubmit={form?.handleSubmit(onSubmit) as any}>
            <>
              <TabsContent value="customer" className="space-y-6 mt-0">
                <div className="space-y-6">
                  <div className="space-y-6">
                    <h3 className="text-lg font-medium mb-4">
                      Customer Information
                    </h3>

                    {/* Customer Selector */}
                    <CustomerSelector form={form} name="customer" />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Status */}

                    <FormField
                      control={form.control}
                      name="status"
                      render={({ field }: { field: any }) => (
                        <FormItem>
                          <FormLabel>Order Status</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select status" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Pending">Pending</SelectItem>
                              <SelectItem value="Processing">
                                Processing
                              </SelectItem>
                              <SelectItem value="Completed">
                                Completed
                              </SelectItem>
                              <SelectItem value="Shipped">Shipped</SelectItem>
                              <SelectItem value="Cancelled">
                                Cancelled
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Due Date */}
                    <FormField
                      control={form.control}
                      name="dueDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Due Date</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "w-full pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, "PPP")
                                  ) : (
                                    <span>Pick a date</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent
                              className="w-auto p-0"
                              align="start"
                            >
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="items" className="mt-0">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium">Order Items</h3>
                    <Button
                      type="button"
                      onClick={addItem}
                      variant="outline"
                      size="sm"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add Item
                    </Button>
                  </div>

                  {form.watch("items")?.map((_, index) => (
                    <Card key={index} className="p-4 border">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        {/* Product */}
                        <FormField
                          control={form.control}
                          name={`items.${index}.product`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Product</FormLabel>
                              <ProductSelector
                                value={field.value}
                                onChange={field.onChange}
                                onPriceChange={(price) => {
                                  form.setValue(`items.${index}.price`, price);
                                }}
                              />
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* Quantity */}
                        <FormField
                          control={form.control}
                          name={`items.${index}.quantity`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Quantity</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  min={1}
                                  {...field}
                                  onChange={(e) => {
                                    field.onChange(Number(e.target.value));
                                  }}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        {/* Size */}
                        <FormField
                          control={form.control}
                          name={`items.${index}.size`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Size</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select size" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {sizeOptions.map((option) => (
                                    <SelectItem
                                      key={option.value}
                                      value={option.value}
                                    >
                                      {option.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        {/* Color */}
                        <FormField
                          control={form.control}
                          name={`items.${index}.color`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Color</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select color" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {colorOptions.map((option) => (
                                    <SelectItem
                                      key={option.value}
                                      value={option.value}
                                    >
                                      {option.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        // src/components/dashboard/orders/order-form.tsx
                        (continued)
                        {/* Material */}
                        <FormField
                          control={form.control}
                          name={`items.${index}.material`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Material</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select material" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {materialOptions.map((option) => (
                                    <SelectItem
                                      key={option.value}
                                      value={option.value}
                                    >
                                      {option.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Print Type */}
                        <FormField
                          control={form.control}
                          name={`items.${index}.printType`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Print Type</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select print type" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {printTypeOptions.map((option) => (
                                    <SelectItem
                                      key={option.value}
                                      value={option.value}
                                    >
                                      {option.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* Price */}
                        <div className="flex items-end gap-4">
                          <FormField
                            control={form.control}
                            name={`items.${index}.price`}
                            render={({ field }) => (
                              <FormItem className="flex-1">
                                <FormLabel>Price per unit</FormLabel>
                                <FormControl>
                                  <Input
                                    type="number"
                                    min={0}
                                    step={0.01}
                                    {...field}
                                    onChange={(e) => {
                                      field.onChange(Number(e.target.value));
                                    }}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          {/* Remove Item Button */}
                          {form.watch("items").length > 1 && (
                            <Button
                              type="button"
                              onClick={() => removeItem(index)}
                              variant="ghost"
                              size="icon"
                              className="mb-2 text-red-500 hover:text-red-700"
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="design" className="mt-0">
                <div className="space-y-6">
                  <h3 className="text-lg font-medium">Design Information</h3>

                  {/* Design Description */}
                  <FormField
                    control={form.control}
                    name="design.description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Design Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Describe the design requirements"
                            className="min-h-[100px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Design Placement */}
                    <FormField
                      control={form.control}
                      name="design.placement"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Placement</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select placement" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {placementOptions.map((option) => (
                                <SelectItem
                                  key={option.value}
                                  value={option.value}
                                >
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Design Mockup URL */}
                    <FormField
                      control={form.control}
                      name="design.mockupUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Mockup URL (Optional)</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter URL to design mockup"
                              {...field}
                              value={field.value || ""}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="payment" className="mt-0">
                <div className="space-y-6">
                  <h3 className="text-lg font-medium">Payment Information</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Payment Status */}
                    <FormField
                      control={form.control}
                      name="payment.status"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Payment Status</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select status" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Pending">Pending</SelectItem>
                              <SelectItem value="Paid">Paid</SelectItem>
                              <SelectItem value="Refunded">Refunded</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Payment Method */}
                    <FormField
                      control={form.control}
                      name="payment.method"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Payment Method</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select method" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {paymentMethodOptions.map((option) => (
                                <SelectItem
                                  key={option.value}
                                  value={option.value}
                                >
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Order Subtotal (Read-only) */}
                  <FormField
                    control={form.control}
                    name="payment.amount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Subtotal</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min={0}
                            step={0.01}
                            readOnly
                            {...field}
                            onChange={(e) => {
                              field.onChange(Number(e.target.value));
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Tax */}
                    <FormField
                      control={form.control}
                      name="payment.tax"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tax</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min={0}
                              step={0.01}
                              {...field}
                              onChange={(e) => {
                                field.onChange(Number(e.target.value));
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Discount */}
                    <FormField
                      control={form.control}
                      name="payment.discount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Discount</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min={0}
                              step={0.01}
                              {...field}
                              onChange={(e) => {
                                field.onChange(Number(e.target.value));
                              }}
                              value={field.value || 0}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Shipping */}
                    <FormField
                      control={form.control}
                      name="payment.shipping"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Shipping Cost</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min={0}
                              step={0.01}
                              {...field}
                              onChange={(e) => {
                                field.onChange(Number(e.target.value));
                              }}
                              value={field.value || 0}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Total (Read-only) */}
                  <FormField
                    control={form.control}
                    name="payment.total"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Total</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min={0}
                            step={0.01}
                            readOnly
                            className="font-bold"
                            {...field}
                            onChange={(e) => {
                              field.onChange(Number(e.target.value));
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Notes */}
                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Order Notes (Optional)</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Add any additional notes about this order"
                            className="min-h-[100px]"
                            {...field}
                            value={field.value || ""}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </TabsContent>

              <div className="flex justify-end gap-4 mt-8 pt-4 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onCancel}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting
                    ? isEditing
                      ? "Updating..."
                      : "Creating..."
                    : isEditing
                      ? "Update Order"
                      : "Create Order"}
                </Button>
              </div>
            </>
          </Form>
        </Tabs>
      </CardContent>
    </Card>
  );
}
