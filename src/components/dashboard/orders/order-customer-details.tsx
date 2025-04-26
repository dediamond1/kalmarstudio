// src/components/dashboard/orders/order-customer-details.tsx

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Phone, Building } from "lucide-react";

interface OrderCustomerDetailsProps {
  customer: {
    id: string;
    name: string;
    email: string;
    phone: string;
    company?: string;
  };
}

export function OrderCustomerDetails({ customer }: OrderCustomerDetailsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Customer Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="text-sm font-medium">Contact Details</h3>
          <div className="space-y-2 mt-2">
            <div className="flex items-start gap-2">
              <Mail className="h-4 w-4 mt-0.5 text-muted-foreground" />
              <div>
                <p className="text-sm">{customer.name}</p>
                <p className="text-sm text-muted-foreground">
                  {customer.email}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Phone className="h-4 w-4 mt-0.5 text-muted-foreground" />
              <p className="text-sm">{customer.phone}</p>
            </div>
            {customer.company && (
              <div className="flex items-start gap-2">
                <Building className="h-4 w-4 mt-0.5 text-muted-foreground" />
                <p className="text-sm">{customer.company}</p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
