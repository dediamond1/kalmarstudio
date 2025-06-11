"use client";

import { useEffect } from "react";
import { toast } from "sonner";
import { getOrders } from "@/lib/api/orders";
import Orders from "@/components/dashboard/Orders";

export default function OrdersPage() {
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        await getOrders();
      } catch (error) {
        console.error("Error fetching orders:", error);
        toast.error(
          error instanceof Error ? error.message : "Failed to fetch orders"
        );
      }
    };
    fetchOrders();
  }, []);

  return (
    <div className="space-y-6">
      <Orders />
    </div>
  );
}
