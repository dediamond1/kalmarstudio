// src/app/dashboard/orders/page.tsx

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

import { OrderStatsCards } from "@/components/dashboard/orders/order-stats-cards";
import { OrdersFilters } from "@/components/dashboard/orders/orders-filters";
import { OrdersTable } from "@/components/dashboard/orders/orders-table";
import { getOrders } from "@/lib/api/orders";
import { Order } from "@/types/order";
import Orders from "@/components/dashboard/Orders";

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const router = useRouter();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const ordersData = await getOrders();
      setOrders(ordersData);
      setFilteredOrders(ordersData);
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to fetch orders"
      );
    } finally {
      setLoading(false);
    }
  };

  // Calculate order stats
  const orderStats = {
    total: orders.length,
    pending: orders.filter((order) => order.status === "Pending").length,
    processing: orders.filter((order) => order.status === "Processing").length,
    completed: orders.filter((order) => order.status === "Completed").length,
    cancelled: orders.filter((order) => order.status === "Cancelled").length,
    value: orders
      .reduce((sum, order) => sum + order.payment.total, 0)
      .toFixed(2),
  };

  return (
    <div className="space-y-6">
      <Orders />
      {/* Header */}
      {/* <div className="flex flex-col gap-4">
        <div className="flex flex-col md:flex-row justify-between md:items-center">
          <div>
            <h1 className="text-3xl font-bold">Orders</h1>
            <p className="text-muted-foreground">
              Manage and track your custom printing orders
            </p>
          </div>

          <div className="flex gap-2 w-full md:w-auto mt-4 md:mt-0">
            <Button variant="default" size="sm" asChild>
              <Link href="/dashboard/orders/new">
                <Plus className="mr-2 h-4 w-4" />
                New Order
              </Link>
            </Button>
          </div>
        </div>

        <OrderStatsCards {...orderStats} />
      </div> */}

      {/* Filters & Search */}
      {/* <OrdersFilters
        orders={orders}
        setFilteredOrders={setFilteredOrders}
        onRefresh={fetchOrders}
      /> */}

      {/* Orders Table */}
      {/* <OrdersTable
        orders={filteredOrders}
        loading={loading}
        onOrderDelete={(deletedId) => {
          setOrders(orders.filter((order) => order.id !== deletedId));
          setFilteredOrders(
            filteredOrders.filter((order) => order.id !== deletedId)
          );
        }}
      /> */}
    </div>
  );
}
