import { Order } from "@/types/order";

export const sampleOrders: Order[] = [
  {
    _id: "ord_001",
    customerId: "cust_001",
    items: [
      {
        productId: "prod_001",
        name: "Premium T-Shirt",
        price: 22.99,
        image: "/products/tshirt.jpg",
        color: "black",
        sizes: [{ size: "L", quantity: 10 }],
        totalQuantity: 10,
      },
    ],
    subtotal: 229.9,
    tax: 20.69,
    shippingCost: 15.0,
    total: 265.59,
    status: "pending",
    paymentMethod: "credit_card",
    design: {
      notes: "Company logo on front",
      options: {
        placement: "front_center",
        colors: ["#FF0000", "#000000"],
        mockup: "https://example.com/mockups/1",
      },
    },
    payment: {
      method: "credit_card",
      status: "pending",
      amount: 265.59,
    },
    shipping: {
      method: "standard",
      cost: 15.0,
      estimatedDelivery: new Date("2025-06-20"),
    },
    createdAt: new Date("2025-05-10"),
    updatedAt: new Date("2025-05-10"),
  },
  {
    _id: "ord_002",
    customerId: "cust_002",
    items: [
      {
        productId: "prod_002",
        name: "Hoodie",
        price: 45.99,
        image: "/products/hoodie.jpg",
        color: "navy",
        sizes: [{ size: "XL", quantity: 5 }],
        totalQuantity: 5,
      },
      {
        productId: "prod_003",
        name: "Cap",
        price: 17.99,
        image: "/products/cap.jpg",
        color: "black",
        sizes: [{ size: "OS", quantity: 3 }],
        totalQuantity: 3,
      },
    ],
    subtotal: 287.92,
    tax: 25.91,
    shippingCost: 0.0,
    total: 313.83,
    status: "processing",
    paymentMethod: "paypal",
    design: {
      notes: "Team name on back, small logo on front",
      options: {
        placement: "back_center",
        colors: ["#0000FF", "#FFFFFF"],
      },
    },
    payment: {
      method: "paypal",
      status: "completed",
      amount: 313.83,
    },
    shipping: {
      method: "express",
      cost: 0.0,
      estimatedDelivery: new Date("2025-06-01"),
    },
    createdAt: new Date("2025-05-05"),
    updatedAt: new Date("2025-05-12"),
  },
  {
    _id: "ord_003",
    customerId: "cust_003",
    items: [
      {
        productId: "prod_004",
        name: "Polo Shirt",
        price: 31.99,
        image: "/products/polo.jpg",
        color: "white",
        sizes: [{ size: "M", quantity: 8 }],
        totalQuantity: 8,
      },
    ],
    subtotal: 255.92,
    tax: 23.03,
    shippingCost: 10.0,
    total: 288.95,
    status: "completed",
    paymentMethod: "bank_transfer",
    design: {
      notes: "Left chest logo",
      options: {
        placement: "left_chest",
        colors: ["#00FF00"],
      },
    },
    payment: {
      method: "bank_transfer",
      status: "completed",
      amount: 288.95,
    },
    shipping: {
      method: "priority",
      cost: 10.0,
      estimatedDelivery: new Date("2025-05-25"),
    },
    createdAt: new Date("2025-05-01"),
    updatedAt: new Date("2025-05-18"),
  },
];
