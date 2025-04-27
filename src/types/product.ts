export interface Product {
    id: string;
    name: string;
    description: string;
    basePrice: number;
    discountPrice?: number;
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
  isNew?: boolean;
  createdAt: Date;
  updatedAt: Date;
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

export interface CartItem {
  productId: string
  name: string
  imageUrl: string
  price: number
  quantity: number
  color?: string
  printType?: string
  material?: string
  selectedOptions?: {
    size?: string
    color?: string
    material?: string
    printType?: string
  }
}
