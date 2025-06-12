export interface OrderItemSize {
  size: string;
  quantity: number;
}

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  image: string;
  color?: string;
  sizes: OrderItemSize[];
  totalQuantity: number;
}

export interface PaymentDetails {
  method: "credit_card" | "paypal" | "bank_transfer";
  transactionId?: string;
  status: "pending" | "completed" | "failed" | "refunded";
  amount: number;
}

export interface ShippingDetails {
  method: "standard" | "express" | "priority";
  trackingNumber?: string;
  cost: number;
  estimatedDelivery?: Date;
}

export interface DesignDetails {
  notes?: string;
  options?: Record<string, any>;
}

export interface Address {
  street?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
}

export interface OrderCreatePayload {
  items: Array<{
    productId: string;
    quantity: number;
    price: number;
  }>;
  paymentIntentId: string;
  amount: number;
}

export interface Order {
  _id: string;
  customerId: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  shippingCost: number;
  total: number;
  status:
    | "pending"
    | "confirmed"
    | "processing"
    | "prepared"
    | "shipped"
    | "transit"
    | "delivery"
    | "delivered"
    | "failed_attempt"
    | "returned_to_sender"
    | "cancelled"
    | "refunded";
  paymentMethod: string;
  design?: DesignDetails;
  payment?: PaymentDetails;
  shipping?: ShippingDetails;
  shippingAddress?: Address;
  billingAddress?: Address;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
  customerEmail?: string;
}

// Legacy types for backward compatibility
export interface LegacyOrderItem {
  product: string | { id: string; name: string; basePrice: number };
  size: string;
  quantity: number;
  price: number;
  color: string;
  material: string;
  printType?: string;
}

export interface LegacyOrder
  extends Omit<Order, "items" | "paymentMethod" | "payment"> {
  items: LegacyOrderItem[];
  payment: {
    status: "Pending" | "Paid" | "Refunded";
    method: "credit_card" | "paypal" | "bank_transfer" | string;
    amount: number;
    tax: number;
    shipping?: number;
    total: number;
    discount?: number;
  };
}
