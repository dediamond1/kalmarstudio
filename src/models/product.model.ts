export interface Product {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  printTypes: string[];
  availableSizes: string[];
  colors: string[];
  materials: string[];
  minOrderQuantity: number;
  imageUrls: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductVariant {
  size: string;
  color: string;
  material: string;
  printType: string;
  priceModifier: number;
  stock: number;
}

export type CreateProductDto = Omit<Product, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateProductDto = Partial<CreateProductDto>;
