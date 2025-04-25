export async function getOrders() {
  try {
    const response = await fetch('/api/orders');
    const data = await response.json();
    if (!data.success) throw new Error(data.error || 'Failed to fetch orders');
    return data.data;
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw error;
  }
}

export async function getOrder(id: string) {
  try {
    const response = await fetch(`/api/orders/${id}`);
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Failed to fetch order');
    return data.data;
  } catch (error) {
    console.error('Error fetching order:', error);
    throw error;
  }
}

export async function createOrder(orderData: any) {
  try {
    const response = await fetch('/api/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    });
    const data = await response.json();
    if (!data.success) throw new Error(data.error || 'Failed to create order');
    return data.data;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
}

export async function updateOrder(id: string, orderData: any) {
  try {
    const response = await fetch(`/api/orders/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    });
    const data = await response.json();
    if (!data.success) throw new Error(data.error || 'Failed to update order');
    return data.data;
  } catch (error) {
    console.error('Error updating order:', error);
    throw error;
  }
}

export async function deleteOrder(id: string) {
  try {
    const response = await fetch(`/api/orders/${id}`, {
      method: 'DELETE',
    });
    const data = await response.json();
    if (!data.success) throw new Error(data.error || 'Failed to delete order');
    return data.data;
  } catch (error) {
    console.error('Error deleting order:', error);
    throw error;
  }
}