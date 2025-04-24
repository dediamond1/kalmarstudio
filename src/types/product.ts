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
    category?: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface CreateProductDto {
    name: string;
    description: string;
    basePrice: number;
    printTypes: string[];
    availableSizes: string[];
    colors: string[];
    materials: string[];
    minOrderQuantity?: number;
    imageUrls: string[];
    category?: string;
    isActive?: boolean;
  }
  
  export interface UpdateProductDto extends Partial<CreateProductDto> {}