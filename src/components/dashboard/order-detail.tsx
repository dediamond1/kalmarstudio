"use client";

import { Order } from "@/types/order";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface OrderDetailProps {
  order: Order | null;
  onClose: () => void;
}

export function OrderDetail({ order, onClose }: OrderDetailProps) {
  if (!order) return null;

  return (
    <Dialog open={!!order} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl p-6">
        <DialogHeader className="border-b pb-4">
          <DialogTitle className="text-xl font-semibold">
            Order #{order._id.slice(-6).toUpperCase()}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-4 max-h-[70vh] overflow-y-auto pr-2">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-gray-900 mb-3">
              Order Information
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Status:</span>
                <span className="font-medium capitalize">
                  {order.status.replace(/_/g, " ")}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Date:</span>
                <span>{new Date(order.createdAt).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Customer:</span>
                <span>{order.customerEmail}</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-gray-900 mb-3">
              Shipping Information
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Method:</span>
                <span className="capitalize">{order.shipping?.method}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Cost:</span>
                <span>${order.shipping?.cost?.toFixed(2)}</span>
              </div>
              {order.shippingAddress && (
                <div>
                  <div className="text-gray-600 mb-1">Address:</div>
                  <div className="text-sm bg-white p-2 rounded border">
                    {[
                      order.shippingAddress.street,
                      order.shippingAddress.city,
                      order.shippingAddress.state,
                      order.shippingAddress.postalCode,
                      order.shippingAddress.country,
                    ]
                      .filter(Boolean)
                      .join("\n")}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-gray-900 mb-3">
              Payment Information
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Method:</span>
                <span className="capitalize">
                  {order.payment?.method?.replace(/_/g, " ")}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Amount:</span>
                <span>${order.payment?.amount?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Status:</span>
                <span className="capitalize">{order.payment?.status}</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-gray-900 mb-3">
              Order Items ({order.items.length})
            </h3>
            <div className="space-y-3 max-h-[300px] overflow-y-auto">
              {order.items.map((item) => (
                <div
                  key={item.productId}
                  className="bg-white p-3 rounded-lg border flex justify-between items-center"
                >
                  <div className="flex-1">
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-600">
                      ${item.price.toFixed(2)} ×{" "}
                      {item.sizes?.reduce(
                        (sum, size) => sum + size.quantity,
                        0
                      ) || item.totalQuantity}{" "}
                      = $
                      {(
                        item.price *
                        (item.sizes?.reduce(
                          (sum, size) => sum + size.quantity,
                          0
                        ) || item.totalQuantity)
                      ).toFixed(2)}
                    </p>
                    {item.sizes?.length > 0 && (
                      <div className="mt-2">
                        <p className="text-xs font-medium text-gray-500 mb-1">
                          Sizes:
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {item.sizes.map((size, index) => (
                            <div
                              key={`${size.size}-${index}`}
                              className="text-xs bg-gray-100 px-2 py-1 rounded"
                            >
                              {size.size}: {size.quantity}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6 border-t pt-4">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button onClick={() => window.print()}>Print Receipt</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
