"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { toast } from "sonner";
import type { Order } from "@/types/order";
import { useQuery } from "@tanstack/react-query";
import { getCustomers } from "@/lib/api/customers";
import { z } from "zod";
import type { ICustomer } from "@/models/customer.model";

const orderFormSchema = z.object({
  customer: z.string().min(1, "Customer is required"),
  // Add other form fields here
});

interface OrderFormProps {
  order?: Order;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function OrderForm({
  order,
  onSuccess,
  onCancel,
}: OrderFormProps) {
  const {
    data: customers,
    isLoading,
    error,
  } = useQuery<ICustomer[]>({
    queryKey: ["customers"],
    queryFn: getCustomers,
  });

  if (isLoading) return <div>Loading customers...</div>;
  if (error) return <div>Failed to load customers</div>;
  if (!customers?.length) return <div>No customers found</div>;

  const form = useForm<z.infer<typeof orderFormSchema>>({
    resolver: zodResolver(orderFormSchema),
    defaultValues: {
      customer: order?.customer.id || "",
      // Initialize other form fields
    },
  });

  async function onSubmit(values: z.infer<typeof orderFormSchema>) {
    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customer: values.customer,
          // Include other form values
        }),
      });

      if (!response.ok) throw new Error("Failed to create order");

      toast.success("Order created successfully");
      onSuccess?.();
    } catch (error) {
      toast.error("Failed to create order");
    }
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="customer"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Customer</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a customer" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {customers?.map((customer: ICustomer) => (
                    <SelectItem key={customer._id} value={customer._id}>
                      {customer.name} ({customer.email})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Add other form fields here */}
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">
            {order ? "Update Order" : "Create Order"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
