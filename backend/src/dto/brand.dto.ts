export interface CreateBrandDto {
  name: string;
  description?: string;
  logo?: string;
}

export interface UpdateBrandDto {
  name?: string;
  description?: string;
  logo?: string;
  isActive?: boolean;
}

export interface BrandQueryDto {
  page?: number;
  limit?: number;
}