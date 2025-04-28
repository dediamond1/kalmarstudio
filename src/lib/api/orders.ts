import { Order, OrderCreatePayload } from '@/types/order'

export async function getOrders(): Promise<Order[]> {
  const response = await fetch('/api/orders')
  if (!response.ok) {
    throw new Error('Failed to fetch orders')
  }
  return response.json()
}

export async function createOrder(payload: OrderCreatePayload) {
  const response = await fetch('/api/orders', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    throw new Error('Failed to create order')
  }

  return response.json()
}
