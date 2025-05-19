import _ from "lodash";
import type { Product } from "@/types/product";
import type { Category } from "@/types/category";

// Search products with fuzzy matching
function searchProducts(products: Product[], query: string): Product[] {
  if (!query) return products;

  return _.filter(products, (product: any) => {
    const searchFields = [
      product.name,
      product.description,
      ...(product.tags || []),
    ]
      .join(" ")
      .toLowerCase();

    return _.some([
      _.deburr(searchFields).includes(_.deburr(query.toLowerCase())),
      _.includes(searchFields, query.toLowerCase()),
    ]);
  });
}

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

// Get active products with filtering options
export async function getActiveProducts({
  category,
  sort = "newest",
  search,
  minPrice,
  maxPrice,
  sizes,
  colors,
  materials,
  printTypes,
  onSale,
  page = 1,
  limit = 12,
}: {
  category?: string;
  sort?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  sizes?: string[];
  colors?: string[];
  materials?: string[];
  printTypes?: string[];
  onSale?: boolean;
  page?: number;
  limit?: number;
}): Promise<{
  products: Product[];
  total: number;
  page: number;
  pages: number;
}> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";
    const url = new URL("/api/products/list", baseUrl);
    if (category) url.searchParams.append("category", category);
    if (sort) url.searchParams.append("sort", sort);
    if (search) url.searchParams.append("search", search);
    if (minPrice) url.searchParams.append("minPrice", minPrice.toString());
    if (maxPrice) url.searchParams.append("maxPrice", maxPrice.toString());
    if (sizes) sizes.forEach((size) => url.searchParams.append("sizes", size));
    if (colors)
      colors.forEach((color) => url.searchParams.append("colors", color));
    if (materials)
      materials.forEach((material) =>
        url.searchParams.append("materials", material)
      );
    if (printTypes)
      printTypes.forEach((type) => url.searchParams.append("printTypes", type));
    if (onSale) url.searchParams.append("onSale", "true");

    const response = await fetch(url.toString());

    if (!response.ok) {
      // throw new Error(
      //   `Failed to fetch products: ${response.status} ${response.statusText}`
      // );
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

// Get all categories
export async function getCategories(): Promise<Category[]> {
  try {
    const response = await fetch("/api/categories");

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
