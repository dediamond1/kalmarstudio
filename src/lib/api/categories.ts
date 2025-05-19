import { config } from "@/constants/config";
import type { Category } from "@/types/category";

export async function getCategories(): Promise<Category[]> {
  try {
    const response = await fetch(
      `${config.NEXT_PUBLIC_API_URL}/api/categories`
    );
    if (!response?.ok) {
      throw new Error(
        `Failed to fetch categories: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();
    console.log("Response from categories API:", data);

    if (!data?.success) {
      throw new Error(data.error || "Failed to fetch categories");
    }

    return data?.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
}

// Additional category-related API functions can be added here as needed
