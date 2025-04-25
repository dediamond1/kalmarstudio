export interface OrderItem {
  product: string | { id: string; name: string; basePrice: number };
  size: string;
  quantity: number;
  price: number;
  color: string;
  material: string;
  printType?: string;
}

export interface ShippingDetails {
  address?: {
    street?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
  };
  method?: "Standard" | "Express" | "Priority" | "Pickup";
  cost?: number;
  trackingNumber?: string;
  estimatedDelivery?: string;
}

export interface OrderDesign {
  description: string;
  mockupUrl?: string;
  colors: string[];
  placement: string;
}

export interface OrderPayment {
  status: "Pending" | "Paid" | "Refunded";
  method: string;
  amount: number;
  tax: number;
  shipping?: number;
  total: number;
  discount?: number;
}

export interface Order {
  id: string;
  customer: {
    id: string;
    name: string;
    email: string;
    phone: string;
    company?: string;
  };
  design: OrderDesign;
  shipping?: ShippingDetails;
  items: OrderItem[];
  status: "Pending" | "Processing" | "Completed" | "Shipped" | "Cancelled";
  dueDate: string;
  payment: OrderPayment;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}