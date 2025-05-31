import type { CartItem } from "@/store/cart";
import { handleApiResponse } from "@/lib/utils";

interface CartApiResponse {
  success: boolean;
  error?: string;
  status?: number;
  cartId?: string;
}

export async function saveCart(
  userId: string,
  items: CartItem[]
): Promise<CartApiResponse> {
  return handleApiResponse(
    await fetch("/api/cart", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId, items }),
    })
  );
}

export async function getCart(userId: string): Promise<CartItem[]> {
  const response = await handleApiResponse(
    await fetch(`/api/cart?userId=${userId}`)
  );
  return response.items || [];
}

export async function clearCart(userId: string): Promise<void> {
  return handleApiResponse(
    await fetch("/api/cart", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId }),
    })
  );
}
