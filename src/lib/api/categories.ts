import type { Category } from "@/types/category";

export async function getCategories(): Promise<Category[]> {
  try {
    const response = await fetch("http://localhost:3000/api/categories");

    if (!response.ok) {
      throw new Error(
        `Failed to fetch categories: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error || "Failed to fetch categories");
    }

    return data.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
}

// Additional category-related API functions can be added here as needed
