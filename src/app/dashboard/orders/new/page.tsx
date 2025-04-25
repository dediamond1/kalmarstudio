"use client";

import { useState, useEffect } from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, Plus, Search, Trash, ArrowLeft } from "lucide-react";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import type { ICustomer } from "@/models/customer.model";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { getProducts, getProductsForOrderSelection } from "@/lib/api/products";

// Define the form schema
const orderFormSchema = z.object({
  customer: z.string().min(1, "Customer is required"),
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
        product: z.string().min(1, "Product is required"),
        quantity: z.coerce.number().min(1, "Quantity must be at least 1"),
        size: z.string().min(1, "Size is required"),
        color: z.string().min(1, "Color is required"),
        material: z.string().min(1, "Material is required"),
        printType: z.string().optional(),
        price: z.coerce.number().min(0, "Price must be at least 0"),
      })
    )
    .min(1, "At least one item is required"),
  design: z.object({
    description: z.string().min(1, "Design description is required"),
    placement: z.string().optional(),
    mockupUrl: z.string().optional(),
    colors: z.array(z.string()).optional(),
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
    total: z.coerce.number().min(0, "Total must be at least 0"),
  }),
  notes: z.string().optional(),
});

type OrderFormValues = z.infer<typeof orderFormSchema>;

// Payment method options
const paymentMethods = [
  { value: "credit_card", label: "Credit Card" },
  { value: "bank_transfer", label: "Bank Transfer" },
  { value: "paypal", label: "PayPal" },
  { value: "cash", label: "Cash" },
];

// Placement options
const placementOptions = [
  { value: "front_center", label: "Front Center" },
  { value: "back_center", label: "Back Center" },
  { value: "left_chest", label: "Left Chest" },
  { value: "right_chest", label: "Right Chest" },
  { value: "left_sleeve", label: "Left Sleeve" },
  { value: "right_sleeve", label: "Right Sleeve" },
];

// Print type options
const printTypeOptions = [
  { value: "digital", label: "Digital Print" },
  { value: "screen", label: "Screen Print" },
  { value: "embroidery", label: "Embroidery" },
  { value: "heat_transfer", label: "Heat Transfer" },
  { value: "vinyl", label: "Vinyl" },
];

