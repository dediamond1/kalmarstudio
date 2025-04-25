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
  }
  
  export interface UpdateCustomerDto extends Partial<CreateCustomerDto> {}