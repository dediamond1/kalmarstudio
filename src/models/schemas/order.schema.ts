import { Schema, model, models } from 'mongoose';

// Define enum values for order status and payment status
const OrderStatus = ['Pending', 'Processing', 'Completed', 'Shipped', 'Cancelled'] as const;
const PaymentStatus = ['Pending', 'Paid', 'Refunded'] as const;
const ShippingMethods = ['Standard', 'Express', 'Priority', 'Pickup'] as const;

const OrderItemSchema = new Schema({
  productId: { 
    type: String,
    required: true 
  },
  name: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  quantity: { 
    type: Number, 
    required: true, 
    min: 1 
  },
  price: { 
    type: Number, 
    required: true, 
    min: 0 
  },
  color: { 
    type: String 
  },
  size: { 
    type: String 
  }
});

const ShippingSchema = new Schema({
  address: {
    street: { type: String },
    city: { type: String },
    state: { type: String },
    postalCode: { type: String },
    country: { type: String }
  },
  method: { 
    type: String, 
    enum: ShippingMethods, 
    default: 'Standard' 
  },
  cost: { 
    type: Number, 
    default: 0 
  },
  trackingNumber: { type: String },
  estimatedDelivery: { type: Date }
});

const DesignSchema = new Schema({
  description: { 
    type: String,
    required: true 
  },
  placement: { 
    type: String, 
    default: 'Front Center' 
  },
  colors: [{ 
    type: String 
  }],
  mockupUrl: { 
    type: String 
  }
});

const PaymentSchema = new Schema({
  status: { 
    type: String, 
    enum: PaymentStatus, 
    default: 'Pending' 
  },
  method: { 
    type: String, 
    default: 'Credit Card' 
  },
  amount: { 
    type: Number, 
    required: true, 
    min: 0 
  },
  tax: { 
    type: Number, 
    default: 0 
  },
  discount: { 
    type: Number, 
    default: 0 
  },
  shipping: {
    type: Number,
    default: 0
  },
  total: { 
    type: Number, 
    required: true, 
    min: 0 
  }
});

const OrderSchema = new Schema({
  customerId: { 
    type: String,
    required: true 
  },
  items: [OrderItemSchema],
  subtotal: {
    type: Number,
    required: true
  },
  tax: {
    type: Number,
    default: 0
  },
  shippingCost: {
    type: Number,
    default: 0
  },
  total: {
    type: Number,
    required: true
  },
  status: { 
    type: String, 
    enum: ['pending', 'processing', 'completed', 'cancelled'],
    default: 'pending' 
  },
  paymentMethod: {
    type: String,
    required: true
  },
  shippingAddress: {
    street: String,
    city: String,
    state: String,
    postalCode: String,
    country: String
  },
  billingAddress: {
    street: String,
    city: String,
    state: String,
    postalCode: String,
    country: String
  }
}, { 
  timestamps: true 
});

// Use existing model if available to prevent OverwriteModelError
export const OrderModel = models.Order || model('Order', OrderSchema);
