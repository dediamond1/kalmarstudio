import { Order } from "@/types/order";
import { z } from "zod";

export function toFormValues(order: Order) {
  return {
    ...order,
    dueDate: new Date(order.dueDate),
    items: order.items.map(item => ({
      ...item
    })),
    payment: {
      ...order.payment
    }
  };
}

export function fromFormValues(values: z.infer<typeof formSchema>): Order {
  // Get or create customer ID
  const customerId = values.customer.id || Math.random().toString(36).substring(2, 9);

  return {
    ...values,
    customer: {
      ...values.customer,
      id: customerId
    },
    items: values.items.map(item => ({
      ...item,
      color: '#000000', // Default color
      material: 'Cotton', // Default material
      printType: 'Digital', // Default print type
      unitPrice: item.price,
      productId: item.product // Temporary until product selection is implemented
    })),
    design: values.design ? {
      description: values.design.description || '',
      colors: values.design.colors || [],
      placement: values.design.placement || 'Front Center',
      mockupUrl: values.design.mockupUrl
    } : undefined,
    payment: {
      status: values.payment.status,
      method: values.payment.method || 'Credit Card',
      amount: values.payment.amount,
      tax: values.payment.tax || 0,
      discount: values.payment.discount,
      total: values.payment.total
    },
    dueDate: values.dueDate.toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    id: values.id || Math.random().toString(36).substring(2, 9)
  };
}

export const formSchema = z.object({
  customer: z.object({
    id: z.string().optional(),
    name: z.string().min(2),
    email: z.string().email(),
    phone: z.string().min(6),
    company: z.string().optional(),
  }),
  items: z.array(
    z.object({
      product: z.string().min(1),
      size: z.string().min(1),
      quantity: z.number().min(1),
      price: z.number().min(0),
      color: z.string().optional(),
      material: z.string().optional(),
      printType: z.string().optional()
    })
  ),
  design: z.object({
    description: z.string().min(5).optional(),
    colors: z.array(z.string()).default([]).optional(),
    placement: z.string().default('Front Center').optional(),
    mockupUrl: z.string().optional()
  }).optional(),
  dueDate: z.date(),
  status: z.enum(["Pending", "Paid", "Refunded"]),
  payment: z.object({
    status: z.enum(["Pending", "Paid", "Refunded"]),
    method: z.string(),
    amount: z.number(),
    tax: z.number().default(0),
    discount: z.number().optional(),
    total: z.number()
  }),
  id: z.string().optional()
});

export type FormValues = z.infer<typeof formSchema>;
