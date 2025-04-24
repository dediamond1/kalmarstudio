import { Document } from 'mongoose';
import { CustomerModel } from './schemas/customer.schema';

export interface IAddress {
  street?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country: string;
}

export interface ICustomer extends Document {
  _id: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  address?: IAddress;
  taxId?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type CreateCustomerDto = Omit<ICustomer, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateCustomerDto = Partial<CreateCustomerDto>;

export type { CustomerModel };
