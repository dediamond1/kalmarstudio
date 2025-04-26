// src/components/dashboard/orders/order-payment-details.tsx

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { OrderPayment } from "@/types/order";

interface OrderPaymentDetailsProps {
  payment: OrderPayment;
}

export function OrderPaymentDetails({ payment }: OrderPaymentDetailsProps) {
  const getPaymentStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "Paid":
        return "secondary";
      case "Pending":
        return "default";
      case "Refunded":
        return "destructive";
      default:
        return "outline";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between">
          <div>
            <h3 className="text-sm font-medium">Payment Status</h3>
            <Badge
              variant={getPaymentStatusBadgeVariant(payment.status)}
              className="mt-1"
            >
              {payment.status}
            </Badge>
          </div>
          <div className="text-right">
            <h3 className="text-sm font-medium">Payment Method</h3>
            <p className="text-sm mt-1">{payment.method}</p>
          </div>
        </div>

        <Separator />

        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm">Subtotal</span>
            <span className="text-sm font-medium">
              ${payment.amount.toFixed(2)}
            </span>
          </div>

          {payment.tax > 0 && (
            <div className="flex justify-between">
              <span className="text-sm">Tax</span>
              <span className="text-sm font-medium">
                ${payment.tax.toFixed(2)}
              </span>
            </div>
          )}

          {payment.discount && payment.discount > 0 && (
            <div className="flex justify-between">
              <span className="text-sm">Discount</span>
              <span className="text-sm font-medium text-green-600">
                -${payment.discount.toFixed(2)}
              </span>
            </div>
          )}

          {payment.shipping && payment.shipping > 0 && (
            <div className="flex justify-between">
              <span className="text-sm">Shipping</span>
              <span className="text-sm font-medium">
                ${payment.shipping.toFixed(2)}
              </span>
            </div>
          )}

          <Separator />

          <div className="flex justify-between text-lg font-bold">
            <span>Total</span>
            <span>${payment.total.toFixed(2)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
