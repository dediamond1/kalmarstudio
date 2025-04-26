// src/components/dashboard/orders/order-status-badge.tsx

import { Badge } from "@/components/ui/badge";

interface OrderStatusBadgeProps {
  status: string;
  className?: string;
}

export function OrderStatusBadge({ status, className }: OrderStatusBadgeProps) {
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "Completed":
        return "secondary";
      case "Processing":
        return "default";
      case "Shipped":
        return "outline";
      case "Pending":
        return "default";
      case "Cancelled":
        return "destructive";
      default:
        return "outline";
    }
  };

  return (
    <Badge variant={getStatusBadgeVariant(status)} className={className}>
      {status}
    </Badge>
  );
}
