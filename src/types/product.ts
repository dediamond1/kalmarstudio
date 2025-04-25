export interface Product {
    id: string;
    name: string;
    description: string;
    basePrice: number;
    category: {
      id: string;
      name: string;
      slug?: string;
    };
    printTypes: string[];
    availableSizes: string[];
    colors: string[];
    materials: string[];
    minOrderQuantity: number;
    imageUrls: string[];
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface CreateProductDto {
    name: string;
    description: string;
    basePrice: number;
    category: string;
    printTypes: string[];
    availableSizes: string[];
    colors: string[];
    materials: string[];
    minOrderQuantity?: number;
    imageUrls: string[];
    isActive?: boolean;
  }
  
  export interface UpdateProductDto extends Partial<CreateProductDto> {}