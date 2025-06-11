"use client";

import React, { useState, useEffect } from "react";
import { useUserStore } from "@/store/user";
import { useToast } from "@/components/ui/toast";

interface OrderItemSize {
  size: string;
  quantity: number;
  _id: string;
}

interface OrderItem {
  name: string;
  price: number;
  sizes: OrderItemSize[];
  image: string;
  _id: string;
}

interface Order {
  _id: string;
  customerEmail: string;
  items: OrderItem[];
  shippingAddress: {
    fullName: string;
    email: string;
    contactNo: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  shippingMethod: {
    type: string;
    cost: number;
    estimatedDelivery: string;
    _id: string;
  };
  payment: {
    amount: number;
    currency: string;
    status: string;
  };
  status: string;
  createdAt: string;
}

const Orders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const email = useUserStore.getState().user?.email;
        if (!email) {
          setLoading(false);
          return;
        }

        console.log(email);

        const response = await fetch(
          `/api/orders?email=${encodeURIComponent(email)}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch orders");
        }

        const data = await response.json();
        console.log(data);
        setOrders(data.orders || []);
      } catch (error) {
        console.error("Error fetching orders:", error);
        toast({
          title: "Order Error",
          description:
            error instanceof Error ? error.message : "Failed to load orders",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    // Immediately invoke fetchOrders
    (async () => {
      await fetchOrders();
    })();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        Loading orders...
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        No orders found
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">Your Orders</h1>

      <div className="space-y-6">
        {orders.map((order) => (
          <div key={order._id} className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-lg font-semibold">
                  Order #
                  {order._id.substring(order._id.length - 6).toUpperCase()}
                </h2>
                <p className="text-sm text-gray-500">
                  Placed on {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="text-right">
                <p className="font-medium">
                  ${order.payment.amount.toFixed(2)}
                </p>
                <p
                  className={`text-sm ${
                    order.status === "Delivered"
                      ? "text-green-600"
                      : order.status === "Cancelled"
                        ? "text-red-600"
                        : "text-blue-600"
                  }`}
                >
                  {order.status}
                </p>
              </div>
            </div>

            <div className="border-t pt-4">
              <h3 className="font-medium mb-2">Shipping Address</h3>
              <p>{order.shippingAddress.fullName}</p>
              <p>{order.shippingAddress.street}</p>
              <p>
                {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
                {order.shippingAddress.zipCode}
              </p>
              <p>{order.shippingAddress.country}</p>
              {order.shippingAddress.contactNo && (
                <p>Phone: {order.shippingAddress.contactNo}</p>
              )}
              {order.shippingAddress.email && (
                <p>Email: {order.shippingAddress.email}</p>
              )}
              <div className="mt-4">
                <h4 className="font-medium">Shipping Method</h4>
                <p>
                  {order.shippingMethod.type} -{" "}
                  {order.shippingMethod.estimatedDelivery}
                </p>
                <p>${order.shippingMethod.cost.toFixed(2)}</p>
              </div>
            </div>

            <div className="border-t pt-4 mt-4">
              <h3 className="font-medium mb-3 text-gray-700">Order Items</h3>
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div
                    key={item._id}
                    className="flex gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <div className="flex-shrink-0">
                      <img
                        src={item.image || "/images/placeholder.png"}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded border"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{item.name}</p>
                      <div className="text-gray-600 space-y-1 mt-1">
                        {item.sizes.map((size) => (
                          <div
                            key={size._id}
                            className="flex justify-between text-sm"
                          >
                            <span>
                              Size {size.size}: {size.quantity} × $
                              {item.price.toFixed(2)}
                            </span>
                            <span className="font-medium">
                              ${(item.price * size.quantity).toFixed(2)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <p className="font-medium text-lg">
                        $
                        {item.sizes
                          .reduce(
                            (sum, size) => sum + item.price * size.quantity,
                            0
                          )
                          .toFixed(2)}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {item.sizes.reduce(
                          (sum, size) => sum + size.quantity,
                          0
                        )}{" "}
                        item
                        {item.sizes.reduce(
                          (sum, size) => sum + size.quantity,
                          0
                        ) !== 1
                          ? "s"
                          : ""}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
