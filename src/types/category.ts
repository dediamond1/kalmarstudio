export interface Category {
    id: string;
    name: string;
    slug: string;
    description?: string;
    parentId?: string | null;
    isActive: boolean;
    sortOrder: number;
    imageUrl?: string;
    createdAt: string;
    updatedAt: string;
    subcategories?: Category[];
  }
  
  export interface CreateCategoryDto {
    name: string;
    slug?: string;
    description?: string;
    parentId?: string | null;
    isActive?: boolean;
    sortOrder?: number;
    imageUrl?: string;
  }
  
  export interface UpdateCategoryDto extends Partial<CreateCategoryDto> {}