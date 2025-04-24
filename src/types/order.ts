export interface OrderItem {
  product: string;
  size: string;
  quantity: number;
  price: number;
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
  design?: OrderDesign;
  items: OrderItem[];
  status: "Pending" | "Paid" | "Refunded";
  dueDate: string;
  payment: OrderPayment;
  createdAt: string;
  updatedAt: string;
}
