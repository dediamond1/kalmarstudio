export interface Customer {
    id: string;
    _id?: string; // For MongoDB compatibility
    name: string;
    email: string;
    phone: string;
    company?: string;
    address?: {
      street?: string;
      city?: string;
      state?: string;
      postalCode?: string;
      country: string;
    };
    taxId?: string;
    notes?: string;
    customerType?: 'individual' | 'business' | 'government' | 'guest';
    status?: 'active' | 'inactive' | 'pending';
    createdAt: string;
    updatedAt: string;
  }
  
  export interface CreateCustomerDto {
    name: string;
    email: string;
    phone: string;
    company?: string;
    address?: {
      street?: string;
      city?: string;
      state?: string;
      postalCode?: string;
      country: string;
    };
    taxId?: string;
    notes?: string;
    customerType?: 'individual' | 'business' | 'government' | 'guest';
    status?: 'active' | 'inactive' | 'pending';
  }
  
  export interface UpdateCustomerDto extends Partial<CreateCustomerDto> {}
