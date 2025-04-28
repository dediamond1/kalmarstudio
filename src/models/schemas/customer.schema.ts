import { Schema, model, Model, Document } from 'mongoose';
import { z } from 'zod';

interface ICustomer extends Document {
  name: string;
  email: string;
  phone: string;
  company?: string;
  address: {
    street?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country: string;
  };
  taxId?: string;
  notes?: string;
  customerType: 'individual' | 'business' | 'government' | 'guest';
  status: 'active' | 'inactive' | 'pending';
  createdAt: Date;
  updatedAt: Date;
}

// Zod Schema
export const customerSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email format'),
  phone: z.string().min(1, 'Phone is required'),
  company: z.string().optional(),
  address: z.object({
    street: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    postalCode: z.string().optional(),
    country: z.string().min(1, 'Country is required')
  }),
  taxId: z.string().optional(),
  notes: z.string().optional()
});

// Mongoose Schema
const AddressSchema = new Schema({
  street: { type: String },
  city: { type: String },
  state: { type: String },
  postalCode: { type: String },
  country: { type: String, required: true }
});

const ContactPersonSchema = new Schema({
  name: { type: String },
  email: { type: String },
  phone: { type: String }
});

const CustomerSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  company: { type: String },
  address: { type: AddressSchema, required: true },
  invoicingAddress: { type: AddressSchema },
  contactPerson: { type: ContactPersonSchema },
  taxId: { type: String },
  vatNumber: { type: String },
  registrationNumber: { type: String },
  paymentTerms: { type: Number, default: 30 }, // days
  preferredPaymentMethod: { 
    type: String,
    enum: ['credit_card', 'bank_transfer', 'paypal', 'other']
  },
  customerType: { 
    type: String, 
    enum: ['individual', 'business', 'government', 'guest'],
    default: 'business'
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'pending'],
    default: 'active'
  },
  notes: { type: String },
  relationshipManager: { type: Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

let CustomerModel: Model<ICustomer>;

try {
  // Try to get existing model to prevent OverwriteModelError
  CustomerModel = model<ICustomer>('Customer');
} catch {
  // Model doesn't exist yet, create it
  CustomerModel = model<ICustomer>('Customer', CustomerSchema);
}

export { CustomerModel };
