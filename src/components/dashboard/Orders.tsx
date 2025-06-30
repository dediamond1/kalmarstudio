"use client";

import { useEffect, useState } from "react";
import { OrderStatsCards } from "./order-stats-cards";
import { OrdersFilters } from "./orders-filters";
import { OrdersTable } from "./orders-table";
import { Order } from "@/types/order";

interface OrdersProps {
  orders?: Order[];
  loading?: boolean;
}

export default function Orders({ orders = [], loading = false }: OrdersProps) {
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);

  useEffect(() => {
    setFilteredOrders(orders);
    return () => {};
  }, [orders]);

  // Calculate stats for the cards
  const stats = {
    total: orders.length,
    pending: orders.filter((o) => o.status === "pending").length,
    processing: orders.filter((o) => o.status === "processing").length,
    delivered: orders.filter((o) => o.status === "delivered").length,
    value: orders.reduce((sum, order) => sum + order.total, 0).toFixed(2),
  };

  // Handle order deletion
  const handleDelete = (orderId: string) => {
    console.log("Would delete order:", orderId);
  };

  // Handle refresh
  const handleRefresh = () => {
    console.log("Would refresh orders");
  };

  const onUpdateStatus = async (id: string, status: string) => {
    try {
      const normalizedStatus = status.toLowerCase().replace(/\s+/g, "_");
      const response = await fetch(`/api/orders/${id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, status: normalizedStatus }),
      });

      if (!response.ok) {
        throw new Error("Failed to update status");
      }

      const { order: updatedOrder } = await response.json();

      // Update local orders state
      setFilteredOrders((prev) =>
        prev.map((order) =>
          order._id === updatedOrder._id ? updatedOrder : order
        )
      );
    } catch (error) {
      console.error("Error updating order status:", error);
      console.error("Failed to update order status:", error);
    }
  };

  return (
    <div className="space-y-6 px-14 py-6">
      <div className="flex justify-between items-center">
        <h1 className="font-bold text-2xl">Orders</h1>
      </div>

      {/* Stats Cards */}
      <OrderStatsCards
        total={stats.total}
        pending={stats.pending}
        processing={stats.processing}
        completed={stats.delivered}
        value={stats.value}
      />

      {/* Filters */}
      <div>
        <OrdersFilters
          orders={orders}
          setFilteredOrders={setFilteredOrders}
          onRefresh={handleRefresh}
        />
      </div>

      {/* Orders Table */}
      <OrdersTable
        orders={filteredOrders}
        loading={loading}
        onOrderDelete={handleDelete}
        onStatusUpdate={onUpdateStatus}
      />
    </div>
  );
}
