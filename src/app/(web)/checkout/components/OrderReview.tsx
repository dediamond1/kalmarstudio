"use client";

import { useCheckout } from "../context";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/format-price";
import type { CheckoutStep } from "../types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Edit2 } from "lucide-react";

export default function OrderReview() {
  const { state, dispatch } = useCheckout();

  const handleEdit = (step: CheckoutStep) => {
    dispatch({ type: "SET_STEP", payload: step });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Customer Information</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleEdit("customer")}
          >
            <Edit2 className="w-4 h-4 mr-2" />
            Edit
          </Button>
        </CardHeader>
        <CardContent>
          <p>
            {state.customer?.firstName} {state.customer?.lastName}
          </p>
          <p>{state.customer?.email}</p>
          <p>{state.customer?.phone}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Shipping Information</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleEdit("shipping")}
          >
            <Edit2 className="w-4 h-4 mr-2" />
            Edit
          </Button>
        </CardHeader>
        <CardContent>
          {state.shippingAddress && (
            <div>
              <p>{state.shippingAddress.address1}</p>
              {state.shippingAddress.address2 && (
                <p>{state.shippingAddress.address2}</p>
              )}
              <p>
                {state.shippingAddress.city}, {state.shippingAddress.state}{" "}
                {state.shippingAddress.postalCode}
              </p>
              <p>{state.shippingAddress.country}</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Payment Method</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleEdit("payment")}
          >
            <Edit2 className="w-4 h-4 mr-2" />
            Edit
          </Button>
        </CardHeader>
        <CardContent>
          {state.paymentMethod && (
            <div>
              <p>{state.paymentMethod.name}</p>
              {state.paymentMethod.icon && (
                <p className="capitalize">{state.paymentMethod.icon} card</p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Order Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>{formatPrice(state.subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span>Shipping</span>
            <span>{formatPrice(state.shippingAmount)}</span>
          </div>
          <div className="flex justify-between">
            <span>Tax</span>
            <span>{formatPrice(state.taxAmount)}</span>
          </div>
          <div className="flex justify-between font-bold text-lg pt-4 border-t">
            <span>Total</span>
            <span>{formatPrice(state.total)}</span>
          </div>
        </CardContent>
      </Card>

      <Button
        className="w-full"
        onClick={() =>
          dispatch({
            type: "SET_STEP",
            payload: "confirmation" as CheckoutStep,
          })
        }
      >
        Place Order
      </Button>
    </div>
  );
}