export default function NewOrderPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [customers, setCustomers] = useState<ICustomer[]>([]);
  const [isLoadingCustomers, setIsLoadingCustomers] = useState(true);
  const [customerSearchQuery, setCustomerSearchQuery] = useState("");
  const [openCustomerCombobox, setOpenCustomerCombobox] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const router = useRouter();

  // Setup form with default values
  const form = useForm<OrderFormValues>({
    resolver: zodResolver(orderFormSchema),
    defaultValues: {
      customer: "",
      status: "Pending",
      dueDate: new Date(),
      items: [
        {
          product: "",
          quantity: 1,
          size: "",
          color: "",
          material: "",
          printType: "digital",
          price: 0,
        },
      ],
      design: {
        description: "",
        placement: "front_center",
        colors: [],
      },
      payment: {
        status: "Pending",
        method: "credit_card",
        amount: 0,
        tax: 0,
        discount: 0,
        total: 0,
      },
      notes: "",
    },
  });

  // Setup field array for order items
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  // Fetch customers when component mounts
  useEffect(() => {
    async function fetchCustomers() {
      try {
        setIsLoadingCustomers(true);
        const response = await fetch("/api/customers");
        const data = await response.json();
        setCustomers(data);
      } catch (error) {
        console.error("Failed to fetch customers:", error);
        toast.error("Failed to load customers");
      } finally {
        setIsLoadingCustomers(false);
      }
    }

    async function fetchProducts() {
      try {
        setIsLoadingProducts(true);
        const productsData = await getProducts();
        console.log("Products fetched successfully:", productsData);
        setProducts(productsData || []);
        setIsLoadingProducts(false);
      } catch (error) {
        console.error("Failed to fetch products:", error);
        toast.error("Failed to load products. Please try again later.");
        // Set empty array to prevent null errors
        setProducts([]);
      } finally {
        setIsLoadingProducts(false);
      }
    }

    fetchCustomers();
    fetchProducts();
  }, []);

  // Filter customers based on search query
  const filteredCustomers = customers.filter((customer) => {
    if (!customerSearchQuery) return true;

    const query = customerSearchQuery.toLowerCase();
    return (
      customer.name.toLowerCase().includes(query) ||
      customer.email.toLowerCase().includes(query) ||
      (customer.company && customer.company.toLowerCase().includes(query))
    );
  });

  // Handle product selection
  const handleProductChange = (index: number, productId: string) => {
    const selectedProduct = products.find((p) => p.id === productId);
    if (selectedProduct) {
      // Set base price
      form.setValue(`items.${index}.price`, selectedProduct.basePrice || 0);

      // Set default size if available
      if (
        selectedProduct.availableSizes &&
        selectedProduct.availableSizes.length > 0
      ) {
        form.setValue(`items.${index}.size`, selectedProduct.availableSizes[0]);
      }

      // Set default color if available
      if (selectedProduct.colors && selectedProduct.colors.length > 0) {
        form.setValue(`items.${index}.color`, selectedProduct.colors[0]);
      }

      // Set default material if available
      if (selectedProduct.materials && selectedProduct.materials.length > 0) {
        form.setValue(`items.${index}.material`, selectedProduct.materials[0]);
      }
    }
  };

  // Get available sizes, colors, and materials for a selected product
  const getProductOptions = (
    productId: string,
    option: "availableSizes" | "colors" | "materials"
  ) => {
    if (!productId) return [];

    const product = products.find((p) => p.id === productId);
    if (!product) return [];

    return product[option] || [];
  };

  // Calculate totals when items change
  useEffect(() => {
    const items = form.watch("items");
    const tax = form.watch("payment.tax") || 0;
    const discount = form.watch("payment.discount") || 0;

    if (items && items.length > 0) {
      const subtotal = items.reduce((sum, item) => {
        return sum + (item.price || 0) * (item.quantity || 0);
      }, 0);

      const total = subtotal + tax - discount;

      form.setValue("payment.amount", subtotal);
      form.setValue("payment.total", total);
    }
  }, [
    form.watch("items"),
    form.watch("payment.tax"),
    form.watch("payment.discount"),
  ]);

  async function onSubmit(values: OrderFormValues) {
    setIsSubmitting(true);

    try {
      const selectedCustomer = customers.find((c) => c._id === values.customer);

      if (!selectedCustomer) {
        throw new Error("Customer not found");
      }

      const orderData = {
        customer: values.customer,
        status: values.status,
        dueDate: values.dueDate,
        items: values.items.map((item) => ({
          product: item.product,
          quantity: item.quantity,
          size: item.size,
          color: item.color,
          material: item.material,
          printType: item.printType || "digital",
          price: item.price,
        })),
        design: {
          description: values.design.description,
          placement: values.design.placement || "front_center",
          colors: values.design.colors || [],
          mockupUrl: values.design.mockupUrl,
        },
        payment: {
          status: values.payment.status,
          method: values.payment.method,
          amount: values.payment.amount,
          tax: values.payment.tax,
          discount: values.payment.discount,
          total: values.payment.total,
        },
        notes: values.notes,
      };

      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || "Failed to create order");
      }

      toast.success("Order created successfully");
      router.push("/dashboard/orders");
    } catch (error: any) {
      toast.error(error.message || "Failed to create order");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" asChild className="-ml-2">
              <Link href="/dashboard/orders">
                <ArrowLeft className="h-4 w-4" />
                Back
              </Link>
            </Button>
          </div>
          <h2 className="text-2xl font-bold tracking-tight">
            Create New Order
          </h2>
          <p className="text-muted-foreground">
            Fill in the details below to create a new order
          </p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Customer Section */}
            <Card>
              <CardHeader>
                <CardTitle>Customer Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="customer"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Customer</FormLabel>
                      <Popover
                        open={openCustomerCombobox}
                        onOpenChange={setOpenCustomerCombobox}
                      >
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              role="combobox"
                              aria-expanded={openCustomerCombobox}
                              className={cn(
                                "w-full justify-between",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value
                                ? customers.find(
                                    (customer) => customer._id === field.value
                                  )?.name || "Select customer"
                                : "Select customer"}
                              <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-full p-0">
                          <Command>
                            <CommandInput
                              placeholder="Search customers..."
                              value={customerSearchQuery}
                              onValueChange={setCustomerSearchQuery}
                            />
                            <CommandList>
                              <CommandEmpty>No customers found.</CommandEmpty>
                              <CommandGroup>
                                {isLoadingCustomers ? (
                                  <div className="p-2 text-center">
                                    Loading customers...
                                  </div>
                                ) : (
                                  filteredCustomers.map((customer, index) => (
                                    <CommandItem
                                      key={index}
                                      value={customer._id}
                                      onSelect={() => {
                                        form.setValue("customer", customer._id);
                                        setOpenCustomerCombobox(false);
                                      }}
                                    >
                                      <div className="flex flex-col">
                                        <span>{customer.name}</span>
                                        <span className="text-xs text-muted-foreground">
                                          {customer.email}{" "}
                                          {customer.company
                                            ? `(${customer.company})`
                                            : ""}
                                        </span>
                                      </div>
                                    </CommandItem>
                                  ))
                                )}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
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
                          <SelectItem value="Processing">Processing</SelectItem>
                          <SelectItem value="Completed">Completed</SelectItem>
                          <SelectItem value="Shipped">Shipped</SelectItem>
                          <SelectItem value="Cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="dueDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Due Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
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
                        <PopoverContent className="w-auto p-0" align="start">
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

                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notes</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Add any additional notes here"
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Design Section */}
            <Card>
              <CardHeader>
                <CardTitle>Design Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="design.description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Design Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe the design"
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

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
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="design.mockupUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mockup URL</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter mockup URL" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </div>

          {/* Order Items Section */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Order Items</CardTitle>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  append({
                    product: "",
                    quantity: 1,
                    size: "",
                    color: "",
                    material: "",
                    printType: "digital",
                    price: 0,
                  })
                }
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Item
              </Button>
            </CardHeader>
            <CardContent>
              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="grid gap-4 mb-6 p-4 border rounded-md"
                >
                  <FormField
                    control={form.control}
                    name={`items.${index}.product`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Product</FormLabel>
                        <Select
                          onValueChange={(value) => {
                            field.onChange(value);
                            handleProductChange(index, value);
                          }}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select product" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {isLoadingProducts ? (
                              <SelectItem value="" disabled>
                                Loading products...
                              </SelectItem>
                            ) : products && products.length > 0 ? (
                              products.map((product) => (
                                <SelectItem key={product.id} value={product.id}>
                                  {product.name} - $
                                  {product.basePrice?.toFixed(2) || "0.00"}
                                </SelectItem>
                              ))
                            ) : (
                              <SelectItem value="" disabled>
                                No products available
                              </SelectItem>
                            )}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name={`items.${index}.size`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Size</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Size" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {getProductOptions(
                                form.getValues(`items.${index}.product`),
                                "availableSizes"
                              ).map((size: string) => (
                                <SelectItem key={size} value={size}>
                                  {size.toUpperCase()}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`items.${index}.color`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Color</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Color" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {getProductOptions(
                                form.getValues(`items.${index}.product`),
                                "colors"
                              ).map((color: string) => (
                                <SelectItem key={color} value={color}>
                                  {color.charAt(0).toUpperCase() +
                                    color.slice(1)}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`items.${index}.material`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Material</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Material" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {getProductOptions(
                                form.getValues(`items.${index}.product`),
                                "materials"
                              ).map((material: string) => (
                                <SelectItem key={material} value={material}>
                                  {material.charAt(0).toUpperCase() +
                                    material.slice(1)}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name={`items.${index}.quantity`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Quantity</FormLabel>
                          <FormControl>
                            <Input type="number" min={1} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`items.${index}.printType`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Print Type</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Print Type" />
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

                    <FormField
                      control={form.control}
                      name={`items.${index}.price`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Unit Price</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min={0}
                              step={0.01}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="flex justify-end">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => remove(index)}
                      disabled={fields.length === 1}
                      className="text-red-500"
                    >
                      <Trash className="h-4 w-4" />
                      <span className="sr-only">Remove item</span>
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Payment Section */}
          <Card>
            <CardHeader>
              <CardTitle>Payment Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                          {paymentMethods.map((method) => (
                            <SelectItem key={method.value} value={method.value}>
                              {method.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

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
                        {...field}
                        disabled
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="payment.tax"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tax</FormLabel>
                      <FormControl>
                        <Input type="number" min={0} step={0.01} {...field} />
                      </FormControl>
                      <FormDescription>Applied tax amount</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="payment.discount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Discount</FormLabel>
                      <FormControl>
                        <Input type="number" min={0} step={0.01} {...field} />
                      </FormControl>
                      <FormDescription>Discount amount</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

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
                        {...field}
                        disabled
                        className="font-bold"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Form Actions */}
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/dashboard/orders")}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating Order..." : "Create Order"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
