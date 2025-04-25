"use client";

import { useState, useEffect, use } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  ArrowLeft,
  Edit,
  Trash,
  Mail,
  Phone,
  Building,
  MapPin,
} from "lucide-react";
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
import { Separator } from "@/components/ui/separator";
import { getCustomer, deleteCustomer } from "@/lib/api/customers";
import { getCountryByCode } from "@/lib/countries";
import type { Customer } from "@/types/customer";

export default function CustomerDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const router = useRouter();
  const customerId = use(params).id;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const customerData = await getCustomer(customerId);
        setCustomer(customerData);
      } catch (error) {
        console.error("Error fetching customer:", error);
        toast.error(
          error instanceof Error
            ? error.message
            : "Failed to load customer details"
        );
        router.push("/dashboard/customers");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [customerId, router]);

  const handleDelete = async () => {
    try {
      await deleteCustomer(customerId);
      toast.success("Customer deleted successfully");
      router.push("/dashboard/customers");
    } catch (error: unknown) {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete customer"
      );
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-center">
          <p>Loading customer details...</p>
        </div>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-center">
          <p>Customer not found</p>
          <Button variant="outline" className="mt-4" asChild>
            <Link href="/dashboard/customers">Back to Customers</Link>
          </Button>
        </div>
      </div>
    );
  }

  const countryName = customer.address?.country
    ? getCountryByCode(customer.address.country)?.name ||
      customer.address.country
    : "";

  const addressLines = [];
  if (customer.address?.street) addressLines.push(customer.address.street);
  if (customer.address?.city || customer.address?.state) {
    const cityState = [customer.address.city, customer.address.state]
      .filter(Boolean)
      .join(", ");
    if (cityState) addressLines.push(cityState);
  }
  if (customer.address?.postalCode)
    addressLines.push(customer.address.postalCode);
  if (countryName) addressLines.push(countryName);

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <Button variant="ghost" size="sm" asChild className="-ml-2 mb-1">
            <Link href="/dashboard/customers" className="flex items-center">
              /* Continuing from where we left off */
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Customers
            </Link>
          </Button>
          <h2 className="text-2xl font-bold tracking-tight">{customer.name}</h2>
          <div className="flex items-center gap-2">
            {customer.company && (
              <Badge variant="outline">{customer.company}</Badge>
            )}
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
            <Link href={`/dashboard/customers/${customerId}/edit`}>
              <Edit className="h-4 w-4 mr-1" />
              Edit
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Customer Contact Details */}
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3">
              <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <h3 className="text-sm font-medium">Email</h3>
                <p className="text-sm">{customer.email}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <h3 className="text-sm font-medium">Phone</h3>
                <p className="text-sm">{customer.phone}</p>
              </div>
            </div>

            {customer.company && (
              <div className="flex items-start gap-3">
                <Building className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <h3 className="text-sm font-medium">Company</h3>
                  <p className="text-sm">{customer.company}</p>
                </div>
              </div>
            )}

            {customer.taxId && (
              <div className="flex items-start gap-3">
                <div className="h-5 w-5 flex items-center justify-center text-muted-foreground">
                  #
                </div>
                <div>
                  <h3 className="text-sm font-medium">Tax ID</h3>
                  <p className="text-sm">{customer.taxId}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Customer Address */}
        <Card>
          <CardHeader>
            <CardTitle>Address</CardTitle>
          </CardHeader>
          <CardContent>
            {addressLines.length > 0 ? (
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  {addressLines.map((line, index) => (
                    <p key={index} className="text-sm">
                      {line}
                    </p>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">
                No address provided
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Notes Section */}
      {customer.notes && (
        <Card>
          <CardHeader>
            <CardTitle>Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">{customer.notes}</p>
          </CardContent>
        </Card>
      )}

      {/* Order History Section - This would be added once order-customer relationship is implemented */}
      <Card>
        <CardHeader>
          <CardTitle>Order History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <p className="text-muted-foreground text-sm">
              No order history available
            </p>
            <Button variant="outline" size="sm" className="mt-2" asChild>
              <Link href={`/dashboard/orders/new?customerId=${customerId}`}>
                Create New Order
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
              Are you sure you want to delete the customer "{customer.name}"?
              This action cannot be undone.
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
