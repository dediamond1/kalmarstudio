"use client";

import Orders from "@/components/dashboard/Orders";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/toast";
import { useState, useEffect } from "react";
import { Order } from "@/types/order";

export default function DashboardPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch("/api/orders");
        if (!response.ok) {
          throw new Error("Failed to fetch orders");
        }
        const data = await response.json();
        setOrders(data.orders || []);
      } catch (error) {
        toast({
          title: "Error",
          description:
            error instanceof Error ? error.message : "Failed to load orders",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div>
      <div className="mt-6 xl:mt-12">
        <div className="relative flex flex-wrap justify-center gap-6 w-full h-full">
          {/* Sales */}
          <CardItem title="Sales" value={0} />

          {/* Total user */}
          <CardItem title="Total Users" value={0} />

          {/* Active Sessions */}
          <CardItem title="Active Sessions" value={0} />

          {/* Premium Users */}
          <CardItem title="Premium Users" value={0} />

          {/* Banned Users */}
          <CardItem title="Banned Users" value={0} />

          {/* Orders */}
          {/* <CardItem title="Orders" value={0} /> */}
        </div>
      </div>
      <Orders orders={orders} loading={loading} />
    </div>
  );
}

const CardItem = ({
  title,
  value,
}: {
  title: string;
  value: string | number;
}) => {
  const getCardStyle = () => {
    switch (title) {
      case "Sales":
        return "bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200";
      case "Total Users":
        return "bg-gradient-to-br from-green-50 to-green-100 border-green-200";
      case "Active Sessions":
        return "bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200";
      case "Premium Users":
        return "bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200";
      case "Banned Users":
        return "bg-gradient-to-br from-red-50 to-red-100 border-red-200";
      default:
        return "bg-white";
    }
  };

  return (
    <Card
      className={`w-[18%] flex flex-col justify-between border ${getCardStyle()}`}
    >
      <CardHeader>
        <CardTitle className="font-medium text-gray-700 text-md">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="font-bold text-gray-800 text-4xl">{value}</div>
      </CardContent>
    </Card>
  );
};