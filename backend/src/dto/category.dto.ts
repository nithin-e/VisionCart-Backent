export interface CreateCategoryDto {
  name: string;
  description?: string;
  image?: string;
}

export interface UpdateCategoryDto {
  name?: string;
  description?: string;
  image?: string;
  isActive?: boolean;
}

export interface CategoryQueryDto {
  page?: number;
  limit?: number;
}
