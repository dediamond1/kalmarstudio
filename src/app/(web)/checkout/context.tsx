"use client";

import React from "react";
import { createContext, useContext, useReducer, useEffect } from "react";
import { CheckoutState, CheckoutAction } from "./types";

const CheckoutContext = createContext<
  | {
      state: CheckoutState;
      dispatch: React.Dispatch<CheckoutAction>;
    }
  | undefined
>(undefined);

const initialState: CheckoutState = {
  step: "cart",
  customer: null,
  shippingAddress: null,
  billingAddress: null,
  shippingMethod: null,
  paymentMethod: null,
  discountCode: null,
  cartItems: [],
  orderNotes: "",
  isGuest: false,
  paymentIntent: null,
  clientSecret: null,
  shippingOptions: [],
  taxAmount: 0,
  shippingAmount: 0,
  subtotal: 0,
  total: 0,
};

function checkoutReducer(
  state: CheckoutState,
  action: CheckoutAction
): CheckoutState {
  switch (action.type) {
    case "SET_STEP":
      return { ...state, step: action.payload };
    case "SET_CUSTOMER":
      return { ...state, customer: action.payload };
    case "SET_SHIPPING_ADDRESS":
      return { ...state, shippingAddress: action.payload };
    case "SET_BILLING_ADDRESS":
      return { ...state, billingAddress: action.payload };
    case "SET_SHIPPING_METHOD":
      return { ...state, shippingMethod: action.payload };
    case "SET_PAYMENT_METHOD":
      return { ...state, paymentMethod: action.payload };
    case "SET_DISCOUNT_CODE":
      return { ...state, discountCode: action.payload };
    case "SET_CART_ITEMS":
      return { ...state, cartItems: action.payload };
    case "SET_ORDER_NOTES":
      return { ...state, orderNotes: action.payload };
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload };
    case "SET_ORDER_ID":
      return { ...state, orderId: action.payload };
    case "SET_PAYMENT_INTENT":
      return { ...state, paymentIntent: action.payload };
    case "SET_SHIPPING_OPTIONS":
      return { ...state, shippingOptions: action.payload };
    case "SET_TAX_AMOUNT":
      return { ...state, taxAmount: action.payload };
    case "SET_SHIPPING_AMOUNT":
      return { ...state, shippingAmount: action.payload };
    case "SET_SUBTOTAL":
      return { ...state, subtotal: action.payload };
    case "SET_TOTAL":
      return { ...state, total: action.payload };
    case "SET_ORDER":
      return {
        ...state,
        order: action.payload,
        orderId: action.payload.id,
      };
    case "CLEAR_CART":
      return { ...state, cartItems: [] };
    default:
      return state;
  }
}

export function CheckoutProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(checkoutReducer, initialState, () => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("checkoutState");
      return saved ? JSON.parse(saved) : initialState;
    }
    return initialState;
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("checkoutState", JSON.stringify(state));
    }
  }, [state]);

  return (
    <CheckoutContext.Provider value={{ state, dispatch }}>
      {children}
    </CheckoutContext.Provider>
  );
}

export function useCheckout() {
  const context = useContext(CheckoutContext);
  if (context === undefined) {
    throw new Error("useCheckout must be used within a CheckoutProvider");
  }
  return context;
}
