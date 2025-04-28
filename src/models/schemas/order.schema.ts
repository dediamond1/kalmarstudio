import { model, models, Schema } from "mongoose";

// Define OrderItem schema first since it's referenced by OrderSchema
const OrderItemSizeSchema = new Schema({
  size: { type: String, required: true },
  quantity: { type: Number, required: true }
});

const OrderItemSchema = new Schema({
  productId: { type: String, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true },
  color: { type: String },
  sizes: [OrderItemSizeSchema],
  totalQuantity: { type: Number, required: true }
});

// Dummy payment schema for testing
const PaymentSchema = new Schema({
  method: { 
    type: String, 
    required: true,
    enum: ['credit_card', 'paypal', 'bank_transfer']
  },
  transactionId: { type: String },
  status: { 
    type: String,
    default: 'pending',
    enum: ['pending', 'completed', 'failed', 'refunded']
  },
  amount: { type: Number, required: true }
});

// Basic shipping schema
const ShippingSchema = new Schema({
  method: {
    type: String,
    required: true,
    enum: ['standard', 'express', 'priority']
  },
  trackingNumber: { type: String },
  cost: { type: Number, required: true },
  estimatedDelivery: { type: Date }
});

// Placeholder design schema
const DesignSchema = new Schema({
  notes: { type: String },
  options: { type: Schema.Types.Mixed }
});

const OrderSchema = new Schema({
  customerId: { 
    type: String,
    required: true 
  },
  items: {
    type: [OrderItemSchema],
    required: true,
    validate: {
      validator: function(v: Array<any>) {
        return v.length > 0;
      },
      message: 'Order must have at least one item'
    }
  },
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
    enum: ['pending', 'processing', 'completed', 'shipped', 'cancelled'],
    default: 'pending' 
  },
  paymentMethod: {
    type: String,
    required: true
  },
  design: {
    type: DesignSchema
  },
  payment: {
    type: PaymentSchema
  },
  shipping: {
    type: ShippingSchema
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
  },
  notes: {
    type: String
  }
}, { 
  timestamps: true 
});

// Use existing model if available to prevent OverwriteModelError
export const OrderModel = models.Order || model('Order', OrderSchema);
