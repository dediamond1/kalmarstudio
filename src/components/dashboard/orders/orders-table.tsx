// src/components/dashboard/orders/orders-table.tsx

import { useState } from "react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ArrowUpDown, MoreHorizontal, Plus } from "lucide-react";
import Link from "next/link";
import { Order } from "@/types/order";
import { toast } from "sonner";
import { deleteOrder } from "@/lib/api/orders";

interface OrdersTableProps {
  orders: Order[];
  loading: boolean;
  onOrderDelete: (orderId: string) => void;
}

export function OrdersTable({
  orders,
  loading,
  onOrderDelete,
}: OrdersTableProps) {
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState<string | null>(null);
  const [sortField, setSortField] = useState<string>("createdAt");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  // Handle sort toggle
  const handleSort = (field: string) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Handle order deletion
  const handleDelete = async () => {
    if (!orderToDelete) return;

    try {
      await deleteOrder(orderToDelete);
      onOrderDelete(orderToDelete);
      toast.success("Order deleted successfully");
      setDeleteConfirmOpen(false);
    } catch (error: unknown) {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete order"
      );
    }
  };

  // Map status to appropriate badge variant
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

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center py-8">
            <p>Loading orders...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (orders.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col items-center justify-center py-8 space-y-4 text-center">
            <p className="text-muted-foreground">No orders found</p>
            <Button asChild>
              <Link href="/dashboard/orders/new">
                <Plus className="mr-2 h-4 w-4" />
                Create your first order
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">
                <div
                  className="flex items-center cursor-pointer"
                  onClick={() => handleSort("createdAt")}
                >
                  Order ID
                  {sortField === "createdAt" && (
                    <ArrowUpDown className="ml-2 h-3 w-3" />
                  )}
                </div>
              </TableHead>
              <TableHead>
                <div
                  className="flex items-center cursor-pointer"
                  onClick={() => handleSort("customer")}
                >
                  Customer
                  {sortField === "customer" && (
                    <ArrowUpDown className="ml-2 h-3 w-3" />
                  )}
                </div>
              </TableHead>
              <TableHead>Items</TableHead>
              <TableHead>
                <div
                  className="flex items-center cursor-pointer"
                  onClick={() => handleSort("status")}
                >
                  Status
                  {sortField === "status" && (
                    <ArrowUpDown className="ml-2 h-3 w-3" />
                  )}
                </div>
              </TableHead>
              <TableHead>
                <div
                  className="flex items-center cursor-pointer"
                  onClick={() => handleSort("total")}
                >
                  Total
                  {sortField === "total" && (
                    <ArrowUpDown className="ml-2 h-3 w-3" />
                  )}
                </div>
              </TableHead>
              <TableHead>
                <div
                  className="flex items-center cursor-pointer"
                  onClick={() => handleSort("dueDate")}
                >
                  Due Date
                  {sortField === "dueDate" && (
                    <ArrowUpDown className="ml-2 h-3 w-3" />
                  )}
                </div>
              </TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>#{order.id.substring(0, 8)}</TableCell>
                <TableCell>
                  <div className="font-medium">{order.customer.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {order.customer.email}
                  </div>
                </TableCell>
                <TableCell>
                  {order.items.length === 1
                    ? typeof order.items[0].product === "string"
                      ? order.items[0].product
                      : order.items[0].product?.name || "Unknown"
                    : `${order.items.length} items`}
                </TableCell>
                <TableCell>
                  <Badge variant={getStatusBadgeVariant(order.status)}>
                    {order.status}
                  </Badge>
                </TableCell>
                <TableCell>${order.payment.total.toFixed(2)}</TableCell>
                <TableCell>
                  {format(new Date(order.dueDate), "MMM d, yyyy")}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href={`/dashboard/orders/${order.id}`}>
                          View details
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={`/dashboard/orders/${order.id}/edit`}>
                          Edit order
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive focus:text-destructive"
                        onClick={() => {
                          setOrderToDelete(order.id);
                          setDeleteConfirmOpen(true);
                        }}
                      >
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this order? This action cannot be
              undone.
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
    </>
  );
}
