"use client";

import { Order } from "@/types/order";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu";

interface OrdersTableProps {
  orders: Order[];
  loading: boolean;
  onOrderDelete: (orderId: string) => void;
  onStatusUpdate: (orderId: string, status: string) => void;
}

export function OrdersTable({
  orders,
  loading,
  onOrderDelete,
  onStatusUpdate,
}: OrdersTableProps) {
  if (loading) {
    return <div>Loading orders...</div>;
  }

  if (orders.length === 0) {
    return <div>No orders found</div>;
  }

  const statusVariant = {
    Pending: "destructive",
    Processing: "secondary",
    Completed: "default",
    Shipped: "secondary",
    Cancelled: "destructive",
  } as const;

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Order ID</TableHead>
          <TableHead>Customer</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Total</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders.map((order) => (
          <TableRow key={order._id}>
            <TableCell className="font-medium">
              #{order.customerEmail?.slice(0, 3).toUpperCase()}-
              {order._id.toString().slice(-6).toUpperCase()}
            </TableCell>
            <TableCell>{order.customerEmail || "No email"}</TableCell>
            <TableCell>
              {new Date(order.createdAt).toLocaleDateString()}
            </TableCell>
            <TableCell>
              <Badge variant={statusVariant[order.status]}>
                {order.status}
              </Badge>
            </TableCell>
            <TableCell>
              ${order.payment?.amount?.toFixed(2) || "0.00"}
            </TableCell>
            <TableCell>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onOrderDelete(order._id)}>
                    Delete
                  </DropdownMenuItem>
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger>
                      Update Status
                    </DropdownMenuSubTrigger>
                    <DropdownMenuSubContent>
                      {Object.keys(statusVariant).map((status) => (
                        <DropdownMenuItem
                          key={status}
                          onClick={() => onStatusUpdate(order._id, status)}
                        >
                          {status}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuSubContent>
                  </DropdownMenuSub>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
