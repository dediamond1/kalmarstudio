import type { Customer } from "@/models/customer.model";

export type { Customer };

export async function getCustomers(): Promise<Customer[]> {
  const response = await fetch('/api/customers');
  if (!response.ok) throw new Error('Failed to fetch customers');
  const { data } = await response.json();
  return data;
}

export async function getCustomer(id: string): Promise<Customer> {
  const response = await fetch(`/api/customers/${id}`);
  if (!response.ok) throw new Error('Failed to fetch customer');
  const { data } = await response.json();
  return data;
}
