export interface CreateProductDto {
  name: string;
  price: number;
  stock: number;
  brand: string;
  images?: string[];
}

export interface UpdateProductDto {
  name?: string;
  price?: number;
  stock?: number;
  brand?: string;
  images?: string[];
  isActive?: boolean;
}

export interface ProductQueryDto {
  page?: number;
  limit?: number;
  search?: string;
}