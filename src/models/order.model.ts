import { ICustomer as Customer } from "./customer.model";
import { Product } from "./product.model";

export interface OrderItem {
  productId: string;
  product?: Product; // Optional populated field
  quantity: number;
  size: string;
  color: string;
  material: string;
  printType: string;
  unitPrice: number;
}

export interface DesignDetails {
  description: string;
  placement: string;
  colors: string[];
  mockupUrl?: string;
  artworkFiles: string[];
}

export interface PaymentDetails {
  status: "Pending" | "Paid" | "Refunded";
  method: string;
  amount: number;
  tax: number;
  discount?: number;
  total: number;
}

export interface Order {
  id: string;
  customerId: string;
  customer?: Customer; // Optional populated field
  status: "Pending" | "Processing" | "Completed" | "Shipped" | "Cancelled";
  items: OrderItem[];
  design: DesignDetails;
  dueDate: Date;
  payment: PaymentDetails;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type CreateOrderDto = Omit<Order, 'id' | 'createdAt' | 'updatedAt' | 'customer'> & {
  customerId: string;
};

export type UpdateOrderDto = Partial<CreateOrderDto>;
