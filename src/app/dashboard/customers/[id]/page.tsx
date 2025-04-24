"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface UpdateCustomerDto {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country: string;
  };
  taxId?: string;
  notes?: string;
}

export default function CustomerDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<UpdateCustomerDto>();
  const [customerId, setCustomerId] = useState("");

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const response = await axios.get(`/api/customers/${id}`);
        form.reset(response.data);
        setCustomerId(id);
      } catch (error) {
        toast.error("Failed to load customer");
        router.push("/dashboard/customers");
      }
      setLoading(false);
    };

    fetchCustomer();
  }, [id]);

  const onSubmit = async (data: UpdateCustomerDto) => {
    try {
      setIsSubmitting(true);
      await axios.post("/api/customers/update", {
        id: customerId,
        data,
      });
      toast.success("Customer updated successfully");
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.error || "Failed to update customer");
      } else {
        toast.error("Failed to update customer");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Customer Details</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" {...form.register("name")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" {...form.register("email")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" {...form.register("phone")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company">Company</Label>
              <Input id="company" {...form.register("company")} />
            </div>
            <div className="space-y-2">
              <Label>Address</Label>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label htmlFor="street">Street</Label>
                  <Input id="street" {...form.register("address.street")} />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="city">City</Label>
                  <Input id="city" {...form.register("address.city")} />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="state">State</Label>
                  <Input id="state" {...form.register("address.state")} />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="postalCode">Postal Code</Label>
                  <Input
                    id="postalCode"
                    {...form.register("address.postalCode")}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="country">Country</Label>
                  <Input id="country" {...form.register("address.country")} />
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="taxId">Tax ID</Label>
              <Input id="taxId" {...form.register("taxId")} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Input id="notes" {...form.register("notes")} />
          </div>
          <div className="flex gap-2">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
            <Button
              variant="outline"
              type="button"
              onClick={() => router.push("/dashboard/customers")}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
