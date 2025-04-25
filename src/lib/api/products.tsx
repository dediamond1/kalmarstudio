import type { Product } from "@/types/product";

// Get all products
export async function getProducts(): Promise<Product[]> {
  try {
    const response = await fetch("/api/products");

    if (!response.ok) {
      throw new Error(
        `Failed to fetch products: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error || "Failed to fetch products");
    }

    return data.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
}

// Get products for order selection (simplified list)
export async function getProductsForOrderSelection(): Promise<any[]> {
  try {
    const response = await fetch("/api/products/list");

    if (!response.ok) {
      throw new Error(
        `Failed to fetch products list: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error || "Failed to fetch products list");
    }

    return data.data;
  } catch (error) {
    console.error("Error fetching products list:", error);
    throw error;
  }
}

// Get a specific product by ID
export async function getProduct(id: string): Promise<Product> {
  try {
    const response = await fetch(`/api/products/${id}`);

    if (!response.ok) {
      throw new Error(
        `Failed to fetch product: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error || "Failed to fetch product");
    }

    return data.data;
  } catch (error) {
    console.error("Error fetching product:", error);
    throw error;
  }
}

// Get products by category ID
export async function getProductsByCategory(
  categoryId: string
): Promise<Product[]> {
  try {
    // This endpoint needs to be created
    const response = await fetch(`/api/products?categoryId=${categoryId}`);

    if (!response.ok) {
      throw new Error(
        `Failed to fetch products by category: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error || "Failed to fetch products by category");
    }

    return data.data || [];
  } catch (error) {
    console.error("Error fetching products by category:", error);
    throw error;
  }
}
