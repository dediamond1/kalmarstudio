import { Schema, model, models } from 'mongoose';

// Define enum values for order status and payment status
const OrderStatus = ['Pending', 'Processing', 'Completed', 'Shipped', 'Cancelled'] as const;
const PaymentStatus = ['Pending', 'Paid', 'Refunded'] as const;

const OrderItemSchema = new Schema({
  product: { 
    type: Schema.Types.Mixed, 
    required: true 
  },
  quantity: { 
    type: Number, 
    required: true, 
    min: 1 
  },
  size: { 
    type: String, 
    required: true 
  },
  color: { 
    type: String, 
    default: 'Default' 
  },
  material: { 
    type: String, 
    default: 'Cotton' 
  },
  printType: { 
    type: String, 
    default: 'Digital' 
  },
  price: { 
    type: Number, 
    required: true, 
    min: 0 
  }
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
  total: { 
    type: Number, 
    required: true, 
    min: 0 
  }
});

const OrderSchema = new Schema({
  customer: { 
    type: Schema.Types.ObjectId, 
    ref: 'Customer', 
    required: true 
  },
  items: [OrderItemSchema],
  design: DesignSchema,
  status: { 
    type: String, 
    enum: OrderStatus, 
    default: 'Pending' 
  },
  dueDate: { 
    type: Date, 
    required: true 
  },
  payment: PaymentSchema,
  notes: { 
    type: String 
  }
}, { 
  timestamps: true 
});

// Use existing model if available to prevent OverwriteModelError
export const OrderModel = models.Order || model('Order', OrderSchema);