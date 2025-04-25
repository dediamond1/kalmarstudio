import type { Customer, CreateCustomerDto, UpdateCustomerDto } from "@/types/customer";

export async function getCustomers(): Promise<Customer[]> {
  try {
    const response = await fetch('/api/customers');
    if (!response.ok) throw new Error('Failed to fetch customers');
    return await response.json();
  } catch (error) {
    console.error('Error fetching customers:', error);
    throw error;
  }
}

export async function getCustomer(id: string): Promise<Customer> {
  try {
    const response = await fetch(`/api/customers/${id}`);
    if (!response.ok) throw new Error('Failed to fetch customer');
    return await response.json();
  } catch (error) {
    console.error('Error fetching customer:', error);
    throw error;
  }
}

export async function createCustomer(data: CreateCustomerDto): Promise<Customer> {
  try {
    const response = await fetch('/api/customers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to create customer');
    return await response.json();
  } catch (error) {
    console.error('Error creating customer:', error);
    throw error;
  }
}

export async function updateCustomer(id: string, data: UpdateCustomerDto): Promise<Customer> {
  try {
    const response = await fetch(`/api/customers/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update customer');
    return await response.json();
  } catch (error) {
    console.error('Error updating customer:', error);
    throw error;
  }
}

export async function deleteCustomer(id: string): Promise<void> {
  try {
    const response = await fetch(`/api/customers/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete customer');
  } catch (error) {
    console.error('Error deleting customer:', error);
    throw error;
  }
}