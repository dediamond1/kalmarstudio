"use client";

import { useState } from "react";
import { OrderStatsCards } from "./order-stats-cards";
import { OrdersFilters } from "./orders-filters";
import { OrdersTable } from "./orders-table";
import { Order } from "@/types/order";

interface OrdersProps {
  orders?: Order[];
  loading?: boolean;
}

export default function Orders({ orders = [], loading = false }: OrdersProps) {
  const [filteredOrders, setFilteredOrders] = useState<Order[]>(orders);

  // Calculate stats for the cards
  const stats = {
    total: orders.length,
    pending: orders.filter((o) => o.status === "pending").length,
    processing: orders.filter((o) => o.status === "processing").length,
    completed: orders.filter((o) => o.status === "completed").length,
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

  return (
    <div className="px-14 py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Orders</h1>
      </div>

      {/* Stats Cards */}
      <OrderStatsCards
        total={stats.total}
        pending={stats.pending}
        processing={stats.processing}
        completed={stats.completed}
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
      />
    </div>
  );
}
