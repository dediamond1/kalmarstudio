import type { Product } from "@/types/product";

// Get all products
export async function getProducts(): Promise<Product[]> {
    try {
        const response = await fetch('/api/products');
        const data = await response.json();

        if (!data.success) {
            throw new Error(data.error || 'Failed to fetch products');
        }

        return data.data;
    } catch (error) {
        console.error('Error fetching products:', error);
        throw error;
    }
}

// Get a specific product by ID
export async function getProduct(id: string): Promise<Product> {
    try {
        const response = await fetch(`/api/products/${id}`);
        const data = await response.json();

        if (!data.success) {
            throw new Error(data.error || 'Failed to fetch product');
        }

        return data.data;
    } catch (error) {
        console.error('Error fetching product:', error);
        throw error;
    }
}

// Get products by category ID
export async function getProductsByCategory(categoryId: string): Promise<Product[]> {
    try {
        const response = await fetch(`/api/products/category/${categoryId}`);
        const data = await response.json();

        if (!data.success) {
            throw new Error(data.error || 'Failed to fetch products by category');
        }

        return data.data;
    } catch (error) {
        console.error('Error fetching products by category:', error);
        throw error;
    }
}

// Create a new product
export async function createProduct(productData: any): Promise<Product> {
    try {
        const response = await fetch('/api/products', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(productData),
        });

        const data = await response.json();

        if (!data.success) {
            throw new Error(data.error || 'Failed to create product');
        }

        return data.data;
    } catch (error) {
        console.error('Error creating product:', error);
        throw error;
    }
}

// Update an existing product
export async function updateProduct(id: string, productData: any): Promise<Product> {
    try {
        const response = await fetch(`/api/products/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(productData),
        });

        const data = await response.json();

        if (!data.success) {
            throw new Error(data.error || 'Failed to update product');
        }

        return data.data;
    } catch (error) {
        console.error('Error updating product:', error);
        throw error;
    }
}

// Delete a product
export async function deleteProduct(id: string): Promise<void> {
    try {
        const response = await fetch(`/api/products/${id}`, {
            method: 'DELETE',
        });

        const data = await response.json();

        if (!data.success) {
            throw new Error(data.error || 'Failed to delete product');
        }
    } catch (error) {
        console.error('Error deleting product:', error);
        throw error;
    }
}