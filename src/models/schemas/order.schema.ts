import { Schema, model } from 'mongoose';
const OrderStatus = ['Pending', 'Paid', 'Refunded'] as const;

const OrderItemSchema = new Schema({
  product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true },
  size: { type: String, required: true },
  color: { type: String, required: true },
  material: { type: String, required: true },
  printType: { type: String, required: true },
  unitPrice: { type: Number, required: true }
});

const DesignDetailsSchema = new Schema({
  description: { type: String, required: true },
  placement: { type: String },
  colors: [{ type: String }],
  mockupUrl: { type: String },
  artworkFiles: [{ type: String }]
});

const PaymentDetailsSchema = new Schema({
  status: { type: String, enum: ['Pending', 'Paid', 'Refunded'], default: 'Pending' },
  method: { type: String, required: true },
  amount: { type: Number, required: true },
  tax: { type: Number, required: true },
  discount: { type: Number },
  total: { type: Number, required: true }
});

const OrderSchema = new Schema({
  customer: { type: Schema.Types.ObjectId, ref: 'Customer', required: true },
  status: { type: String, enum: OrderStatus, default: 'Pending' },
  items: [OrderItemSchema],
  design: DesignDetailsSchema,
  dueDate: { type: Date, required: true },
  payment: PaymentDetailsSchema,
  notes: { type: String }
}, { timestamps: true });

export const OrderModel = model('Order', OrderSchema);
