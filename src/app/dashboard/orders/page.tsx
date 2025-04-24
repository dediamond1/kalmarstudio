"use client";

import { useState, useEffect } from "react";
import { getOrders, deleteOrder } from "@/lib/api/orders";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { MoreHorizontal } from "lucide-react";
import { toast } from "sonner";
import { OrderDetails } from "@/components/dashboard/order-details";
import OrderForm from "@/components/dashboard/order-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import type { Order } from "@/types/order";

export default function OrdersPage() {
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState<string | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const orders = await getOrders();
        setOrders(orders);
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Failed to fetch orders"
        );
      }
    };
    fetchOrders();
  }, []);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const handleDelete = async (id: string) => {
    try {
      await deleteOrder(id);
      setOrders(orders.filter((order) => order.id !== id));
      toast.success("Order deleted successfully");
    } catch (error: unknown) {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete order"
      );
    }
  };

  const handleEdit = (order: Order) => {
    setCurrentOrder(order);
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Orders</h1>
        <Button onClick={() => setIsDialogOpen(true)}>Add Order</Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Product</TableHead>
              <TableHead>Design</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow
                key={order.id}
                onClick={() => {
                  setCurrentOrder(order);
                  setIsDetailsOpen(true);
                }}
                className="cursor-pointer hover:bg-muted/50"
              >
                <TableCell>{order.customer.name}</TableCell>
                <TableCell>
                  {typeof order.items[0]?.product === "string"
                    ? order.items[0].product
                    : order.items[0]?.product?.name || "-"}
                </TableCell>
                <TableCell>{order.design?.description || "-"}</TableCell>
                <TableCell>{order.items[0].quantity}</TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      order.status === "Pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : order.status === "Paid"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {order.status}
                  </span>
                </TableCell>
                <TableCell>{order.dueDate}</TableCell>
                <TableCell>${order.payment.total}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEdit(order)}>
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-red-600"
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
            <Button
              variant="destructive"
              onClick={() => {
                if (orderToDelete) {
                  handleDelete(orderToDelete);
                  setDeleteConfirmOpen(false);
                }
              }}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <OrderDetails
        order={currentOrder}
        open={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
      />
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>
              {currentOrder ? "Edit Order" : "Create New Order"}
            </DialogTitle>
          </DialogHeader>
          <OrderForm
            order={
              currentOrder
                ? {
                    ...currentOrder,
                    dueDate: currentOrder.dueDate,
                    createdAt:
                      currentOrder.createdAt || new Date().toISOString(),
                    updatedAt:
                      currentOrder.updatedAt || new Date().toISOString(),
                  }
                : undefined
            }
            onSuccess={() => {
              setIsDialogOpen(false);
              setCurrentOrder(null);
              // Refresh orders list
              const fetchOrders = async () => {
                try {
                  const orders = await getOrders();
                  setOrders(orders);
                } catch (error: unknown) {
                  toast.error(
                    error instanceof Error
                      ? error.message
                      : "Failed to refresh orders"
                  );
                }
              };
              fetchOrders();
              toast.success(
                `Order ${currentOrder ? "updated" : "created"} successfully`
              );
            }}
            onCancel={() => {
              setIsDialogOpen(false);
              setCurrentOrder(null);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
